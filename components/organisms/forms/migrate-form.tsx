import { Formik, Form, FormikHelpers } from "formik";
import React, { useState } from "react";
import { FormField } from "@/components/molecules/form-fields";
import { emailRegex } from "@/utils";
import { Button } from "@/components/atoms/button";
import authClient from "@/lib/authClient";
import FormDescription from "./form-description";
import { Text } from "@/components/atoms/text";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FormInfo } from "@/components/molecules/form-info";

const MigrateForm = () => {
  const [successForm, setSuccessForm] = useState<boolean>(false);
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (
    {
      email,
    }: {
      email: string;
    },
    {
      resetForm,
    }: FormikHelpers<{
      email: string;
    }>
  ) => {
    setLoading(true);
    try {
      const { data, status } = await authClient({
        method: "GET",
        url: `/migration_intent/${email}`,
      });
      if (status === 200) {
        setSuccessForm(true);
        console.log("success");
        resetForm();
      }
    } catch (err) {
      if (
        ((err as AxiosError).response?.data as any)?.message === "Missing token"
      ) {
        setOnSubmitError("Validation is missing");
      }
      if (
        ((err as AxiosError).response?.data as any)?.message === "Invalid token"
      ) {
        setOnSubmitError("Invalid Token");
      }
      if (((err as AxiosError).response?.data as any)?.code === 500) {
        setOnSubmitError("Internal Server Error");
      }
    }

    setLoading(false);
  };
  return (
    <div className=" w-full md:px-6 lg:px-0 bg-white text-center">
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
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              {!successForm ? (
                <div className="text-center flex flex-col gap-6">
                  <FormDescription
                    title="Migrate"
                    content="Please insert your email so we can migrate your account."
                  />
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Email"
                    type="email"
                    error={errors.email as string}
                    touched={touched.email as boolean}
                  />
                  {onSubmitError && (
                    <Text className="mt-2 text-left text-[#FB2834]">
                      {onSubmitError}
                    </Text>
                  )}

                  <div className="">
                    <FormInfo />
                    <Button title={`Migrat${loading ? "ing" : "e"}`} />
                    <Button
                      handleClick={() => router.push("/signup")}
                      title="Create an Account"
                      variant="secondary"
                      className="opacity-50"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  <FormDescription
                    title="Check your inbox"
                    content=" You should have received an email. Click on the link
                    provided and you’ll be able to migrate your account."
                  />
                  <FormInfo />
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

export default MigrateForm;
