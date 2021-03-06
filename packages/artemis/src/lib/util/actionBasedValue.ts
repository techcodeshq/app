import { KeyValueAction } from "@prisma/client";

export const actionBasedValue = (
  action: KeyValueAction,
  values: [string, string, string],
) =>
  action === "INCREMENT"
    ? values[0]
    : action === "DECREMENT"
    ? values[1]
    : values[2];
