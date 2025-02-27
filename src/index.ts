import { writeFile } from "fs/promises";
import type {
  ImageGenerationInputs,
  ImageKey,
  ScreenshotGenieConfig,
  ImageHash,
  ImageFileName,
  FormattedDateString
} from "./types";

// Re-export the types
export type {
  ImageGenerationInputs,
  ImageKey,
  ScreenshotGenieConfig,
  ImageHash,
  ImageFileName,
  FormattedDateString
};

/**
 * Screenshot Genie client library for generating and managing screenshots
 */
export class ScreenshotGenie {
  private apiKey: string | undefined;
  private host: string;

  constructor(config: ScreenshotGenieConfig = {}) {
    const {
      apiKey = process.env.SCREENSHOT_GENIE_API_KEY,
      host = "https://screenshotgenie.com",
    } = config;
    // Check for API key in options first, then environment variable
    const providedApiKey = apiKey || process.env.SCREENSHOT_GENIE_API_KEY;

    if (!providedApiKey) {
      throw new Error(
        "ScreenshotGenie requires an API key. Either provide it in the constructor options " +
          "or set the SCREENSHOT_GENIE_API_KEY environment variable."
      );
    }

    this.apiKey = providedApiKey;
    this.host = host;
  }

  async createImageKey(
    imageGenerationInputs: ImageGenerationInputs
  ): Promise<ImageKey> {
    if (!imageGenerationInputs.browserZoom) {
      imageGenerationInputs.browserZoom = 1.0;
    }
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

    const json = await response.json();

    if (json.ok === false) {
      throw new Error(json.body);
    }

    console.log("json", json);
    return json.imageKey;
  }

  getImageUrl(imageKey: ImageKey, width: number): string {
    if (!imageKey) {
      throw new Error("`imageKey` is required to generate the image URL.");
    }
    if (!width) {
      throw new Error("`width` is required to generate the image URL.");
    }

    const imageId = imageKey.split("_expires_")[0];
    const imageFileName = `${imageId}_${width}px.png`;
    return `${this.host}/images/${imageFileName}`;
  }

  // NodeJS only
  async downloadImage(url: string, filePath: string): Promise<void> {
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

export const isImageKeyExpired = (imageKey: ImageKey): boolean => {
  // Extract the expiration date from the image key
  const parts = imageKey.split("_expires_");
  if (parts.length !== 2) {
    throw new Error(
      "Invalid image key format. Expected format: {imageHash}_expires_{expirationDate}"
    );
  }

  const expirationDateStr = parts[1];

  // Validate the expiration date format (should be YYYYMMDD)
  if (!/^\d{8}$/.test(expirationDateStr)) {
    throw new Error(
      "Invalid expiration date format in image key. Expected format: YYYYMMDD"
    );
  }

  // Parse the expiration date
  const year = parseInt(expirationDateStr.substring(0, 4), 10);
  const month = parseInt(expirationDateStr.substring(4, 6), 10) - 1; // JS months are 0-indexed
  const day = parseInt(expirationDateStr.substring(6, 8), 10);

  const expirationDate = new Date(year, month, day);
  expirationDate.setHours(23, 59, 59, 999); // Set to end of the day

  // Compare with current date
  const currentDate = new Date();

  return currentDate > expirationDate;
};
