import { Command } from "commander";
import { findAndDeleteFileAsync } from "./async";
import chalk from "chalk";
import { findAndDeleteFileSync } from "./sync";

const program = new Command();

program
  .version("1.0.0")
  .description("A simple CLI to delete a file based on fuzzy search")
  .action(() => {
    findAndDeleteFileAsync();
  });

program
  .option(
    "-a, --async",
    `Search and delete file asynchronously, ${chalk.blue(
      "NB: this is faster but will timeout if directory is larger"
    )}`
  )
  .action(() => {
    findAndDeleteFileAsync();
  });

program
  .option(
    "-s, --sync",
    `Search and delete file synchronously, ${chalk.blue(
      "NB: this takes a long time to complete if directory is large"
    )}`
  )
  .action(() => {
    findAndDeleteFileSync();
  });

program.parse(process.argv);
