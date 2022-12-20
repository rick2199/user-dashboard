import { NextApiRequest, NextApiResponse } from "next";

const migrateAccount = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  if (!query.token) {
    res.end();
    return;
  }

  return res.redirect(`/migration?token=${query.token}`);
};

export default migrateAccount;
