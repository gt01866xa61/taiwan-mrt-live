import { line, schedule, station } from "./helpers.mjs";

const G = line({
  id: "jp-tokyo-g",
  code: "G",
  name: "東京 Metro 銀座線",
  shortName: "銀座線",
  color: "#F39700",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 5, holiday: 5, late: 7 }),
  runSeconds: 82,
  stations: [
    station("G01", "澀谷", "渋谷"), station("G02", "表參道", "表参道"),
    station("G03", "外苑前"), station("G04", "青山一丁目"),
    station("G05", "赤坂見附"), station("G06", "溜池山王"),
    station("G07", "虎之門", "虎ノ門"), station("G08", "新橋"),
    station("G09", "銀座"), station("G10", "京橋"),
    station("G11", "日本橋"), station("G12", "三越前"),
    station("G13", "神田"), station("G14", "末廣町", "末広町"),
    station("G15", "上野廣小路", "上野広小路"), station("G16", "上野"),
    station("G17", "稻荷町", "稲荷町"), station("G18", "田原町"),
    station("G19", "淺草", "浅草")
  ],
  anchors: {
    G01:[1,22], G02:[4,19], G04:[6,17], G05:[8,15], G08:[12,13],
    G09:[14,13], G11:[17,12], G13:[20,10], G16:[23,7], G19:[26,4]
  }
});

const M = line({
  id: "jp-tokyo-m",
  code: "M",
  name: "東京 Metro 丸之內線",
  shortName: "丸之內線",
  color: "#E60012",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 2.5, offPeak: 5, holiday: 5, late: 7 }),
  runSeconds: 94,
  stations: [
    station("M01", "荻窪"), station("M02", "南阿佐谷"),
    station("M03", "新高圓寺", "新高円寺"), station("M04", "東高圓寺", "東高円寺"),
    station("M05", "新中野"), station("M06", "中野坂上"),
    station("M07", "西新宿"), station("M08", "新宿"),
    station("M09", "新宿三丁目"), station("M10", "新宿御苑前"),
    station("M11", "四谷三丁目"), station("M12", "四谷"),
    station("M13", "赤坂見附"), station("M14", "國會議事堂前", "国会議事堂前"),
    station("M15", "霞關", "霞ケ関"), station("M16", "銀座"),
    station("M17", "東京"), station("M18", "大手町"),
    station("M19", "淡路町"), station("M20", "御茶之水", "御茶ノ水"),
    station("M21", "本鄉三丁目", "本郷三丁目"), station("M22", "後樂園", "後楽園"),
    station("M23", "茗荷谷"), station("M24", "新大塚"),
    station("M25", "池袋")
  ],
  anchors: {
    M01:[0,13], M06:[5,13], M08:[7,13], M09:[8,12], M12:[8,9],
    M13:[8,15], M14:[10,15], M15:[12,15], M16:[14,13], M17:[16,14],
    M18:[18,14], M20:[20,13], M21:[20,12], M22:[20,10], M25:[20,6]
  }
});

const H = line({
  id: "jp-tokyo-h",
  code: "H",
  name: "東京 Metro 日比谷線",
  shortName: "日比谷線",
  color: "#9CAEB7",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 6, holiday: 6, late: 8 }),
  runSeconds: 88,
  stations: [
    station("H01", "中目黑", "中目黒"), station("H02", "惠比壽", "恵比寿"),
    station("H03", "廣尾", "広尾"), station("H04", "六本木"),
    station("H05", "神谷町"), station("H06", "虎之門之丘", "虎ノ門ヒルズ"),
    station("H07", "霞關", "霞ケ関"), station("H08", "日比谷"),
    station("H09", "銀座"), station("H10", "東銀座"),
    station("H11", "築地"), station("H12", "八丁堀"),
    station("H13", "茅場町"), station("H14", "人形町"),
    station("H15", "小傳馬町", "小伝馬町"), station("H16", "秋葉原"),
    station("H17", "仲御徒町"), station("H18", "上野"),
    station("H19", "入谷"), station("H20", "三之輪", "三ノ輪"),
    station("H21", "南千住"), station("H22", "北千住")
  ],
  anchors: {
    H01:[3,26], H02:[4,23], H04:[8,19], H07:[12,15], H08:[13,14],
    H09:[14,13], H10:[15,12], H13:[17.5,10.5], H14:[18,10], H16:[21,8], H18:[23,7],
    H22:[27,1]
  }
});

const F = line({
  id: "jp-tokyo-f",
  code: "F",
  name: "東京 Metro 副都心線",
  shortName: "副都心線",
  color: "#9C5E31",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7, holiday: 7, late: 10 }),
  runSeconds: 98,
  stations: [
    station("F01", "和光市"), station("F02", "地下鐵成增", "地下鉄成増"),
    station("F03", "地下鐵赤塚", "地下鉄赤塚"), station("F04", "平和台"),
    station("F05", "冰川台", "氷川台"), station("F06", "小竹向原"),
    station("F07", "千川"), station("F08", "要町"),
    station("F09", "池袋"), station("F10", "雜司谷", "雑司が谷"),
    station("F11", "西早稻田", "西早稲田"), station("F12", "東新宿"),
    station("F13", "新宿三丁目"), station("F14", "北參道", "北参道"),
    station("F15", "明治神宮前〈原宿〉", "明治神宮前〈原宿〉"),
    station("F16", "澀谷", "渋谷")
  ],
  anchors: {
    F01:[15,0], F06:[17,3], F09:[20,6], F12:[10,10], F13:[8,12],
    F15:[4,19], F16:[1,22]
  }
});

const A = line({
  id: "jp-tokyo-a",
  code: "A",
  name: "都營淺草線",
  shortName: "淺草線",
  color: "#E85298",
  operator: "東京都交通局",
  sourceMode: "官方即時位置可用／目前預覽採班距模擬",
  accuracy: "realtime-ready",
  schedule: schedule({ peak: 5, offPeak: 7, holiday: 7, late: 10 }),
  runSeconds: 92,
  stations: [
    station("A01", "西馬込"), station("A02", "馬込"),
    station("A03", "中延"), station("A04", "戶越", "戸越"),
    station("A05", "五反田"), station("A06", "高輪台"),
    station("A07", "泉岳寺"), station("A08", "三田"),
    station("A09", "大門"), station("A10", "新橋"),
    station("A11", "東銀座"), station("A12", "寶町", "宝町"),
    station("A13", "日本橋"), station("A14", "人形町"),
    station("A15", "東日本橋"), station("A16", "淺草橋", "浅草橋"),
    station("A17", "藏前", "蔵前"), station("A18", "淺草", "浅草"),
    station("A19", "本所吾妻橋"), station("A20", "押上〈晴空塔〉", "押上〈スカイツリー前〉")
  ],
  anchors: {
    A01:[4,29], A05:[5,24], A07:[7,20], A09:[10,16], A10:[12,13],
    A11:[15,12], A13:[17,12], A14:[18,10], A16:[22,8], A17:[25,6], A18:[26,4],
    A20:[29,2]
  }
});

const E = line({
  id: "jp-tokyo-e",
  code: "E",
  name: "都營大江戶線・都心環狀段",
  shortName: "大江戶線",
  color: "#B6007A",
  operator: "東京都交通局",
  sourceMode: "官方即時位置可用／目前預覽採班距模擬",
  accuracy: "realtime-ready",
  schedule: schedule({ peak: 4, offPeak: 6, holiday: 6, late: 8 }),
  runSeconds: 96,
  stations: [
    station("E01", "新宿西口"), station("E02", "東新宿"),
    station("E03", "若松河田"), station("E04", "牛込柳町"),
    station("E05", "牛込神樂坂", "牛込神楽坂"), station("E06", "飯田橋"),
    station("E07", "春日"), station("E08", "本鄉三丁目", "本郷三丁目"),
    station("E09", "上野御徒町"), station("E10", "新御徒町"),
    station("E11", "藏前", "蔵前"), station("E12", "兩國", "両国"),
    station("E13", "森下"), station("E14", "清澄白河"),
    station("E15", "門前仲町"), station("E16", "月島"),
    station("E17", "勝鬨", "勝どき"), station("E18", "築地市場"),
    station("E19", "汐留"), station("E20", "大門"),
    station("E21", "赤羽橋"), station("E22", "麻布十番"),
    station("E23", "六本木"), station("E24", "青山一丁目"),
    station("E25", "國立競技場", "国立競技場"), station("E26", "代代木", "代々木"),
    station("E27", "新宿"), station("E28", "都廳前", "都庁前")
  ],
  anchors: {
    E01:[8,11], E02:[10,10], E06:[16,8], E08:[20,12], E09:[23,7],
    E11:[25,6], E12:[27,8], E14:[25,12], E15:[23,14], E16:[20,16],
    E18:[16,15], E20:[10,16], E22:[8,18], E23:[8,19], E24:[6,17],
    E27:[7,13], E28:[6,12]
  }
});

export const tokyo = {
  id: "tokyo",
  name: "東京",
  subtitle: "旅遊核心 6 線",
  lines: [G, M, H, F, A, E],
  presets: [
    { id: "all", label: "全部 6 線", lineIds: [G, M, H, F, A, E].map(item => item.id) },
    { id: "metro", label: "東京 Metro", lineIds: [G, M, H, F].map(item => item.id) },
    { id: "toei", label: "都營地下鐵", lineIds: [A, E].map(item => item.id) }
  ],
  pois: [
    { id:"tokyo-shibuya", name:"澀谷十字路口", icon:"✦", x:0.2, y:23.2, station:"澀谷", note:"G01／F16" },
    { id:"tokyo-sensoji", name:"淺草寺", icon:"⛩", x:27.1, y:3.2, station:"淺草", note:"G19／A18 步行" },
    { id:"tokyo-skytree", name:"東京晴空塔", icon:"◆", x:30, y:1, station:"押上〈晴空塔〉", note:"A20" },
    { id:"tokyo-tsukiji", name:"築地場外市場", icon:"●", x:16.2, y:16.5, station:"築地市場", note:"E18／H11 步行" },
    { id:"tokyo-meiji", name:"明治神宮", icon:"⛩", x:3, y:20.5, station:"明治神宮前〈原宿〉", note:"F15 步行" }
  ]
};
