import NewsFragments from "./src/index.js";
import pjson from "./package.json" assert { type: 'json' };

const newsFragments = new NewsFragments();

newsFragments.init();
newsFragments.bump(pjson.version);
