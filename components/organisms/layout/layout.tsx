import Image from "next/image";
import { SideContent } from "@/components/organisms/side-content";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col md:flex-row ">
      <aside className="max-w-[560px] h-full md:basis-[40%] bg-darkBg">
        <SideContent />
      </aside>
      <main className="lg:w-[384px] p-10  m-0 md:py-20  md:overflow-y-auto md:basis-[60%]">
        <div className="mx-auto max-w-sm">
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
