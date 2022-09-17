import Konva from "konva";
import elements from "./data.json";

const ORIGINAL_WIDTH = 1400;

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

  const tooltip = new Konva.Text({
    text: "",
    fontFamily: "Calibri",
    fontSize: 12,
    padding: 5,
    visible: false,
    fill: "black",
    opacity: 0.75,
    textFill: "white",
  });

  tooltipLayer.add(tooltip);

  const reduce = ORIGINAL_WIDTH / width;
  for (const el of elements) {
    var group = new Konva.Group({
      x: el.x / reduce,
      y: el.y / reduce,
      // rotation: 20,
    });

    for (const p of el.pathData) {
      const path = new Konva.Path({
        // x: p.x / reduce,
        // y: p.y / reduce,
        data: p.d,
        fill: p.fill,
        scaleX: el.width / el.width / reduce,
        scaleY: el.height / el.height / reduce,
        stroke: p.stroke || undefined,
        strokeWidth: p.strokeWidth
          ? parseInt(p.strokeWidth) / reduce
          : undefined,
      });

      group.add(path);
    }

    for (const p of el.ellipseData) {
      const oval = new Konva.Ellipse({
        x: p.cx / reduce,
        y: p.cy / reduce,
        radiusX: p.rx / reduce,
        radiusY: p.ry / reduce,
        fill: p.fill,
        // stroke: 'black',
        // strokeWidth: 4,
      });

      group.add(oval);
    }

    for (const p of el.circleData) {
      const circle = new Konva.Circle({
        x: p.cx / reduce,
        y: p.cy / reduce,
        radius: p.r / reduce,
        fill: p.fill,
        // stroke: 'black',
        // strokeWidth: 4,
      });

      group.add(circle);
    }

    for (const p of el.rectData) {
      const rect = new Konva.Rect({
        x: p.x / reduce,
        y: p.y / reduce,
        width: p.width / reduce,
        height: p.height / reduce,
        rotation: p.rotate,
        cornerRadius: p.rx / reduce,
        fill: p.fill,
      });

      group.add(rect);
    }
    group.on("click touchstart", function (e) {
      const mousePos = stage.getPointerPosition();
      const stagePos = stage.position();
      const newX = (Math.abs(stagePos.x) + mousePos.x) / stage.scaleX();
      const newY = (Math.abs(stagePos.y) + mousePos.y) / stage.scaleY();
      tooltip.position({
        x: newX,
        y: newY,
      });
      tooltip.text(el.description);
      tooltip.show();
    });
    layer.add(group);
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
