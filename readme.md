# arcgis-js-utils

封装了 ArcGIS Maps SDK for JavaScript 4.x 的 API 工具库

## 安装

```
npm i arcgis-js-utils
```

## 快速上手

引入 arcgis-js-utils

```javascript
import ArcgisJsUtils from "arcgis-js-utils";
```

### 地图

```js
  <div class="map-div" :id="mapDomId"></div>

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
