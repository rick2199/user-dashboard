import * as React from "react";
import { Inter } from "@next/font/google";

interface HeadingProps {
  size?: "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}

const inter = Inter({ subsets: ["latin"] });

const Heading: React.FC<HeadingProps> = ({ children, size, className, as }) => {
  const Component = as || "h5";
  return (
    <Component
      className={`${className?.includes("font-normal") ? "" : "font-bold"}
      ${size === "3xl" ? "text-[48px] leading-[56px]" : ""}
       ${size === "2xl" ? "text-[40px] leading-[48px]" : ""} ${
        size === "xl" ? "text-[32px] leading-10" : ""
      } ${size === "lg" ? "text-2xl" : ""} ${
        size === "md" ? "text-xl leading-6" : ""
      } ${size === "sm" ? "text-base" : ""} ${size === "xs" ? "text-sm" : ""} ${
        className ? className : ""
      } ${inter.className}
      `}
    >
      {children}
    </Component>
  );
};

export default Heading;
