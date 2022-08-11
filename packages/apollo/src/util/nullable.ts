import * as t from "io-ts";

export const nullable = <A, O = A>(type: t.Type<A, O>) => {
  return t.union([type, t.null]);
};
