import { Layout } from "@/components/organisms/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/signup");
  }, [router]);
  return (
    <Layout>
      <div></div>
    </Layout>
  );
};

export default Home;
