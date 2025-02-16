import { buildCli } from "../cli/cli.composer.mts";
import { cliConfig } from "../cli/cli.config.mts";
import { cliRunCommand } from "../cli/cli.run-command.mts";

const main = async () => {
  const composer = buildCli(cliConfig)

  await cliRunCommand(
    'UpdateSavedCompanies',
    ([search, start, limit]) => composer.updateSavedCompanies(search, +start, +limit),
  )
}

main()
