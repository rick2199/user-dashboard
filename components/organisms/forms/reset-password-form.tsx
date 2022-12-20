import React, { useState } from "react";
import Image from "next/image";
import { Formik, Form } from "formik";
import { AxiosError } from "axios";
import { passwordRegex } from "@/utils";
import { keccak } from "@/utils/sha256";
import authClient from "@/lib/authClient";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-fields";
import { Text } from "@/components/atoms/text";
import { Heading } from "@/components/atoms/heading";
import FormDescription from "./form-description";
import { useRouter } from "next/router";

const ResetPasswordForm = () => {
  //change for the correct token
  const token = "";
  const router = useRouter();
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successView, setSuccessView] = useState<boolean>(false);

  const returnToLogin = () => {
    router.replace("/login", undefined, { shallow: true });
  };

  return (
    <div className="h-full w-full md:px-6 lg:px-0 bg-white text-center">
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validate={({ password, confirmPassword }) => {
          const errors: any = {};

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
        onSubmit={async ({ password }, { resetForm }) => {
          setLoading(true);
          const clientHash = keccak(256)(password);

          try {
            await authClient({
              method: "POST",
              url: "/reset_password",
              data: {
                password: clientHash,
                token,
              },
            });
          } catch (err) {
            console.log(err);
            if (
              ((err as AxiosError).response?.data as any)?.message ===
              "User not found"
            ) {
              setOnSubmitError("User not found");
            }
            if (((err as AxiosError).response?.data as any)?.code === 500) {
              setOnSubmitError("Internal Server Error");
            }
          } finally {
            setLoading(false);
            setSuccessView(true);
            resetForm();
          }
        }}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              {!successView ? (
                <div className="my-6 md:h-full md:w-full flex flex-col gap-6">
                  <FormDescription
                    title="Create a New Password"
                    content="You won’t be able to re-use your old password so try and come up with something you’ll remember."
                  />
                  <div className="relative">
                    <label className="text-left">
                      <Heading size="sm">Email</Heading>
                    </label>
                    <input
                      type="email"
                      disabled={true}
                      className="w-full mt-1 bg-[#CCCDD2] py-2 rounded px-4 font-body focus:outline-none"
                      //change for the correct placeholder
                      placeholder="eddie@thedefiant.io"
                    />
                    <Image
                      src="/icons/lock-icon.svg"
                      className="absolute top-9 right-2"
                      alt="lock-icon"
                      height={24}
                      width={24}
                    />
                  </div>
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Create New Password"
                    type="password"
                    error={errors.password as string}
                    touched={touched.password as boolean}
                  />
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Confirm New Password"
                    type="confirmPassword"
                    error={errors.confirmPassword as string}
                    touched={touched.confirmPassword as boolean}
                  />
                  <div
                    className={`relative bottom-0 pb-5 md:static md:mt-${
                      onSubmitError ? "3" : "5"
                    } md:pb-0`}
                  >
                    {onSubmitError && (
                      <Text className="text-left text-[#FB2834]">
                        {onSubmitError}
                      </Text>
                    )}
                  </div>
                  <Button
                    title={`Reset${loading ? "ting" : ""} Password`}
                    className={` ${loading ? "opacity-50" : ""}`}
                  />
                </div>
              ) : (
                <div className="mt-8 w-full">
                  <FormDescription
                    title="Password Reset"
                    content="Your new password is saved to your account so make sure you remember it and update any password managers."
                  />
                  <Button
                    title="Return to Login"
                    className="mt-6"
                    handleClick={returnToLogin}
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

export default ResetPasswordForm;
