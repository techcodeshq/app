import { useAxios } from "src/util/axios";
import { useCallback } from "react";
import { useSWRConfig } from "swr";

type RequestMethods = "post" | "patch" | "delete";
export type Error = { error: string; description: string };

export const useMutation = <Return, Body>(
  url: string,
  method: RequestMethods,
  refetchUrl: string = null,
  deps: any[] = [],
) => {
  const { axios, loading } = useAxios();
  const { mutate } = useSWRConfig();

  const execute = useCallback(
    async (
      body: Body,
      handleError: (error: Error) => any = () => null,
    ): Promise<Return> => {
      const res = await axios[method]<Return & Error>(url, body);

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
