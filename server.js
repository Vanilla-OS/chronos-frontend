import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express.default();
const PORT = process.env.PORT || 6090;

app.use(express.static(resolve(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
