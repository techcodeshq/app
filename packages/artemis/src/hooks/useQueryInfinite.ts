import { useAxios } from "@lib/axios";
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteResponse,
} from "swr/infinite";

export const useQueryInfinite = <T, Error = any>(
  url: string,
  config: SWRInfiniteConfiguration<T, Error> = {},
): SWRInfiniteResponse<T, Error> => {
  const { axios, loading } = useAxios();

  const toReturn = useSWRInfinite(
    (index) => {
      if (!loading) {
        return url + index;
      }

      return null;
    },
    async (url) => {
      const res = await axios.get<T>(url);

      return res.data;
    },
    config,
  );

  return toReturn;
};
