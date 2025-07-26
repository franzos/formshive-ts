export function clearField(value: string | undefined): string | undefined {
  if (value === undefined || value === null || value.trim() === '') {
    return undefined;
  }
  return value.trim();
}