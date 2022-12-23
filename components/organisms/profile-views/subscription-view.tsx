import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { User } from "@/context/user-context";
import Image from "next/image";
import React from "react";

interface SubscriptionViewProps {
  user: User | null;
}

const SubscriptionView: React.FC<SubscriptionViewProps> = ({ user }) => {
  return (
    <div className="p-5">
      <Heading className="text-center text-4xl lg:text-left lg:text-[40px] lg:leading-[48px]">
        Subscriptions
      </Heading>
      <div className="mt-5 h-[250px] w-[340px] bg-[#D9D9D9] md:mt-10 md:h-[384px] md:w-[528px]"></div>
      <div className="mt-10 border-t-2 border-dark-black lg:mt-28">
        <Heading className="mt-2 font-body">Billing Info</Heading>
        <Text className="text-text-default-light text-sm lg:text-base">
          This is the information we use to bill your account as a Premium
          member.
        </Text>
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
        <div className="mt-10 flex justify-center lg:mt-28">
          <Image src="/stripe.png" alt="stripe-logo" height={48} width={48} />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionView;
