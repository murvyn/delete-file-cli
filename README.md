# Delete File Cli

```markdown
# Delete File CLI

A simple CLI to delete a file based on fuzzy search. This tool allows you to search and delete files either asynchronously or synchronously from a specified directory.

## Features

- Asynchronous search and delete for faster operations (with timeout consideration).
- Synchronous search and delete for more stable operations on large directories.
- Fuzzy search using file names.

## Installation

To install the CLI globally, use the following command:

```sh
npm install -g delete-file-cli
```

## Usage

### Basic Commands

- **Async Search and Delete**

  To search and delete a file asynchronously:

  ```sh
  delete-file-cli -a
  ```

- **Sync Search and Delete**

  To search and delete a file synchronously:

  ```sh
  delete-file-cli -s
  ```

### Examples

1. **Async Search and Delete**

   ```sh
   delete-file-cli -a
   ```

   You will be prompted to enter the directory and file name to search. The tool will perform an asynchronous search and present you with a list of matching files to choose from for deletion.

2. **Sync Search and Delete**

   ```sh
   delete-file-cli -s
   ```

   Similar to the async command, you will be prompted for the directory and file name. The tool will perform a synchronous search and present matching files for deletion.

## Development

### Project Structure

```
delete-file-cli/
├── src/
│   ├── index.mjs
│   ├── async.mjs
│   ├── sync.mjs
│   └── helpers/
│       ├── deleteFile.mjs
│       └── getAllFilesInDirectory.mjs
├── package.json
└── README.md
```

### Scripts

- **Start**

  To run the CLI locally:

  ```sh
  npm run start
  ```

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1. Fork the repo
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Maintainer: Marvin Asamoah

Email: <marvin.asamoah.123@gmail.com>

GitHub: [murvyn](https://github.com/murvyn)

```txt

### Note
Make sure to replace placeholders like `your-email@example.com` and `Your GitHub Profile` with your actual contact information and GitHub profile link.

This `README.md` file provides an overview of the CLI tool, instructions on installation and usage, and guidelines for development and contributing. It should serve as a good starting point for users and contributors alike.
