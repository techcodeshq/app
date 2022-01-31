export const validateOsis = (osis: string) => {
  if (osis.length !== 9) {
    return "OSIS must be 9 digits";
  } else if (isNaN(+osis)) {
    return "OSIS must be a number!";
  }
};
