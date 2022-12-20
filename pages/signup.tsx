import { FormTabs } from "@/components/organisms/form-tabs";
import { SignupForm } from "@/components/organisms/forms";
import { Layout } from "@/components/organisms/layout";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const Signup = () => {
  const { isLoggedIn } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [isLoggedIn, router]);
  return (
    <Layout>
      <FormTabs />
      <SignupForm />
    </Layout>
  );
};

export default Signup;
