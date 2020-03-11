const NewsFragments = require("./src");
const pjson = require("./package.json");

const newsFragments = new NewsFragments();

newsFragments.init();
newsFragments.bump(pjson.version);
