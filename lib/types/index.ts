import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Locate from "@arcgis/core/widgets/Locate.js";
export type TOptions = {
  Map: Map;
  MapView: MapView;
  Locate: Locate;
};
export function getKey<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
export type TOptionsKeys = keyof TOptions;
