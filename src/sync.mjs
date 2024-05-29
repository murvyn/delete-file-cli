import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { deleteFileSync } from "./helpers/deleteFile.mjs";
import { getAllFilesInDirectorySync } from "./helpers/getAllFilesInDirectory.mjs";
import { performance } from "perf_hooks";

let isCancelled = false;

// Signal handling for SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log(chalk.yellow("\nSearch cancelled by user"));
  isCancelled = true;
  process.exit(1); // Exit with error code
});

export const findAndDeleteFileSync = async () => {
  const directoryAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "Please enter directory(sync):",
    },
  ]);

  const { directory } = directoryAnswer;

  const searchNameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "searchName",
      message: "Please enter file name(sync):",
    },
  ]);
  const { searchName } = searchNameAnswer;
  try {
    const spinner = ora("Searching for file(s)").start();

    const startTime = performance.now()

    const files = getAllFilesInDirectorySync(directory);
    if (!files) {
      spinner.fail("Something went wrong");
      return;
    }
    const fileNames = files?.map((filePath) => ({
      name: path.basename(filePath),
      path: filePath
    }));

    const results = fileNames.filter((file) => file.name.includes(searchName));
    const endTime = performance.now()
    const totalTime = endTime - startTime
    spinner.succeed(`Found ${results.length} files in ${totalTime}`);


    if (results.length === 0) {
      console.log(chalk.yellow(`No file found matching ${searchName}`));

      return;
    } else {
      const choices = results.map((result) => ({
        name: result.name,
        path: result.path,
      }));

      const answer = await inquirer.prompt([
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

      const confirm = await inquirer.prompt([
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
