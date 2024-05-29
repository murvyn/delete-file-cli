import { findAndDeleteFileAsync } from "./async.mjs";
import { Command } from "commander";
import chalk from "chalk";
import { findAndDeleteFileSync } from "./sync.mjs";

const program = new Command();

program
  .version("1.0.0")
  .description("A simple CLI to delete a file based on fuzzy search")
   .option(
    "-a, --async",
    `Search and delete file asynchronously, ${chalk.blue(
      "NB: this is faster but will timeout if directory is larger"
    )}`
  )
  .option(
    "-s, --sync",
    `Search and delete file synchronously, ${chalk.blue(
      "NB: this takes a long time to complete if directory is large"
    )}`
  )
  .action((option) => {
    if(option.async){
      findAndDeleteFileAsync();
    }else if(option.sync){
      findAndDeleteFileSync();
    }else{
      findAndDeleteFileAsync()
    }
  });

program.parse(process.argv);
