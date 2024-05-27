'use strict';

const fs = require('fs');
const cheerio = require("cheerio");
var fontCarrier = require('font-carrier');


const INPUT_PATH = "./iconfont/iconfont.ttf";

(async () => {
  const SVG_DEMO = await fs.promises.readFile("./svg.demo.svg", "utf-8");
  let contents = "";
  try {
    const fileContents = await fs.promises.readFile(INPUT_PATH);
    var transFont = fontCarrier.transfer(fileContents);
    var output = transFont.output({
      types: ['svg']
    });
    contents = output.svg.toString();
  } catch (err) {
    console.error(err);
  }
  if (!contents) {
    console.log("end");
    return;
  }
  await fs.promises.writeFile(`./contents.svg`, contents, "utf-8");
  const $ = cheerio.load(contents);
  await Promise.all(Array.prototype.map.call($("glyph"), async ele => {
    const d = $(ele).attr("d");
    const svgName = $(ele).attr("glyph-name");
    const $svgDemo = cheerio.load(SVG_DEMO);
    let newSvg = $svgDemo.html();
    $svgDemo("path").attr("d", d);
    newSvg = $svgDemo("svg").toString();
    await fs.promises.writeFile(`./dist/${svgName || Date.now()}.svg`, newSvg, "utf-8");
  }));
  console.log("success");
})();
