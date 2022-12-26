import { ResetPasswordForm } from "@/components/organisms/forms";
import { Layout } from "@/components/organisms/layout";
import { UserContext } from "@/context/user-context";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const ResetPassword = () => {
  const { isLoggedIn, logout } = useContext(UserContext);
  useEffect(() => {
    if (isLoggedIn) {
      logout();
    }
  }, [logout, isLoggedIn]);

  return (
    <Layout>
      <ResetPasswordForm />
    </Layout>
  );
};

export default ResetPassword;
