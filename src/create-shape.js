export default function createShape(element, svgSize, reduce) {
  switch (element.type) {
    case "path":
      return new Konva.Path({
        data: element.data.d,
        fill: element.data.fill,
        scaleX: svgSize / svgSize / reduce,
        scaleY: svgSize / svgSize / reduce,
      });
    case "ellipse":
      return new Konva.Ellipse({
        x: element.data.cx / reduce,
        y: element.data.cy / reduce,
        radiusX: element.data.rx / reduce,
        radiusY: element.data.ry / reduce,
        fill: element.data.fill,
      });
    case "circle":
      return new Konva.Circle({
        x: element.data.cx / reduce,
        y: element.data.cy / reduce,
        radius: element.data.r / reduce,
        fill: element.data.fill,
      });
    case "rect":
      return new Konva.Rect({
        x: element.data.x / reduce,
        y: element.data.y / reduce,
        width: element.data.width / reduce,
        height: element.data.height / reduce,
        rotation: element.data.rotate,
        cornerRadius: element.data.rx / reduce,
        fill: element.data.fill,
      });
    default:
      return null;
  }
}
