import type { SVGProps } from "react";

export const Icons = {
  Logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <g fill="hsl(var(--primary))">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M168 96h-24v-8a16 16 0 0 0-32 0v8h-24a8 8 0 0 0-8 8v72a8 8 0 0 0 8 8h80a8 8 0 0 0 8-8v-72a8 8 0 0 0-8-8Zm-40-8a8 8 0 0 1 16 0v8h-16Zm40 80h-8v-8a8 8 0 0 0-16 0v8h-24v-8a8 8 0 0 0-16 0v8h-8v-56h80Z" />
      </g>
    </svg>
  ),
};
