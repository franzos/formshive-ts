## Field types:

- `text`
- `textarea`
- `select`
- `checkbox`
- `radio`
- `file`
- `hidden`
- `submit`
- `number`
- `date`

## Attributes:

Attributes define how your form behaves, and optionally, how it looks. Not all attributes apply everywhere:

- **frontend**: these apply only on the front-end, and are mostly visual
- **backend**: these apply only on the back-end, and are for validation and processing

Here's a list of supported attributes:

- `name`:
    - **name** of the field
- `field`:
    - **type** of the field
    - **valid**: text, textarea, select, checkbox, radio, file, hidden, submit, number, date
- `value`:
    - **value** of the field (HTML)
- `placeholder`:
    - **field** placeholder (HTML)
- `required`:
    - **make** field requred
    - **valid**: `true`, `false`
    - **default**: `false`
    - **validate**: frontend, backend
- `disabled`:
    - **make** field disabled (HTML)
    - **valid**: `true`, `false`
    - **default**: `false`
- `readonly`: 
    - **make** field readonly (HTML)
    - **valid**: `true`, `false`
    - **default**: `false`
- `multiple`
    - **allow** multiple selections
    - **valid**: `true`, `false`
    - **default**: `false`
- `is_min`:
    - **ensure** min: (text length, number, date as unix time)
    - **valid**: number
    - **validate**: frontend, backend
- `is_max`:
    - **ensure** max: (text length, number, date as unix time)
    - **valid**: number
    - **validate**: frontend, backend
- `is_in`:
    - **ensure** response is in list
    - **valid**: comma separated list
    - **validate**: frontend, backend
- `is_pattern`:
    - **ensure** response matches pattern
    - **valid**: regex
    - **validate**: frontend, backend
- `is_email`:
    - **ensure** response is an email
    - **valid**: `true`, `false`
    - **default**: `false`
    - **validate**: frontend, backend
- `is_url`:
    - **ensure** response is a URL
    - **valid**: `true`, `false`
    - **default**: `false`
    - **validate**: frontend, backend
- `is_empty`:
    - **ensure** response is empty
    - **valid**: `true`, `false`
    - **default**: `false`
    - **validate**: frontend, backend
- `is_not_empty`:
    - **ensure** response is not empty
    - **valid**: `true`, `false`
    - **default**: `false`
    - **validate**: frontend, backend
- `helptext`
    - **help** text for the field
- `on_fail`
    - **what** to do if the field fails validation
    - **valid**: ['spam', 'trash', 'pass', 'reject']
      - spam: mark as spam (201)
      - trash: discard (201) - not active yet
      - pass: pass through (201)
      - reject: reject (400)
- `map_to`
    - **map** to a different field name; great for honey pots
- `hidden`
    - **don't** show this field in the form (HTML)
    - **valid**: `true`, `false`
    - **default**: `false`
- `discard`
    - **discard** the field value
    - **valid**: `true`, `false`
    - **default**: `false`
- `label`
    - **field** label (HTML)
- `options`
    - **list** of options for select, checkbox, radio
    - **valid**: comma separated list
- `check_spam`
    - **check** the field value for spam
    - **valid**: `true`, `false`
    - **default**: `false`
    - note: this should only be used on long text, like textarea; by default we check the field with the name `messages` for spam. You can only have one field with `check_spam` set to `true` per form.

## Form settings:

- `discard_additional_fields`
    - discard any additional fields not defined in the form spec
    - valid: `true`, `false`
    - default: `false`