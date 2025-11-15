import express from "express";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    accessKeyId: "a796181af29f73ba3a13fc4e4390991f",
    secretAccessKey: "2d56de239fa346e93a995c1e6bcfb120873a69b19eb6fea7926899c4d15d16c1",
    endpoint: "https://c33a7784ff7805cf551e71d2b920feb7.r2.cloudflarestorage.com"
})

const app = express();

app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);