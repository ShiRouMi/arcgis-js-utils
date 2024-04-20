export const DEFAULT_OPTIONS = {
  Map: {
    basemap: null,
  },
  MapView: {
    container: "",
    zoom: 6,
    center: [120.210792, 30.246026],
    spatialReference: {
      wkid: 4490,
    },
  },
  Locate: {
    position: "bottom-right",
    container: "",
    popupEnabled: false,
  },
};

export const ERROR_MSG = {
  viewContainerError: "未传入地图容器 id，加载失败",
  basemapError: "未传入底图 basemap，加载失败",
  viewError: "视图不存在，加载失败",
  urlError: "未传入服务地址，加载失败",
  apiFailed: "arcgis API 加载失败",
  layerTypeError: "未传入图层类型或者图层类型不存在，加载失败",
};

/**
 * 绑定事件
 * 获取实例
 * 错误处理等
 */
