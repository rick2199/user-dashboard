import { Heading } from "@/components/atoms/heading";
import { Tab } from "@headlessui/react";
import React, { useContext, useEffect } from "react";
import {
  AccountView,
  NewsletterView,
  SubscriptionView,
} from "@/components/organisms/profile-views";
import Image from "next/image";
import Link from "next/link";
import { User, UserContext } from "@/context/user-context";
import { useRouter } from "next/router";
import axios from "axios";
import { GetStaticProps } from "next";
import { activeCampaignDBLists } from "@/lib/activeCampaignDBLists";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

interface ProfileLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  user: User | null;
  logout: () => void;
}
interface ProfileProps {
  data: {
    newsletterData: {
      freeListsDB: string[];
      premiumListsDB: string[];
    };
  };
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  children,
  isLoggedIn,
  user,
  logout,
}) => {
  return (
    <>
      <header className="flex w-full flex-row items-center justify-between border-b-2 border-[#E2E3E8] p-2 lg:px-12">
        <div className="hidden lg:block">
          <Link href="/" className="hover:cursor-pointer">
            <Heading className="underline">Home</Heading>
          </Link>
        </div>

        <div className="flex w-full  lg:justify-center ">
          <Link href="/" className="hover:cursor-pointer">
            <Image
              src="/defiant-logo-horizontal.png"
              alt="The Defiant Logo"
              width={130}
              height={32}
            />
          </Link>
        </div>

        {isLoggedIn && user && (
          <div className="flex flex-row gap-3">
            <div className="grid h-12 w-12 items-center rounded-full bg-gray-600 text-center font-bold uppercase text-white">
              {user?.userName.slice(0, 2)}
            </div>
            <div className="flex flex-col justify-center text-sm capitalize leading-5">
              <span className="font-bold">{user?.userName}</span>
              <button
                onClick={() => logout()}
                className="text-text-disabled hover:underline"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="mt-4 flex flex-col items-center lg:mt-12 lg:ml-[224px] lg:flex-row">
        {children}
      </main>
    </>
  );
};

const Profile: React.FC<ProfileProps> = ({ data }) => {
  const { isLoggedIn, user, logout, token } = useContext(UserContext);
  const router = useRouter();
  const { newsletterData } = data;
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login", undefined, { shallow: false });
    }
  }, [isLoggedIn, router]);

  const profileTabs = [
    {
      title: "Account",
      component: <AccountView user={user} logout={logout} />,
    },
    { title: "Subscription", component: <div>Loading...</div> },
    {
      title: "Newsletter",
      component: (
        <NewsletterView
          freeLists={newsletterData.freeListsDB}
          premiumLists={newsletterData.premiumListsDB}
        />
      ),
    },
  ];

  const handleTabChange = async (title: string) => {
    if (title !== "Subscription") return;

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BLOG_URL_URL}/api/auth/create-management-link`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.location.href = data;
  };

  if (!isLoggedIn || (isLoggedIn && !user)) {
    return (
      <ProfileLayout user={user} isLoggedIn={isLoggedIn} logout={logout}>
        Loading...
      </ProfileLayout>
    );
  }
  return (
    <ProfileLayout user={user} isLoggedIn={isLoggedIn} logout={logout}>
      <Tab.Group>
        <Tab.List className="flex flex-col gap-8 space-x-1 rounded-xl p-1 lg:mt-[calc(64px+58px)]">
          {profileTabs.map(({ title }) => (
            <Tab
              key={title}
              className={({ selected }) =>
                classNames(
                  "ml-0 max-w-[192px] rounded-md py-2 pr-[72px] pl-5 text-left",
                  selected
                    ? "bg-dark-black text-text-inverse-default"
                    : "text-dark-black"
                )
              }
              onClick={() => handleTabChange(title)}
            >
              <Heading>{title}</Heading>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="static mt-10 p-4 lg:absolute lg:top-0 lg:left-[524px] lg:mt-[calc(72px+58px)]">
          {profileTabs.map(({ component, title }) => {
            return (
              <Tab.Panel
                key={title}
                className={({ selected }) =>
                  classNames("rounded-xl bg-white p-3")
                }
              >
                {component}
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </ProfileLayout>
  );
};

export default Profile;

export const getStaticProps: GetStaticProps = async () => {
  const newsletterData = await activeCampaignDBLists();
  return {
    props: {
      data: {
        newsletterData,
      },
    },
    revalidate: 60 * 60 * 24,
  };
};
