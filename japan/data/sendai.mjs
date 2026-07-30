import { line, schedule, station } from "./helpers.mjs";

const N = line({
  id: "jp-sendai-n",
  code: "N",
  name: "仙台市地下鐵 南北線",
  shortName: "仙台南北線",
  color: "#00A65A",
  operator: "仙台市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 94,
  stations: [
    station("N01", "泉中央"), station("N02", "八乙女"),
    station("N03", "黑松", "黒松"), station("N04", "旭丘", "旭ヶ丘"),
    station("N05", "台原"), station("N06", "北仙台"),
    station("N07", "北四番丁"), station("N08", "勾當台公園", "勾当台公園"),
    station("N09", "廣瀨通", "広瀬通"), station("N10", "仙台"),
    station("N11", "五橋"), station("N12", "愛宕橋"),
    station("N13", "河原町"), station("N14", "長町一丁目"),
    station("N15", "長町"), station("N16", "長町南"),
    station("N17", "富澤", "富沢")
  ],
  anchors: {
    N01:[15,0], N05:[15,7], N09:[15,12], N10:[15,14],
    N13:[15,19], N17:[15,26]
  }
});

const T = line({
  id: "jp-sendai-t",
  code: "T",
  name: "仙台市地下鐵 東西線",
  shortName: "仙台東西線",
  color: "#00A7E1",
  operator: "仙台市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 5, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 96,
  stations: [
    station("T01", "八木山動物公園"), station("T02", "青葉山"),
    station("T03", "川內", "川内"), station("T04", "國際中心", "国際センター"),
    station("T05", "大町西公園"), station("T06", "青葉通一番町"),
    station("T07", "仙台"), station("T08", "宮城野通"),
    station("T09", "連坊"), station("T10", "藥師堂", "薬師堂"),
    station("T11", "卸町"), station("T12", "六丁之目", "六丁の目"),
    station("T13", "荒井")
  ],
  anchors: {
    T01:[0,14], T04:[6,14], T06:[11,14], T07:[15,14],
    T10:[21,14], T13:[28,14]
  }
});

export const sendai = {
  id: "sendai",
  name: "仙台",
  subtitle: "市營地下鐵完整 2 線",
  lines: [N, T]
};
