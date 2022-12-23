import { NextApiRequest, NextApiResponse } from "next";

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  if (!query.token) {
    res.end();
    return;
  }

  res.redirect(`/reset-password?token=${query.token}`);
};

export default resetPassword;
