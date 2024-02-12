const fs = require("fs");
const path = require("path");
const { URL } = require("url");

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

const chronosConfig = {
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

const publicFolderPath = path.resolve(__dirname, "public");
if (!fs.existsSync(publicFolderPath)) {
  fs.mkdirSync(publicFolderPath);
}

if (process.env.CHRONOS_LOGO_URL && !isWebURL(process.env.CHRONOS_LOGO_URL)) {
  const logoExtension = path.extname(process.env.CHRONOS_LOGO_URL);
  const logoFileName = `logo${logoExtension}`;
  const logoFilePath = path.resolve(publicFolderPath, logoFileName);
  fs.copyFileSync(process.env.CHRONOS_LOGO_URL, logoFilePath);
  chronosConfig.logoUrl = `/logo${logoExtension}`;
}

const configFilePath = path.resolve(publicFolderPath, "chronos.json");
fs.writeFileSync(configFilePath, JSON.stringify(chronosConfig, null, 2));

console.log("chronos.json generated successfully!");

function isWebURL(str) {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
}
