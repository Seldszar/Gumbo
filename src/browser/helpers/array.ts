import { escapeRegExp } from "lodash-es";

export function isEmpty<T extends unknown[]>(value?: T): value is undefined {
  return !value?.length;
}

export function matchFields<T>(value: T, fields: Array<keyof T>, query: string): boolean {
  if (query.length === 0) {
    return true;
  }

  const searchPattern = new RegExp(escapeRegExp(query), "i");

  return fields.some((fieldName) => {
    const fieldValue = value[fieldName];

    if (typeof fieldValue !== "string") {
      return false;
    }

    return searchPattern.test(fieldValue);
  });
}

export function filterList<T>(values: T[], fields: Array<keyof T>, query: string): T[] {
  if (query.length === 0) {
    return values;
  }

  return values.filter((value) => matchFields(value, fields, query));
}
