import { useAxios } from "src/util/axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

export const useQuery = <T, Error = any>(
  url: string,
  config: SWRConfiguration<T, Error> = {},
): SWRResponse<T, Error> => {
  const { axios, loading } = useAxios();

  const toReturn = useSWR(
    !loading ? url : null,
    async (url) => {
      const res = await axios.get<T>(url);

      return res.data;
    },
    config,
  );

  return toReturn;
};
