import express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import cors from "cors";
import {CakeworkApiClient, CakeworkApiEnvironment} from "@cakework/client/dist";
import {Svix} from "svix";

dotenv.config();

//@ts-ignore
const svix = new Svix(process.env.SVIX_AUTH_TOKEN);

const cakework = new CakeworkApiClient({
  xApiKey: process.env.CAKEWORK_API_KEY
});

var dockerfile: string
try {
  dockerfile = fs.readFileSync("./assets/Dockerfile", "utf8")
} catch(err) {
  console.error(err);
  process.exit(1);
}

var serverfile: string
try {
  serverfile = fs.readFileSync("./assets/server.js", "utf8")
} catch(err) {
  console.error(err);
  process.exit(1);
}

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//@ts-ignore
var fakeLocalDb = [];

app.post('/deploy', async (req, res) => {
  const config = req.body.config.content;
  const configJson = JSON.parse(config);
      //@ts-ignore
      configJson.handlers.forEach((handler, i) => {
        //@ts-ignore
        fakeLocalDb.push(handler);      
      });
  const jsHandlers = req.body.js_handlers.content;
  const packageJson = req.body.package_json.content;

  try {
    const request = {
      dockerfile: dockerfile,
      files: [
        {
          dir: ".",
          name: "cupcake.json",
          content: config
        },
        {
          dir: ".",
          name: "package.json",
          content: packageJson
        },
        {
          dir: ".",
          name: "handlers.js",
          content: jsHandlers
        },
        {
          dir: ".",
          name: "server.js",
          content: serverfile
        },
      ]
    }

    // map a handler to an image id
    const buildId = await cakework.buildImageFromFiles(request);
    // TODO use our webhook API instead of polling
    var build = await cakework.getBuild(buildId.buildId);
    while (build.status != "succeeded") {
      await new Promise(r => setTimeout(r, 2000));
      build = await cakework.getBuild(buildId.buildId);
    }

    const startVMRequest = {
      imageId: build.imageId!,
      cpu: 1,
      memory: 256,
      port: 8080
    }
    const vm = await cakework.startVm(startVMRequest);
    console.log(vm.id);
    console.log(vm.hostname);

    //@ts-ignore
    fakeLocalDb.forEach(async (handler) => {
      await svix.endpoint.create("app_2MUdhDRsA8W9Ee0Bvznutqi4WB7", {
        url: "https://" + vm.hostname + "/" + handler.name,
        version: 1,
        description: "an endpoint",
      });
    });

    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
})

app.get('/handlers', (req, res) => {
  //@ts-ignore
   res.send(fakeLocalDb);
})

app.post('/testEvent', async(req, res) => {
    const eventName = req.body.name;
    //@ts-ignore
    await svix.message.create("app_2MUdhDRsA8W9Ee0Bvznutqi4WB7", {
      eventType: eventName,
      payload: {
        // hack for onSyncStarted
        source: "Airtable",
        data: [
          "row1",
          "row2",
        ]
      }
    });

    res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
