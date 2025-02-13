# Screenshot Genie Client

A lightweight Node.js client library for [Screenshot Genie](https://screenshotgenie.com/), a service for screenshot generation and thumbnail hosting.

## Features

- Generate screenshots from HTML or URLs
- Create thumbnails at different widths
- Download images directly to files
- Simple, Promise-based API

## Installation

```bash
# If using as a local file:
# Just copy screenshotGenie.js to your project

# If published to npm:
npm install @yourorg/screenshot-genie
```

## Quick Start

```javascript
import ScreenshotGenie from "./screenshotGenie.js";

const genie = new ScreenshotGenie({
  apiKey: process.env.SCREENSHOT_GENIE_API_KEY
});

// Generate from HTML
const { imageKey } = await genie.createImageKey({
  html: "<h1>Hello World!</h1>",
  width: 800,
  height: 600
});

// Get URL for a 300px thumbnail
const imageUrl = genie.getImageUrl(imageKey, 300);

// Download the image
await genie.downloadImage(imageKey, 300, "thumbnail.png");
```

## API Reference

### Constructor

```javascript
new ScreenshotGenie({
  apiKey: string,  // Required: Your Screenshot Genie API key
  host?: string    // Optional: Override the API host (default: https://screenshotgenie.com)
})
```

### Methods

#### createImageKey(imageGenerationInputs)
Generate a new screenshot and get its key.

```javascript
const inputs = {
  html: "<h1>Hello</h1>",  // HTML content to render
  // OR
  url: "https://example.com",  // URL to capture
  width: 1200,    // Viewport width
  height: 800,    // Viewport height
  browserZoom: 1  // Browser zoom level
};
const { imageKey } = await genie.createImageKey(inputs);
```

#### getImageUrl(imageKey, width)
Get the URL for an image at a specific width.

```javascript
const url = genie.getImageUrl("abc123_expires_20250311", 300);
```

#### downloadImage(imageKey, width, filePath)
Download an image directly to a file.

```javascript
await genie.downloadImage("abc123_expires_20250311", 300, "image.png");
```

## Notes

- Image keys are valid for 30 days
- Supported image widths: Any size up to the original capture width
- All methods throw errors with detailed messages on failure

## License

MIT
