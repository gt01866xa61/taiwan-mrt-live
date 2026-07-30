import { tokyo } from "./tokyo.mjs";
import { yokohama } from "./yokohama.mjs";
import { nagoya } from "./nagoya.mjs";
import { osaka } from "./osaka.mjs";
import { kyoto } from "./kyoto.mjs";
import { kobe } from "./kobe.mjs";
import { sendai } from "./sendai.mjs";
import { placeNetwork, snapNetworkTransfers } from "./helpers.mjs";

function place(source, x = 0, y = 0) {
  return placeNetwork(source, source.id, x, y);
}

function lineIds(lines) {
  return lines.map(line => line.id);
}

const kantoTokyo = place(tokyo);
const kantoYokohama = place(yokohama, 6, 42);
const kantoLines = snapNetworkTransfers([...kantoTokyo, ...kantoYokohama]);

const tokaiLines = snapNetworkTransfers(place(nagoya));

const kansaiOsaka = place(osaka);
const kansaiKyoto = place(kyoto, 38, 0);
const kansaiKobe = place(kobe, 17, 38);
const kansaiLines = snapNetworkTransfers([
  ...kansaiOsaka,
  ...kansaiKyoto,
  ...kansaiKobe
]);

const tohokuLines = snapNetworkTransfers(place(sendai));

export const regions = [
  {
    id: "kanto",
    name: "關東",
    subtitle: "東京 13 線＋橫濱 2 線",
    lines: kantoLines,
    systems: [
      { id: "tokyo-metro", label: "東京 Metro", lineIds: lineIds(kantoTokyo.filter(line => line.operator === "Tokyo Metro")) },
      { id: "toei", label: "都營地下鐵", lineIds: lineIds(kantoTokyo.filter(line => line.operator === "東京都交通局")) },
      { id: "yokohama", label: "橫濱市營", lineIds: lineIds(kantoYokohama) }
    ],
    defaultSystem: "tokyo-metro"
  },
  {
    id: "tokai",
    name: "東海",
    subtitle: "名古屋市營地下鐵 6 線",
    lines: tokaiLines,
    systems: [
      { id: "nagoya", label: "名古屋市營", lineIds: lineIds(tokaiLines) }
    ],
    defaultSystem: "nagoya"
  },
  {
    id: "kansai",
    name: "關西",
    subtitle: "大阪 9 線＋京都 2 線＋神戶 2 線",
    lines: kansaiLines,
    systems: [
      { id: "osaka", label: "大阪 Metro", lineIds: lineIds(kansaiOsaka) },
      { id: "kyoto", label: "京都市營", lineIds: lineIds(kansaiKyoto) },
      { id: "kobe", label: "神戶市營", lineIds: lineIds(kansaiKobe) }
    ],
    defaultSystem: "osaka"
  },
  {
    id: "tohoku",
    name: "東北",
    subtitle: "仙台市地下鐵 2 線",
    lines: tohokuLines,
    systems: [
      { id: "sendai", label: "仙台市營", lineIds: lineIds(tohokuLines) }
    ],
    defaultSystem: "sendai"
  }
];

export function regionById(id) {
  return regions.find(region => region.id === id) || regions[0];
}

// Transitional aliases keep older consumers from breaking while the UI moves
// from city tabs to the same region model used by the Taiwan page.
export const cities = regions;
export const cityById = regionById;
