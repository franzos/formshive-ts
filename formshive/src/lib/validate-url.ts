export function validateUrl(value: string, allowEmpty: boolean = false) {
  if (allowEmpty && value === '') {
    console.warn('URL is empty');
    return null;
  }
  console.warn('URL is not empty');
  return /^(http|https):\/\/[^ "]+$/.test(value) ? null : 'Invalid URL';
}
