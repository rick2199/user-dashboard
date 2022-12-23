import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import authClient from "@/lib/authClient";
import { passwordRegex, usernameRegex } from "@/utils";
import { keccak } from "@/utils/sha256";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormField } from "@/components/molecules/form-fields";
import FormDescription from "./form-description";
import { FormInfo } from "@/components/molecules/form-info";

const MigrationForm = () => {
  const [successView, setSuccessView] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const router = useRouter();
  const token = router.query.token;
  return (
    <div className=" w-full md:px-6 lg:px-0 bg-white text-center">
      <div className="mx-3 mb-8 mt-2 rounded-sm border border-[#F19B27] bg-[#FEF6EC] py-2 px-3 font-body text-sm text-text-light">
        <span>
          Make sure the url starts with thedefiant.io and don’t click on any
          links that are suspicious.
        </span>
      </div>
      <Formik
        initialValues={{
          userName: "",
          password: "",
          confirmPassword: "",
        }}
        validate={({ userName, password, confirmPassword }) => {
          const errors: any = {};
          if (!userName) {
            errors.userName = "Please enter a username";
          } else if (!usernameRegex.test(userName)) {
            errors.userName = "This isn’t a valid username";
          }

          if (!password) {
            errors.password = "Please enter a password";
          } else if (!passwordRegex.test(password)) {
            errors.password = "This isn’t a valid password";
          }

          if (!confirmPassword) {
            errors.confirmPassword = "Please enter a password";
          } else if (!passwordRegex.test(confirmPassword)) {
            errors.confirmPassword = "This isn’t a valid password";
          } else if (password !== confirmPassword) {
            errors.confirmPassword = "Your passwords don't match";
          }

          return errors;
        }}
        onSubmit={async ({ userName, password }, { resetForm, setErrors }) => {
          setLoading(true);
          const clientHash = keccak(256)(password);

          try {
            await authClient({
              method: "POST",
              url: "/migrate_user",
              data: {
                password: clientHash,
                migrationToken: token,
                userName,
              },
            });
            setSuccessView(true);
            resetForm();
          } catch (err) {
            console.log((err as any).response?.data.message);
            if (
              ((err as AxiosError).response?.data as any)?.message ===
              "User is already migrated"
            ) {
              setOnSubmitError("User is already migrated");
            }
            if (
              ((err as AxiosError).response?.data as any)?.message ===
              "Username is not available"
            ) {
              setErrors({ userName: "Username is not available" });
            }
            if (
              ((err as AxiosError).response?.data as any)?.message ===
              "Invalid token"
            ) {
              setOnSubmitError("Invalid Token");
            }
            if (((err as AxiosError).response?.data as any)?.code === 500) {
              setOnSubmitError("Internal Server Error");
            }
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              {!successView ? (
                <div className="flex flex-col gap-6">
                  <FormDescription
                    title="Migration"
                    content="We are one step away!"
                  />
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Username"
                    type="userName"
                    isRequired={true}
                    error={errors.userName as string}
                    touched={touched.userName as boolean}
                  />
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Password"
                    type="password"
                    isRequired={true}
                    error={errors.password as string}
                    touched={touched.password as boolean}
                  />
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Confirm Password"
                    type="confirmPassword"
                    isRequired={true}
                    error={errors.confirmPassword as string}
                    touched={touched.confirmPassword as boolean}
                  />
                  {onSubmitError && (
                    <Text className="mt-2 text-left text-[#FB2834]">
                      {onSubmitError}
                    </Text>
                  )}

                  <FormInfo />
                  <Button title={`Migrat${loading ? "ing" : "e"} now`} />
                </div>
              ) : (
                <div className="flex gap-6 flex-col">
                  <FormDescription
                    title="Welcome Back!"
                    content="Your new password is saved to your account so make sure
                    you remember it and update any password managers."
                  />
                  <Button
                    handleClick={() => router.push("/login")}
                    disabled={false}
                    title="Return to Login"
                  />
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MigrationForm;
