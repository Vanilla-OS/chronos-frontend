import type { App } from "vue";
import ChronosAPI from "@/core/chronos";
import ChronosConfig from "@/config";

export default {
    install(app: App) {
        app.use(ChronosAPI, ChronosConfig.chronosApiUrl);
    },
};
