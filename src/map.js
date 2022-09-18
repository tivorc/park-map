import Konva from "konva";
import mapInfo from "./data.json";

const ORIGINAL_WIDTH = 1400;

function updateTooltip(tooltip, x, y, text) {
  tooltip.getText().text(text);
  tooltip.position({ x, y });
  tooltip.show();
}

function updateTooltipScale(tooltip, scale) {
  if (!tooltip.visible()) return;

  tooltip.getText().fontSize(18 / scale);
  tooltip.getText().padding(5 / scale);
  tooltip.getTag().pointerWidth(10 / scale);
  tooltip.getTag().pointerHeight(10 / scale);
}

async function draw() {
  Konva.hitOnDragEnabled = true;

  const width =
    window.innerWidth > window.innerHeight
      ? window.innerHeight
      : window.innerWidth;
  const height = width;

  const stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
    draggable: true,
  });

  const layer = new Konva.Layer();
  const tooltipLayer = new Konva.Layer();

  const tooltip = new Konva.Label({
    opacity: 0.75,
    visible: false,
    listening: false,
  });

  tooltip.add(
    new Konva.Tag({
      fill: "black",
      pointerDirection: "down",
      pointerWidth: 10,
      pointerHeight: 10,
      lineJoin: "round",
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      shadowOpacity: 0.5,
      cornerRadius: 3,
    })
  );

  tooltip.add(
    new Konva.Text({
      text: "",
      fontFamily: "system-ui",
      fontSize: 18,
      padding: 5,
      fill: "white",
    })
  );

  tooltipLayer.add(tooltip);

  const reduce = ORIGINAL_WIDTH / width;
  for (const el of mapInfo.elements) {
    let item = null;

    if (el.type === "path") {
      item = new Konva.Path({
        data: el.data.d,
        fill: el.data.fill,
        scaleX: ORIGINAL_WIDTH / ORIGINAL_WIDTH / reduce,
        scaleY: ORIGINAL_WIDTH / ORIGINAL_WIDTH / reduce,
      });
    }

    if (el.type === "ellipse") {
      item = new Konva.Ellipse({
        x: el.data.cx / reduce,
        y: el.data.cy / reduce,
        radiusX: el.data.rx / reduce,
        radiusY: el.data.ry / reduce,
        fill: el.data.fill,
      });
    }

    if (el.type === "circle") {
      item = new Konva.Circle({
        x: el.data.cx / reduce,
        y: el.data.cy / reduce,
        radius: el.data.r / reduce,
        fill: el.data.fill,
      });
    }

    if (el.type === "rect") {
      item = new Konva.Rect({
        x: el.data.x / reduce,
        y: el.data.y / reduce,
        width: el.data.width / reduce,
        height: el.data.height / reduce,
        rotation: el.data.rotate,
        cornerRadius: el.data.rx / reduce,
        fill: el.data.fill,
      });
    }

    if (el.description) {
      item.on("click touchstart", function () {
        const mousePos = stage.getPointerPosition();
        const stagePos = stage.position();
        const newX = (Math.abs(stagePos.x) + mousePos.x) / stage.scaleX();
        const newY = (Math.abs(stagePos.y) + mousePos.y) / stage.scaleY();
        updateTooltip(tooltip, newX, newY, el.description);
      });
    }
    layer.add(item);
  }

  stage.add(layer);
  stage.add(tooltipLayer);

  function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  function getCenter(p1, p2) {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }
  let lastCenter = null;
  let lastDist = 0;

  stage.on("touchmove", function (e) {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      // if the stage was under Konva's drag&drop
      // we need to stop it, and implement our own pan logic with two pointers
      if (stage.isDragging()) {
        stage.stopDrag();
      }

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter) {
        lastCenter = getCenter(p1, p2);
        return;
      }
      const newCenter = getCenter(p1, p2);

      const dist = getDistance(p1, p2);

      if (!lastDist) {
        lastDist = dist;
      }

      // local coordinates of center point
      var pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleX(),
      };

      var scale = stage.scaleX() * (dist / lastDist);

      stage.scaleX(scale);
      stage.scaleY(scale);

      // calculate new position of the stage
      var dx = newCenter.x - lastCenter.x;
      var dy = newCenter.y - lastCenter.y;

      var newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };

      stage.position(newPos);
      updateTooltipScale(tooltip, scale);

      lastDist = dist;
      lastCenter = newCenter;
    }
  });

  stage.on("touchend", function () {
    lastDist = 0;
    lastCenter = null;
  });
}

draw();
