import { line, schedule, station } from "./helpers.mjs";

const K = line({
  id: "jp-kyoto-k",
  code: "K",
  name: "京都市營地下鐵 烏丸線",
  shortName: "京都烏丸線",
  color: "#3AAA35",
  operator: "京都市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7, holiday: 7, late: 10 }),
  runSeconds: 98,
  stations: [
    station("K01", "國際會館", "国際会館"), station("K02", "松崎"),
    station("K03", "北山"), station("K04", "北大路"),
    station("K05", "鞍馬口"), station("K06", "今出川"),
    station("K07", "丸太町"), station("K08", "烏丸御池"),
    station("K09", "四條", "四条"), station("K10", "五條", "五条"),
    station("K11", "京都"), station("K12", "九條", "九条"),
    station("K13", "十條", "十条"), station("K14", "水雞橋", "くいな橋"),
    station("K15", "竹田")
  ],
  anchors: {
    K01:[12,0], K04:[12,5], K06:[12,9], K08:[12,13], K09:[12,15],
    K11:[12,19], K15:[12,28]
  }
});

const T = line({
  id: "jp-kyoto-t",
  code: "T",
  name: "京都市營地下鐵 東西線",
  shortName: "京都東西線",
  color: "#F15A24",
  operator: "京都市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 5, offPeak: 8, holiday: 8, late: 10 }),
  runSeconds: 104,
  stations: [
    station("T01", "六地藏", "六地蔵"), station("T02", "石田"),
    station("T03", "醍醐"), station("T04", "小野"),
    station("T05", "椥辻"), station("T06", "東野"),
    station("T07", "山科"), station("T08", "御陵"),
    station("T09", "蹴上"), station("T10", "東山"),
    station("T11", "三條京阪", "三条京阪"), station("T12", "京都市役所前"),
    station("T13", "烏丸御池"), station("T14", "二條城前", "二条城前"),
    station("T15", "二條", "二条"), station("T16", "西大路御池"),
    station("T17", "太秦天神川")
  ],
  anchors: {
    T01:[0,21], T04:[4,19], T07:[7,17], T08:[8,15], T09:[9,14],
    T10:[10,13], T11:[11,13], T12:[11.5,13], T13:[12,13],
    T14:[15,13], T15:[17,13], T17:[22,13]
  }
});

export const kyoto = {
  id: "kyoto",
  name: "京都",
  subtitle: "市營地下鐵完整 2 線",
  lines: [K, T]
};
