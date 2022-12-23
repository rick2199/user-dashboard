import React, { useState } from "react";
import Image from "next/image";
import { Field } from "formik";
import { Text } from "@/components/atoms/text";

interface CheckBoxFieldProps {
  error: string;
  content?: string;
  touched: boolean;
  children: React.ReactNode;
}

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  error,
  content,
  touched,
  children,
}) => {
  const [isTermsChecked, setTermsCheck] = useState<boolean>(false);
  const termsInput =
    typeof window !== "undefined"
      ? (document?.querySelector("#terms") as HTMLInputElement)
      : null;
  return (
    <label className="relative flex cursor-pointer gap-3" htmlFor="terms">
      <Field
        type="checkbox"
        name="terms"
        value="terms"
        checked={isTermsChecked}
        onClick={() => setTermsCheck(!isTermsChecked)}
        id="terms"
        className={`relative top-1 h-5 w-5 flex-none appearance-none border-2 ${
          error && touched ? "border-[#FB2834]" : "border-[#484D57]"
        } ${
          termsInput?.checked
            ? " border-primary-default bg-primary-default"
            : ""
        } `}
      />
      <Image
        src="/icons/check-icon.svg"
        alt="check-icon-icon"
        height={10}
        width={12}
        className={`${
          termsInput?.checked ? "opacity-1" : "opacity-0"
        } absolute top-[9px] left-[3px] md:left-1`}
      />
      <Text
        size="sm"
        className={`${error && touched ? "text-[#FB2834]" : ""} text-left`}
      >
        {content ? content : children}
      </Text>
    </label>
  );
};

export default CheckBoxField;
