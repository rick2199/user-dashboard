import { NextApiRequest, NextApiResponse } from "next";

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Set-Cookie", "defiant_session=empty; Max-Age=0");
  res.end();
};

export default logout;
