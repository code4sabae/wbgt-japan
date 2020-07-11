// for Deno
//import util from "https://taisukef.github.io/denolib/util.mjs";

// for Node
import util from "./util.mjs";
import fetch from "node-fetch";

const DIR = "prev15WG";

const downloadPrev = async (force) => {
  const t = new Date();
  const y = t.getFullYear();
  const m = t.getMonth() + 1;
  const d = t.getDate();
  const h = t.getHours();

  const ymdh = y + util.fix0(m, 2) + util.fix0(d, 2) + util.fix0(h, 2) + "00";
  console.log(ymdh);
  const fn = `../data/${DIR}/${ymdh}`;
  const fn2 = `../data/${DIR}/latest`;
  const chk = util.readCSV(fn);
  if (chk && !force) return false;

  const url = `https://www.wbgt.env.go.jp/prev15WG/dl/yohou_all.csv`;
  const res = await fetch(url);
  if (res.status === 200) {
    const scsv = await res.text();
    const csv = util.decodeCSV(scsv);

    csv[0][0] = "id";
    csv[0][1] = "dt";
    const csv2 = csv.map(a => a.map(s => s.trim()));

    util.mkdirSyncForFile(fn);
    util.writeCSV(fn, csv2);
    util.writeCSV(fn2, csv2);
    return true;
  }
  return false;
};

const fn = import.meta.url.substring(import.meta.url.lastIndexOf("/"));
import.meta.main = process.argv[1].endsWith(fn);
if (import.meta.main) {
  downloadPrev(true);
}

export { downloadPrev };
