import { Middleware } from "typera-express";
import { namespaces } from "..";

export const gateway: Middleware.Middleware<
  { gateways: typeof namespaces },
  never
> = async () => {
  return Middleware.next({ gateways: namespaces });
};
