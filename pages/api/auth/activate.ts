import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const activateAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  if (!query.token) {
    res.end();
    return;
  }

  try {
    await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/activate_account?token=${query.token}`
    );

    return res.redirect("/login");
  } catch (err: any) {
    return res.redirect("/login");
  }
};

export default activateAccount;
