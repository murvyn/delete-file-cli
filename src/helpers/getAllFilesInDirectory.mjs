import chalk from "chalk"
import { lstatSync, readdirSync } from "fs";
import { lstat, readdir } from  "fs/promises"
import path from "path"

export const getAllFilesInDirectoryAsync = async (
  dir,
  arrayOfFiles= []
) => {
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

    const files = await readdir(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = await lstat(fullPath);

      if (stats.isFile()) {
        arrayOfFiles.push(fullPath);
      } else if (stats.isDirectory()) {
        await getAllFilesInDirectoryAsync(fullPath, arrayOfFiles);
      }
    }
  } catch (err) {
    console.log('error here')
    if (err.code) {
      const errorCode = err.code;
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

export const getAllFilesInDirectorySync = (dir, arrayOfFiles = []) => {
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

    const files = readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      try {
        const stats = lstatSync(fullPath);

        if (stats.isFile()) {
          arrayOfFiles.push(fullPath);
        } else if (stats.isDirectory()) {
          getAllFilesInDirectorySync(fullPath, arrayOfFiles);
        }
      } catch (err) {
        if (err.code) {
          const errorCode = err.code;
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
    if (err.code) {
      const errorCode = err.code;
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

