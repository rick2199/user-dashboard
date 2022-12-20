import React, { useState } from "react";
import { Formik, Form } from "formik";
import { AxiosError } from "axios";
import { emailRegex, passwordRegex, usernameRegex } from "@/utils";
import { keccak } from "@/utils/sha256";
import authClient from "@/lib/authClient";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-fields";
import { CheckBoxField } from "@/components/molecules/form-fields";
import { Text } from "@/components/atoms/text";
import { useRouter } from "next/router";
import FormDescription from "./form-description";
import { FormInfo } from "@/components/molecules/form-info";

const SignupForm = () => {
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const [isEmailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const redirectUri = router.query.redirect_uri;
  return (
    <div className=" w-full md:px-6 lg:px-0 bg-white text-center">
      {!isEmailSent ? (
        <Formik
          initialValues={{
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validate={async ({
            email,
            password,
            confirmPassword,
            terms,
            userName,
          }) => {
            const errors: any = {};
            if (!userName) {
              errors.userName = "Please enter a username";
            } else if (!usernameRegex.test(userName)) {
              errors.userName = "This isn’t a valid username";
            }
            if (!email) {
              errors.email = "Please enter an email";
            } else if (!emailRegex.test(email)) {
              errors.email = "This isn’t a valid email address";
            }
            if (email && emailRegex.test(email)) {
              try {
                const res = await authClient({
                  url: `/is_email_valid/${email}`,
                });

                if (!res.data.data.valid) {
                  errors.email =
                    "You need to migrate your account first, click here";
                }
              } catch (error) {
                // ignore error
                console.error(error);
              }
            }
            if (!password) {
              errors.password = "Please enter a password";
            } else if (!passwordRegex.test(password)) {
              errors.password = "This password is too short";
            }
            if (!confirmPassword) {
              errors.confirmPassword = "Please enter a password";
            } else if (!passwordRegex.test(confirmPassword)) {
              errors.confirmPassword = "This password is too short";
            } else if (password !== confirmPassword) {
              errors.confirmPassword = "Your passwords don't match";
            }
            if (!terms) {
              errors.terms = "Please select the option";
            }

            return errors;
          }}
          onSubmit={async ({ userName, password, email }, { resetForm }) => {
            setLoading(true);
            const clientHash = keccak(256)(password);
            try {
              const { data } = await authClient({
                method: "POST",
                url: "/register",
                data: {
                  userName,
                  password: clientHash,
                  email,
                  name: "My first view",
                },
              });
              if (data.code === 200) {
                //GENERATE JWT
                setEmailSent(true);
                resetForm();
                localStorage.setItem("redirectUri", redirectUri as string);
              }
            } catch (err) {
              console.log(err);
              if (
                ((err as AxiosError).response?.data as any)?.message ===
                "Email is already registered"
              ) {
                setOnSubmitError("Email is already registered");
              }
              if (
                ((err as AxiosError).response?.data as any)?.message ===
                "Username is taken"
              ) {
                setOnSubmitError("Username is taken");
              }
              if (
                ((err as AxiosError).response?.data as any)?.message ===
                "User already exists, migrate instead"
              ) {
                setOnSubmitError("User already exists, migrate instead");
              }
              if (((err as AxiosError).response?.data as any)?.code === 500) {
                setOnSubmitError("Internal Server Error");
              }
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ errors, touched, values }) => {
            const isCompleted =
              !!values.confirmPassword &&
              !!values.email &&
              !!values.password &&
              !!values.terms &&
              !!values.userName;
            return (
              <Form>
                <div className="mt-8 md:h-full md:w-full">
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Email"
                    type="email"
                    error={errors.email as string}
                    touched={touched.email as boolean}
                    isRequired={true}
                  />
                  {!errors.email ? (
                    <Text className="relative top-1 text-left">
                      Your email is never public and only used for communication
                      and account recovery.
                    </Text>
                  ) : (
                    <div className="pt-[46px]"></div>
                  )}
                  {errors.email !==
                    "You need to migrate your account first, click here" && (
                    <div className="my-6 flex flex-col gap-6">
                      <FormField
                        setOnSubmitError={setOnSubmitError}
                        label="Username"
                        type="userName"
                        error={errors.userName as string}
                        touched={touched.userName as boolean}
                        isRequired={true}
                      />
                      <FormField
                        setOnSubmitError={setOnSubmitError}
                        label="Password"
                        type="password"
                        error={errors.password as string}
                        touched={touched.password as boolean}
                        isRequired={true}
                      />
                      <FormField
                        setOnSubmitError={setOnSubmitError}
                        label="Confirm Password"
                        type="confirmPassword"
                        error={errors.confirmPassword as string}
                        touched={touched.confirmPassword as boolean}
                        isRequired={true}
                      />
                    </div>
                  )}
                </div>
                {errors.email !==
                  "You need to migrate your account first, click here" && (
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
                    <div className={`mt-${onSubmitError ? "2" : "10"}`}>
                      <CheckBoxField
                        error={errors.terms as string}
                        touched={touched.terms as boolean}
                        content="By signing up I accept The Defiant’s Privacy Policy & Terms and
              Conditions."
                      />
                    </div>
                  </div>
                )}
                <Button
                  disabled={!isCompleted}
                  title={`Creat${loading ? "ing" : "e"} Account`}
                  className={`mt-5 ${loading ? "opacity-50" : ""}`}
                />
              </Form>
            );
          }}
        </Formik>
      ) : (
        <div className="mt-8">
          <FormDescription
            title="Check your inbox"
            content="You are only one step away! You should have received an email. Click
            on the link provided and you’ll be able to activate your account."
          />
          <FormInfo />
          <Button disabled={false} title="Return to Login" />
        </div>
      )}
    </div>
  );
};

export default SignupForm;
