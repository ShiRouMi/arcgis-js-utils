# arcgis-js-utils

封装了 ArcGIS Maps SDK for JavaScript 4.x 的 API 工具库

## 安装

```
npm i @arcgis/core  // 必须安装
npm i arcgis-js-utils
```

## 快速上手

引入 arcgis-js-utils

```javascript
import "@arcgis/core/assets/esri/themes/light/main.css"; // 必须调研
import ArcgisJsUtils from "arcgis-js-utils";
```

### 地图

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

### 地图事件

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
