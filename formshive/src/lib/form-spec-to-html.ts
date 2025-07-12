import { FormField, FormSpec } from './form-specs';

export function translateTypeToHtmlType(type: string) {
  switch (type) {
    case 'text':
      return 'input';
    case 'textarea':
      return 'textarea';
    case 'select':
      return 'select';
    case 'checkbox':
      return 'input';
    case 'radio':
      return 'input';
    case 'file':
      return 'input';
    case 'hidden':
      return 'input';
    case 'submit':
      return 'button';
    case 'number':
      return 'input';
    case 'date':
      return 'input';
    default:
      return 'input';
  }
}

export function attachLabelAndHelpText(
  html: string,
  fieldName: string,
  inset: number,
  label?: string,
  helptext?: string,
  required?: boolean
) {
  const insetHtml = ' '.repeat(inset);
  if (label) {
    const requiredIndicator = required ? '*' : '';
    html = `${insetHtml}<label for="${fieldName}">${label}${requiredIndicator}</label>
${html}`;
  }

  if (helptext) {
    html = `${html}
${insetHtml}<br/><small>${helptext}</small>`;
  }

  return html;
}

export function renderFieldOptions(field: FormField, properties: string, insetHtml: string) {
  const options = field.options ? field.options.split(',') : [];
  return options
    .map(
      (option) =>
        `${insetHtml}<input type="${field.field}" name="${field.name}" value="${option.replace(' ', '_')}" ${properties}/> ${option}`
    )
    .join('');
}

export function renderInputField(field: FormField, inset = 2) {
  const type = translateTypeToHtmlType(field.field);
  const isRequired = field.required ? 'required' : '';
  const isDisabled = field.disabled ? 'disabled' : '';

  const properties =
    isRequired && isDisabled ? `${isRequired} ${isDisabled}` : isRequired || isDisabled;
  const isTextEmail = field.is_email === true ? 'email' : field.field;
  const insetHtml = ' '.repeat(inset);

  let html = '';

  if (field.field === 'select') {
    const options = field.options ? field.options.split(',') : [];
    html = `${insetHtml}<${type} name="${field.name}" placeholder="${field.placeholder}" ${properties}>
  ${options.map((option) => `${insetHtml}<option value="${option}">${option}</option>`).join('')}
${insetHtml}</${type}>`;
  } else if (field.field === 'radio' || field.field === 'checkbox') {
    html = renderFieldOptions(field, properties, insetHtml);
  } else if (field.field === 'submit') {
    return `${insetHtml}<button type="submit" value="submit">${field.label}</button>`;
  } else if (field.field === 'textarea') {
    html = `${insetHtml}<${type} name="${field.name}" placeholder="${field.placeholder}" ${properties}>${field.value || ''}</${type}>`;
  } else {
    // For input types like text, number, date, etc., include the 'type' attribute correctly
    html = `${insetHtml}<${type} type="${isTextEmail}" name="${field.name}" placeholder="${field.placeholder}" ${properties}/>`;
  }

  return attachLabelAndHelpText(
    html,
    field.name,
    inset,
    field.label,
    field.helptext,
    field.required
  );
}

/**
 * @deprecated Use `generateHtmlFromSpecV2` instead.
 */
export function generateHtmlFromSpec(data: FormSpec, formUrl: string): string {
  const hasFileUpload = Object.values(data.fields).some((field) => field.field === 'file');
  const encType = hasFileUpload ? 'multipart/form-data' : 'application/x-www-form-urlencoded';

  let html = `<form class="rusty-form" id="rusty-form" action="${formUrl}">\n`;
  if (formUrl) {
    html = `<form  class="rusty-form" id="rusty-form" action="${formUrl}" method="POST" enctype="${encType}">\n`;
  }

  for (const key in data.fields) {
    const field = data.fields[key];
    const { name, field: fieldType, label, placeholder, required, options, value } = field;

    if (fieldType !== 'hidden') {
      const _label = label || name;
      const requiredIndicator = required ? '*' : '';
      html += `  <label for="${name}">${_label?.trim()}${requiredIndicator}</label>\n`;
    }

    switch (fieldType) {
      case 'text':
      case 'number':
      case 'date':
      case 'file':
      case 'hidden':
      case 'submit':
        html += `  <input type="${fieldType}" name="${name}"`;
        if (placeholder) html += ` placeholder="${placeholder}"`;
        if (required) html += ` required`;
        if (value) html += ` value="${value}"`;
        html += '>\n';
        break;
      case 'textarea':
        html += `  <textarea name="${name}"`;
        if (placeholder) html += ` placeholder="${placeholder}"`;
        if (required) html += ` required`;
        html += `>${value || ''}</textarea>\n`;
        break;
      case 'select':
        html += `  <select name="${name}">\n`;
        if (options) {
          options.split(',').forEach((option) => {
            html += `  <option value="${option.trim()}">${option.trim()}</option>\n`;
          });
        }
        html += '  </select>\n';
        break;
      case 'radio':
      case 'checkbox':
        if (options) {
          options.split(',').forEach((option) => {
            html += `  <input type="${fieldType}" name="${name}" value="${option.trim()}"> ${option.trim()}<br>\n`;
          });
        }
        break;
      default:
        console.warn(`Unsupported field type: ${fieldType}`);
    }

    if (field.helptext) {
      html += `  <small>${field.helptext}</small>\n`;
    }
  }

  html += '  <button type="submit" value="submit">Submit</button>\n';
  html += '</form>';
  return html;
}

export const generateHtmlFromSpecV2 = (
  data: FormSpec,
  formUrl: string,
  checkChallenge: boolean,
  challengeUrl: string
): string => {
  const hasFileUpload = Object.values(data.fields).some((field) => field.field === 'file');
  const encType = hasFileUpload ? 'multipart/form-data' : 'application/x-www-form-urlencoded';

  let formHtml = `<form class="rusty-form" id="rusty-form" action="${formUrl}" method="POST" enctype="${encType}">\n`;
  for (const field of Object.values(data.fields)) {
    formHtml += `${renderInputField(field)}\n`;
  }

  // Add captcha widget if checkChallenge is true
  if (checkChallenge) {
    formHtml += `\n`;
    formHtml += '  <!-- Add the captcha widget anywhere between the form tags -->\n';
    formHtml += `  <altcha-widget\n`;
    formHtml += `    challengeurl=${challengeUrl}\n`;
    formHtml += `    hidefooter\n`;
    formHtml += `    hidelogo\n`;
    formHtml += `  ></altcha-widget>\n`;
    formHtml += '  <!-- End of captcha widget -->\n';
    formHtml += `\n`;
  }

  formHtml += '  <button type="submit" value="submit">Submit</button>\n';
  formHtml += '</form>';

  return formHtml;
};

// export function exampleLLMPrompt(formUrl: string) {
//   return `Generate a HTML form with following fields:
//   - email: required
//   - name: required
//   - message: required
//   - products: optional, multiple checkboxes (Product A, Product B, Product C)

// and a button to submit ("Send").

// POST to the following URL: ${formUrl}`;
// }

export const generateLLMPrompt = (
  data: FormSpec,
  formUrl: string,
  checkChallenge: boolean,
  challengeUrl: string
): string => {
  const fields = Object.values(data.fields)
    .map((field) => {
      const fieldType = field.field;
      const fieldName = field.name;
      const fieldLabel = field.label || fieldName;
      const fieldRequired = field.required ? 'required' : 'optional';
      return `- ${fieldLabel}: ${fieldRequired} (${fieldType})`;
    })
    .join('\n');

  let prompt = `Generate a HTML form with following fields:\n${fields}\n\n`;

  if (checkChallenge) {
    prompt += `Include a captcha widget using the following HTML code:
    
  <altcha-widget
    challengeurl=${challengeUrl}
    hidefooter
    hidelogo
  ></altcha-widget>
  
IMPORTANT: For the captcha to work, you must include this script tag in the HTML head:
  <script async defer src="https://cdn.jsdelivr.net/npm/altcha/dist/altcha.min.js" type="module"></script>

`;
  }

  prompt += `POST to the following URL: ${formUrl}`;

  return prompt;
};
