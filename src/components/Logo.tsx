type LogoProps = {
  class?: string;
};

export const Logo = (props: LogoProps) => {
  return (
    <svg
      class={props.class}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 10H34.7068C35.5799 10 36.0337 11.0406 35.4396 11.6805L24.2967 23.6805C24.1075 23.8842 23.842 24 23.5639 24H18C14.134 24 11 20.866 11 17C11 13.134 14.134 10 18 10Z"
        fill="#E75590"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30 24H24.4361C24.158 24 23.8925 24.1158 23.7033 24.3195L12.5604 36.3195C11.9663 36.9594 12.4201 38 13.2932 38H30C33.866 38 37 34.866 37 31C37 27.134 33.866 24 30 24Z"
        fill="#448CFD"
      />
    </svg>
  );
};
