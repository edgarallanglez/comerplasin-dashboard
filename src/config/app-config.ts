import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Comerplasin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Comerplasin.`,
  meta: {
    title: "Comerplasin",
    description:
      "Tablero de estadísticas de Comerplasin en tiempo real",
  },
};
