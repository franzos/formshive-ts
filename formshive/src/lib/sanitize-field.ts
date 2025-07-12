export function sanitizeFieldName(fieldName: string): string {
  return fieldName
    .replace(/ /g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
}
