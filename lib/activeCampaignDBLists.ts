import axios from "axios";

export const activeCampaignDBLists = async () => {
  const { data } = await axios.get(`/api/newsletter/newsletter-lists`);

  return {
    freeListsDB: data.free,
    premiumListsDB: data.premium,
  };
};
