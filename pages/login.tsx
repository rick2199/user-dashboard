import { FormTabs } from "@/components/organisms/form-tabs";
import { LoginForm } from "@/components/organisms/forms";
import { Layout } from "@/components/organisms/layout";

const Login = () => {
  return (
    <Layout>
      <FormTabs />
      <LoginForm />
    </Layout>
  );
};

export default Login;
