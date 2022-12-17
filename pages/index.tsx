import { Layout } from "@/components/organisms/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login", undefined, { shallow: true });
  }, [router]);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Home;
