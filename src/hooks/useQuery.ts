import { useAxios } from "@lib/axios";
import useSWR, { SWRConfiguration } from "swr";

export const useQuery = <T, Data = any, Error = any>(
  url: string,
  config: SWRConfiguration<Data, Error> = {}
) => {
  const { axios, loading } = useAxios();
  const toReturn = useSWR(
    !loading ? url : null,
    async (url) => {
      const res = await axios.get<T>(url);

      return res.data;
    },
    config
  );

  return toReturn;
};
