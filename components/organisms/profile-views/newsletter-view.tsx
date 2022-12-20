import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { UserContext } from "@/context/user-context";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { NewsletterList } from "@/components/molecules/newsletter";

interface NewsletterViewProps {
  freeLists: any[];
  premiumLists: any[];
}

const NewsletterView: React.FC<NewsletterViewProps> = ({
  premiumLists,
  freeLists,
}) => {
  const [data, setData] = useState<any>(null);
  console.log(freeLists);
  const freeListsFiltered = freeLists.filter(
    (i) => i.categoryWP === "defi-daily"
  );
  const premiumDefiDaily = premiumLists.find(
    (i) => i.categoryWP === "defi-daily"
  );
  const premiumListsFiltered = premiumLists.filter(
    (i) => i.categoryWP !== "defi-daily"
  );

  console.log({ freeListsFiltered });

  const { token, user } = useContext(UserContext);
  const defiDailyListId =
    user?.role === "PREMIUM"
      ? premiumDefiDaily.listId
      : freeListsFiltered[0].listId;

  const isSub = data?.listsOwned.includes(defiDailyListId);

  useEffect(() => {
    let fetched = false;
    const fetchNewsletterData = async () => {
      const { data } = await axios({
        method: "GET",
        url: "/api/newsletter/lists",
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(data);
    };

    if (token && !fetched) {
      fetched = true;
      fetchNewsletterData();
    }
  }, [token]);
  console.log({ data });
  return (
    <div>
      <Heading className="text-center text-4xl lg:text-left lg:text-[40px] lg:leading-[48px]">
        Newsletter
      </Heading>

      <div className="mt-4 border-t-2 border-dark-black lg:mt-10 ">
        <Heading className="mt-2 font-body">Free Newsletters</Heading>
        <Text className="text-text-default-light">
          Stay up to date with our free newsletters available to all users.
        </Text>
        {freeListsFiltered.map((item: any) => {
          return (
            <NewsletterList
              token={token as string}
              listId={defiDailyListId}
              key={item.id}
              frequency={item.frequency}
              title={item.name}
              listsOwned={isSub ? [defiDailyListId] : []}
              categoryWP={item.categoryWP}
            />
          );
        })}
      </div>
      <div className="mt-10 border-t-2 border-dark-black ">
        <Heading className="mt-2 font-body">Premium Newsletters</Heading>
        <Text className="text-text-default-light">
          As a subscriber, you have access to the newsletters below.
        </Text>
        {premiumListsFiltered.map((item: any) => {
          return (
            <NewsletterList
              token={token as string}
              listId={item.listId}
              key={item.id}
              frequency={item.frequency}
              title={item.name}
              listsOwned={data?.listsOwned}
              categoryWP={item.categoryWP}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewsletterView;
