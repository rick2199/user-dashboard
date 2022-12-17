import Image from "next/image";
import { Heading } from "@/components/atoms/heading";
import { SideItem } from "@/components/atoms/side-item";
import sideContentData from "@/data/side-content.json";

const SideContent = () => {
  return (
    <div className=" text-text-inverse-default h-full flex flex-col md:items-center justify-center px-6 md:px-10 pt-6 lg:px-16 lg:pt-0">
      <Image
        src="/icons/logo.svg"
        alt="The Defiant"
        width={100}
        style={{ filter: "brightness(0) invert(1)" }}
        height={100}
        className="mb-8 block md:hidden"
      />
      <Heading
        as="h1"
        className="lg:text-[48px] lg:leading-[56px] text-[40px] leading-[48px]"
      >
        Get Smarter on DeFi & Web3
      </Heading>
      <ul className="mt-2">
        {sideContentData.map((sideItem, index) => (
          <li className="my-8 flex flex-row" key={index}>
            <SideItem {...sideItem} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideContent;
