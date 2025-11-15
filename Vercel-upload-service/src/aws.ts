import AWS from "aws-sdk";
import fs from "fs";

// replace with your own credentials
const s3 = new AWS.S3({
    accessKeyId: "a796181af29f73ba3a13fc4e4390991f",
    secretAccessKey: "2d56de239fa346e93a995c1e6bcfb120873a69b19eb6fea7926899c4d15d16c1",
    endpoint: "https://c33a7784ff7805cf551e71d2b920feb7.r2.cloudflarestorage.com"
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
    console.log(response);
}