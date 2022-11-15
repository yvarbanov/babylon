import React from 'react';

const UserInterfaceLogo: React.FC<
  {
    onClick?: () => void;
  } & React.HTMLAttributes<SVGElement>
> = ({ onClick, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1508.5 178.739" onClick={onClick} {...rest}>
    <g fill="#fff">
      <path d="M316.6 63.2v-56H342a21.279 21.279 0 0 1 7.8 1.3 18.111 18.111 0 0 1 5.9 3.5 15.577 15.577 0 0 1 5 11.8 15.051 15.051 0 0 1-3.1 9.5 16.836 16.836 0 0 1-8.4 5.8l12.5 24.1h-9.3l-11.6-23H325v23Zm24.7-48.6H325v18.7h16.3q5.25 0 8.1-2.7a8.7 8.7 0 0 0 2.8-6.6 8.7 8.7 0 0 0-2.8-6.6c-1.8-1.9-4.5-2.8-8.1-2.8ZM364.1 42.8a20.674 20.674 0 0 1 1.6-8.2 20.288 20.288 0 0 1 4.3-6.7 19.92 19.92 0 0 1 6.5-4.5 19.718 19.718 0 0 1 8-1.6 18.463 18.463 0 0 1 7.8 1.6 18.677 18.677 0 0 1 6.2 4.5 20.927 20.927 0 0 1 4.1 6.8 23.2 23.2 0 0 1 1.5 8.4v2.3H372a13.822 13.822 0 0 0 4.6 8.4 13.6 13.6 0 0 0 9.1 3.3 15.553 15.553 0 0 0 5.7-1 12.858 12.858 0 0 0 4.6-2.6l5.1 5a25.983 25.983 0 0 1-7.4 4.1 24.69 24.69 0 0 1-8.4 1.3 21.306 21.306 0 0 1-8.4-1.6 22.763 22.763 0 0 1-6.8-4.4 20.788 20.788 0 0 1-4.5-6.7 23.2 23.2 0 0 1-1.5-8.4Zm20.2-14.2a11.527 11.527 0 0 0-8 3 13.046 13.046 0 0 0-4.2 7.8h24.2a13.091 13.091 0 0 0-4.2-7.8 11.106 11.106 0 0 0-7.8-3ZM443.1 63.2v-3.8a19.448 19.448 0 0 1-5.8 3.3 18.924 18.924 0 0 1-6.7 1.2 19.824 19.824 0 0 1-14.6-6.1 22.268 22.268 0 0 1-4.4-6.7 21.812 21.812 0 0 1 0-16.4A20.534 20.534 0 0 1 416 28a19.335 19.335 0 0 1 6.6-4.5 20.334 20.334 0 0 1 8.2-1.6 20.7 20.7 0 0 1 6.6 1 19.415 19.415 0 0 1 5.7 3V7.2l8-1.8v57.8Zm-25.2-20.4a13.718 13.718 0 0 0 4 10.1 13.45 13.45 0 0 0 9.8 4.1 14.956 14.956 0 0 0 6.4-1.3 15.954 15.954 0 0 0 4.9-3.6V33.6a14.988 14.988 0 0 0-4.9-3.5 15.271 15.271 0 0 0-6.4-1.3 13.423 13.423 0 0 0-9.9 4 13.806 13.806 0 0 0-3.9 10ZM478.1 63.2v-56h8.4v24h29.8v-24h8.4v56h-8.4V38.8h-29.8v24.4ZM547.2 64a16.483 16.483 0 0 1-10.8-3.5 11.037 11.037 0 0 1-4.2-8.9 10.375 10.375 0 0 1 4.7-9.2 20.76 20.76 0 0 1 11.8-3.2 27.841 27.841 0 0 1 5.8.6 27.374 27.374 0 0 1 5.3 1.6v-4.3a8.143 8.143 0 0 0-2.6-6.5 11.452 11.452 0 0 0-7.4-2.2 20.788 20.788 0 0 0-6 .9 34.616 34.616 0 0 0-6.6 2.6l-3-6a54.169 54.169 0 0 1 8.4-3.1 33.18 33.18 0 0 1 8.3-1.1c5.2 0 9.3 1.3 12.2 3.8s4.4 6.1 4.4 10.8v27h-7.8v-3.5a19.441 19.441 0 0 1-5.8 3.2 23.54 23.54 0 0 1-6.7 1Zm-7.3-12.6a5.646 5.646 0 0 0 2.6 4.8 11.193 11.193 0 0 0 6.6 1.8 16.256 16.256 0 0 0 5.9-1 14.449 14.449 0 0 0 4.9-2.9V47a19.778 19.778 0 0 0-4.8-1.8 24.933 24.933 0 0 0-5.7-.6 11.859 11.859 0 0 0-6.8 1.8 5.728 5.728 0 0 0-2.7 5ZM580.6 53.2v-24H572v-6.7h8.6V12.1l7.9-1.9v12.3h12v6.7h-12v22.1a5.94 5.94 0 0 0 1.4 4.4c.9.9 2.5 1.3 4.6 1.3a23.637 23.637 0 0 0 3-.2 10.857 10.857 0 0 0 2.8-.8v6.7a19.28 19.28 0 0 1-3.8.9 27.484 27.484 0 0 1-3.8.3c-3.9 0-7-.9-9-2.8-2-1.7-3.1-4.4-3.1-7.9Z" />
    </g>
    <path
      d="M127 90.2c12.5 0 30.6-2.6 30.6-17.5a12.678 12.678 0 0 0-.3-3.4L149.8 37c-1.7-7.1-3.2-10.3-15.7-16.6-9.7-5-30.8-13.1-37.1-13.1-5.8 0-7.5 7.5-14.4 7.5-6.7 0-11.6-5.6-17.9-5.6-6 0-9.9 4.1-12.9 12.5 0 0-8.4 23.7-9.5 27.2a4.216 4.216 0 0 0-.3 1.9c0 9.2 36.3 39.4 85 39.4Zm32.5-11.4c1.7 8.2 1.7 9.1 1.7 10.1 0 14-15.7 21.8-36.4 21.8-46.8 0-87.7-27.4-87.7-45.5a17.535 17.535 0 0 1 1.5-7.3C21.8 58.8 0 61.8 0 81c0 31.5 74.6 70.3 133.7 70.3 45.3 0 56.7-20.5 56.7-36.6-.1-12.8-11-27.3-30.9-35.9Z"
      fill="#e00"
    />
    <path d="M159.5 78.8c1.7 8.2 1.7 9.1 1.7 10.1 0 14-15.7 21.8-36.4 21.8-46.8 0-87.7-27.4-87.7-45.5a17.535 17.535 0 0 1 1.5-7.3l3.7-9.1a4.877 4.877 0 0 0-.3 2c0 9.2 36.3 39.4 85 39.4 12.5 0 30.6-2.6 30.6-17.5a12.678 12.678 0 0 0-.3-3.4Z" />
    <path
      d="M253.5 158.7a2.22 2.22 0 0 1-2.2-2.2V2.2a2.2 2.2 0 0 1 4.4 0v154.2a2.242 2.242 0 0 1-2.2 2.3Z"
      fill="#fff"
    />
    <text
      data-name="Product Demo System"
      transform="translate(1186 149)"
      fill="#fff"
      fontSize={82}
      fontFamily="'RedHatDisplay', 'Overpass', overpass, helvetica, arial, sans-serif"
      fontWeight={700}
    >
      <tspan x={-877.892} y={0}>
        Product Demo System
      </tspan>
    </text>
  </svg>
);

export default UserInterfaceLogo;
