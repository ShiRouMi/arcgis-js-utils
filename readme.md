# arcgis-js-utils

封装了 ArcGIS Maps SDK for JavaScript 4.x 的 API 工具库

## 安装

```
npm i @arcgis/core  // @arcgis/core 依赖没有打包进库，所以必须安装
npm i arcgis-js-utils
```

## 快速上手

引入 arcgis-js-utils

```javascript
import "@arcgis/core/assets/esri/themes/light/main.css"; // 必须调研
import ArcgisJsUtils from "arcgis-js-utils";
```

### 实例化

```vue
<div class="map-div" :id="mapDomId"></div>
```

```js
  const mapDomId = 'testMap'
  const basemap = [] // 配置底图
  const arcgisMap = new ArcgisMapUtils({
    Map: {
      basemap
    },
    MapView: {
      container: mapDomId
    },
    Locate: {
    }
    geolocation: true
  })
```

### 属性

| 名称    | 类型 | 说明                             | 默认值 |
| ------- | ---- | -------------------------------- | ------ |
| Map     | --   | 与 Arcgis Map 一样的地图配置     | --     |
| MapView | --   | 与 Arcgis MapView 一样的视图配置 | --     |
| Locate  | --   | 与 Arcgis Locate 一样的定位配置  | --     |

### 事件

- arcgisMap 实例上提供了 $on 方法进行事件监听
- 与原生 arcgis API 事件监听一样的方式

```js
const { _mapView } = arcgisMap;

// 方式1
arcgisMap.$on("view", "click", (e) => {
  console.log(e);
});

// 方式2
_mapView.on("click", (e) => {
  console.log(e);
});
```
