// for Deno
//import util from "https://taisukef.github.io/denolib/util.mjs";

// for Node
import util from "../../nodeutil/util.mjs";
import fetch from "node-fetch";

const DIR = "est15WG";

const downloadEst = async (dlcnt) => {
  const t = new Date();
  let y = t.getFullYear();
  let m = t.getMonth() + 1;
  if (!dlcnt) dlcnt = t.getDay() === 1 ? 2 : 1;
  let errcnt = 0;
  while (errcnt < 12) {
    const ym = y + util.fix0(m, 2);
    console.log(ym);
    const url = `https://www.wbgt.env.go.jp/est15WG/dl/wbgt_all_${ym}.csv`
    const res = await fetch(url);
    if (res.status === 200) {
      const scsv = await res.text();
      const csv = util.decodeCSV(scsv);
      const fn = `../data/${DIR}/${ym}`;
      util.mkdirSyncForFile(fn);
      util.writeCSV(fn, csv);
      await util.sleep(500);
      errcnt = 0;
      dlcnt--;
      if (!dlcnt) break;
    } else {
      await util.sleep(100);
      errcnt++;
    }
    m--;
    if (m == 0) {
      m = 12;
      y--;
    }
  }
};

if (import.meta.main) {
  downloadEst(100);
}

export { downloadEst };
