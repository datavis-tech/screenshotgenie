import "dotenv/config";
import ScreenshotGenie from "../src/index";

// Check environment variable
if (!process.env.SCREENSHOT_GENIE_API_KEY) {
  console.error(
    "❌ Please set SCREENSHOT_GENIE_API_KEY in .env file or environment"
  );
  process.exit(1);
}

async function captureFromHTML() {
  console.log("\n📸 Capturing from HTML...");

  const genie = new ScreenshotGenie();

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
  const thumbnailUrl = genie.getImageUrl(imageKey, 200);
  console.log(`🔗 Thumbnail URL:`, thumbnailUrl);
  await genie.downloadImage(thumbnailUrl, "thumbnail.png");
  console.log("💾 Saved thumbnail.png");
}

async function captureFromURL() {
  console.log("\n📸 Capturing from URL...");

  const genie = new ScreenshotGenie();

  const inputs = {
    url: "https://github.com",
    width: 1920,
    height: 1080,
    browserZoom: 1,
  };

  const { imageKey } = await genie.createImageKey(inputs);
  console.log("✅ Generated image key:", imageKey);

  // Download full-size image
  const imageUrl = genie.getImageUrl(imageKey, 1200);
  console.log(`🔗 1200px URL:`, imageUrl);
  await genie.downloadImage(imageUrl, "github.png");
  console.log("💾 Saved github.png");
}

// Run the examples
(async () => {
  try {
    await captureFromHTML();
    await captureFromURL();
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();
