import NewsFragments from "./src";
import pjson from "./package.json";

const newsFragments = new NewsFragments();

newsFragments.init();
newsFragments.bump(pjson.version);
