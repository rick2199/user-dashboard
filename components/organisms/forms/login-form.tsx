import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import authClient from "@/lib/authClient";
import { passwordRegex } from "@/utils";
import { keccak } from "@/utils/sha256";
import { AxiosError } from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { FormField } from "@/components/molecules/form-fields";
import { useState } from "react";
import Link from "next/link";

const LoginForm = () => {
  const [onSubmitError, setOnSubmitError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirectUri = router.query.redirect_uri;

  const onSubmit = async (
    {
      userName,
      password,
    }: {
      userName: string;
      password: string;
    },
    {
      resetForm,
    }: FormikHelpers<{
      userName: string;
      password: string;
    }>
  ) => {
    setLoading(true);
    const clientHash = keccak(256)(password);
    const isEmail = userName.includes("@");

    try {
      const { data, status } = await authClient({
        method: "POST",
        url: "/login",
        data: isEmail
          ? {
              email: userName,
              password: clientHash,
              userName: null,
            }
          : {
              userName: userName,
              password: clientHash,
              email: null,
            },
      });
      if (status === 200) {
        // GENERATE JWT
        localStorage.setItem("token", data.token);
        console.log("success");
        resetForm();
        if (typeof window !== "undefined") {
          const storagedUri = localStorage.getItem("redirectUri");
          const win: Window | null = window;
          if (!redirectUri && storagedUri === "undefined") {
            win.location = process.env.NEXT_PUBLIC_BLOG_URL_URL as string;
          }
          if (redirectUri) {
            win.location = decodeURIComponent(redirectUri as string);
          }

          if (storagedUri && storagedUri !== "undefined") {
            win.location = storagedUri;
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
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
        setOnSubmitError(
          "Your account has not been activated, please check your inbox"
        );
      }
      if (
        ((err as AxiosError).response?.data as any)?.message ===
        "Invalid Login Details"
      ) {
        setOnSubmitError("Please check your credentials");
      }
      if (((err as AxiosError).response?.data as any)?.code === 500) {
        setOnSubmitError("Internal Server Error");
      }
    }
    setLoading(false);
  };
  return (
    <div className="h-full md:px-6 lg:px-0 bg-white text-center pt-[42px]">
      <Formik
        initialValues={{
          userName: "",
          password: "",
        }}
        validate={async ({ userName, password }) => {
          const errors: any = {};
          if (!userName) {
            errors.userName = "Please enter an email or username";
          }
          if (userName && userName.includes("@")) {
            try {
              // check for migration validation
              const res = await authClient({
                url: `/is_email_valid/${userName}`,
              });

              if (!res.data.data.valid) {
                errors.userName =
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
        {({ errors, touched, values }) => {
          const isCompleted = !!values.password && !!values.userName;
          return (
            <Form className="relative flex flex-col gap-6 text-center">
              <FormField
                setOnSubmitError={setOnSubmitError}
                label="Email or Username"
                type="userName"
                placeHolder="Enter your email or username"
                error={errors.userName as string}
                touched={touched.userName as boolean}
              />
              {errors.userName !==
                "You need to migrate your account first, click here" && (
                <div>
                  <FormField
                    setOnSubmitError={setOnSubmitError}
                    label="Password"
                    type="password"
                    error={errors.password as string}
                    touched={touched.password as boolean}
                  />
                  <div className=" mt-1 flex flex-row items-start justify-between">
                    {onSubmitError && (
                      <Text className="text-left text-[#FB2834]">
                        {onSubmitError}
                      </Text>
                    )}
                    <Link href="/forgot-password" className="cursor-pointer">
                      <Text className="w-max text-end underline">
                        Forgot your password?
                      </Text>
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6 w-full md:static">
                <Button
                  title={`Log${loading ? "ging In" : "in"} `}
                  disabled={!isCompleted}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LoginForm;
