import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import authClient from "@/lib/authClient";
import { emailRegex, passwordRegex } from "@/utils";
import { keccak } from "@/utils/sha256";
import { AxiosError } from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { FormField } from "@/components/molecules/form-fields";
import { useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    {
      resetForm,
    }: FormikHelpers<{
      email: string;
      password: string;
    }>
  ) => {
    setLoading(true);
    const clientHash = keccak(256)(password);
    try {
      const { data, status } = await authClient({
        method: "POST",
        url: "/login",
        data: {
          email,
          password: clientHash,
          userName: null,
        },
      });
      if (status === 200) {
        //GENERATE JWT
        localStorage.setItem("token", data.token);
        console.log("success");
        resetForm();
        if (localStorage.getItem("email")) {
          localStorage.removeItem("email");
          router.replace("/profile", undefined, { shallow: true });
        }
      }
    } catch (err) {
      console.log(err);
      if (
        ((err as AxiosError).response?.data as any)?.message ===
        "User not found"
      ) {
        setOnSubmitError("User Not Found");
      }
      if (
        ((err as AxiosError).response?.data as any)?.message ===
        "User not activated"
      ) {
        setOnSubmitError("User not activated");
      }
      if (((err as AxiosError).response?.data as any)?.code === 500) {
        setOnSubmitError("Internal Server Error");
      }
    }
    setTimeout(() => setOnSubmitError(""), 5000);
    setLoading(false);
  };
  return (
    <div className="h-full md:px-6 lg:px-0 bg-white text-center pt-[42px]">
      <Button type="button" disabled={false} title="Connect Wallet" />
      <div className="flex flex-row mt-6 items-center gap-2">
        <hr className="w-full border-[#D9D9D9]" />
        <Text>or</Text>
        <hr className="w-full border-[#D9D9D9]" />
      </div>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={async ({ email, password }) => {
          const errors: any = {};
          if (!email) {
            errors.email = "Please enter an email";
          } else if (!emailRegex.test(email)) {
            errors.email = "This isn’t a valid email address";
          }
          if (email && emailRegex.test(email)) {
            try {
              // check for migration validation
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
            errors.password = "This isn’t a valid password";
          }

          return errors;
        }}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => {
          return (
            <Form>
              <div className="relative flex flex-col text-center">
                <FormField
                  label="Email"
                  type="email"
                  error={errors.email as string}
                  touched={touched.email as boolean}
                />
                {errors.email !==
                  "You need to migrate your account first, click here" && (
                  <>
                    <FormField
                      label="Password"
                      type="password"
                      error={errors.password as string}
                      touched={touched.password as boolean}
                    />
                    <div className=" mt-1 flex flex-row items-center justify-between">
                      {onSubmitError && (
                        <Text className="text-left text-[#FB2834]">
                          {onSubmitError}
                        </Text>
                      )}
                      <div
                        className={`cursor-pointer ${
                          errors.password && touched.password ? "mt-4" : ""
                        }`}
                      >
                        <Text className="pt-1 text-end underline">
                          I need help
                        </Text>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6 w-full md:static md:mt-6">
                  <Button
                    title={`Log${loading ? "ging In" : "in"} `}
                    disabled={false}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginForm;
