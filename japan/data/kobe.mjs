import { line, schedule, station } from "./helpers.mjs";

const S = line({
  id: "jp-kobe-s",
  code: "S",
  name: "神戶市營地下鐵 西神・山手／北神線",
  shortName: "西神・山手線",
  color: "#00A650",
  operator: "神戶市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 4, offPeak: 7.5, holiday: 7.5, late: 10 }),
  runSeconds: 94,
  stations: [
    station("S01", "谷上"), station("S02", "新神戶", "新神戸"),
    station("S03", "三宮"), station("S04", "縣廳前", "県庁前"),
    station("S05", "大倉山"), station("S06", "湊川公園"),
    station("S07", "上澤", "上沢"), station("S08", "長田〈長田神社前〉", "長田〈長田神社前〉"),
    station("S09", "新長田〈鐵人28號前〉", "新長田〈鉄人28号前〉"),
    station("S10", "板宿"), station("S11", "妙法寺"),
    station("S12", "名谷"), station("S13", "綜合運動公園", "総合運動公園"),
    station("S14", "學園都市", "学園都市"), station("S15", "伊川谷"),
    station("S16", "西神南"), station("S17", "西神中央")
  ],
  anchors: {
    S01:[20,0], S02:[16,5], S03:[14,8], S06:[11,11], S09:[8,14],
    S12:[5,17], S17:[0,22]
  }
});

const K = line({
  id: "jp-kobe-k",
  code: "K",
  name: "神戶市營地下鐵 海岸線",
  shortName: "海岸線",
  color: "#0072BC",
  operator: "神戶市交通局",
  sourceMode: "官方站序／概略班距模擬",
  schedule: schedule({ peak: 5, offPeak: 10, holiday: 10, late: 12 }),
  runSeconds: 96,
  stations: [
    station("K01", "三宮・花時計前"), station("K02", "舊居留地・大丸前", "旧居留地・大丸前"),
    station("K03", "港元町"), station("K04", "臨海樂園", "ハーバーランド"),
    station("K05", "中央市場前"), station("K06", "和田岬"),
    station("K07", "御崎公園"), station("K08", "苅藻"),
    station("K09", "駒林〈三國志之町〉", "駒ヶ林〈三国志のまち〉"),
    station("K10", "新長田〈鐵人28號前〉", "新長田〈鉄人28号前〉")
  ],
  anchors: {
    K01:[14,9], K03:[12,9], K04:[11,10], K06:[10,13],
    K08:[9,15], K10:[8,14]
  }
});

export const kobe = {
  id: "kobe",
  name: "神戶",
  subtitle: "市營地下鐵完整 2 系統",
  lines: [S, K]
};
