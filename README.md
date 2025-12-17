# Threads CORS Fix

A browser extension that fixes CORS (Cross-Origin Resource Policy) issues when embedding Threads content.

## What it does

Modifies the `Cross-Origin-Resource-Policy` header from `same-origin` to `cross-origin` for resources loaded from:
- `fbcdn.net`
- `cdninstagram.com`

This allows Threads images and media to load correctly on third-party websites.

## Installation

### Chrome

1. Download or clone this repository
2. Run `npm run build`
3. Go to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the `dist/chrome` folder

### Firefox

1. Download or clone this repository
2. Run `npm run build`
3. Go to `about:debugging`
4. Click "This Firefox"
5. Click "Load Temporary Add-on..."
6. Select `dist/firefox/manifest.json`

#### ⚠️ Important: Firefox Enhanced Tracking Protection

Firefox's Enhanced Tracking Protection may block requests to Facebook CDN domains **before** this extension can modify the headers.

**If images are not loading on Threads:**

1. Navigate to `threads.net`
2. Click the **shield icon** 🛡️ in the address bar
3. Toggle **OFF** the "Enhanced Tracking Protection" for this site

This only affects `threads.net` and does not reduce your privacy on other websites.

## Development

### Build Commands

```bash
# Build for all browsers
npm run build

# Build for specific browser
npm run build:chrome
npm run build:firefox

# Create zip packages for store submission
npm run package

# Clean build directory
npm run clean
```

### Project Structure

```
src/
├── manifests/
│   ├── chrome.json      # Chrome manifest
│   └── firefox.json     # Firefox manifest
└── shared/
    ├── rules.json       # Declarative net request rules
    └── icons/           # Extension icons
```

## Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome  | 88+             | Full support |
| Firefox | 113+            | Requires disabling ETP for threads.net |

## License

MIT
