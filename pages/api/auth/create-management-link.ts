import authClient from "@/lib/authClient";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
const createManagementLink = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "GET") {
    try {
      const { data } = await authClient({
        method: "GET",
        headers: {
          Authorization: req.headers.authorization as string,
        },
        url: "/me",
      });
      const user = data.data.user;

      const { url } = await stripe.billingPortal.sessions.create({
        customer: user.customerId,
        return_url: process.env.NEXT_PUBLIC_USER_DASHBOARD_URL,
      });
      console.log(process.env.STRIPE_SECRET_KEY);
      res.status(200).json(url);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
};

export default createManagementLink;
