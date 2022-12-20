import { ForgotPasswordForm } from "@/components/organisms/forms";
import { Layout } from "@/components/organisms/layout";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const ForgotPassword = () => {
  const { isLoggedIn } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/", undefined, { shallow: true });
    }
  }, [isLoggedIn, router]);
  return (
    <Layout>
      <ForgotPasswordForm />
    </Layout>
  );
};

export default ForgotPassword;
