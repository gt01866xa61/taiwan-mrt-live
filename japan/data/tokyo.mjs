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
    F15:[3,20], F16:[1,22]
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
  name: "都營大江戶線",
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
    station("E27", "新宿"), station("E28", "都廳前", "都庁前"),
    station("E29", "西新宿五丁目"), station("E30", "中野坂上"),
    station("E31", "東中野"), station("E32", "中井"),
    station("E33", "落合南長崎"), station("E34", "新江古田"),
    station("E35", "練馬"), station("E36", "豐島園", "豊島園"),
    station("E37", "練馬春日町"), station("E38", "光丘", "光が丘")
  ],
  anchors: {
    E01:[8,11], E02:[10,10], E06:[16,8], E08:[20,12], E09:[23,7],
    E11:[25,6], E12:[27,8], E14:[25,12], E15:[23,14], E16:[20,16],
    E18:[16,15], E20:[10,16], E22:[8,18], E23:[8,19], E24:[6,17],
    E27:[7,13], E28:[6,12], E30:[4,10], E32:[1,8], E35:[-2,5], E38:[-5,2]
  }
});

const T = line({
  id: "jp-tokyo-t",
  code: "T",
  name: "東京 Metro 東西線",
  shortName: "東西線",
  color: "#00A7DB",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 5, holiday: 5, late: 7 }),
  runSeconds: 89,
  stations: [
    station("T01", "中野"), station("T02", "落合"),
    station("T03", "高田馬場"), station("T04", "早稻田", "早稲田"),
    station("T05", "神樂坂", "神楽坂"), station("T06", "飯田橋"),
    station("T07", "九段下"), station("T08", "竹橋"),
    station("T09", "大手町"), station("T10", "日本橋"),
    station("T11", "茅場町"), station("T12", "門前仲町"),
    station("T13", "木場"), station("T14", "東陽町"),
    station("T15", "南砂町"), station("T16", "西葛西"),
    station("T17", "葛西"), station("T18", "浦安"),
    station("T19", "南行德", "南行徳"), station("T20", "行德", "行徳"),
    station("T21", "妙典"), station("T22", "原木中山"),
    station("T23", "西船橋")
  ],
  anchors: {
    T01:[0,5], T03:[4,8], T06:[16,8], T07:[17,9], T09:[18,14],
    T10:[17,12], T11:[17,10.5], T12:[23,14], T15:[28,14], T23:[38,14]
  }
});

const C = line({
  id: "jp-tokyo-c",
  code: "C",
  name: "東京 Metro 千代田線",
  shortName: "千代田線",
  color: "#009944",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 5, holiday: 5, late: 7 }),
  runSeconds: 90,
  stations: [
    station("C01", "代代木上原", "代々木上原"), station("C02", "代代木公園", "代々木公園"),
    station("C03", "明治神宮前〈原宿〉"), station("C04", "表參道", "表参道"),
    station("C05", "乃木坂"), station("C06", "赤坂"),
    station("C07", "國會議事堂前", "国会議事堂前"), station("C08", "霞關", "霞ケ関"),
    station("C09", "日比谷"), station("C10", "二重橋前〈丸之內〉", "二重橋前〈丸の内〉"),
    station("C11", "大手町"), station("C12", "新御茶之水", "新御茶ノ水"),
    station("C13", "湯島"), station("C14", "根津"),
    station("C15", "千駄木"), station("C16", "西日暮里"),
    station("C17", "町屋"), station("C18", "北千住"),
    station("C19", "綾瀨", "綾瀬"), station("C20", "北綾瀨", "北綾瀬")
  ],
  anchors: {
    C01:[0,22], C03:[3,20], C04:[5,18], C06:[8,17], C08:[12,15],
    C09:[13,14], C11:[18,14], C12:[20,12], C13:[22,9], C16:[25,5],
    C18:[27,1], C20:[31,-2]
  }
});

const Y = line({
  id: "jp-tokyo-y",
  code: "Y",
  name: "東京 Metro 有樂町線",
  shortName: "有樂町線",
  color: "#C1A470",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 6, holiday: 6, late: 8 }),
  runSeconds: 91,
  stations: [
    station("Y01", "和光市"), station("Y02", "地下鐵成增", "地下鉄成増"),
    station("Y03", "地下鐵赤塚", "地下鉄赤塚"), station("Y04", "平和台"),
    station("Y05", "冰川台", "氷川台"), station("Y06", "小竹向原"),
    station("Y07", "千川"), station("Y08", "要町"),
    station("Y09", "池袋"), station("Y10", "東池袋"),
    station("Y11", "護國寺", "護国寺"), station("Y12", "江戶川橋", "江戸川橋"),
    station("Y13", "飯田橋"), station("Y14", "市谷"),
    station("Y15", "麴町", "麹町"), station("Y16", "永田町"),
    station("Y17", "櫻田門", "桜田門"), station("Y18", "有樂町", "有楽町"),
    station("Y19", "銀座一丁目"), station("Y20", "新富町"),
    station("Y21", "月島"), station("Y22", "豐洲", "豊洲"),
    station("Y23", "辰巳"), station("Y24", "新木場")
  ],
  anchors: {
    Y01:[15,0], Y06:[17,3], Y09:[20,6], Y13:[16,8], Y14:[14,9],
    Y16:[10,13], Y18:[14,15], Y21:[20,16], Y22:[23,18], Y24:[27,20]
  }
});

const Z = line({
  id: "jp-tokyo-z",
  code: "Z",
  name: "東京 Metro 半藏門線",
  shortName: "半藏門線",
  color: "#9B7CB6",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3, offPeak: 5, holiday: 5, late: 7 }),
  runSeconds: 90,
  stations: [
    station("Z01", "澀谷", "渋谷"), station("Z02", "表參道", "表参道"),
    station("Z03", "青山一丁目"), station("Z04", "永田町"),
    station("Z05", "半藏門", "半蔵門"), station("Z06", "九段下"),
    station("Z07", "神保町"), station("Z08", "大手町"),
    station("Z09", "三越前"), station("Z10", "水天宮前"),
    station("Z11", "清澄白河"), station("Z12", "住吉"),
    station("Z13", "錦糸町"), station("Z14", "押上〈晴空塔〉", "押上〈スカイツリー前〉")
  ],
  anchors: {
    Z01:[1,22], Z02:[4,19], Z03:[6,17], Z04:[10,13], Z05:[14,10],
    Z06:[17,9], Z07:[18,10], Z08:[18,14], Z09:[20,10], Z10:[20,12],
    Z11:[25,12], Z12:[28,12], Z14:[29,2]
  }
});

const N = line({
  id: "jp-tokyo-n",
  code: "N",
  name: "東京 Metro 南北線",
  shortName: "南北線",
  color: "#00ADA9",
  operator: "Tokyo Metro",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 6, holiday: 6, late: 8 }),
  runSeconds: 91,
  stations: [
    station("N01", "目黑", "目黒"), station("N02", "白金台"),
    station("N03", "白金高輪"), station("N04", "麻布十番"),
    station("N05", "六本木一丁目"), station("N06", "溜池山王"),
    station("N07", "永田町"), station("N08", "四谷"),
    station("N09", "市谷"), station("N10", "飯田橋"),
    station("N11", "後樂園", "後楽園"), station("N12", "東大前"),
    station("N13", "本駒込"), station("N14", "駒込"),
    station("N15", "西原", "西ケ原"), station("N16", "王子"),
    station("N17", "王子神谷"), station("N18", "志茂"),
    station("N19", "赤羽岩淵")
  ],
  anchors: {
    N01:[6,26], N04:[8,18], N05:[9,17], N06:[8,15], N07:[10,13],
    N08:[8,9], N10:[16,8], N11:[20,10], N14:[23,3], N19:[28,-2]
  }
});

const I = line({
  id: "jp-tokyo-i",
  code: "I",
  name: "都營三田線",
  shortName: "都營三田線",
  color: "#0079C2",
  operator: "東京都交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 6, holiday: 6, late: 8 }),
  runSeconds: 90,
  stations: [
    station("I01", "目黑", "目黒"), station("I02", "白金台"),
    station("I03", "白金高輪"), station("I04", "三田"),
    station("I05", "芝公園"), station("I06", "御成門"),
    station("I07", "內幸町", "内幸町"), station("I08", "日比谷"),
    station("I09", "大手町"), station("I10", "神保町"),
    station("I11", "水道橋"), station("I12", "春日"),
    station("I13", "白山"), station("I14", "千石"),
    station("I15", "巢鴨", "巣鴨"), station("I16", "西巢鴨", "西巣鴨"),
    station("I17", "新板橋"), station("I18", "板橋區役所前", "板橋区役所前"),
    station("I19", "板橋本町"), station("I20", "本蓮沼"),
    station("I21", "志村坂上"), station("I22", "志村三丁目"),
    station("I23", "蓮根"), station("I24", "西台"),
    station("I25", "高島平"), station("I26", "新高島平"),
    station("I27", "西高島平")
  ],
  anchors: {
    I01:[6,26], I04:[8,20], I08:[13,14], I09:[18,14], I10:[18,10],
    I12:[20,10], I15:[22,4], I18:[24,1], I22:[27,-1], I27:[31,-4]
  }
});

const S = line({
  id: "jp-tokyo-s",
  code: "S",
  name: "都營新宿線",
  shortName: "都營新宿線",
  color: "#6CBB5A",
  operator: "東京都交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 6, holiday: 6, late: 8 }),
  runSeconds: 91,
  stations: [
    station("S01", "新宿"), station("S02", "新宿三丁目"),
    station("S03", "曙橋"), station("S04", "市谷"),
    station("S05", "九段下"), station("S06", "神保町"),
    station("S07", "小川町"), station("S08", "岩本町"),
    station("S09", "馬喰橫山", "馬喰横山"), station("S10", "濱町", "浜町"),
    station("S11", "森下"), station("S12", "菊川"),
    station("S13", "住吉"), station("S14", "西大島"),
    station("S15", "大島"), station("S16", "東大島"),
    station("S17", "船堀"), station("S18", "一之江"),
    station("S19", "瑞江"), station("S20", "篠崎"),
    station("S21", "本八幡")
  ],
  anchors: {
    S01:[7,13], S02:[8,12], S04:[14,9], S05:[17,9], S06:[18,10],
    S08:[21,8], S09:[23,10], S11:[27,10], S13:[28,12], S21:[38,12]
  }
});

export const tokyo = {
  id: "tokyo",
  name: "東京",
  subtitle: "東京 Metro 9 線＋都營地下鐵 4 線",
  lines: [G, M, H, T, C, Y, Z, N, F, A, I, S, E]
};
