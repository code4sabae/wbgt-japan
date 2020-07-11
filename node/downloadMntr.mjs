
//import util from "https://taisukef.github.io/denolib/util.mjs";
import util from "./util.mjs";
import fetch from "node-fetch";


/*
ERROR RS - rustls::session:514 - TLS alert received: Message {
    typ: Alert,
    version: TLSv1_2,
    payload: Alert(
        AlertMessagePayload {
            level: Fatal,
            description: HandshakeFailure,
        },
    ),
}
error: Uncaught Http: error sending request for url (https://www.wbgt.env.go.jp/mntr/dl/Osaka_202006.csv):
error trying to connect: received fatal alert: HandshakeFailure
*/

const downloadMntr = async (dlcnt) => {
  const area = util.readCSV("../data/mntr/area");
  console.log(area);
  const json = util.csv2json(area);
  for (const c of json) {
    console.log(c.id);
    await downloadMntrArea(c.id, dlcnt);
  }
};
const downloadMntrArea = async (id, dlcnt) => {
  const t = new Date();
  let y = t.getFullYear();
  let m = t.getMonth() + 1;
  if (!dlcnt) dlcnt = t.getDay() === 1 ? 2 : 1;
  let errcnt = 0;
  while (errcnt < 12) {
    const ym = y + util.fix0(m, 2);
    console.log(ym);
    const url = `https://www.wbgt.env.go.jp/mntr/dl/${id}_${ym}.csv`;
    const res = await fetch(url);
    if (res.status === 200) {
      const scsv = await res.text();
      const csv = util.decodeCSV(scsv);
      const fn = `../data/mntr/${id}/${ym}`;
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

const fn = import.meta.url.substring(import.meta.url.lastIndexOf("/"));
import.meta.main = process.argv[1].endsWith(fn);
if (import.meta.main) {
  downloadMntr(1);
}

export { downloadMntr };
