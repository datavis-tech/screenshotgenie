import { writeFile } from "fs/promises";

interface ScreenshotGenieConfig {
  apiKey?: string;
  host?: string;
}

interface ImageGenerationInputs {
  html?: string;
  url?: string;
  width: number;
  height: number;
  browserZoom?: number;
}

/**
 * Screenshot Genie client library for generating and managing screenshots
 */
export default class ScreenshotGenie {
  private apiKey: string | undefined;
  private host: string;
  /**
   * Create a new Screenshot Genie client
   * @param {Object} config Configuration options
   * @param {string} config.apiKey Your Screenshot Genie API key
   * @param {string} [config.host="https://screenshotgenie.com"] Optional API host override
   */
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

  /**
   * Create an image key by providing the HTML or URL and other generation parameters
   * @param {Object} imageGenerationInputs Generation parameters
   * @param {string} [imageGenerationInputs.html] HTML content to render
   * @param {string} [imageGenerationInputs.url] URL to capture (alternative to html)
   * @param {number} imageGenerationInputs.width Viewport width in pixels
   * @param {number} imageGenerationInputs.height Viewport height in pixels
   * @param {number} [imageGenerationInputs.browserZoom=1] Browser zoom level
   * @returns {Promise<Object>} Object containing { imageKey }
   */
  async createImageKey(imageGenerationInputs: ImageGenerationInputs) {
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
   * Generate a direct image URL for a given width
   * @param {string} imageKey The image key returned from createImageKey
   * @param {number} width Desired image width in pixels
   * @returns {string} Direct URL to the generated image
   */
  getImageUrl(imageKey: string, width: number): string {
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
   * Download the screenshot directly to a file
   * @param {string} imageKey The image key to identify the screenshot
   * @param {number} width Desired image width in pixels
   * @param {string} filePath Local file path to save the image
   * @returns {Promise<void>}
   */
  async downloadImage(
    url: string,
    filePath: string
  ): Promise<void> {
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
