import Image from "next/image";
import { SideContent } from "@/components/organisms/side-content";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col md:flex-row ">
      <aside className="mb-10 md:mb-0 max-w-[560px] h-full md:basis-[40%] bg-darkBg">
        <SideContent />
      </aside>
      <main className=" p-10 m-0 md:grid md:place-items-center md:overflow-y-auto md:basis-[60%]">
        <div className="mx-auto max-w-sm lg:w-[384px]">
          <Image
            src="/icons/logo.svg"
            alt="The Defiant"
            width={100}
            height={100}
            className="mx-auto mb-[74px] hidden md:block"
          />
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
