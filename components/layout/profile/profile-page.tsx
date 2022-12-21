import { Heading } from "@/components/atoms/heading";
import {
  AccountView,
  NewsletterView,
} from "@/components/organisms/profile-views";
import { User, UserContext } from "@/context/user-context";
import { Tab } from "@headlessui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { activeCampaignDBLists } from "@/lib/activeCampaignDBLists";

interface ProfileLayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  user: User | null;
  logout: () => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
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
          <a
            href={process.env.NEXT_PUBLIC_BLOG_URL_URL}
            className="hover:cursor-pointer"
          >
            <Heading className="underline">Home</Heading>
          </a>
        </div>

        <div className="flex w-full  lg:justify-center ">
          <a
            href={process.env.NEXT_PUBLIC_BLOG_URL_URL}
            className="hover:cursor-pointer"
          >
            <Image
              src="/defiant-logo-horizontal.png"
              alt="The Defiant Logo"
              width={130}
              height={32}
            />
          </a>
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

interface NewsletterData {
  freeListsDB: any;
  premiumListsDB: any;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, user, logout, token } = useContext(UserContext);
  const [newsletterData, setNewsletterData] = useState<NewsletterData | null>(
    null
  );

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
          freeLists={newsletterData?.freeListsDB}
          premiumLists={newsletterData?.premiumListsDB}
        />
      ),
    },
  ];
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login", undefined, { shallow: false });
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const getData = async () => {
      const res = await activeCampaignDBLists();
      setNewsletterData(res);
    };
    getData();
  }, []);

  const handleTabChange = async (title: string) => {
    if (title !== "Subscription") return;

    const { data } = await axios.get(`/api/auth/create-management-link`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export default ProfilePage;
