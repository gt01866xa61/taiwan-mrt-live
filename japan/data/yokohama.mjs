import { line, schedule, station } from "./helpers.mjs";

const B = line({
  id: "jp-yokohama-b",
  code: "B",
  name: "橫濱市營地下鐵 藍線",
  shortName: "橫濱藍線",
  color: "#0075C2",
  operator: "橫濱市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4.5, offPeak: 8, holiday: 8, late: 11 }),
  runSeconds: 92,
  stations: [
    station("B01", "湘南台"), station("B02", "下飯田"),
    station("B03", "立場"), station("B04", "中田"),
    station("B05", "踊場"), station("B06", "戶塚", "戸塚"),
    station("B07", "舞岡"), station("B08", "下永谷"),
    station("B09", "上永谷"), station("B10", "港南中央"),
    station("B11", "上大岡"), station("B12", "弘明寺"),
    station("B13", "蒔田"), station("B14", "吉野町"),
    station("B15", "阪東橋"), station("B16", "伊勢佐木長者町"),
    station("B17", "關內", "関内"), station("B18", "櫻木町", "桜木町"),
    station("B19", "高島町"), station("B20", "橫濱", "横浜"),
    station("B21", "三澤下町", "三ツ沢下町"),
    station("B22", "三澤上町", "三ツ沢上町"),
    station("B23", "片倉町"), station("B24", "岸根公園"),
    station("B25", "新橫濱", "新横浜"), station("B26", "北新橫濱", "北新横浜"),
    station("B27", "新羽"), station("B28", "仲町台"),
    station("B29", "中心南", "センター南"), station("B30", "中心北", "センター北"),
    station("B31", "中川"), station("B32", "薊野", "あざみ野")
  ],
  anchors: {
    B01:[2,28], B06:[2,22], B11:[6,17], B17:[10,12], B20:[12,10],
    B25:[18,6], B28:[22,3], B29:[24,3], B30:[25,2], B32:[28,0]
  }
});

const G = line({
  id: "jp-yokohama-g",
  code: "G",
  name: "橫濱市營地下鐵 綠線",
  shortName: "橫濱綠線",
  color: "#40B14B",
  operator: "橫濱市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 88,
  stations: [
    station("G01", "中山"), station("G02", "川和町"),
    station("G03", "都筑互動之丘", "都筑ふれあいの丘"),
    station("G04", "中心南", "センター南"), station("G05", "中心北", "センター北"),
    station("G06", "北山田"), station("G07", "東山田"),
    station("G08", "高田"), station("G09", "日吉本町"),
    station("G10", "日吉")
  ],
  anchors: {
    G01:[28,12], G03:[25,6], G04:[24,3], G05:[25,2],
    G07:[29,0], G10:[34,0]
  }
});

export const yokohama = {
  id: "yokohama",
  name: "橫濱",
  subtitle: "市營地下鐵完整 2 線",
  lines: [B, G]
};
