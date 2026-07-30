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

const Y = line({
  id: "jp-osaka-y",
  code: "Y",
  name: "Osaka Metro 四橋線",
  shortName: "四橋線",
  color: "#0078BA",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 90,
  stations: [
    station("Y11", "西梅田"), station("Y12", "肥後橋"),
    station("Y13", "本町"), station("Y14", "四橋"),
    station("Y15", "難波", "なんば"), station("Y16", "大國町", "大国町"),
    station("Y17", "花園町"), station("Y18", "岸里"),
    station("Y19", "玉出"), station("Y20", "北加賀屋"),
    station("Y21", "住之江公園")
  ],
  anchors: {
    Y11:[10,8], Y13:[12,11], Y14:[10,13], Y15:[12,15], Y16:[12,17],
    Y18:[9,21], Y21:[6,28]
  }
});

const S = line({
  id: "jp-osaka-s",
  code: "S",
  name: "Osaka Metro 千日前線",
  shortName: "千日前線",
  color: "#E44D93",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 88,
  stations: [
    station("S11", "野田阪神"), station("S12", "玉川"),
    station("S13", "阿波座"), station("S14", "西長堀"),
    station("S15", "櫻川", "桜川"), station("S16", "難波", "なんば"),
    station("S17", "日本橋"), station("S18", "谷町九丁目"),
    station("S19", "鶴橋"), station("S20", "今里"),
    station("S21", "新深江"), station("S22", "小路"),
    station("S23", "北巽"), station("S24", "南巽")
  ],
  anchors: {
    S11:[5,10], S13:[10,13], S14:[8,15], S16:[12,15], S17:[15,16],
    S18:[18,17], S19:[20,17], S20:[22,17], S24:[28,17]
  }
});

const I = line({
  id: "jp-osaka-i",
  code: "I",
  name: "Osaka Metro 今里筋線",
  shortName: "今里筋線",
  color: "#EE7B1A",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 5, offPeak: 10, holiday: 10, late: 12 }),
  runSeconds: 92,
  stations: [
    station("I11", "井高野"), station("I12", "瑞光四丁目"),
    station("I13", "大桐豐里", "だいどう豊里"), station("I14", "太子橋今市"),
    station("I15", "清水"), station("I16", "新森古市"),
    station("I17", "關目成育", "関目成育"), station("I18", "蒲生四丁目"),
    station("I19", "鴫野"), station("I20", "綠橋", "緑橋"),
    station("I21", "今里")
  ],
  anchors: {
    I11:[26,0], I14:[18,3], I17:[22,7], I18:[24,8], I20:[23,13], I21:[22,17]
  }
});

const P = line({
  id: "jp-osaka-p",
  code: "P",
  name: "Osaka Metro 南港港城線",
  shortName: "New Tram",
  color: "#00A7DB",
  operator: "Osaka Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 90,
  stations: [
    station("P09", "宇宙廣場", "コスモスクエア"), station("P10", "貿易中心前", "トレードセンター前"),
    station("P11", "中埠頭"), station("P12", "港城西", "ポートタウン西"),
    station("P13", "港城東", "ポートタウン東"), station("P14", "渡輪碼頭", "フェリーターミナル"),
    station("P15", "南港東"), station("P16", "南港口"),
    station("P17", "平林"), station("P18", "住之江公園")
  ],
  anchors: {
    P09:[2,13], P11:[1,16], P14:[2,21], P16:[4,24], P18:[6,28]
  }
});

export const osaka = {
  id: "osaka",
  name: "大阪",
  subtitle: "地下鐵 8 線＋New Tram",
  lines: [M, T, Y, C, S, K, N, I, P]
};
