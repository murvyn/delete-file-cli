import chalk from "chalk";
import { lstatSync, readdirSync } from "fs";
import { lstat, readdir } from "fs/promises";
import path from "path";

export const getAllFilesInDirectoryAsync = async (
  dir: string,
  arrayOfFiles: string[] = []
): Promise<string[]> => {
  const excludedDirectories = [
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Program Files (x86)",
    "C:\\$Recycle.Bin",
    "C:\\System Volume Information",
  ];
  try {
    if (
      excludedDirectories.some((excludedDir) => dir.startsWith(excludedDir))
    ) {
      console.log(chalk.yellow(`Skipping unauthorized directory: ${dir}`));
      return arrayOfFiles;
    }

    const files: string[] = await readdir(dir);

    for (const file of files) {
      const fullPath: string = path.join(dir, file);
      const stats = await lstat(fullPath);

      if (stats.isFile()) {
        arrayOfFiles.push(fullPath);
      } else if (stats.isDirectory()) {
        await getAllFilesInDirectoryAsync(fullPath, arrayOfFiles);
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code) {
      const errorCode = (err as NodeJS.ErrnoException).code;
      if (errorCode === "EPERM" || errorCode === "EACCES") {
        console.warn(chalk.blue(`Skipping unauthorized directory: ${dir}`));
      } else {
        console.error(chalk.red(`Error reading directory: ${err.message}`));
      }
    } else {
      console.error(chalk.red("An unknown error occurred"));
    }
  }
  return arrayOfFiles;
};

export const getAllFilesInDirectorySync = (dir: string, arrayOfFiles: string[] = []) => {
  const excludedDirectories = [
    "C:\\Windows",
    "C:\\Program Files",
    "C:\\Program Files (x86)",
    "C:\\$Recycle.Bin",
    "C:\\System Volume Information",
  ];

  try {
    if (
      excludedDirectories.some((excludedDir) => dir.startsWith(excludedDir))
    ) {
      console.log(chalk.yellow(`Skipping unauthorized directory: ${dir}`));
      return arrayOfFiles;
    }

    const files: string[] = readdirSync(dir);

    for (const file of files) {
      const fullPath: string = path.join(dir, file);
      try {
        const stats = lstatSync(fullPath);

        if (stats.isFile()) {
          arrayOfFiles.push(fullPath);
        } else if (stats.isDirectory()) {
          getAllFilesInDirectorySync(fullPath, arrayOfFiles);
        }
      } catch (err) {
        if (err instanceof Error && (err as NodeJS.ErrnoException).code) {
          const errorCode = (err as NodeJS.ErrnoException).code;
          if (errorCode === "EPERM" || errorCode === "EACCES") {
            console.warn(
              chalk.blue(`Skipping unauthorized directory: ${fullPath}`)
            );
          } else {
            console.error(
              chalk.red(`Error reading file/directory: ${err.message}`)
            );
          }
        } else {
          console.error(chalk.red("An unknown error occurred"));
        }
      }
    }
  } catch (err) {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code) {
      const errorCode = (err as NodeJS.ErrnoException).code;
      if (errorCode === "EPERM" || errorCode === "EACCES") {
        console.warn(chalk.blue(`Skipping unauthorized directory: ${dir}`));
      } else {
        console.error(chalk.red(`Error reading directory: ${err.message}`));
      }
    } else {
      console.error(chalk.red("An unknown error occurred"));
    }
  }
  return arrayOfFiles;
};
