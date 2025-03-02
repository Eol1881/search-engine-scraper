import { buildCli } from "../cli/cli.composer.mts";
import { cliConfig } from "../cli/cli.config.mts";

const main = async () => {
  const composer = buildCli(cliConfig);
  composer.updateSavedCompanies();
};

main();
