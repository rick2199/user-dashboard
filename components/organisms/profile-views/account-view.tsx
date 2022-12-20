import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { User } from "@/context/user-context";
import React from "react";

interface AccountViewProps {
  user: User | null;
  logout: () => void;
}

const AccountView: React.FC<AccountViewProps> = ({ user, logout }) => {
  return (
    <div>
      <Heading className="text-center text-4xl lg:text-left lg:text-[40px] lg:leading-[48px]">
        Account
      </Heading>
      <div className="mt-4 border-t-2 border-dark-black lg:mt-10 ">
        <Heading className="mt-2 font-body">Your Profile</Heading>
        <Text className="text-text-default-light text-sm lg:text-base">
          Customize your details and presence across the whole Defiant network.
        </Text>
        <div className="mt-12">
          <label>
            <Heading>Email Address</Heading>
          </label>
          <input
            type="email"
            disabled
            value={user?.email}
            className="mt-3 h-full w-[80%] bg-[#F0F2F7] py-2 pl-3 font-heading"
          />
        </div>
        <div className="mt-8">
          <label>
            <Heading>Username</Heading>
          </label>
          <input
            type="text"
            disabled
            value={user?.userName}
            className="mt-3 h-full w-[80%] bg-[#F0F2F7] py-2 pl-3 font-heading"
          />
        </div>
        <div className="mt-8 flex  max-w-[150px] flex-col gap-8">
          {/* <button className="w-full border-2 border-dark-black px-4 py-3" onClick={()=>setModalType("reset-password")}>
            <Heading size="xs">Reset Password</Heading>
          </button> */}
          <button
            className="w-full border-2 border-dark-black px-4 py-3"
            onClick={logout}
          >
            <Heading size="xs">Log Out</Heading>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AccountView;
