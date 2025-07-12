// import { load } from 'js-toml';
import { parse, stringify } from 'smol-toml';

export interface FormField {
  name: string;
  field: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  multiple?: boolean;
  is_min?: number;
  is_max?: number;
  is_in?: string;
  is_pattern?: string;
  is_email?: boolean;
  is_url?: boolean;
  is_empty?: boolean;
  is_not_empty?: boolean;
  helptext?: string;
  on_fail?: 'spam' | 'trash' | 'pass' | 'reject';
  map_to?: string;
  hidden?: boolean;
  discard?: boolean;
  options?: string;
  check_spam?: boolean;
  value?: any; // Added to support value attribute
}

export interface FormSettings {
  discard_additional_fields?: boolean;
}

export interface FormSpec {
  fields: { [key: string]: FormField };
  settings: FormSettings;
}

export function validatFormSpec(formSpec: FormSpec): {
  isValid: boolean;
  errors: Map<string, string>;
} {
  const errors = new Map<string, string>();

  // Validate each field
  Object.entries(formSpec.fields).forEach(([key, field]) => {
    if (!field.name) {
      errors.set(`${key}.name`, 'Field name is missing.');
    }
    if (!field.field) {
      errors.set(`${key}.field`, 'Field type is missing.');
    }

    // Add more field-specific validation as needed
    if (
      field.is_min !== undefined &&
      ['text', 'number', 'date', 'textarea'].indexOf(field.field) === -1
    ) {
      errors.set(`${key}.is_min`, `is_min is not applicable for this field type ${field.field}.`);
    }

    if (field.is_max !== undefined && ['text', 'number', 'date'].indexOf(field.field) === -1) {
      errors.set(`${key}.is_max`, 'is_max is not applicable for this field type.');
    }

    if (field.is_in && field.is_in.split(',').length === 0) {
      errors.set(`${key}.is_in`, 'is_in must contain a comma-separated list.');
    }

    if (field.is_pattern) {
      try {
        new RegExp(field.is_pattern);
      } catch (e) {
        errors.set(`${key}.is_pattern`, 'is_pattern contains an invalid regex.');
      }
    }

    if (field.on_fail && !['spam', 'trash', 'reject', 'pass'].includes(field.on_fail)) {
      errors.set(`${key}.on_fail`, 'on_fail contains an invalid value.');
    }
  });

  // Check for only one 'check_spam' field
  const spamFields = Object.entries(formSpec.fields)
    .filter(([_, field]) => field.check_spam)
    .map(([key, _]) => key);
  if (spamFields.length > 1) {
    errors.set(
      'form_spec',
      `Multiple fields have spam checking enabled (${spamFields.join(', ')}). Only one field per form can have spam checking enabled.`
    );
  }

  // Validate form settings
  if (formSpec.settings.discard_additional_fields === undefined) {
    errors.set(
      'settings.discard_additional_fields',
      'discard_additional_fields setting is missing.'
    );
  }

  return {
    isValid: errors.size === 0,
    errors,
  };
}

export function parseTomlToFormSpec(tomlString: string): FormSpec | null {
  try {
    const parsed = parse(tomlString) as any; // Using 'any' for simplicity; consider a more specific type

    // Assuming the TOML structure aligns with the FormSpec structure
    // You might need to adjust this part based on the actual TOML structure and desired FormSpec structure
    const formSpec: FormSpec = {
      fields: {},
      settings: parsed.settings,
    };

    // Extract fields excluding 'settings'
    Object.keys(parsed).forEach((key) => {
      if (key !== 'settings') {
        formSpec.fields[key] = parsed[key];
      }
    });

    return formSpec;
  } catch (error) {
    console.error('Failed to parse TOML:', error);
    return null;
  }
}

export function dumpFormSpecToToml(formSpec: FormSpec): string {
  const toml = stringify({
    ...formSpec.fields,
    settings: formSpec.settings,
  });
  return toml;
}

export function parseAndValidateFormSpec(tomlString: string): {
  formSpec: FormSpec | null;
  isValid: boolean;
  errors: Map<string, string>;
} {
  if (!tomlString || tomlString.trim() === '') {
    return {
      formSpec: null,
      // Empty = no form spec
      isValid: true,
      errors: new Map(),
    };
  }
  try {
    const formSpec = parseTomlToFormSpec(tomlString);
    if (formSpec) {
      return {
        formSpec,
        ...validatFormSpec(formSpec),
      };
    }
  } catch (error) {
    console.error('Failed to parse and validate TOML:', error);
    return {
      formSpec: null,
      isValid: false,
      errors: new Map([['Error', `Failed to parse TOML. ${error}`]]),
    };
  }
  return {
    formSpec: null,
    isValid: false,
    errors: new Map([['Error', 'Failed to parse TOML. Please check the syntax and try again.']]),
  };
}

export const specsPlaceholder = `[first_name]
name = 'first_name'
field = 'text'
label = 'First Name'
placeholder = 'Mike'
required = true

[last_name]
name = 'last_name'
field = 'text'
label = 'Last Name'
placeholder = 'Doe'
required = true

[email]
name = 'email'
field = 'text'
label = 'Email'
placeholder = 'mike.doe@gmail.com'
is_email = true
required = true

[phone]
name = 'phone'
field = 'text'
label = 'Phone'
placeholder = '123-456-7890'

[message]
name = 'message'
field = 'textarea'
label = 'Message'
placeholder = 'Message'
required = true
check_spam = true
is_min = 5
on_fail = 'spam'

[kind_of_inquiry]
name = 'kind_of_inquiry'
field = 'select'
label = 'Kind of Inquiry'
options = 'General Inquiry,Technical Support,Partnership,Other'
required = true

[respond_by]
name = 'respond_by'
field = 'checkbox'
label = 'Respond by'
options = 'Email,Phone'

[settings]
discard_additional_fields = false`;
