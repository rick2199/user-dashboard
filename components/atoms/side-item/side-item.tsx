import Image from "next/image";
import { Heading } from "@/components/atoms/heading/";

interface SideItemProps {
  iconName: string;
  title: string;
  description: string;
}

const SideItem: React.FC<SideItemProps> = ({
  iconName,
  title,
  description,
}) => {
  return (
    <>
      <Image
        src={`/icons/${iconName}-icon.svg`}
        alt={iconName}
        width={40}
        height={40}
        className="align-top flex-none w-10"
      />
      <div className="ml-4">
        <Heading>{title}</Heading>
        <p className="text-text-inverse-light">{description}</p>
      </div>
    </>
  );
};

export default SideItem;
