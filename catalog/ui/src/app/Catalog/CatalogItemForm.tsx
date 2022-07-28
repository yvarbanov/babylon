import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  ActionList,
  ActionListItem,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Form,
  FormGroup,
  FormHelperText,
  PageSection,
  PageSectionVariants,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextArea,
  TextInput,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import useSWR from 'swr';
import { ExclamationCircleIcon, ExclamationTriangleIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import {
  apiPaths,
  createServiceRequest,
  CreateServiceRequestParameterValues,
  createWorkshop,
  createWorkshopProvision,
  fetcher,
} from '@app/api';
import { CatalogItem } from '@app/types';
import { ErrorBoundary } from 'react-error-boundary';
import { displayName, randomString } from '@app/util';
import DynamicFormInput from '@app/components/DynamicFormInput';
import TermsOfService from '@app/components/TermsOfService';
import { reduceFormState, checkEnableSubmit, checkConditionsInFormState } from './CatalogItemFormReducer';
import PatientNumberInput from '@app/components/PatientNumberInput';
import useSession from '@app/utils/useSession';

import './catalog-item-form.css';

const CatalogItemFormData: React.FC<{ namespace: string; catalogItemName: string }> = ({
  namespace,
  catalogItemName,
}) => {
  const history = useHistory();
  const { isAdmin, groups, roles, workshopNamespaces, userNamespace } = useSession().getSession();
  const { data: catalogItem } = useSWR<CatalogItem>(
    apiPaths.CATALOG_ITEM({ namespace, name: catalogItemName }),
    fetcher
  );
  const [userRegistrationSelectIsOpen, setUserRegistrationSelectIsOpen] = useState(false);
  const workshopInitialProps = useMemo(
    () => ({
      userRegistration: 'open',
      accessPassword: randomString(8),
      description: '',
      displayName: displayName(catalogItem),
      provisionCount: catalogItem.spec.multiuser ? 1 : 20,
      provisionConcurrency: catalogItem.spec.multiuser ? 1 : 10,
      provisionStartDelay: 30,
    }),
    [catalogItem]
  );

  const [formState, dispatchFormState] = useReducer(
    reduceFormState,
    reduceFormState(null, {
      type: 'init',
      catalogItem,
      user: { groups, roles, isAdmin },
    })
  );
  const submitRequestEnabled = checkEnableSubmit(formState);

  useEffect(() => {
    if (!formState.conditionChecks.completed) {
      checkConditionsInFormState(formState, dispatchFormState);
    }
  }, [dispatchFormState, formState]);

  async function submitRequest(): Promise<void> {
    if (!submitRequestEnabled) {
      throw new Error('submitRequest called when submission should be disabled!');
    }
    const parameterValues: CreateServiceRequestParameterValues = {};
    for (const parameterState of Object.values(formState.parameters)) {
      // Add parameters for request that have values and are not disabled or hidden
      if (
        parameterState.value !== undefined &&
        !parameterState.isDisabled &&
        !parameterState.isHidden &&
        !(parameterState.value === '' && !parameterState.isRequired)
      ) {
        parameterValues[parameterState.name] = parameterState.value;
      }
    }

    if (formState.workshop) {
      const {
        accessPassword,
        description,
        displayName,
        userRegistration,
        provisionConcurrency,
        provisionCount,
        provisionStartDelay,
      } = formState.workshop;
      const workshop = await createWorkshop({
        accessPassword,
        description,
        displayName,
        catalogItem: catalogItem,
        openRegistration: userRegistration === 'open',
        // FIXME - Allow selecting service namespace
        serviceNamespace: workshopNamespaces[0],
      });

      await createWorkshopProvision({
        catalogItem: catalogItem,
        concurrency: provisionConcurrency,
        count: provisionCount,
        parameters: parameterValues,
        startDelay: provisionStartDelay,
        workshop: workshop,
      });

      history.push(`/workshops/${workshop.metadata.namespace}/${workshop.metadata.name}`);
    } else {
      const resourceClaim = await createServiceRequest({
        catalogItem,
        catalogNamespaceName: namespace,
        userNamespace,
        groups,
        parameterValues,
      });

      history.push(`/services/${resourceClaim.metadata.namespace}/${resourceClaim.metadata.name}`);
    }
  }

  return (
    <PageSection variant={PageSectionVariants.light} className="catalog-item-form">
      <Title headingLevel="h1" size="lg">
        Order {displayName(catalogItem)}
      </Title>
      {formState.formGroups.length > 0 ? <p>Order by completing the form. Default values may be provided.</p> : null}
      {formState.error ? <p className="error">{formState.error}</p> : null}
      <Form className="catalog-item-form__form">
        {formState.formGroups.map((formGroup, formGroupIdx) => {
          // do not render form group if all parameters for formGroup are hidden
          if (formGroup.parameters.every((parameter) => parameter.isHidden)) {
            return null;
          }
          // check if there is an invalid parameter in the form group
          const invalidParameter = formGroup.parameters.find(
            (parameter) =>
              !parameter.isDisabled && (parameter.isValid === false || parameter.validationResult === false)
          );
          // status is error if found an invalid parameter
          // status is success if all form group parameters are validated.
          const status: 'default' | 'error' | 'success' | 'warning' = invalidParameter
            ? 'error'
            : formGroup.parameters.every((parameter) => parameter.isValid && parameter.validationResult)
            ? 'success'
            : 'default';

          return (
            <FormGroup
              key={formGroup.key}
              fieldId={formGroup.parameters.length === 1 ? `${formGroup.key}-${formGroupIdx}` : null}
              isRequired={formGroup.isRequired}
              label={formGroup.formGroupLabel}
              helperTextInvalid={
                invalidParameter?.validationMessage ? (
                  <FormHelperText
                    icon={<ExclamationCircleIcon />}
                    isError={status === 'error'}
                    isHidden={status !== 'error'}
                  >
                    {invalidParameter.validationMessage}
                  </FormHelperText>
                ) : null
              }
              validated={status}
            >
              {formGroup.parameters.map((parameterState) => (
                <div
                  className={`catalog-item-form__group-control--${
                    formGroup.parameters.length > 1 ? 'multi' : 'single'
                  }`}
                  key={parameterState.spec.name}
                >
                  <DynamicFormInput
                    id={formGroup.parameters.length === 1 ? `${formGroup.key}-${formGroupIdx}` : null}
                    isDisabled={parameterState.isDisabled}
                    parameter={parameterState.spec}
                    validationResult={parameterState.validationResult}
                    value={parameterState.value}
                    onChange={(value: boolean | number | string, isValid = true) => {
                      dispatchFormState({
                        type: 'parameterUpdate',
                        parameter: { name: parameterState.spec.name, value, isValid },
                      });
                    }}
                  />
                  {parameterState.spec.description ? (
                    <Tooltip position="right" content={<div>{parameterState.spec.description}</div>}>
                      <OutlinedQuestionCircleIcon
                        aria-label={parameterState.spec.description}
                        className="tooltip-icon-only"
                      />
                    </Tooltip>
                  ) : null}
                </div>
              ))}
            </FormGroup>
          );
        })}

        {workshopNamespaces.length > 0 ? (
          <FormGroup key="workshop-switch" fieldId="workshop-switch">
            <div className="catalog-item-form__group-control--single">
              <Switch
                id="workshop-switch"
                aria-label="Enable workshop user interface"
                label="Enable workshop user interface"
                isChecked={!!formState.workshop}
                hasCheckIcon
                onChange={(isChecked) =>
                  dispatchFormState({
                    type: 'workshop',
                    workshop: isChecked ? workshopInitialProps : null,
                  })
                }
              />
              <Tooltip
                position="right"
                isContentLeftAligned={true}
                content={
                  catalogItem.spec.multiuser ? (
                    <p>Setup a user interface for the workshop attendants to access their credentials.</p>
                  ) : (
                    <ul>
                      <li>- Provision independent services for each seat in the workshop.</li>
                      <li>- Setup a user interface for the workshop attendants to access their credentials.</li>
                    </ul>
                  )
                }
              >
                <OutlinedQuestionCircleIcon
                  aria-label="Setup a user interface for the attendants to access their credentials"
                  className="tooltip-icon-only"
                />
              </Tooltip>
            </div>
          </FormGroup>
        ) : null}

        {formState.workshop ? (
          <div className="catalog-item-form__workshop-form">
            <FormGroup fieldId="workshopDisplayName" isRequired={true} label="Display Name">
              <div className="catalog-item-form__group-control--single">
                <TextInput
                  id="workshopDisplayName"
                  onChange={(v) =>
                    dispatchFormState({ type: 'workshop', workshop: { ...formState.workshop, displayName: v } })
                  }
                  value={formState.workshop.displayName}
                />
                <Tooltip position="right" content={<p>Title shown in the workshop user interface.</p>}>
                  <OutlinedQuestionCircleIcon
                    aria-label="Title shown in the workshop user interface"
                    className="tooltip-icon-only"
                  />
                </Tooltip>
              </div>
            </FormGroup>
            <FormGroup fieldId="workshopAccessPassword" label="Password">
              <div className="catalog-item-form__group-control--single">
                <TextInput
                  id="workshopAccessPassword"
                  onChange={(v) =>
                    dispatchFormState({ type: 'workshop', workshop: { ...formState.workshop, accessPassword: v } })
                  }
                  value={formState.workshop.accessPassword}
                />
                <Tooltip
                  position="right"
                  content={<p>Password to access credentials, if left empty no password will be required.</p>}
                >
                  <OutlinedQuestionCircleIcon
                    aria-label="Password to access credentials, if left empty no password will be required"
                    className="tooltip-icon-only"
                  />
                </Tooltip>
              </div>
            </FormGroup>
            <FormGroup fieldId="workshopRegistration" label="User Registration" className="select-wrapper">
              <div className="catalog-item-form__group-control--single">
                <Select
                  onToggle={(isOpen) => setUserRegistrationSelectIsOpen(isOpen)}
                  selections={formState.workshop.userRegistration}
                  variant={SelectVariant.single}
                  isOpen={userRegistrationSelectIsOpen}
                  onSelect={(_, selected) => {
                    dispatchFormState({
                      type: 'workshop',
                      workshop: {
                        ...formState.workshop,
                        userRegistration: typeof selected === 'string' ? selected : selected.toString(),
                      },
                    });
                    setUserRegistrationSelectIsOpen(false);
                  }}
                >
                  <SelectOption value="open">open registration</SelectOption>
                  <SelectOption value="pre">pre-registration</SelectOption>
                </Select>
                <Tooltip
                  position="right"
                  isContentLeftAligned={true}
                  content={
                    <ul>
                      <li>- Open registration: Only the password will be required to access the credentials.</li>
                      <li>
                        - Pre-registration: Emails need to be provided before the attendant can access their
                        credentials, an email and password will be required to access the credentials.
                      </li>
                    </ul>
                  }
                >
                  <OutlinedQuestionCircleIcon aria-label="Type of registration" className="tooltip-icon-only" />
                </Tooltip>
              </div>
            </FormGroup>
            <FormGroup fieldId="workshopDescription" label="Description">
              <div className="catalog-item-form__group-control--single">
                <TextArea
                  onChange={(v) =>
                    dispatchFormState({ type: 'workshop', workshop: { ...formState.workshop, description: v } })
                  }
                  value={formState.workshop.description}
                  aria-label="Description"
                />
                <Tooltip position="right" content={<p>Description shown in the workshop user interface.</p>}>
                  <OutlinedQuestionCircleIcon
                    aria-label="Description shown in the workshop user interface"
                    className="tooltip-icon-only"
                  />
                </Tooltip>
              </div>
            </FormGroup>
            {catalogItem.spec.multiuser ? null : (
              <>
                <FormGroup key="provisionCount" fieldId="workshopProvisionCount" label="Workshop seats">
                  <div className="catalog-item-form__group-control--single">
                    <PatientNumberInput
                      min={0}
                      max={200}
                      onChange={(v) =>
                        dispatchFormState({ type: 'workshop', workshop: { ...formState.workshop, provisionCount: v } })
                      }
                      value={formState.workshop.provisionCount}
                    />
                    <Tooltip position="right" content={<p>Number of reserved seats for the workshop.</p>}>
                      <OutlinedQuestionCircleIcon
                        aria-label="Number of reserved seats for the workshop"
                        className="tooltip-icon-only"
                      />
                    </Tooltip>
                  </div>
                </FormGroup>
                {isAdmin ? (
                  <>
                    <FormGroup
                      key="provisionConcurrency"
                      fieldId="workshopProvisionConcurrency"
                      label="Provision Concurrency (only visible to admins)"
                    >
                      <div className="catalog-item-form__group-control--single">
                        <PatientNumberInput
                          min={1}
                          max={20}
                          onChange={(v) =>
                            dispatchFormState({
                              type: 'workshop',
                              workshop: { ...formState.workshop, provisionConcurrency: v },
                            })
                          }
                          value={formState.workshop.provisionConcurrency}
                        />
                      </div>
                    </FormGroup>
                    <FormGroup
                      key="provisionStartDelay"
                      fieldId="workshopProvisionStartDelay"
                      label="Provision Start Interval (only visible to admins)"
                    >
                      <div className="catalog-item-form__group-control--single">
                        <PatientNumberInput
                          min={15}
                          max={600}
                          onChange={(v) =>
                            dispatchFormState({
                              type: 'workshop',
                              workshop: { ...formState.workshop, provisionStartDelay: v },
                            })
                          }
                          value={formState.workshop.provisionStartDelay}
                        />
                      </div>
                    </FormGroup>
                  </>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {catalogItem.spec.termsOfService ? (
          <TermsOfService
            agreed={formState.termsOfServiceAgreed}
            onChange={(agreed) => {
              dispatchFormState({
                type: 'termsOfServiceAgreed',
                termsOfServiceAgreed: agreed,
              });
            }}
            text={catalogItem.spec.termsOfService}
          />
        ) : null}

        <ActionList>
          <ActionListItem>
            <Button isAriaDisabled={!submitRequestEnabled} isDisabled={!submitRequestEnabled} onClick={submitRequest}>
              Order
            </Button>
          </ActionListItem>
          <ActionListItem>
            <Button variant="secondary" onClick={history.goBack}>
              Cancel
            </Button>
          </ActionListItem>
        </ActionList>
      </Form>
    </PageSection>
  );
};

const CatalogItemForm: React.FC = () => {
  const routeMatch = useRouteMatch<{ namespace: string; catalogItem: string }>(
    '/catalog/:namespace/order/:catalogItem'
  );
  const { catalogItem: catalogItemName, namespace }: { catalogItem: string; namespace: string } = routeMatch.params;
  return (
    <ErrorBoundary
      fallbackRender={() => (
        <PageSection>
          <EmptyState variant="full">
            <EmptyStateIcon icon={ExclamationTriangleIcon} />
            <Title headingLevel="h1" size="lg">
              Catalog item not found.
            </Title>
            <EmptyStateBody>
              CatalogItem {catalogItemName} was not found in {namespace}
            </EmptyStateBody>
          </EmptyState>
        </PageSection>
      )}
    >
      <CatalogItemFormData catalogItemName={catalogItemName} namespace={namespace} />
    </ErrorBoundary>
  );
};

export default CatalogItemForm;