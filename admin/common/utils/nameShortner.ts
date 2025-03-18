export const nameShortner = (name: string): string => {
  let listNames = "";

  if (name.length > 30) {
    return name.substring(0, 30).concat("...");
  }

  return listNames;
};

export const truncate = (str: string, max = 5) => {
  const array = str.trim().split(" ");
  const ellipsis = array.length > max ? "..." : "";

  return array.slice(0, max).join(" ") + ellipsis;
};
