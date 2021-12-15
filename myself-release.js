import NewsFragments from "./src/index.js";
import { readFileSync } from "fs";

const pjson = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url))
);

const newsFragments = new NewsFragments();

newsFragments.init();
newsFragments.bump(pjson.version);
