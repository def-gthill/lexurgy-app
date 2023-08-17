export function toPrettyJson(value: any): string {
  return JSON.stringify(value, undefined, 2);
}
