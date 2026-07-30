import { line, schedule, station } from "./helpers.mjs";

const M = line({
  id: "jp-osaka-m",
  code: "M",
  name: "Osaka Metro 御堂筋線",
  shortName: "御堂筋線",
  color: "#E5171F",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 5, holiday: 5, late: 8 }),
  runSeconds: 88,
  stations: [
    station("M11", "江坂"), station("M12", "東三國", "東三国"),
    station("M13", "新大阪"), station("M14", "西中島南方"),
    station("M15", "中津"), station("M16", "梅田"),
    station("M17", "淀屋橋"), station("M18", "本町"),
    station("M19", "心齋橋", "心斎橋"), station("M20", "難波", "なんば"),
    station("M21", "大國町", "大国町"), station("M22", "動物園前"),
    station("M23", "天王寺"), station("M24", "昭和町"),
    station("M25", "西田邊", "西田辺"), station("M26", "長居"),
    station("M27", "我孫子", "あびこ"), station("M28", "北花田"),
    station("M29", "新金岡"), station("M30", "中百舌鳥", "なかもず")
  ],
  anchors: {
    M11:[12,0], M13:[12,3], M16:[12,7], M18:[12,11], M19:[12,13],
    M20:[12,15], M22:[12,19], M23:[12,21], M30:[12,28]
  }
});

const T = line({
  id: "jp-osaka-t",
  code: "T",
  name: "Osaka Metro 谷町線",
  shortName: "谷町線",
  color: "#522886",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7, holiday: 7, late: 10 }),
  runSeconds: 91,
  stations: [
    station("T11", "大日"), station("T12", "守口"),
    station("T13", "太子橋今市"), station("T14", "千林大宮"),
    station("T15", "關目高殿", "関目高殿"), station("T16", "野江內代", "野江内代"),
    station("T17", "都島"), station("T18", "天神橋筋六丁目"),
    station("T19", "中崎町"), station("T20", "東梅田"),
    station("T21", "南森町"), station("T22", "天滿橋", "天満橋"),
    station("T23", "谷町四丁目"), station("T24", "谷町六丁目"),
    station("T25", "谷町九丁目"), station("T26", "四天王寺前夕陽丘"),
    station("T27", "天王寺"), station("T28", "阿倍野"),
    station("T29", "文之里"), station("T30", "田邊", "田辺"),
    station("T31", "駒川中野"), station("T32", "平野"),
    station("T33", "喜連瓜破"), station("T34", "出戶", "出戸"),
    station("T35", "長原"), station("T36", "八尾南")
  ],
  anchors: {
    T11:[18,0], T18:[18,7], T20:[16,8], T21:[18,9], T22:[18,11],
    T23:[18,13], T24:[18,15], T25:[18,17], T27:[12,21], T36:[18,28]
  }
});

const C = line({
  id: "jp-osaka-c",
  code: "C",
  name: "Osaka Metro 中央線",
  shortName: "中央線",
  color: "#019A66",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7, holiday: 7, late: 10 }),
  runSeconds: 96,
  stations: [
    station("C09", "夢洲"), station("C10", "宇宙廣場", "コスモスクエア"),
    station("C11", "大阪港"), station("C12", "朝潮橋"),
    station("C13", "弁天町"), station("C14", "九條", "九条"),
    station("C15", "阿波座"), station("C16", "本町"),
    station("C17", "堺筋本町"), station("C18", "谷町四丁目"),
    station("C19", "森之宮"), station("C20", "綠橋", "緑橋"),
    station("C21", "深江橋"), station("C22", "高井田"),
    station("C23", "長田")
  ],
  anchors: {
    C09:[0,13], C10:[2,13], C13:[7,13], C15:[10,13], C16:[12,11],
    C17:[15,11], C18:[18,13], C19:[21,13], C23:[28,13]
  }
});

const K = line({
  id: "jp-osaka-k",
  code: "K",
  name: "Osaka Metro 堺筋線",
  shortName: "堺筋線",
  color: "#814721",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 5, offPeak: 8, holiday: 8, late: 10 }),
  runSeconds: 87,
  stations: [
    station("K11", "天神橋筋六丁目"), station("K12", "扇町"),
    station("K13", "南森町"), station("K14", "北濱", "北浜"),
    station("K15", "堺筋本町"), station("K16", "長堀橋"),
    station("K17", "日本橋"), station("K18", "惠美須町", "恵美須町"),
    station("K19", "動物園前"), station("K20", "天下茶屋")
  ],
  anchors: {
    K11:[18,7], K13:[18,9], K14:[16,10], K15:[15,11], K16:[15,13],
    K17:[15,16], K19:[12,19], K20:[14,22]
  }
});

const N = line({
  id: "jp-osaka-n",
  code: "N",
  name: "Osaka Metro 長堀鶴見綠地線",
  shortName: "長堀鶴見綠地線",
  color: "#A9CC51",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 5, offPeak: 7, holiday: 7, late: 10 }),
  runSeconds: 93,
  stations: [
    station("N11", "大正"), station("N12", "巨蛋前千代崎", "ドーム前千代崎"),
    station("N13", "西長堀"), station("N14", "西大橋"),
    station("N15", "心齋橋", "心斎橋"), station("N16", "長堀橋"),
    station("N17", "松屋町"), station("N18", "谷町六丁目"),
    station("N19", "玉造"), station("N20", "森之宮"),
    station("N21", "大阪商務園區", "大阪ビジネスパーク"), station("N22", "京橋"),
    station("N23", "蒲生四丁目"), station("N24", "今福鶴見"),
    station("N25", "橫堤", "横堤"), station("N26", "鶴見綠地", "鶴見緑地"),
    station("N27", "門真南")
  ],
  anchors: {
    N11:[4,15], N13:[8,15], N15:[12,13], N16:[15,13], N18:[18,15],
    N20:[21,13], N22:[23,9], N27:[28,6]
  }
});

export const osaka = {
  id: "osaka",
  name: "大阪",
  subtitle: "旅遊核心 5 線",
  lines: [M, T, C, K, N],
  presets: [
    { id: "all", label: "全部 5 線", lineIds: [M, T, C, K, N].map(item => item.id) },
    { id: "visitor", label: "觀光主軸", lineIds: [M, C, K, N].map(item => item.id) }
  ],
  pois: [
    { id:"osaka-dotonbori", name:"道頓堀", icon:"✦", x:13.5, y:16.2, station:"難波", note:"M20／K17 步行" },
    { id:"osaka-castle", name:"大阪城", icon:"◆", x:22, y:12, station:"森之宮", note:"C19／N20 步行" },
    { id:"osaka-tsutenkaku", name:"通天閣", icon:"◆", x:13.5, y:18, station:"惠美須町", note:"K18 步行" },
    { id:"osaka-yumeshima", name:"夢洲", icon:"●", x:-0.5, y:11.8, station:"夢洲", note:"C09" },
    { id:"osaka-umeda", name:"梅田商圈", icon:"✦", x:11, y:6, station:"梅田", note:"M16／東梅田步行" }
  ]
};
