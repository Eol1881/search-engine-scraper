import { buildCli } from "../cli/cli.composer.mts";
import { cliConfig } from "../cli/cli.config.mts";

const main = async () => {
  const composer = buildCli({ ...cliConfig, playwright: { ...cliConfig.playwright, isTest: true } });
  composer.updateSavedCompanies();
};

main();
