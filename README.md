# Threads Image Fix

A browser extension that fixes image loading issues on Threads by modifying CORS (Cross-Origin Resource Sharing) headers.

![Example](example.jpg)

## 📖 Overview

This extension resolves image loading problems on Threads (threads.net) caused by Cross-Origin Resource Policy restrictions. It automatically modifies response headers from CDN servers to allow cross-origin image loading.

## 💡 How It Works

The extension uses the Declarative Net Request API to modify response headers from Facebook CDN and Instagram CDN servers:

- **Target domains**: `fbcdn.net`, `cdninstagram.com`
- **Modified header**: `cross-origin-resource-policy` → `cross-origin`
- **Affected resources**: Images, media, fonts, stylesheets, scripts, and other resources

This allows Threads to properly load images from these CDN servers without CORS restrictions.

## 🛡️ Privacy

This extension:
- ✅ Does NOT collect any user data
- ✅ Does NOT track browsing history
- ✅ Only modifies headers for specified CDN domains
- ✅ Works entirely locally in your browser
