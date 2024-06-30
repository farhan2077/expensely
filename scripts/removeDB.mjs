/* eslint-disable no-console */
/* eslint-disable no-undef */

// this script removes local sqlite db and associated files and the db/migrations folder

import { unlink, rm } from "fs/promises";

const filesToRemove = ["local.db", "local.db-shm", "local.db-wal"];
const foldersToRemove = ["db/migrations"];

async function removeFiles(files) {
  try {
    await Promise.all(files.map((file) => unlink(file)));
    console.log("All db files deleted");
  } catch (err) {
    console.error("Error deleting db files:", err);
  }
}

async function removeFolders(folders) {
  try {
    await Promise.all(
      folders.map((folder) => rm(folder, { recursive: true, force: true }))
    );
    console.log("All db folders deleted");
  } catch (err) {
    console.error("Error deleting db folders:", err);
  }
}

removeFiles(filesToRemove);
removeFolders(foldersToRemove);
