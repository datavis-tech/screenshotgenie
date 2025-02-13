import { writeFile } from "fs/promises";

export default class ScreenshotGenie {
  constructor({ apiKey, host = "https://screenshotgenie.com" }) {
    if (!apiKey) {
      throw new Error("ScreenshotGenie requires an `apiKey` to be provided.");
    }
    this.apiKey = apiKey;
    this.host = host;
  }

  /**
   * Create an image key by providing the HTML or URL and other generation parameters.
   * @param {Object} imageGenerationInputs - The generation inputs (html, url, width, height, etc.).
   * @returns {Promise<Object>} - Returns an object containing { imageKey }.
   */
  async createImageKey(imageGenerationInputs) {
    const response = await fetch(`${this.host}/api/create-image-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ imageGenerationInputs }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create image key. Status: ${response.status}, Body: ${errorText}`
      );
    }

    const { imageKey } = await response.json();
    return { imageKey };
  }

  /**
   * Generate a direct image URL for a given width.
   * @param {string} imageKey - The image key returned from `createImageKey`.
   * @param {number} width - The width of the image to fetch (in pixels).
   * @returns {string} - A direct URL to the generated image.
   */
  getImageUrl(imageKey, width) {
    if (!imageKey) {
      throw new Error("`imageKey` is required to generate the image URL.");
    }
    if (!width) {
      throw new Error("`width` is required to generate the image URL.");
    }

    const imageId = imageKey.split("_")[0];
    const imageFileName = `${imageId}_${width}px.png`;
    return `${this.host}/images/${imageFileName}`;
  }

  /**
   * Download the screenshot for a given image key at a specified width.
   * @param {string} imageKey - The image key to identify the screenshot.
   * @param {number} width - The desired width in pixels.
   * @param {string} filePath - The local file path where the image should be saved.
   * @returns {Promise<void>}
   */
  async downloadImage(imageKey, width, filePath) {
    const url = this.getImageUrl(imageKey, width);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to download image. Status: ${response.status}, Body: ${errorText}`
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(filePath, buffer);
  }
}
