import { FormTabs } from "@/components/organisms/form-tabs";
import { SignupForm } from "@/components/organisms/forms";
import { Layout } from "@/components/organisms/layout";

const Signup = () => {
  return (
    <Layout>
      <FormTabs />
      <SignupForm />
    </Layout>
  );
};

export default Signup;
