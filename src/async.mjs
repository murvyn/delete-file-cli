import inquirer from "inquirer";
import Fuse from "fuse.js";
import path from "path";
import { deleteFileAsync } from "./helpers/deleteFile.mjs";
import { getAllFilesInDirectoryAsync } from "./helpers/getAllFilesInDirectory.mjs";

export const findAndDeleteFileAsync = async () => {
  const directoryAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "directory",
      message: "Please enter directory(async):",
    },
  ]);

  const { directory } = directoryAnswer;

  const searchNameAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "searchName",
      message: "Please enter file name(async):",
    },
  ]);
  const { searchName } = searchNameAnswer;

  try {
    const files = await getAllFilesInDirectoryAsync(directory);
    const fileNames = files.map((filePath) => ({
      name: path.basename(filePath),
      path: filePath,
    }));

    const results = fileNames.filter((file) => file.name.includes(searchName));
    spinner.succeed(`Found ${results.length} files`);

    if (results.length === 0) {
      return console.log(`No file found matching ${searchName}`);
    } else {
      const choices = results.map((result) => ({
        name: result.item,
        path: files.find((file) => path.basename(file) === result.item),
      }));

      const answer = await inquirer.prompt([
        {
          type: "list",
          name: "fileToDelete",
          message: "Matches found. Please choose the file to delete:",
          choices,
        },
      ]);

      const confirm = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirmDelete",
          message: `Are you sure you want to delete ${answer.fileToDelete}`,
          default: false,
        },
      ]);
      if (confirm.confirmDelete) {
        const res = choices.filter(
          (choice) => choice.name === answer.fileToDelete
        );
        if (!res[0].path) {
          console.error("Something went wrong");
          return;
        }
        await deleteFileAsync(res[0].path);
      } else {
        console.log("File deletion aborted");
      }
    }
  } catch (err) {
    console.error("err", err);
    return;
  }
};

// module.exports.findAndDeleteFileAsync = findAndDeleteFileAsync
