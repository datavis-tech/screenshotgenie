import ScreenshotGenie from "./index.js";

// Load API key from environment
const apiKey = process.env.SCREENSHOT_GENIE_API_KEY;
if (!apiKey) {
  console.error("Please set SCREENSHOT_GENIE_API_KEY environment variable");
  process.exit(1);
}

async function captureFromHTML() {
  console.log("\n📸 Capturing from HTML...");
  const genie = new ScreenshotGenie({ apiKey });

  const inputs = {
    html: `
      <div style="padding: 2em; font-family: system-ui;">
        <h1 style="color: #2563eb;">Hello from Screenshot Genie!</h1>
        <p style="color: #4b5563;">Capturing HTML content is easy.</p>
      </div>
    `,
    width: 800,
    height: 400,
    browserZoom: 1,
  };

  const { imageKey } = await genie.createImageKey(inputs);
  console.log("✅ Generated image key:", imageKey);

  // Get URLs for different sizes
  const sizes = [800, 400, 200];
  for (const width of sizes) {
    const url = genie.getImageUrl(imageKey, width);
    console.log(`🔗 ${width}px URL:`, url);
  }

  // Download a thumbnail
  await genie.downloadImage(imageKey, 200, "thumbnail.png");
  console.log("💾 Saved thumbnail.png");
}

async function captureFromURL() {
  console.log("\n📸 Capturing from URL...");
  const genie = new ScreenshotGenie({ apiKey });

  const inputs = {
    url: "https://github.com",
    width: 1200,
    height: 800,
    browserZoom: 1,
  };

  const { imageKey } = await genie.createImageKey(inputs);
  console.log("✅ Generated image key:", imageKey);

  // Download full-size image
  await genie.downloadImage(imageKey, 1200, "github.png");
  console.log("💾 Saved github.png");
}

// Run the examples
(async () => {
  try {
    await captureFromHTML();
    await captureFromURL();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();
