import { getAxios } from "@lib/axios";
import { NextApiRequest } from "next";
import { Adapter } from "next-auth/adapters";

const Adapter = (req: NextApiRequest): Adapter => {
  return {
    async createUser(user) {
      const axios = await getAxios(req, false);

      const res = await axios.post("/auth/user", user);
      return res.data;
    },

    async getUser(id) {
      const axios = await getAxios(req, false);
      const res = await axios.get(`/auth/user/${id}`);

      return res.data;
    },

    async getUserByEmail(email) {
      const axios = await getAxios(req, false);
      const res = await axios.get(`/auth/user-email/${email}`);

      return res.data;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const axios = await getAxios(req, false);
      const res = await axios.get(
        `/auth/user-account/${provider}/${providerAccountId}`
      );

      return res.data.error ? null : res.data;
    },

    async updateUser(user) {
      const axios = await getAxios(req);
      const res = await axios.patch("/auth/user", user);

      return res.data;
    },

    async linkAccount(account) {
      const axios = await getAxios(req, false);
      const res = await axios.post("/auth/linkAccount", account);

      return res.data;
    },

    async createSession(session) {
      const axios = await getAxios(req, false);
      const res = await axios.post("/auth/session", session);

      return {
        ...res.data,
        expires: new Date(res.data.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
      const axios = await getAxios(req, false);
      const res = await axios.get(`/auth/session/${sessionToken}`);

      return res.data.error
        ? null
        : {
            user: {
              ...res.data.user,
            },
            session: {
              ...res.data.session,
              expires: new Date(res.data.session.expires),
            },
          };
    },

    async updateSession(session) {
      const axios = await getAxios(req, false);
      const res = await axios.patch(`/auth/session`, session, {
        headers: { authorization: session.sessionToken },
      });

      return res.data;
    },

    async deleteSession(sessionToken) {
      const axios = await getAxios(req, false);
      const res = await axios.delete(`/auth/session/${sessionToken}`, {
        headers: { authorization: sessionToken },
      });

      return res.data;
    },
  };
};

export default Adapter;
