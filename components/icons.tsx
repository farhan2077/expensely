import * as React from "react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      stroke="none"
      viewBox="0 0 40 40"
      {...props}
    >
      <path d="M20 0c11.046 0 20 8.954 20 20v14a6 6 0 0 1-6 6H21v-8.774c0-2.002.122-4.076 1.172-5.78a10 10 0 0 1 6.904-4.627l.383-.062a.8.8 0 0 0 0-1.514l-.383-.062a10 10 0 0 1-8.257-8.257l-.062-.383a.8.8 0 0 0-1.514 0l-.062.383a9.999 9.999 0 0 1-4.627 6.904C12.85 18.878 10.776 19 8.774 19H.024C.547 8.419 9.29 0 20 0Z"></path>
      <path d="M0 21h8.774c2.002 0 4.076.122 5.78 1.172a10.02 10.02 0 0 1 3.274 3.274C18.878 27.15 19 29.224 19 31.226V40H6a6 6 0 0 1-6-6V21ZM40 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
    </svg>
  ),
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  bdt: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.946c.018 3.472-.894 6.232-2.637 7.983A7.267 7.267 0 0 1 13 23h-3a3 3 0 0 1-3-3v-8H4.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5H7V4a1 1 0 0 0-1-1H3.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5H6a3 3 0 0 1 3 3v6h2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H9v8a1 1 0 0 0 1 1h3a5.346 5.346 0 0 0 3.946-1.481c1.339-1.347 2.069-3.677 2.054-6.562A.984.984 0 0 0 18 12h-2.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5H18a2.989 2.989 0 0 1 3 2.946Z" />
    </svg>
  ),
};
