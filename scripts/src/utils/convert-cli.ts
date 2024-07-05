import { wordConvert } from "./wordConvert";

const word = process.argv.slice(2).join(" ");

console.info(wordConvert(word));
