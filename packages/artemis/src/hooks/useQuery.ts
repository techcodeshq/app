import { useAxios } from "@lib/axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";
import { useBranchId } from "./useBranchId";

export const useQuery = <T, Error = any>(
  url: string,
  config: SWRConfiguration<T, Error> = {},
): SWRResponse<T, Error> => {
  const { axios, loading } = useAxios();
  const branchId = useBranchId();

  const toReturn = useSWR(
    !loading ? url : null,
    async (url) => {
      const res = await axios.get<T>(url, {
        headers: {
          branchId,
        },
      });

      return res.data;
    },
    config,
  );

  return toReturn;
};
