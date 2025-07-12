export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateTemplateString(template: string): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!template || template.trim() === '') {
    return { isValid: true, errors, warnings };
  }

  // Regular expression to find template variables
  // Matches: {{ variable }}, {{ variable | "fallback" }}, {{ variable|"fallback" }}
  // const templateRegex = /\{\{\s*([^}|]+)(\s*\|\s*"([^"]*)")?\s*\}\}/g;
  const invalidTemplateRegex = /\{\{[^}]*\}\}/g;

  let match;
  const foundVariables = new Set<string>();
  const allMatches: string[] = [];

  // Find all template-like patterns
  while ((match = invalidTemplateRegex.exec(template)) !== null) {
    allMatches.push(match[0]);
  }

  // Reset regex
  invalidTemplateRegex.lastIndex = 0;

  // Validate each template pattern
  for (const templateMatch of allMatches) {
    const validMatch = templateMatch.match(/^\{\{\s*([^}|]+)(\s*\|\s*"([^"]*)")?\s*\}\}$/);

    if (!validMatch) {
      errors.push(
        `Invalid template syntax: "${templateMatch}". Use format {{ variable }} or {{ variable | "fallback" }}`
      );
      continue;
    }

    const [, variableName, , fallback] = validMatch;
    const cleanVariableName = variableName.trim();

    // Validate variable name
    if (!cleanVariableName) {
      errors.push(`Empty variable name in "${templateMatch}"`);
      continue;
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(cleanVariableName)) {
      errors.push(
        `Invalid variable name "${cleanVariableName}". Use only letters, numbers, and underscores. Must start with a letter or underscore.`
      );
      continue;
    }

    foundVariables.add(cleanVariableName);

    // Validate fallback if present
    if (fallback !== undefined) {
      if (fallback.length === 0) {
        warnings.push(
          `Empty fallback for variable "${cleanVariableName}". Consider providing a default value.`
        );
      }
    } else {
      warnings.push(
        `No fallback provided for variable "${cleanVariableName}". Consider adding a fallback: {{ ${cleanVariableName} | "default value" }}`
      );
    }
  }

  // Check for unmatched braces
  const openBraces = (template.match(/\{\{/g) || []).length;
  const closeBraces = (template.match(/\}\}/g) || []).length;

  if (openBraces !== closeBraces) {
    errors.push(`Unmatched braces: found ${openBraces} opening {{ and ${closeBraces} closing }}`);
  }

  // Check for single braces that might be mistakes
  // First, remove all valid template variables to avoid false positives
  const templateWithoutValid = template.replace(/\{\{\s*[^}|]+(\s*\|\s*"[^"]*")?\s*\}\}/g, '');

  const singleOpenBrace = templateWithoutValid.match(/\{(?!\{)/g);
  const singleCloseBrace = templateWithoutValid.match(/(?<!\})\}/g);

  if (singleOpenBrace) {
    warnings.push(
      `Found ${singleOpenBrace.length} single "{" brace(s). Did you mean to use double braces "{{" for template variables?`
    );
  }

  if (singleCloseBrace) {
    warnings.push(
      `Found ${singleCloseBrace.length} single "}" brace(s). Did you mean to use double braces "}}" for template variables?`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function getTemplateVariables(template: string): string[] {
  if (!template) return [];

  const variables: string[] = [];
  const templateRegex = /\{\{\s*([^}|]+)(\s*\|\s*"([^"]*)")?\s*\}\}/g;
  let match;

  while ((match = templateRegex.exec(template)) !== null) {
    const variableName = match[1].trim();
    if (variableName && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableName)) {
      variables.push(variableName);
    }
  }

  return [...new Set(variables)]; // Remove duplicates
}

// Test function for development - can be removed in production
export function testValidation() {
  const testCases = [
    'Hi {{ name }}',
    'Hi { name }',
    'Hi {{ name | "there" }}',
    'Hi {{ invalid-name }}',
  ];

  testCases.forEach((test) => {
    const result = validateTemplateString(test);
    console.log(
      `"${test}": ${result.isValid ? 'Valid' : 'Invalid'}, Errors: ${result.errors.length}, Warnings: ${result.warnings.length}`
    );
  });
}
