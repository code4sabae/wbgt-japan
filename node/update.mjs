import { downloadEst } from "./downloadEst.mjs";
import { downloadPrev } from "./downloadPrev.mjs";
import { downloadMntr } from "./downloadMntr.mjs";

const main = async () => {
  const d = new Date();
  if (d.getMinutes() < 48) return; // 1時間置き更新、45分が更新時間なので
  const res = await downloadPrev();
  console.log(res);
  if (res) {
    await downloadEst();
    await downloadMntr();
  }
};
main();
