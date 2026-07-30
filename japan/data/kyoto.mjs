import { line, schedule, station } from "./helpers.mjs";

const K = line({
  id: "jp-kyoto-k",
  code: "K",
  name: "京都市營地下鐵 烏丸線",
  shortName: "烏丸線",
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
    station("K13", "十條", "十条"), station("K14", "Kuinabashi", "くいな橋"),
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
  shortName: "東西線",
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
  lines: [K, T],
  presets: [
    { id: "all", label: "全部 2 線", lineIds: [K, T].map(item => item.id) }
  ],
  pois: [
    {
      id:"kyoto-okazaki",
      name:"岡崎神社・兔子神社",
      icon:"🐇",
      x:8.8,
      y:10.2,
      station:"蹴上",
      note:"T09 蹴上站下車後步行；或搭市巴士 32／93／203／204 號至岡崎神社前，5 號至東天王町",
      featured:true
    },
    { id:"kyoto-nijo", name:"二條城", icon:"◆", x:15, y:11.8, station:"二條城前", note:"T14" },
    { id:"kyoto-nishiki", name:"錦市場", icon:"✦", x:11.5, y:15.3, station:"四條", note:"K09 步行" },
    { id:"kyoto-kiyomizu", name:"清水寺", icon:"⛩", x:8.2, y:17, station:"東山", note:"地下鐵後仍需轉公車／步行" },
    { id:"kyoto-station", name:"京都車站", icon:"●", x:11, y:19.5, station:"京都", note:"K11" }
  ]
};
