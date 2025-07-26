import { FormSpec } from './form-specs';

export function generateCurlFormData(data: FormSpec, formUrl: string): string {
  let curlCommand = `curl -X POST \\\n`;

  for (const key in data.fields) {
    const field = data.fields[key];
    const { name, options, value } = field; // Include placeholder in the destructuring

    // Check if the field has 'options' and handle accordingly
    if (options) {
      const opts = options.split(',');
      if (field.multiple) {
        // If multiple selections are allowed, format each option as an array item
        opts.forEach((option) => {
          curlCommand += `  -d "${name}[]=${option.trim()}" \\\n`;
        });
      } else {
        // If only single selection is allowed, just add the first option
        curlCommand += `  -d "${name}=${opts[0].trim()}" \\\n`;
      }
    } else if (value !== undefined && value !== null) {
      // Handling fields with a single value
      curlCommand += `  -d "${name}=${value}" \\\n`;
    }
  }

  curlCommand += `  ${formUrl}?redirect=none`;
  return curlCommand;
}

export function generateCurlJson(data: FormSpec, formUrl: string): string {
  let jsonData: { [key: string]: any } = {};

  for (const key in data.fields) {
    const field = data.fields[key];
    const { name, options, value, placeholder, multiple } = field;

    if (options) {
      const opts = options.split(',');
      if (multiple) {
        // If multiple selections are allowed, store all options as an array
        jsonData[name] = opts.map((option) => option.trim());
      } else {
        // If only single selection is allowed, just store the first option
        jsonData[name] = opts[0].trim();
      }
    } else if (value !== undefined && value !== null) {
      // Handling fields with a single value
      jsonData[name] = value;
    } else if (placeholder !== undefined && placeholder !== null) {
      // Use placeholder as value if value is not provided
      jsonData[name] = placeholder;
    }
  }

  const jsonString = JSON.stringify(jsonData);
  let curlCommand = `curl -X POST \\\n`;
  curlCommand += `  -H "Content-Type: application/json" \\\n`;
  curlCommand += `  -d '${jsonString}' \\\n`;
  curlCommand += `  ${formUrl}?redirect=none`;

  return curlCommand;
}
