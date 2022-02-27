import { Dictionary } from "@/common/types";

export function isEmpty<T extends unknown[]>(value?: T): value is undefined {
  return !value?.length;
}

export function filterList<T extends Dictionary<any>, K extends keyof T>(
  values: undefined | T[],
  searchFields: K[],
  searchQuery: string
): T[] {
  if (isEmpty(values)) {
    return [];
  }

  if (searchQuery.length === 0) {
    return values;
  }

  const searchPattern = new RegExp(searchQuery, "i");

  return values.filter((value) =>
    searchFields.some((fieldName) => searchPattern.test(value[fieldName]))
  );
}
