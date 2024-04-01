// Services
import { Server } from "./server.js";
import { createChronosPath } from "./generate-config.js";

createChronosPath();
new Server().start();