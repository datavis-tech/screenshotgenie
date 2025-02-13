import { writeFile } from "fs/promises";

// Use your API key here.
const API_KEY = process.env.SCREENSHOT_GENIE_API_KEY;

// You can specify these options to generate an image from
// either a URL or HTML.
const imageGenerationInputs = {
  html: `<h1 style="font-size: 120px; margin-left: 120px">Hello, Screenshot Genie!</h1>`,
  // url: "https://github.com",
  width: 960,
  height: 500,
  browserZoom: 1,
};

async function main() {
  const HOST = "https://screenshotgenie.com";
  try {
    // Get the image key.
    // This is a unique identifier for the image that is generated.
    // You can store it in your database to refer to the image later.
    // The image key is valid for 30 days.
    // It can be used to generate image URLs for different sizes.
    const imageKeyResponse = await fetch(`${HOST}/api/create-image-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ imageGenerationInputs }),
    });
    if (!imageKeyResponse.ok) {
      const errorText = await imageKeyResponse.text();
      throw new Error(
        `HTTP error! status: ${imageKeyResponse.status}, body: ${errorText}`
      );
    }
    const { imageKey } = await imageKeyResponse.json();
    console.log(`Image key: ${imageKey}`);
    // Example output:
    //   Image key: df795d8fd1354b91d968ca674b4e1a45_expires_20250311

    // Generate the image URL for a 300px wide thumbnail.
    const thumbnailWidth = 300;
    const imageId = imageKey.split("_")[0];
    const imageFileName = `${imageId}_${thumbnailWidth}px.png`;
    const imageURL = `${HOST}/images/${imageFileName}`;
    console.log(`Image URL: ${imageURL}`);
    // Example output:
    //   Image URL: https://screenshotgenie.com/images/df795d8fd1354b91d968ca674b4e1a45_300px.png

    // Fetch the image and save it to a file.
    const imageResponse = await fetch(imageURL);
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    await writeFile(imageFileName, imageBuffer);
    console.log(`Saved: ${imageFileName}`);
    // Example output:
    //   Saved: df795d8fd1354b91d968ca674b4e1a45_300px.png
  } catch (e) {
    console.error(e);
  }
}

main();
