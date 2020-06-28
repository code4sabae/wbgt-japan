// import util from "https://taisukef.github.io/denolib/util.mjs";
import util from "./util.mjs";

const area = `
札幌 Sapporo
名古屋 Nagoya
福岡 Fukuoka
仙台 Sendai
大阪 Osaka
鹿児島 Kagoshima
新潟 Niigata
広島 Hiroshima
那覇 Naha
東京 Tokyo
高知 Kochi
`;

const a = area.trim().split("\n").map(a => a.split(" "));
a.unshift(["name", "id"]);
const a2 = a.map(a => [a[1], a[0]]);
console.log(a2);

util.writeCSV("../data/mntr/area", a2);
