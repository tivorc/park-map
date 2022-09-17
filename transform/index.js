const fs = require("fs/promises");
const path = require("path");

const data = {
  "all-area": {
    name: "Area total",
    description: "Area total",
    x: 235,
    y: 52,
  },
  auditorium: {
    name: "Auditorium",
    description: "Auditorium",
    x: 899.73,
    y: 516.48,
  },
  ways: {
    name: "Caminos",
    description: "Caminos",
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
  "aulas-inicial": {
    name: "Aulas Inicial",
    description: "Aulas Inicial",
    x: 797.62,
    y: 714.18,
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

      const pathData = path.map((p) => {
        const id = p.match(/id="([ \w-()]+)"/)[1];
        const d = p.match(/ d="([ \w.-]{10,})"/)[1];
        const fill = (p.match(/fill="(.*)"/) || [])[1];
        const stroke = (p.match(/stroke="([#\w]*)"/) || [])[1];
        const strokeWidth = (p.match(/stroke-width="(.*)"/) || [])[1];

        return { id, d, fill, stroke, strokeWidth };
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
        width,
        height,
        pathData,
        ellipseData,
        circleData,
        ...more,
      };
    });
    fs.writeFile(
      path.join(__dirname, "../src", "data.json"),
      JSON.stringify(result)
    );
  });
