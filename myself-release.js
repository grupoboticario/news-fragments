import { readFileSync } from "fs";

import NewsFragments from "./src/index.js";

const pjson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)),
);

const newsFragments = new NewsFragments();

newsFragments.init();
newsFragments.bump(pjson.version);
