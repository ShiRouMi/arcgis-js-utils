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
        container, // 这里不能取一个随机值，要和 dom 中元素对应
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
   * 添加图层
   * @param type 图层类型
   * @param opt
   */
  add(type: string, opt: any) {
    if (type) {
      switch (type) {
        case "FeatureLayer": // 要素
          this.addFeatureLayer(opt);
          break;
        case "GraphicsLayer": // 图形
          this.addGraphicsLayer(opt);
          break;
        case "TileLayer":
          this.addTileLayer(opt);
          break;
        case "TileLayer4490": // 4490切片
          this.addTileLayer4490(opt);
          break;
        case "VectorTileLayer": // 矢量切片
          this.addVectorTileLayer(opt);
          break;
        case "GeoJSONLayer": // geojson
          this.addGeoJSONLayer(opt);
          break;
        case "ImageryLayer":
          this.addImageryLayer(opt);
          break;
        case "ImageryTileLayer":
          this.addImageryTileLayer(opt);
          break;
        case "DynamicLayer":
        case "MapImageLayer":
          this.addMapImageLayer(opt); // 动态范围
          break;
        case "GroupLayer":
          this.addGroupLayer(opt); // 组合图层
          break;
        case "WebTileLayer":
          this.addWebTileLayer(opt);
          break;
        case "WFSLayer":
          this.addWFSLayer(opt);
          break;
        case "WMSLayer":
          this.addWMSLayer(opt);
          break;
        case "Heatmap": // 热力图
          this.addHeatmapRenderer(opt);
          break;
        case "Cluster": // 统计
          this.addClusterRenderer(opt);
          break;
        case "Grid": // 网格
          this.addGridRenderer(opt);
          break;
        default:
          throw new Error(ERROR_MSG.layerTypeError);
      }
    } else {
      throw new Error(ERROR_MSG.layerTypeError);
    }
  }

  /**
   * 添加要素图层
   * 在一个地图服务或者要素服务的图层上显示要素，该层可以是(空间)层，也可以是(非空间)表。
   * @param opt
   * @returns
   */
  addFeatureLayer(opt) {
    const { url } = opt;
    const layer = new FeatureLayer(opt);
    this._map.add(layer, opt.index);
    return layer;
  }
  addGraphicsLayer(opt) {}
  addTileLayer4490(opt) {}
  addGeoJSONLayer(opt) {}
  addTileLayer(opt) {}
  addDynamicLayer(opt) {}
  /**
   * 矢量切片
   * @param opt
   */
  addVectorTileLayer(opt) {}
  addGroupLayer(opt) {}

  /**
   * Represents a dynamic image service resource as a layer.
   * 区别 addMapImageLayer 这两类啥差别
   * @param opt
   */
  addImageryLayer(opt) {}

  /**
   * ImageryTileLayer presents raster data from a tiled image service.
   * Binary imagery tiles are projected, processed, and rendered on the client-side.
   * Tiled access is fast and scalable.
   * @param opt
   */
  addImageryTileLayer(opt) {}

  /**
   * 向地图添加地理引用图像,该地图将把地理参照图像放置在指定的地理范围内。
   * MapImageLayer allows you to display, query, and analyze layers from data defined in a map service.
   * 支持 sublayer
   * 这个应该就是对应 3 里面的ArcGISDynamicMapServiceLayer
   * @param opt
   */
  addMapImageLayer(opt) {}
  addWFSLayer(opt) {}
  /**
   * OGC Web Map Services (WMS)
   * @param opt
   */
  addWMSLayer(opt) {}
  addWebTileLayer(opt) {}
  /**
   * 网格 聚合 热力图命名是 addXXXRenderer
   */
  addGridRenderer(opt) {}

  addClusterRenderer(opt) {}

  addHeatmapRenderer(opt) {}

  // ========================= 图层 =======================
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

  /**
   * 切换图层显隐
   * @param layer
   * @param visible
   */
  toggleLayerVisible(layer, visible: boolean) {
    layer.visible = visible;
  }

  /**
   * 根据 layerId 切换图层显隐
   * @param layerId
   * @param visible
   */
  toggleLayerVisibleById(layerId, visible: boolean) {
    const layer = this._map.findLayerById(layerId);
    if (layer) {
      this.toggleLayerVisible(layer, visible);
    }
  }
  // ========================= 图形 =======================
  // 创建图形 移除图形
  // ========================= 缩放 =======================
  /**
   * 全图
   */
  fullmap() {
    const center = DEFAULT_OPTIONS.MapView.center;
    const zoom = DEFAULT_OPTIONS.MapView.zoom;
    this.goTo({
      center,
      zoom,
    });
  }

  /**
   * https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#goTo
   * @param target target 可以有多种形式
   * @param opt
   */
  goTo(target, opt?: any) {
    if (this._mapView) {
      this._mapView.goTo(target, opt);
    } else {
      throw new Error(ERROR_MSG.viewError);
    }
  }
}
