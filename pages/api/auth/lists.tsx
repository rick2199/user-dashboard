import authClient from "@/lib/authClient";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const newsletterLists = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.authorization) {
    throw new Error("Forbidden");
  }
  const [_, token] = req.headers.authorization.split("Bearer ");

  if (!token) {
    throw new Error("Forbidden");
  }

  try {
    const { data } = await authClient({
      method: "GET",
      headers: {
        Authorization: req.headers.authorization as string,
      },
      url: "/me",
    });
    const user = data.data.user;
    const { data: userSearch } = await axios.get(
      `${
        process.env.ACTIVE_CAMPAIGN_BASE_PATH
      }/api/3/contacts?email=${encodeURIComponent(user?.email)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Api-Token": process.env.ACTIVE_CAMPAIGN_API_KEY as string,
        },
      }
    );

    const activeCampaignUserId: string =
      userSearch.contacts?.length > 0 ? userSearch.contacts[0].id : null;

    const { data: lists } = await axios.get(
      `${process.env.ACTIVE_CAMPAIGN_BASE_PATH}/api/3/contacts/${activeCampaignUserId}/contactLists`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Api-Token": process.env.ACTIVE_CAMPAIGN_API_KEY as string,
        },
      }
    );

    if (req.method === "GET") {
      const listsOwned = lists.contactLists.map(
        (item: { list: string }) => item.list
      );
      res.status(200).json({
        listsOwned,
      });
    }
    if (req.method === "PUT") {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BLOG_URL_URL}/api/newsletter/newsletter-lists`
      );
      const premiumLists = data.premium.map((item: any) => item.listId);
      const listToUpdate: string[] = [];
      const urlencoded = new URLSearchParams();
      const listIds = lists.contactLists.map(
        (item: { list: string }) => item.list
      );
      urlencoded.append("api_action", "contact_edit");
      urlencoded.append("api_key", process.env.ACTIVE_CAMPAIGN_API_KEY || "");
      urlencoded.append("id", activeCampaignUserId);
      urlencoded.append("email", user?.email as string);
      if (!req.body.remove) {
        if (user.role === "PREMIUM") {
          listToUpdate.push(...listIds, req.body.listId);
        } else {
          const freeLists = [...listIds].filter(
            (item) => !premiumLists.includes(item)
          );
          const isFree = !premiumLists.includes(req.body.listId);
          listToUpdate.push(...freeLists, isFree ? req.body.listId : undefined);
        }
      } else {
        const index = listIds.indexOf(req.body.listId);
        if (index > -1) {
          listIds.splice(index, 1);
        }
        if (user.role === "PREMIUM") {
          listToUpdate.push(...listIds);
        } else {
          const freeLists = [...listIds].filter(
            (item) => !premiumLists.includes(item)
          );
          const isFree = !premiumLists.includes(req.body.listId);
          listToUpdate.push(...freeLists, isFree ? undefined : req.body.listId);
        }
      }
      const filteredListToUpdate = listToUpdate.filter(function (element) {
        return element !== undefined;
      });
      if (filteredListToUpdate.length > 0) {
        filteredListToUpdate.forEach((item) => {
          urlencoded.append(`p[${item}]`, item);
        });
      } else {
        urlencoded.append("p[36]", "36");
      }

      await axios.post(
        `${process.env.ACTIVE_CAMPAIGN_BASE_PATH}/admin/api.php?api_action=contact_edit`,
        urlencoded,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      res.status(200).json({ data: "ok" });
    }
  } catch (err) {
    console.log({ err });
    const errorMessage =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ statusCode: 500, message: errorMessage });
  }
};

export default newsletterLists;
