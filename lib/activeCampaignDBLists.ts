import axios from "axios";

export const activeCampaignDBLists = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BLOG_URL_URL}/api/newsletter/admin-list`
  );

  return {
    freeListsDB: data.free,
    premiumListsDB: data.premium,
  };
};
