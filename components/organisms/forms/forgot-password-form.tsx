import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import authClient from "@/lib/authClient";
import { emailRegex } from "@/utils";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { FormField } from "@/components/molecules/form-fields";
import { useState } from "react";
import FormDescription from "./form-description";
import { FormInfo } from "@/components/molecules/form-info";

const ForgotPasswordForm = () => {
  const [isEmailValid, setEmailValid] = useState<boolean>(false);
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showValidationPage, setShowValidationPage] = useState<boolean>(false);

  return (
    <div className="h-full md:px-6 lg:px-0 bg-white text-center">
      <Formik
        initialValues={{
          email: "",
        }}
        validate={({ email }) => {
          const errors: any = {};
          if (!email) {
            errors.email = "Please enter an email";
          } else if (!emailRegex.test(email)) {
            errors.email = "This isn’t a valid email address";
          }
          if (email && emailRegex.test(email)) {
            setEmailValid(true);
          }

          return errors;
        }}
        onSubmit={async ({ email }, { resetForm }) => {
          setLoading(true);
          if (isEmailValid) {
            try {
              const { data } = await authClient({
                method: "POST",
                url: "/forgot_password",
                data: {
                  email,
                },
              });
              if (data.code === 200) {
                setShowValidationPage(true);
                resetForm();
              }
            } catch (err) {
              if ((err as AxiosError).response?.statusText === "Not Found") {
                setOnSubmitError("Email not found");
              }
              if (((err as AxiosError).response?.data as any)?.code === 500) {
                setOnSubmitError("Internal Server Error");
              }
            } finally {
              setLoading(true);
            }
          }
          setTimeout(() => setOnSubmitError(""), 5000);
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form className="flex flex-col gap-6">
              {!showValidationPage ? (
                <>
                  <FormDescription
                    title="Forgot your password?"
                    content="It happens. Enter your email below and we’ll send you a
                    link to create a brand new one."
                  />
                  <div className="relative">
                    <FormField
                      label="Email"
                      type="email"
                      error={errors.email as string}
                      touched={touched.email as boolean}
                    />
                    {onSubmitError && (
                      <Text className="absolute bottom-[-28px] text-[#FB2834]">
                        {onSubmitError}
                      </Text>
                    )}
                  </div>

                  <Button
                    title={`Send${loading ? "ing" : ""} reset link`}
                    disabled={false}
                    className="mt-6"
                  />
                </>
              ) : (
                <div>
                  <FormDescription
                    title="Email Sent"
                    content="You should have recieved an email if you have an account registered with us. Click on the link provided and you’ll be able to reset your password."
                  />
                  <FormInfo />
                  <Button disabled={false} title="Return to Login" />
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;
