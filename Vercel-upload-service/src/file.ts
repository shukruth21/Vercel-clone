import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))// recursively get all files within a folder, not using push as it returns an array
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}