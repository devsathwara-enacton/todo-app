export function serializeDate(date: any) {
  return new Date(date).toLocaleDateString("en-US");
}
export function serializeBoolean(data: number) {
  if (typeof data === "number") {
    return Boolean(data);
  }
}
