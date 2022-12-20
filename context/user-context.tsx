import authClient from "@/lib/authClient";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, {
  ReactNode,
  useState,
  createContext,
  useEffect,
  useCallback,
} from "react";

type Modals = "success" | "error" | null;

interface UserContextValue {
  token: string | null;
  isLoggedIn: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
  modalType: Modals;
  setModalType: React.Dispatch<React.SetStateAction<Modals>>;
}

export interface User {
  role: "FREE" | "PREMIUM";
  userName: string;
  email: string;
}

export const UserContext = createContext<UserContextValue>({
  token: null,
  isLoggedIn: false,
  user: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
  modalType: null,
  setModalType: () => {},
});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const cookie = Cookies.get("defiant_session");
  const [token, setToken] = useState(cookie || null);
  const [user, setUser] = useState<User | null>(null);
  let isLoggedIn = !!token;

  const [modalType, setModalType] = useState<Modals>(null);
  const fetchUser = useCallback(async () => {
    try {
      const { data }: AxiosResponse<{ data: { user: User } }> =
        await authClient({
          method: "GET",
          url: "/me",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      if (data.data) {
        setUser({
          email: data.data.user.email,
          role: data.data.user.role,
          userName: data.data.user.userName,
        });
        const redirect = localStorage.getItem("redirect");
        const plan = localStorage.getItem("plan");
        if (redirect && plan && data.data.user.role === "FREE") {
          localStorage.removeItem("redirect");
          localStorage.removeItem("plan");
          const { data: checkoutSession } = await axios.post(
            `/api/checkout-sessions`,
            {
              plan,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (checkoutSession?.url) {
            window.location.replace(checkoutSession.url);
          }
        }
      }
    } catch (err) {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, fetchUser, user]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.replace("/", undefined, { shallow: false });
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        isLoggedIn,
        setUser,
        setToken,
        logout,
        setModalType,
        modalType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
