export const getAbbrev = (str: string) => {
  const strArr = str.trim().split(" ");
  if (strArr[0].length <= 0) return "-";
  if (strArr.length > 1) return `${strArr[0][0]}${strArr[1][0]}`.toUpperCase();
  else
    return `${strArr[0][0]}${
      strArr[0].length > 1 ? strArr[0][1] : ""
    }`.toUpperCase();
};

export const formatAmount = (amount: number, prefix = "") => {
  return `${prefix}${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount)}`;
};

export const formatQty = (qty: number, fractionDigits = 2) => {
  return `${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(qty)}`;
};

export function sortList(list: any[], sortBy: string, sortObjectKey = "") {
  return list.slice().sort((a, b) => {
    const fieldKey: string = sortBy.startsWith("-")
      ? sortBy.substring(1)
      : sortBy;
    const fieldValueA = sortObjectKey
      ? (a as any)[sortObjectKey][fieldKey]
      : (a as any)[fieldKey];
    const fieldValueB = sortObjectKey
      ? (b as any)[sortObjectKey][fieldKey]
      : (b as any)[fieldKey];
    const isDescending = sortBy.startsWith("-");
    if (typeof fieldValueA === "string" && typeof fieldValueB === "string") {
      return isDescending
        ? fieldValueB.localeCompare(fieldValueA)
        : fieldValueA.localeCompare(fieldValueB);
    } else {
      const a = fieldValueA as number;
      const b = fieldValueB as number;
      return isDescending ? b - a : a - b;
    }
  });
}
