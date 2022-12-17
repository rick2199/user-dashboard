import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import React from "react";

interface FormDescriptionProps {
  title: string;
  content: string;
  children?: React.ReactNode;
}

const FormDescription: React.FC<FormDescriptionProps> = ({
  title,
  content,
  children,
}) => {
  return (
    <div className="flex flex-col items-start text-left gap-4">
      <Heading size="xl">{title}</Heading>
      <Text size="md" className="!text-text-light text-left">
        {content}
        {children}
      </Text>
    </div>
  );
};

export default FormDescription;
