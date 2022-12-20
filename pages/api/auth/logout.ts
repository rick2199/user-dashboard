import { NextApiRequest, NextApiResponse } from "next";

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Set-Cookie", "defiant_session=empty; Max-Age=0");
};

export default logout;
