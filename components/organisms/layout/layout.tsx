import { FormTabs } from "@/components/molecules/form-tabs";
import { SideContent } from "@/components/molecules/side-content/";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <header className="md:basis-[48%] lg:basis-auto">
        <SideContent />
      </header>
      <main className="md:m-auto lg:w-[384px] p-10 md:p-0 m-0 md:basis-[52%] lg:basis-auto">
        <FormTabs />
        {children}
      </main>
    </div>
  );
};

export default Layout;
