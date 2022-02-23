import { useAxios } from "@lib/axios";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { useBranchId } from "./useBranchId";

type RequestMethods = "post" | "patch" | "delete";
type Error = { error: string; description: string };

export const useMutation = <Return, Body>(
  url: string,
  method: RequestMethods,
  refetchUrl: string = null,
  deps: any[] = [],
) => {
  const { axios, loading } = useAxios();
  const { mutate } = useSWRConfig();
  const branchId = useBranchId();

  const execute = useCallback(
    async (
      body: Body,
      handleError: (error: Error) => any = () => null,
    ): Promise<Return> => {
      const res = await axios[method]<Return & Error>(url, body, {
        headers: {
          branchId,
        },
      });

      if (res.data.error) {
        await handleError(res.data);
        return;
      }

      if (refetchUrl) mutate(refetchUrl);
      return res.data;
    },
    [axios, loading, ...deps],
  );

  return execute;
};
