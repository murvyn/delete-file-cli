import Fuse from "fuse.js";
import inquirer from "inquirer";
import path from "path";
import { deleteFileAsync } from "./helpers/deleteFile";
import { getAllFilesInDirectoryAsync } from "./helpers/getAllFilesInDirectory";

type Choice = {
  name: string;
  path?: string;
};

export const findAndDeleteFileAsync = async (): Promise<void> => {
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
    const files: string[] = await getAllFilesInDirectoryAsync(directory);
    const fileNames: string[] = files.map((filePath) =>
      path.basename(filePath)
    );

    const fuse = new Fuse(fileNames, { includeScore: true });
    const results = fuse.search(searchName);

    if (results.length === 0) {
      return console.log(`No file found matching ${searchName}`);
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
          choices,
        },
      ]);

      const confirm = await inquirer.prompt<{ confirmDelete: boolean }>([
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
    console.error(err);
    return;
  }
};
