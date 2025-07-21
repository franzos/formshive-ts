export function validateUrl(value?: string, allowEmpty: boolean = false) {
  if (allowEmpty && value === '' || value === undefined || value === null) {
    console.warn('URL is empty');
    return null;
  }
  console.warn(`URL is not empty`, value);
  return /^(http|https):\/\/[^ "]+$/.test(value) ? null : 'Invalid URL';
}
