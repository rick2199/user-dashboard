import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import formsData from "@/data/forms-data.json";
import { Heading } from "@/components/atoms/heading";

interface TabsProps {
  children: React.ReactNode;
  active: boolean;
  href: string;
}
const Tab: React.FC<TabsProps> = ({ children, active, href }) => {
  return (
    <li
      className={`min-w-max font-bold cursor-pointer hover:border-[#20C17C] hover:text-text-default `}
    >
      <Link
        href={`/${href}`}
        className="flex flex-row place-items-center gap-2 pr-6 pt-2 "
      >
        <Heading
          as="h4"
          size="md"
          className={`   pb-2 ${
            active
              ? "border-[#273BF1] border-b-2 text-text-default"
              : "text-text-disabled"
          }`}
        >
          {children}
        </Heading>
      </Link>
    </li>
  );
};

const FormTabs = () => {
  const router = useRouter();
  const [, path] = router.asPath.split("/");
  return (
    <div className="w-full md:px-6 lg:px-0">
      <Image
        src="/icons/logo.svg"
        alt="The Defiant"
        width={100}
        height={100}
        className="mx-auto mb-[74px] hidden md:block"
      />
      <ul className="flex w-max">
        {formsData.map((item: any, index: number) => (
          <Tab
            key={index}
            active={path === item.href || (!path && index === 0)}
            href={item.href}
          >
            {item.children}
          </Tab>
        ))}
      </ul>
    </div>
  );
};

export default FormTabs;
