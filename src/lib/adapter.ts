import axios from "../lib/axios";
import { Adapter } from "next-auth/adapters";

const Adapter = (_, options = {}): Adapter => {
  return {
    async createUser(user) {
      const res = await axios.post("/auth/user", user);

      return res.data;
    },

    async getUser(id) {
      const res = await axios.get(`/auth/user/${id}`);

      return res.data;
    },

    async getUserByEmail(email) {
      const res = await axios.get(`/auth/user-email/${email}`);

      return res.data;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const res = await axios.get(
        `/auth/user-account/${provider}/${providerAccountId}`
      );

      return res.data.error ? null : res.data;
    },

    async updateUser(user) {
      const res = await axios.patch("/auth/user", user);

      return res.data;
    },

    async linkAccount(account) {
      const res = await axios.post("/auth/linkAccount", account);

      return res.data;
    },

    async createSession(session) {
      const res = await axios.post("/auth/session", session);

      return {
        ...res.data,
        expires: new Date(res.data.expires),
      };
    },

    async getSessionAndUser(sessionToken) {
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
      const res = await axios.post(`/auth/session`, session);

      return res.data;
    },

    async deleteSession(sessionToken) {
      const res = await axios.delete(`/auth/session/${sessionToken}`);

      return res.data;
    },
  };
};

export default Adapter;
