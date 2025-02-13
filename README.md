# Screenshot Genie Client

A Node.js client library for [Screenshot Genie](https://screenshotgenie.com/) - a simple way to generate, resize, and host screenshots programmatically.

## Features

✨ Generate screenshots from HTML or URLs  
🖼️ Create responsive thumbnails at any width  
💾 Download images directly to files  
🚀 Modern, Promise-based API  
📝 Full TypeScript support  
🔒 Secure authentication via API keys 

## Installation

```bash
# Using npm
npm install screenshotgenie

# Using yarn
yarn add screenshotgenie

# Using pnpm
pnpm add screenshotgenie
```

## Quick Start

```javascript
import ScreenshotGenie from "screenshotgenie";

// Initialize the client
const genie = new ScreenshotGenie({
  apiKey: process.env.SCREENSHOT_GENIE_API_KEY
});

// Capture from HTML
const { imageKey } = await genie.createImageKey({
  html: "<h1>Hello World!</h1>",
  width: 800,
  height: 600
});

// Get a thumbnail URL
const imageUrl = genie.getImageUrl(imageKey, 400);

// Download the image
await genie.downloadImage(imageKey, 400, "thumbnail.png");
```

## API Reference

### Constructor Options

```typescript
interface ScreenshotGenieOptions {
  apiKey: string;    // Your Screenshot Genie API key
  host?: string;     // Optional API host override
}

const genie = new ScreenshotGenie(options);
```

### Methods

#### createImageKey(inputs)

Generate a new screenshot and get its unique key.

```typescript
interface ImageGenerationInputs {
  html?: string;      // HTML content to render
  url?: string;       // URL to capture (alternative to html)
  width: number;      // Viewport width in pixels
  height: number;     // Viewport height in pixels
  browserZoom?: number; // Browser zoom level (default: 1)
}

const { imageKey } = await genie.createImageKey(inputs);
```

#### getImageUrl(imageKey, width)

Get the URL for an image at a specific width.

```javascript
const url = genie.getImageUrl("abc123_expires_20250311", 800);
// => https://screenshotgenie.com/images/abc123_800px.png
```

#### downloadImage(imageKey, width, filePath)

Download an image directly to a file.

```javascript
await genie.downloadImage("abc123_expires_20250311", 800, "screenshot.png");
```

## Examples

### Capture from HTML

```javascript
const { imageKey } = await genie.createImageKey({
  html: `
    <div style="padding: 2em">
      <h1>Hello from Screenshot Genie!</h1>
      <p>Capturing HTML content is easy.</p>
    </div>
  `,
  width: 800,
  height: 400
});

// Generate multiple sizes
const sizes = [800, 400, 200];
for (const width of sizes) {
  await genie.downloadImage(imageKey, width, `image_${width}px.png`);
}
```

### Capture from URL

```javascript
const { imageKey } = await genie.createImageKey({
  url: "https://github.com",
  width: 1200,
  height: 800,
  browserZoom: 1
});

// Get a thumbnail URL
const thumbUrl = genie.getImageUrl(imageKey, 400);
```

## Best Practices

- Store your API key securely (e.g., environment variables)
- Store image keys for later use (e.g. attached to entries in your database)
- Image keys expire after 30 days
- Handle errors appropriately in production code
- Consider implementing retry logic for image requests

## Error Handling

The library throws detailed errors for common issues:

```javascript
try {
  await genie.createImageKey(inputs);
} catch (error) {
  if (error.message.includes("API key")) {
    // Handle authentication errors
  } else if (error.message.includes("Failed to create")) {
    // Handle generation errors
  }
}
```

## License

MIT © Datavis Tech
