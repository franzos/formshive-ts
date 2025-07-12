# Formshive Embedded

Add forms to any website with one script tag.

## Quick Start

```html
<script src="https://formshive.com/embed.min.js"></script>
<div data-formshive-id="your-form-uuid"></div>
```

## Features

- Zero dependencies - Pure vanilla JavaScript
- ALTCHA spam protection built-in
- Supports Bootstrap, Tailwind, Bulma, Material

## Installation

### CDN (Recommended)
```html
<script src="https://formshive.com/embed.min.js"></script>
```

### NPM
```bash
npm install @gofranz/formshive-embed
```

## Usage

### Embed Mode (Default)
```html
<div data-formshive-id="your-form-uuid"></div>
```

### Link Mode
```html
<a href="#" data-formshive-id="your-form-uuid" data-formshive-mode="link">
  Contact Us
</a>
```

### iFrame Mode
```html
<div data-formshive-id="your-form-uuid" data-formshive-mode="iframe"></div>
```

## Configuration

```html
<div 
  data-formshive-id="your-form-uuid"
  data-formshive-mode="embed"
  data-formshive-css="tailwind"
  data-formshive-locale="en"
  data-formshive-theme="dark">
</div>
```

Attributes:
- `data-formshive-id` - Form UUID (required)
- `data-formshive-mode` - Display mode: embed, link, iframe
- `data-formshive-css` - CSS framework: bootstrap, tailwind, bulma, material
- `data-formshive-locale` - Language: en, es, de, fr, etc.
- `data-formshive-theme` - Theme: light, dark

## JavaScript API

```javascript
// Load forms dynamically
Formshive.loadForms();

// Load specific form
Formshive.loadForm('your-form-uuid');
```

## Styling

CSS frameworks automatically detected or specify with `data-formshive-css`.

Dark mode:
```html
<div data-formshive-id="your-form-uuid" data-formshive-theme="dark"></div>
```

## Support

- Email: support@formshive.com
- Documentation: https://formshive.com/docs

## License

MIT