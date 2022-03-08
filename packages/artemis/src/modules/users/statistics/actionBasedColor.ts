import { actionBasedValue } from "src/util/actionBasedValue";
import { KeyValueAction } from "@prisma/client";

export const actionBasedColor = (value: KeyValueAction) =>
  actionBasedValue(value, ["green.300", "red.300", null]);
