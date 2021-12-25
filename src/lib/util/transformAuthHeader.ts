import { NextApiRequest } from "next";

export const transformAuthHeader = (req: NextApiRequest) => {
  return {
    headers: { "session-token": req.cookies["next-auth.session-token"] },
  };
};
