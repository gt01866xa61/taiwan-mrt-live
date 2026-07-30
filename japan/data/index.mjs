import { tokyo } from "./tokyo.mjs";
import { osaka } from "./osaka.mjs";
import { kyoto } from "./kyoto.mjs";

export const cities = [tokyo, osaka, kyoto];

export function cityById(id) {
  return cities.find(city => city.id === id) || cities[0];
}
