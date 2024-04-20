import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import Locate from "@arcgis/core/widgets/Locate";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { type TOptionsKeys, getKey } from "./types/index";
import { DEFAULT_OPTIONS, ERROR_MSG } from "./config/default";

/**
 * 合并用户输入参数与预设参数
 * @param opt
 */
const mergeUserOptions = (opt: any) => {
  for (const type in opt) {
    const filterDefaultOptions = getKey(DEFAULT_OPTIONS, type as TOptionsKeys);
    const filterUserOpt = getKey(opt, type);
    if (filterDefaultOptions) {
      Object.assign(filterDefaultOptions, filterUserOpt);
    } else {
      DEFAULT_OPTIONS[type as TOptionsKeys] = filterUserOpt;
    }
  }
};

export default class ArcgisMapUtils {
  // 实例属性
  _map: null;
  _mapView: null;
  _locateWidget: null;
  constructor(opt: any) {
    this.#init(opt);
    // 默认返回实例对象， 那么这些实例属性都能读取到
  }
  /**
   * 私有方法，合并初始化地图和视图方法
   * @param opt
   */
  #init(opt: any) {
    try {
      mergeUserOptions(opt);

      this.#initMap();
      this.#initView();
      this.#locate();

      this._mapView.when(() => {
        if (opt.geolocation) {
          this.getLocation();
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }
  /**
   * 私有方法，初始化地图
   *
   */
  #initMap() {
    const basemap = DEFAULT_OPTIONS.Map.basemap;
    if (basemap) {
      this._map = new Map(DEFAULT_OPTIONS.Map);
    } else {
      throw new Error(ERROR_MSG.basemapError);
    }
  }
  /**
   * 私有方法，初始化视图
   * @param opt
   */
  #initView() {
    const container = DEFAULT_OPTIONS.MapView.container;
    if (container) {
      this._mapView = new MapView({
        ...DEFAULT_OPTIONS.MapView,
        container, // 这里不能取一个随机值，要和 dom 中元素对于
        map: this._map,
      });
      this.#removeViewUI();
    } else {
      throw new Error(ERROR_MSG.viewContainerError);
    }
  }
  /**
   * 移除一些不常用的默认 view-ui
   */
  #removeViewUI() {
    if (this._mapView) {
      this._mapView.ui.remove(["zoom", "attribution"]);
    }
  }

  /**
   * 视图销毁，与视图相关的资源会一并销毁，包括像 map popup等
   */
  destroy() {
    if (this._mapView) {
      this._mapView.destroy();
    }
  }

  /**
   * 给地图上的元素增加监听事件
   * @param target 需要被监听事件的地图元素
   * @param eventName 需要监听的事件
   * @param callback 需要执行的函数
   */
  $on(target: any, eventName: string, callback: any) {
    const targetEnum = {
      view: this._mapView,
      locate: this._locateWidget,
    };
    const t = getKey(targetEnum, target);
    t.on(eventName, callback);
  }
  /**
   * 初始化定位 widget
   * @returns
   */
  #locate() {
    this._locateWidget = new Locate({
      ...DEFAULT_OPTIONS.Locate,
      view: this._mapView,
    });
    this._mapView.ui.add(this._locateWidget, {
      position: DEFAULT_OPTIONS.Locate.position,
    });
    return this._locateWidget;
  }

  /**
   * 定位
   */
  getLocation() {
    if (this._locateWidget) {
      this._locateWidget.locate();
    } else {
      // TODO 抛出错误
    }
  }

  /**
   * 图层的命名都是 addXXXLayer
   */

  /**
   * 添加要素图层
   * @param opt
   * @returns
   */
  addFeatureLayer(opt) {
    const { url } = opt;
    const layer = new FeatureLayer(opt);
    this._map.add(layer, opt.index);
    return layer;
  }

  /**
   * 网格 聚合 热力图命名是 addXXXRenderer
   */
  addGridRenderer() {}

  addClusterRenderer() {}

  addHeatmapRenderer() {}

  /**
   * 移除图层
   * @param layer
   */
  removeLayer(layer) {
    this._map.remove(layer);
  }

  /**
   * 根据 layerId 移除图层
   * @param layerId
   */
  removeLayerById(layerId: string) {
    const layer = this._map.findLayerById(layerId);
    if (layer) {
      this.removeLayer(layer);
    }
  }

  /**
   * 移除所有图层
   */
  removeAll() {
    this._map.removeAll();
  }

  toggleLayerVisible(layer, visible: boolean) {
    layer.visible = visible;
  }

  toggleLayerVisibleById(layerId, visible: boolean) {
    const layer = this._map.findLayerById(layerId);
    if (layer) {
      this.toggleLayerVisible(layer, visible);
    }
  }

  goTo(target, opt) {}
}
