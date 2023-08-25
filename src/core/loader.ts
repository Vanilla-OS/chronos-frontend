import type { App } from "vue";
import ChronosPlugin from "@/core/chronos";

export default {
    install(app: App) {
        app.use(ChronosPlugin);
    },
};
