import { fileURLToPath } from 'url';
import { dirname, resolve, extname } from 'path';
import { promises as fs } from 'fs';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parseArray = (arrayString) => {
  try {
    return arrayString ? JSON.parse(arrayString) : [];
  } catch (error) {
    console.error(`Error parsing JSON array: ${error.message}`);
    return [];
  }
};

const extractItemsFromEnv = (prefix) => {
  const items = [];
  let index = 1;

  while (process.env[`${prefix}_${index}`]) {
    const itemString = process.env[`${prefix}_${index}`];
    const item = parseArray(itemString);

    if (item.length > 0) {
      items.push(item[0]);
    }

    index++;
  }

  return items;
};

const generateChronosConfig = {
  title: process.env.CHRONOS_TITLE || "Chronos Documentation",
  logoTitle: process.env.CHRONOS_LOGO_TITLE || "Documentation",
  logoUrl: process.env.CHRONOS_LOGO_URL || "/logo.svg",
  description:
    process.env.CHRONOS_DESCRIPTION ||
    "A frontend in Vue.js for the Chronos documentation server.",
  baseUrl: process.env.CHRONOS_BASE_URL || "http://localhost:5173",
  chronosCollections: extractItemsFromEnv("CHRONOS_COLLECTION"),
  extraLinks: extractItemsFromEnv("CHRONOS_EXTRA_LINK") || [
    {
      url: "https://github.com/vanilla-os/Chronos",
      name: "Source Code",
    },
  ],
};

export function createChronosPath() {
  const publicFolderPath = resolve(__dirname, "public");
  fs.mkdir(publicFolderPath, { recursive: true }).catch(console.error);

  if (process.env.CHRONOS_LOGO_URL && !isWebURL(process.env.CHRONOS_LOGO_URL)) {
    const logoExtension = extname(process.env.CHRONOS_LOGO_URL);
    const logoFileName = `logo${logoExtension}`;
    const logoFilePath = resolve(publicFolderPath, logoFileName);
    fs.copyFile(process.env.CHRONOS_LOGO_URL, logoFilePath).catch(console.error);
    generateChronosConfig.logoUrl = `/logo${logoExtension}`;
  }

  const configFilePath = resolve(publicFolderPath, "chronos.json");
  fs.writeFile(configFilePath, JSON.stringify(generateChronosConfig, null, 2)).catch(console.error);

  console.log("chronos.json generated successfully!");
}

function isWebURL(str) {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
}
