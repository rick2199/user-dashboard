import React from "react";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Sora } from "@next/font/google";

interface ButtonProps {
  variant?: "primary" | "secondary";
  title: string;
  handleClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const sora = Sora({ subsets: ["latin"] });

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  title,
  handleClick,
  className,
  type = "submit",
  disabled = false,
}) => {
  return (
    <>
      {variant === "primary" ? (
        <button
          disabled={disabled}
          type={type}
          onClick={handleClick}
          className={`w-full ${
            disabled
              ? "bg-[#CCCDD2] text-[#050505]"
              : "bg-[#CAFCE6] text-[#11623F] hover:bg-[#8CF8C9]"
          }  py-[10px] rounded-md !text-xl ${className ? className : ""}`}
        >
          <Heading className={sora.className} size="sm">
            {title}
          </Heading>
        </button>
      ) : (
        <div onClick={handleClick} className="mt-5 cursor-pointer text-center">
          <Text className="hover:underline">{title}</Text>
        </div>
      )}
    </>
  );
};

export default Button;
