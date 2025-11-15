
import express from "express";
import cors from "cors";
import path from 'path'
import { fileURLToPath } from 'url';
import { simpleGit } from "simple-git";
import { generate } from "./utils.js";
import { getAllFiles } from "./file.js";
import { uploadFile } from "./aws.js";
import {createClient} from 'redis'
const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors())
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate(); 
    const git = simpleGit()
    await git.clone(repoUrl, path.join(__dirname, `output/${id}`));
    const files = getAllFiles(path.join(__dirname, `output/${id}`))
    //upload each file to s3
    files.forEach(async file=>{
        await uploadFile(file.slice(__dirname.length +1),file)
    })
    await new Promise((resolve) => setTimeout(resolve, 5000))
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({
        id: id
    })
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})

app.listen(3000);