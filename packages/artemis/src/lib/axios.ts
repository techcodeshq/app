import axios, { AxiosInstance } from "axios";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export const useAxios = () => {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const instance = useRef<AxiosInstance>(null);

  useEffect(() => {
    if (session.status === "authenticated") {
      instance.current = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
        headers: {
          authorization: session?.data?.user.sessionToken || "",
        },
      });

      setLoading(false);
    }
  }, [session]);

  return { axios: instance.current, loading };
};

export const getAxios = async (
  req: NextApiRequest | IncomingMessage,
  authorize: boolean = true,
) => {
  if (!authorize)
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      withCredentials: true,
    });

  const session = await getSession({ req });
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
      authorization: session.user.sessionToken || "",
    },
  });
};
