const fs = require("fs/promises");
const path = require("path");

const methods = {
  path: getPathData,
  circle: getCircleData,
  rect: getRectData,
  ellipse: getEllipseData,
  text: getTextData,
};

fs.readFile(path.join(__dirname, "../images", "map.svg"), "ascii").then(
  (file) => {
    const width = file.match(/width="(\d+)"/)[1];
    const height = file.match(/height="(\d+)"/)[1];
    const groups = file.match(/<g id="\d[\w-]+">([\r\n].+)+?[\r\n]<\/g>/g);

    const result = groups.map((group) => {
      const id = group.match(/id="(\d[\w-]+)"/)[1];
      const text = group.match(/<(text).+/g);
      const elements = group.match(/<(path|circle|rect|ellipse).+/g);

      const description = text ? methods.text(text[0]) : "";

      const data = elements.map((element) => {
        const type = element.match(/<(\w+)/)[1];
        const data = methods[type](element);
        return { type, data, id, description };
      });
      return data;
    });

    fs.writeFile(
      path.join(__dirname, "../src", "data.json"),
      JSON.stringify({
        width: Number(width),
        height: Number(height),
        elements: result.flat(1),
      })
    );
  }
);

function getPathData(path) {
  const d = path.match(/ d="([ \w.-]{10,})"/)[1];
  const fill = (path.match(/fill="(.*)"/) || [])[1];
  const stroke = (path.match(/stroke="([#\w]*)"/) || [])[1];
  const strokeWidth = (path.match(/stroke-width="(.*)"/) || [])[1];

  return { d, fill, stroke, strokeWidth };
}

function getCircleData(circle) {
  const cx = circle.match(/cx="([\d.]*)"/)[1];
  const cy = circle.match(/cy="([\d.]*)"/)[1];
  const r = circle.match(/r="([\d.]*)"/)[1];
  const fill = circle.match(/fill="(.*)"/)[1];

  return { cx, cy, r, fill };
}

function getRectData(rect) {
  const x = rect.match(/x="([-\d.]+)"/)[1];
  const y = rect.match(/y="([-\d.]+)"/)[1];
  const width = rect.match(/width="([\d.]+)"/)[1];
  const height = rect.match(/height="([\d.]+)"/)[1];
  const fill = rect.match(/fill="(.*)"/)[1];
  const rotation = rect.match(/transform="rotate\(([-\d.]+)/);
  const rx = rect.match(/rx="([\d]+)"/);

  return {
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
    rotate: rotation ? Number(rotation[1]) : 0,
    rx: rx ? Number(rx[1]) : 0,
    fill,
  };
}

function getEllipseData(ellipse) {
  const cx = ellipse.match(/cx="([\d.]*)"/)[1];
  const cy = ellipse.match(/cy="([\d.]*)"/)[1];
  const rx = ellipse.match(/rx="([\d.]*)"/)[1];
  const ry = ellipse.match(/ry="([\d.]*)"/)[1];
  const fill = ellipse.match(/fill="(.*)"/)[1];

  return { cx, cy, rx, ry, fill };
}

function getTextData(text) {
  const textContent = text
    .match(/<tspan.*>(.*)<\/tspan>/)[1]
    .replace(/&#x([0-9a-f]{2,});/gi, function (_, pair) {
      return String.fromCharCode(parseInt(pair, 16));
    })
    .replace(/&#([0-9a-f]{2});/gi, function (_, pair) {
      return String.fromCharCode(pair);
    });

  return textContent;
}
