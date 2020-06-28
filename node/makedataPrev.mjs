// import pdf2text from "./pdf2text.mjs";
import pdf2csv from "./pdf2csv.mjs";
import util from "./util.mjs";
import fs from "fs";

// python3 pdf2csv.py ../docs/areadata.pdf
//  --> docs/csv files

const main_ng = async () => {
//  const txt = await pdf2text.pdf2text("../docs/areadata.pdf");
//  const txt = await pdf2csv.pdf2csv("../docs/areadata.pdf");
//   console.log(txt);
};

const packCSV = () => {
  const path = "../docs/";
  const list = fs.readdirSync(path).filter(s => s.endsWith(".csv"));
  const res = [];
  let flgfirst = true;
  list.forEach(fn => {
    const s = util.readCSV(path + fn.substring(0, fn.length - 4));
    s.shift();
    if (flgfirst) {
      flgfirst = false;
    } else {
      s.shift();
    }
    s.forEach(a => a.shift());
    console.log(s);
    res.push(s);
  });
  util.writeCSV("../data/area-with-cid", res.flat());
};

/*
const cidmap = {
  9887: "福",
  7884: "永",
  9195: "町",
  8777: "特",
  7868: "気",
  12767: "象",
  12411: "観",
  8196: "測",
  11206: "興",
  8556: "点",
  9234: "番",
  12210: "表",
  12464: "記",
  8079: "海",
  13352: "道",
  14039: "宮",
  12833: "賀",
  8643: "熊",
  15285: "鹿",
  14069: "関",
  14179: "陸",
};
const cid = Object.entries(cidmap);
cid.unshift(["cid", "char"]);
console.log(cid);
util.writeCSV("cidmap", cid);
*/
const cidmap = {};
util.readCSV("../data/cidmap").forEach(a => cidmap[a[0]] = a[1]);


const unmaps = [];
const decodeChars = (s) => {
  //  (cid:9887) -> dec
  const n = s.matchAll(/\(cid:(\d+)\)/g);
  let res = s;
  for (const c of n) {
    // console.log(c);
    const ch = cidmap[c[1]];
    if (ch) {
      res = res.replace(c[0], ch);
    } else {
      if (unmaps.indexOf(c[1]) === -1) {
        unmaps.push(c[1]);
      }
    }
  }
  // console.log(res);
  return res;
};

//const t = "(cid:9887)山市松(cid:7884)(cid:9195)　(cid:9887)山(cid:8777)別地域(cid:7868)(cid:12767)(cid:12411)(cid:8196)所";
// decodeChars(t);

const decodeCharsCSV = () => {
  const area = util.readCSV("../data/area-with-cid");
  // console.log(area, area.length);
  const res = [];
  for (const c of area) {
    const c2 = c.map(a => decodeChars(a));
    console.log(c2);
    res.push(c2);
  }
  util.writeCSV("../data/area", res);
};

const fixArea = () => {
  const org = util.readCSV("../data/area");
  const area = util.csv2json(org);
  const ss = new TextDecoder().decode(fs.readFileSync("../docs/areadata.pdf.txt")).split("\n").map(s => s.trim());
  const find = id => {
    const n = ss.indexOf(id);
    if (n < n) {
      throw new Error("not found! " + id);
    }
    return [...(ss[n + 1].split(" ")), ss[n + 2], ss[n + 3]];
  };
  for (const a of area) {
    const s = find(a.地点番号);
    [a.観測所名, a.よみがな, a.ローマ字表記, a.所在地] = s;
    //console.log(a, s);
    //break;
  }
  area.sort((a, b) => parseInt(a.地点番号) - parseInt(b.地点番号));
  util.writeCSV("../data/area2", util.json2csv(area));
};

const main = async () => {
  // packCSV();
  // decodeCharsCSV();
  // console.log("unmaps", unmaps);
  //console.log(String.fromCharCode(13352));
  fixArea();
};
main();

/*
const a = area.trim().split("\n").map(a => a.split(" "));
a.unshift(["name", "id"]);
const a2 = a.map(a => [a[1], a[0]]);
console.log(a2);

util.writeCSV("../data/area-acutual", a2);
*/