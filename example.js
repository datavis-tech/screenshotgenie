import ScreenshotGenie from "./screenshotGenie.js";

// Example usage of the Screenshot Genie client library
(async () => {
  try {
    // Initialize the client with your API key
    const genie = new ScreenshotGenie({
      apiKey: process.env.SCREENSHOT_GENIE_API_KEY,
    });

    // Define the screenshot parameters
    const imageGenerationInputs = {
      html: `<h1 style="font-size: 120px; margin-left: 120px">Hello, Screenshot Genie!</h1>`,
      // url: "https://github.com",  // Alternative: capture from URL
      width: 960,
      height: 500,
      browserZoom: 1,
    };

    // 1. Create an image key
    const { imageKey } = await genie.createImageKey(imageGenerationInputs);
    console.log("✅ Image key:", imageKey);

    // 2. Generate URL for a 300px-wide thumbnail
    const thumbnailWidth = 300;
    const thumbUrl = genie.getImageUrl(imageKey, thumbnailWidth);
    console.log("🔗 300px image URL:", thumbUrl);

    // 3. Download and save the image
    const outFilePath = `screenshot_${thumbnailWidth}px.png`;
    await genie.downloadImage(imageKey, thumbnailWidth, outFilePath);
    console.log(`💾 Saved: ${outFilePath}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
