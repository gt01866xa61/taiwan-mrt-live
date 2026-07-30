import { line, schedule, station } from "./helpers.mjs";

const H = line({
  id: "jp-nagoya-h",
  code: "H",
  name: "名古屋市營地下鐵 東山線",
  shortName: "東山線",
  color: "#F1CB00",
  operator: "名古屋市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 2.5, offPeak: 5, holiday: 5, late: 7 }),
  runSeconds: 86,
  stations: [
    station("H01", "高畑"), station("H02", "八田"),
    station("H03", "岩塚"), station("H04", "中村公園"),
    station("H05", "中村日赤"), station("H06", "本陣"),
    station("H07", "龜島", "亀島"), station("H08", "名古屋"),
    station("H09", "伏見"), station("H10", "榮", "栄"),
    station("H11", "新榮町", "新栄町"), station("H12", "千種"),
    station("H13", "今池"), station("H14", "池下"),
    station("H15", "覺王山", "覚王山"), station("H16", "本山"),
    station("H17", "東山公園"), station("H18", "星丘", "星ヶ丘"),
    station("H19", "一社"), station("H20", "上社"),
    station("H21", "本鄉", "本郷"), station("H22", "藤丘", "藤が丘")
  ],
  anchors: {
    H01:[0,14], H07:[7,14], H08:[10,14], H09:[13,14], H10:[16,14],
    H13:[20,14], H16:[24,14], H22:[32,14]
  }
});

const M = line({
  id: "jp-nagoya-m",
  code: "M",
  name: "名古屋市營地下鐵 名城線",
  shortName: "名城線",
  color: "#9C7EB5",
  operator: "名古屋市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 3.5, offPeak: 7, holiday: 7, late: 9 }),
  runSeconds: 88,
  stations: [
    station("M01", "金山"), station("M02", "東別院"),
    station("M03", "上前津"), station("M04", "矢場町"),
    station("M05", "榮", "栄"), station("M06", "久屋大通"),
    station("M07", "名古屋城"), station("M08", "名城公園"),
    station("M09", "黑川", "黒川"), station("M10", "志賀本通"),
    station("M11", "平安通"), station("M12", "大曾根", "大曽根"),
    station("M13", "名古屋巨蛋前矢田", "ナゴヤドーム前矢田"),
    station("M14", "砂田橋"), station("M15", "茶屋坂", "茶屋ヶ坂"),
    station("M16", "自由丘", "自由ヶ丘"), station("M17", "本山"),
    station("M18", "名古屋大學", "名古屋大学"), station("M19", "八事日赤"),
    station("M20", "八事"), station("M21", "綜合復健中心", "総合リハビリセンター"),
    station("M22", "瑞穗運動場東", "瑞穂運動場東"), station("M23", "新瑞橋"),
    station("M24", "妙音通"), station("M25", "堀田"),
    station("M26", "熱田神宮傳馬町", "熱田神宮伝馬町"),
    station("M27", "熱田神宮西"), station("M28", "西高藏", "西高蔵"),
    station("M01R", "金山")
  ],
  anchors: {
    M01:[14,22], M03:[16,18], M05:[16,14], M06:[16,12], M08:[16,8],
    M12:[22,8], M13:[24,10], M17:[24,14], M20:[23,18], M23:[20,22],
    M27:[16,24], M28:[15,23], M01R:[14,22]
  }
});

const E = line({
  id: "jp-nagoya-e",
  code: "E",
  name: "名古屋市營地下鐵 名港線",
  shortName: "名港線",
  color: "#9C7EB5",
  operator: "名古屋市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 7, offPeak: 10, holiday: 10, late: 12 }),
  runSeconds: 90,
  stations: [
    station("E01", "金山"), station("E02", "日比野"),
    station("E03", "六番町"), station("E04", "東海通"),
    station("E05", "港區役所", "港区役所"), station("E06", "築地口"),
    station("E07", "名古屋港")
  ],
  anchors: {
    E01:[14,22], E03:[12,25], E05:[10,28], E07:[8,31]
  }
});

const T = line({
  id: "jp-nagoya-t",
  code: "T",
  name: "名古屋市營地下鐵 鶴舞線",
  shortName: "鶴舞線",
  color: "#00A1E9",
  operator: "名古屋市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 91,
  stations: [
    station("T01", "上小田井"), station("T02", "庄內綠地公園", "庄内緑地公園"),
    station("T03", "庄內通", "庄内通"), station("T04", "淨心", "浄心"),
    station("T05", "淺間町", "浅間町"), station("T06", "丸之內", "丸の内"),
    station("T07", "伏見"), station("T08", "大須觀音", "大須観音"),
    station("T09", "上前津"), station("T10", "鶴舞"),
    station("T11", "荒畑"), station("T12", "御器所"),
    station("T13", "川名"), station("T14", "杁中", "いりなか"),
    station("T15", "八事"), station("T16", "鹽釜口", "塩釜口"),
    station("T17", "植田"), station("T18", "原"),
    station("T19", "平針"), station("T20", "赤池")
  ],
  anchors: {
    T01:[3,3], T05:[9,9], T06:[11,11], T07:[13,14], T09:[16,18],
    T10:[18,18], T12:[20,18], T15:[23,18], T20:[31,25]
  }
});

const S = line({
  id: "jp-nagoya-s",
  code: "S",
  name: "名古屋市營地下鐵 櫻通線",
  shortName: "櫻通線",
  color: "#E45E3C",
  operator: "名古屋市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 91,
  stations: [
    station("S01", "太閤通"), station("S02", "名古屋"),
    station("S03", "國際中心", "国際センター"), station("S04", "丸之內", "丸の内"),
    station("S05", "久屋大通"), station("S06", "高岳"),
    station("S07", "車道"), station("S08", "今池"),
    station("S09", "吹上"), station("S10", "御器所"),
    station("S11", "櫻山", "桜山"), station("S12", "瑞穗區役所", "瑞穂区役所"),
    station("S13", "瑞穗運動場西", "瑞穂運動場西"), station("S14", "新瑞橋"),
    station("S15", "櫻本町", "桜本町"), station("S16", "鶴里"),
    station("S17", "野並"), station("S18", "鳴子北"),
    station("S19", "相生山"), station("S20", "神澤", "神沢"),
    station("S21", "德重", "徳重")
  ],
  anchors: {
    S01:[7,17], S02:[10,14], S04:[11,11], S05:[16,12], S08:[20,14],
    S10:[20,18], S14:[20,22], S17:[25,25], S21:[31,25]
  }
});

const K = line({
  id: "jp-nagoya-k",
  code: "K",
  name: "名古屋市營地下鐵 上飯田線",
  shortName: "上飯田線",
  color: "#E68E9A",
  operator: "名古屋市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 7.5, offPeak: 15, holiday: 15, late: 18 }),
  runSeconds: 120,
  stations: [
    station("K01", "上飯田"), station("K02", "平安通")
  ],
  anchors: {
    K01:[22,5], K02:[22,8]
  }
});

export const nagoya = {
  id: "nagoya",
  name: "名古屋",
  subtitle: "市營地下鐵完整 6 線",
  lines: [H, M, E, T, S, K]
};
