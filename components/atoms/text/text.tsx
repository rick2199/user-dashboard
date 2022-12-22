import React, { ReactNode } from "react";
import { PT_Serif } from "@next/font/google";

interface TextProps {
  children: ReactNode;
  size?: "lg" | "md" | "sm" | "xs";
  className?: string;
}

const ptSerif = PT_Serif({
  style: "normal",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Text: React.FC<TextProps> = ({ children, size, className }) => {
  const styles = {
    lg: "text-lg",
    md: "text-base",
    sm: "text-sm",
    xs: "text-xs",
  };
  return (
    <p
      className={`font-normal text-text-light ${ptSerif.className}  ${
        size ? styles[size] : styles.md
      } ${className ? className : ""}`}
    >
      {children}
    </p>
  );
};

export default Text;
