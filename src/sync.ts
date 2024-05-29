import { Command } from "commander";
import Fuse from "fuse.js";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { deleteFileSync } from "./helpers/deleteFile";
import { getAllFilesInDirectorySync } from "./helpers/getAllFilesInDirectory";

const program = new Command();

let isCancelled = false;

// Signal handling for SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log(chalk.yellow("\nSearch cancelled by user"));
  isCancelled = true;
  process.exit(1); // Exit with error code
});

type Choice = {
  name: string;
  path?: string;
};

export const findAndDeleteFileSync = async (): Promise<void> => {
  const directoryAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "Please enter directory:",
    },
  ]);

  const { directory } = directoryAnswer;

  const searchNameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "searchName",
      message: "Please enter file name:",
    },
  ]);
  const { searchName } = searchNameAnswer;
  try {
    const spinner = ora("Searching for file(s)").start();

    const files: string[] | undefined = getAllFilesInDirectorySync(directory);
    if (!files) {
      spinner.fail("Something went wrong");
      return;
    }
    const fileNames: string[] = files?.map((filePath) =>
      path.basename(filePath)
    );

    spinner.succeed(`Found ${fileNames.length} files`);

    const fuse = new Fuse(fileNames, { includeScore: true });
    const results = fuse.search(searchName);

    if (results.length === 0) {
      console.log(chalk.yellow(`No file found matching ${searchName}`));

      return;
    } else {
      const choices: Choice[] = results.map((result) => ({
        name: result.item,
        path: files.find((file) => path.basename(file) === result.item),
      }));

      const answer = await inquirer.prompt<{ fileToDelete: string }>([
        {
          type: "list",
          name: "fileToDelete",
          message: "Matches found. Please choose the file to delete:",
          choices: choices.map((choice) => choice.name),
        },
      ]);

      if (isCancelled) {
        console.log(chalk.yellow("File deletion cancelled"));
        return;
      }

      const confirm = await inquirer.prompt<{ confirmDelete: boolean }>([
        {
          type: "confirm",
          name: "confirmDelete",
          message: `Are you sure you want to delete ${answer.fileToDelete}?`,
          default: false,
        },
      ]);
      if (confirm.confirmDelete) {
        const res = choices.find(
          (choice) => choice.name === answer.fileToDelete
        );
        if (!res || !res.path) {
          return console.error(chalk.red("Something went wrong"));
        }
        deleteFileSync(res.path);
      } else {
        console.log(chalk.yellow("File deletion aborted"));
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(chalk.red(`Error: ${err.message}`));
    } else {
      console.error(chalk.red("An unknown error occurred"));
    }
  }
};
