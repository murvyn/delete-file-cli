import chalk from "chalk";
import { unlinkSync } from "fs";
import { unlink } from "fs/promises";

export const deleteFileAsync = (filePath: string): void => {
  unlink(filePath.trim())
    .then(() => console.log(chalk.green("File deleted successfully")))
    .catch((err) => {
      if (err instanceof Error) {
        console.error(chalk.red(`Error deleting file: ${err.message}`));
      } else {
        console.error(
          chalk.red("An unknown error occurred while deleting the file")
        );
      }
    });
};

export const deleteFileSync = (filePath: string): void => {
  try {
    unlinkSync(filePath.trim());
    console.log(chalk.green("File deleted successfully"));
  } catch (err) {
    if (err instanceof Error) {
      console.error(chalk.red(`Error deleting file: ${err.message}`));
    } else {
      console.error(
        chalk.red("An unknown error occurred while deleting the file")
      );
    }
  }
};

