# Browser AI CKEditor

Provides AI-powered toolbar buttons for CKEditor 5 using Chrome's built-in AI
APIs for rewriting, summarizing, proofreading, and content generation.

## Features

- **AI Rewrite**: Rewrites selected text with improved clarity and style
- **AI Summarize**: Summarizes selected text into a concise version
- **AI Proofread**: Corrects grammar, spelling, and punctuation errors
- **AI Write for Me**: Generates content based on a topic or prompt

## Requirements

This module requires:

- Drupal 10.3+ or Drupal 11
- CKEditor 5 (included in Drupal core)
- **Google Chrome version 128 or later**
- Chrome's built-in AI APIs enabled

### Enabling Chrome AI APIs

Chrome's AI APIs are currently experimental and must be enabled manually:

1. Open Chrome and navigate to `chrome://flags`
2. Enable the following flags:
   - `#optimization-guide-on-device-model` → Set to "Enabled BypassPerfRequirement"
   - `#prompt-api-for-gemini-nano` → Set to "Enabled"
   - `#summarization-api-for-gemini-nano` → Set to "Enabled"
   - `#writer-api-for-gemini-nano` → Set to "Enabled"
   - `#rewriter-api-for-gemini-nano` → Set to "Enabled"
3. Restart Chrome

**Note**: These APIs are only available in Chrome. Other browsers (Firefox,
Safari, Edge) do not support these APIs, and the toolbar buttons will be
disabled when using those browsers.

## Installation

1. Install as you would normally install a contributed Drupal module. See
   [Installing Drupal Modules](https://www.drupal.org/docs/extending-drupal/installing-drupal-modules)
   for further information.

2. Enable the module at Administration > Extend.

## Configuration

1. Navigate to Administration > Configuration > Content authoring > Text
   formats and editors.
2. Configure a text format that uses CKEditor 5.
3. Drag the AI toolbar buttons (Rewrite, Summarize, Proofread, Write for Me)
   from the available buttons to the active toolbar.
4. Save the configuration.

## Usage

### AI Rewrite, Summarize, and Proofread

1. Select text in the CKEditor 5 editor
2. Click the corresponding AI toolbar button
3. Wait for the AI to process your request
4. The selected text will be replaced with the AI-generated result

### AI Write for Me

1. Place your cursor where you want the generated content
2. Click the "AI Write for Me" toolbar button
3. Enter a topic or prompt in the popup form
4. Click "Generate"
5. The AI-generated content will be inserted at the cursor position

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 128+ | ✅ Full support (with flags enabled) |
| Chrome < 128 | ❌ Not supported |
| Firefox | ❌ Not supported |
| Safari | ❌ Not supported |
| Edge | ❌ Not supported |

When using an unsupported browser, the AI toolbar buttons will be disabled but
the editor will continue to function normally.

## Troubleshooting

### Buttons are disabled

- Ensure you are using Google Chrome version 128 or later
- Verify that the Chrome AI flags are enabled (see Requirements section)
- Check the browser console for error messages
- Restart Chrome after enabling the flags

### AI operations fail

- Some AI operations require an internet connection for initial model download
- Ensure you have sufficient disk space for AI models
- Check Chrome's AI model status at `chrome://on-device-translation-internals/`

## Development

### Building from source

```bash
cd web/modules/custom/browser_ai_ckeditor
npm install
npm run build
```

### Development mode with watch

```bash
npm run watch
```

## Maintainers

- [Tanay Sai](https://www.drupal.org/u/saitanay) - saitanay
- [Amit Vyas](https://www.drupal.org/u/vyasamit2007) - vyasamit2007
- [Aman Srivatsava](https://www.drupal.org/u/credevator) - credevator

## Supporting organizations

This module is maintained by the community. Contributions are welcome!

## Contributing

Contributions to this module are welcome! Please visit the [issue queue](https://www.drupal.org/project/issues/browser_ai_ckeditor) to report bugs or suggest features.
