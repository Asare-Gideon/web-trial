export const nameShortner = (name: string, length = 30): string => {
  let listNames = "";

  if (name.length > length) {
    return name.substring(0, length).concat("...");
  }

  return listNames;
};
