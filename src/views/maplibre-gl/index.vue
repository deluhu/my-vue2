<template>
  <main>
    <div id="map" style="width: 100%; height: 100vh"></div>
    <div style="position: absolute; top: 10px; left: 10px; z-index: 1">
      <select v-model="currentStyle" @change="changeMapStyle">
        <option value="vec">矢量地图</option>
        <option value="img">影像地图</option>
        <option value="ter">地形地图</option>
      </select>
    </div>
    <div class="fps">FPS：{{ fps }}</div>
  </main>
</template>

<script>
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";

import getRenHeRoad from "@config/renhe_road.js";
const RENHE = getRenHeRoad();

export default {
  name: "PureMapLibreDemo",
  data() {
    return {
      map: null,
      baseConfig: {
        // center: [114.305, 30.5928], // 武汉市中心
        center: [114.38289848809904, 30.603658880826956], // 仁和路
        zoom: 6,
        // bounds: [
        //   [113.8, 30.2],
        //   [114.6, 30.9],
        // ], // 武汉市大致范围
        bounds: [
          [114.3760442254665, 30.60883451645401],
          [114.38897621261208, 30.597845743044175],
        ], // 仁和路大致范围
      },
      baseUrl: {
        vec: "./gis-ae/tdt-map/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
        img: "./gis-ae/tdt-map/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
        ter: "./gis-ae/tdt-map/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
        cva: "./gis-ae/tdt-map/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=6cd9a2cd6399e2f545b4afacc6177fda",
      },
      currentStyle: "vec",
      speedFactor: 100,
      animation: null,
      startTime: 0,
      progress: 0,
      resetTime: false,
      fps: 0,
    };
  },
  watch: {},
  mounted() {
    this.initMap();
    // this.$axios.post('/subscribe-api/', {
    //   "email": "kjsdfjk@gmail.com"
    // });
    // this.$axios.post('/get-waterQuality/', {
    //   AreaID: 420100,
    //   RiverID: '',
    //   MNName: '',
    //   PageIndex: -1,
    //   PageSize: 60,
    //   action: 'getRealDatas',
    // }).then(res => {
    //   console.log(res);
    // })
  },
  methods: {
    initMap() {
      this.map = new maplibregl.Map({
        container: "map",
        style: this.getStyle(),
        // style: "https://demotiles.maplibre.org/style.json",
        center: this.baseConfig.center, // 武汉市中心
        zoom: this.baseConfig.zoom,
        minZoom: 3,
        renderWorldCopies: false,
      });
      this.map.on("load", async () => {
        this.getFps();
        this.fitMapToBounds();
        this.addCustomLayer();
        this.addControls();
        this.addDrawControls();
        // this.addSymbolLayer();
        // this.addMissionLayer();
        // await this.addLineLayer();
        // this.animateLine();
      });
      // this.registerListener();
    },
    getFps() {
      let lastFrameTime = performance.now();
      let currentFPS = 0;
      let timer = null;

      let animate = () => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;

        currentFPS = 1000 / deltaTime;

        lastFrameTime = currentTime;
        requestAnimationFrame(animate);

        if (timer) {
          return;
        }
        timer = setTimeout(() => {
          this.fps = currentFPS.toFixed(2);
          timer = null;
        }, 200);
      }
      animate();
    },
    registerListener() {
      this.map.on("click", e => {
        console.log(e.lngLat);
      });
      // this.map.on("zoom", () => {
      //   const currentZoom = this.map.getZoom();
      //   console.log("当前缩放级别：", currentZoom);
      // });

      // this.addMissionEvent();
    },
    changeMapStyle() {
      this.map.setStyle(this.getStyle());
    },
    getStyle() {
      return {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
        sources: {
          base: {
            type: "raster",
            tiles: [this.baseUrl[this.currentStyle]],
            tileSize: 256,
          },
          label: {
            type: "raster",
            tiles: [this.baseUrl.cva],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "base",
            type: "raster",
            source: "base",
          },
          {
            id: "label",
            type: "raster",
            source: "label",
          },
        ],
      };
    },
    fitMapToBounds() {
      const padding = new maplibregl.EdgeInsets(50, 50, 50, 50); // 上、右、下、左
      this.map.fitBounds(this.baseConfig.bounds, {
        padding: padding,
        duration: 1000, // 平滑动画时间
      });
    },
    addCustomLayer() {
      this.map.addSource("wuhan-center", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [114.305, 30.5928],
              },
              properties: {
                title: "武汉市中心",
              },
            },
          ],
        },
      });

      this.map.addLayer({
        id: "wuhan-center",
        type: "circle",
        source: "wuhan-center",
        paint: {
          "circle-radius": 6,
          "circle-color": "#ff0000",
        },
      });

      this.map.on("click", "wuhan-center", e => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.title;

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<strong>${description}</strong>`)
          .addTo(this.map);
      });

      this.map.on("mouseenter", "wuhan-center", () => {
        this.map.getCanvas().style.cursor = "pointer";
      });

      this.map.on("mouseleave", "wuhan-center", () => {
        this.map.getCanvas().style.cursor = "";
      });
    },
    addControls() {
      this.map.addControl(new maplibregl.NavigationControl(), "top-right");
      this.map.addControl(new maplibregl.FullscreenControl(), "top-right");
      this.map.addControl(new maplibregl.GeolocateControl(), "top-right");
      this.map.addControl(new maplibregl.ScaleControl(), "bottom-left");
    },
    addDrawControls() {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: true,
          line_string: true,
          polygon: true,
          trash: true,
        },
        styles: [
          // 默认填充样式
          {
            id: "gl-draw-polygon-fill",
            type: "fill",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"],
            ],
            paint: {
              "fill-color": "#00bcd4",
              "fill-opacity": 0.3,
            },
          },
          // 填充轮廓样式
          {
            id: "gl-draw-polygon-stroke",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"],
            ],
            paint: {
              "line-color": "#00bcd4",
              "line-width": 2,
            },
          },
          // 绘制时的线样式
          {
            id: "gl-draw-line",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "LineString"],
              ["!=", "mode", "static"],
            ],
            paint: {
              "line-color": "#ff9800",
              "line-width": 2,
            },
          },
          // 绘制点的样式
          {
            id: "gl-draw-point",
            type: "circle",
            filter: ["all", ["==", "$type", "Point"], ["!=", "mode", "static"]],
            paint: {
              "circle-radius": 5,
              "circle-color": "#f44336",
            },
          },
          // 鼠标悬停样式
          {
            id: "gl-draw-polygon-hover",
            type: "fill",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["==", "active", "false"],
              ["==", "user_hover", true],
            ],
            paint: {
              "fill-color": "#00bcd4",
              "fill-opacity": 0.5,
            },
          },
          // 选中状态样式
          {
            id: "gl-draw-polygon-active",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "Polygon"],
              ["==", "active", "true"],
            ],
            paint: {
              "line-color": "#2196f3",
              "line-width": 3,
            },
          },
          // 选中的线样式
          {
            id: "gl-draw-line-active",
            type: "line",
            filter: [
              "all",
              ["==", "$type", "LineString"],
              ["==", "active", "true"],
            ],
            paint: {
              "line-color": "#2196f3",
              "line-width": 3,
            },
          },
          // 选中的点样式
          {
            id: "gl-draw-point-active",
            type: "circle",
            filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"]],
            paint: {
              "circle-radius": 6,
              "circle-color": "#2196f3",
            },
          },
        ],
      });
      this.map.addControl(draw, "top-right");
      const buttons = document.querySelectorAll(
        ".mapbox-gl-draw_ctrl-draw-btn"
      );

      buttons.forEach(button => {
        const title = button.getAttribute("title");
        if (title === "LineString tool (l)")
          button.setAttribute("title", "线工具");
        if (title === "Polygon tool (p)")
          button.setAttribute("title", "多边形工具");
        if (title === "Marker tool (m)")
          button.setAttribute("title", "标记工具");
        if (title === "Delete") button.setAttribute("title", "删除");
      });
      this.map.on("draw.create", e => {
        const drawType = e.features[0].geometry.type;
        const featureId = e.features[0].id;
        draw.setFeatureProperty(featureId, "editable", false); // 标记为不可编辑
        // draw.changeMode('static');  // 切换到静态模式
        if (drawType === "Polygon") {
          this.renderRandomMarker(e.features[0]);
        }
      });
      this.map.on("draw.delete", e => {
        const drawType = e.features[0].geometry.type;
        if (drawType === "Polygon") {
          const uid = e.features[0].id.slice(0, 4);
          this.map.removeLayer(`random-points-${uid}`);
          this.map.removeSource(`random-points-${uid}`);
        }
      });
    },
    async renderRandomMarker(geojson) {
      const bbox = turf.bbox(geojson);
      const padding = new maplibregl.EdgeInsets(50, 50, 50, 50); // 上、右、下、左
      this.map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: padding,
          duration: 1000, // 平滑动画时间
        }
      );
      if (!this.map.getImage("marker")) {
        const image = await this.map.loadImage(
          "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
        );
        this.map.addImage("marker", image.data);
      }

      const points = [];
      for (let i = 0; i < 30000; i++) {
        var position = turf.randomPosition(bbox);
        if (turf.booleanPointInPolygon(position, geojson)) {
          // new maplibregl.Marker().setLngLat(position).addTo(this.map);
          points.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: position,
            },
          });
        }
      }
      const uid = `random-points-${geojson.id.slice(0, 4)}`;
      this.map.addSource(uid, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points,
        },
      });
      this.map.addLayer({
        id: uid,
        type: "symbol",
        source: uid,
        layout: {
          "icon-image": "marker", // 使用自定义图片
          "icon-size": 0.5, // 控制图标大小
          "icon-allow-overlap": false, // 不允许重叠渲染
          // 'text-field': 'gis元素',
          // 'text-size': 14,
          // 'text-font': ['Noto Sans Bold'],
          // 'text-offset': [0, 1.5], // 文字在图标上方
          // 'text-anchor': 'top',
        },
        // paint: {
        //   'text-color': '#0077f3'
        // }
      });
      this.map.on("click", uid, e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [uid],
        });

        if (features.length > 0) {
          const clickedPoint = features[0];
          console.log("点击的点：", clickedPoint);
        }
      });
    },
    addMissionEvent() {
      this.map.on("styleimagemissing", e => {
        const id = e.id; // id of the missing image

        // check if this missing icon is one this function can generate
        const prefix = "square-rgb-";
        if (id.indexOf(prefix) !== 0) return;

        // extract the color from the id
        const rgb = id.replace(prefix, "").split(",").map(Number);

        const width = 64; // The image will be 64 pixels square
        const bytesPerPixel = 4; // Each pixel is represented by 4 bytes: red, green, blue, and alpha.
        const data = new Uint8Array(width * width * bytesPerPixel);

        for (let x = 0; x < width; x++) {
          for (let y = 0; y < width; y++) {
            const offset = (y * width + x) * bytesPerPixel;
            data[offset + 0] = rgb[0]; // red
            data[offset + 1] = rgb[1]; // green
            data[offset + 2] = rgb[2]; // blue
            data[offset + 3] = 255; // alpha
          }
        }
        this.map.addImage(id, { width, height: width, data });
      });
    },
    addMissionLayer() {
      this.map.addSource("miss-points", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [114.305, 30.5928],
              },
              properties: {
                color: "255,0,0",
              },
            },
          ],
        },
      });

      this.map.addLayer({
        id: "miss-points",
        type: "symbol",
        source: "miss-points",
        layout: {
          "icon-image": ["concat", "square-rgb-", ["get", "color"]],
        },
      });
    },
    async addSymbolLayer() {
      const image = await this.map.loadImage("/cs3.png");
      this.map.addImage("cat", image.data);
      this.map.addSource("symbol-img", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [114.40588811073582, 30.589892809938846],
              },
            },
          ],
        },
      });
      this.map.addLayer({
        id: "symbol-img",
        type: "symbol",
        source: "symbol-img",
        layout: {
          "icon-image": "cat",
          "icon-size": 0.1,
        },
        minzoom: 11.5,
        maxzoom: 14,
      });
    },
    async addLineLayer() {
      const image = await this.map.loadImage("/cs3.png");
      this.map.addImage("cat", image.data);
      this.map.addSource("line-cs-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: RENHE[0],
              },
            },
          ],
        },
      });
      this.map.addLayer({
        id: "line-cs-point",
        type: "symbol",
        source: "line-cs-point",
        layout: {
          "icon-image": "cat",
          "icon-size": 0.05,
        },
      });

      this.map.addSource("renhe-line", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [],
              },
            },
          ],
        },
      });
      this.map.addLayer({
        id: "renhe-line",
        type: "line",
        source: "renhe-line",
        layout: {},
        paint: {
          "line-color": "#ed6498",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });
      this.startTime = performance.now();
    },
    animateLine(timestamp) {
      if (this.resetTime) {
        this.startTime = performance.now() - this.progress;
        this.resetTime = false;
      } else {
        this.progress = timestamp - this.startTime;
      }
      let source_data = { ...this.map.getSource("renhe-line")._data };
      let point_data = { ...this.map.getSource("line-cs-point")._data };
      const maxPoints = RENHE.length;
      const currentIndex = Math.floor(this.progress / this.speedFactor);

      if (currentIndex > maxPoints - 1) {
        this.startTime = timestamp;
        source_data.features[0].geometry.coordinates = [];
        point_data.features[0].geometry.coordinates = RENHE[0];
      } else {
        source_data.features[0].geometry.coordinates = RENHE.slice(
          0,
          currentIndex + 1
        );
        point_data.features[0].geometry.coordinates = RENHE[currentIndex];
      }
      this.map.getSource("renhe-line").setData(source_data);
      this.map.getSource("line-cs-point").setData(point_data);

      this.animation = requestAnimationFrame(this.animateLine);
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100vh;
}

.fps {
  position: absolute;
  right: 12px;
  bottom: 40px;
  background-color: rgb(255, 255, 255);
  padding: 4px 6px;
  border-radius: 24px;
  font-size: 12px;
}

.mapboxgl-ctrl-group {
  float: right;
  margin: 10px 10px 0 0;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  clear: both;
  pointer-events: auto;
  transform: translate(0);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .mapbox-gl-draw_ctrl-draw-btn {
    border: none;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    background-size: 24px;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
