const fs = require("fs/promises");
const path = require("path");

const data = {
  "00-all-area": {
    name: "",
    description: "",
    x: 235,
    y: 52,
  },
  "01-vehicular-road": {
    name: "Ingreso vehicular",
    description: "Ingreso vehicular",
    x: 718.02,
    y: 490.09,
  },
  "03-vehicle-parking": {
    name: "Estacionamiento vehicular",
    description: "Estacionamiento vehicular",
    x: 913,
    y: 586,
  },
  "04-pedestrian-path": {
    name: "Camino peatonal",
    description: "Camino peatonal",
    x: 329.43,
    y: 258.81,
  },
  pools: {
    name: "Piscinas",
    description: "Piscinas",
    x: 1017,
    y: 326,
  },
  lake: {
    name: "Lago",
    description: "Lago",
    x: 554.51,
    y: 691.81,
  },
  "07-auditorium": {
    name: "Auditorium",
    description: "Auditorium",
    x: 906.5,
    y: 524.3,
  },
  "08-school": {
    name: "Colegio",
    description: "Colegio",
    x: 782.78,
    y: 717.62,
  },
  "09-pool-restroom": {
    name: "Baños piscina",
    description: "Baños piscina",
    x: 1099.26,
    y: 404.45,
  },
  "10-pool-showers": {
    name: "Regaderas piscina",
    description: "Regaderas piscina",
    x: 1088.06,
    y: 414.89,
  },
  "12-primary-school": {
    name: "Colegio primario",
    description: "Colegio primario",
    x: 1129.99,
    y: 346.9,
  },
};

fs.readdir(path.join(__dirname, "../images"))
  .then((list) => {
    const files = list.map((file) =>
      fs.readFile(path.join(__dirname, "../images", file), "utf8")
    );
    return Promise.all(files);
  })
  .then((list) => {
    const result = list.map((file) => {
      const groupId = file.match(/id="([ \w-()]+)"/)[1];
      const width = file.match(/width="(\d+)"/)[1];
      const height = file.match(/height="(\d+)"/)[1];
      const path = file.match(/<path.*?\/>/g) || [];
      const ellipse = file.match(/<ellipse.*?\/>/g) || [];
      const circle = file.match(/<circle.*?\/>/g) || [];
      const rects = file.match(/<rect.*?\/>/g) || [];

      const rectData = rects.map((rect) => {
        const x = rect.match(/x="([\d.]+)"/)[1];
        const y = rect.match(/y="([\d.]+)"/)[1];
        const width = rect.match(/width="([\d.]+)"/)[1];
        const height = rect.match(/height="([\d.]+)"/)[1];
        const fill = rect.match(/fill="(.*)"/)[1];
        const rotation = rect.match(/transform="rotate\(([-\d.]+)/);
        return {
          x: Number(x),
          y: Number(y),
          width: Number(width),
          height: Number(height),
          rotate: rotation ? Number(rotation[1]) : 0,
          fill,
        };
      });

      const pathData = path.map((p) => {
        const d = p.match(/ d="([ \w.-]{10,})"/)[1];
        const fill = (p.match(/fill="(.*)"/) || [])[1];
        const stroke = (p.match(/stroke="([#\w]*)"/) || [])[1];
        const strokeWidth = (p.match(/stroke-width="(.*)"/) || [])[1];

        return { d, fill, stroke, strokeWidth };
      });

      const ellipseData = ellipse.map((e) => {
        const cx = e.match(/cx="([\d.]*)"/)[1];
        const cy = e.match(/cy="([\d.]*)"/)[1];
        const rx = e.match(/rx="([\d.]*)"/)[1];
        const ry = e.match(/ry="([\d.]*)"/)[1];
        const fill = e.match(/fill="(.*)"/)[1];
        return { cx, cy, rx, ry, fill };
      });

      const circleData = circle.map((e) => {
        const cx = e.match(/cx="([\d.]*)"/)[1];
        const cy = e.match(/cy="([\d.]*)"/)[1];
        const r = e.match(/r="([\d.]*)"/)[1];
        const fill = e.match(/fill="(.*)"/)[1];
        return { cx, cy, r, fill };
      });

      const more = data[groupId] || {};
      return {
        width: Number(width),
        height: Number(height),
        pathData,
        ellipseData,
        circleData,
        rectData,
        ...more,
      };
    });
    fs.writeFile(
      path.join(__dirname, "../src", "data.json"),
      JSON.stringify(result)
    );
  });
