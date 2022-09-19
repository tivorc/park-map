import Konva from "konva";
import createShape from "./create-shape";
import mapInfo from "./data.json";
import addStageListeners from "./stage-event-listeners";
import tooltipLayer, { updateTooltip, updateTooltipScale } from "./tooltip";

async function draw() {
  Konva.hitOnDragEnabled = true;

  const width = window.innerWidth - 16;
  const height = window.innerHeight - 16;

  const stage = new Konva.Stage({
    container: "map",
    width: width,
    height: height,
    draggable: true,
  });

  const layer = new Konva.Layer();

  let translateX = 0;
  let translateY = 0;
  let reduce = 1;
  if (width > height) {
    reduce = mapInfo.height / height;
    translateX = (width - mapInfo.width / reduce) / 2;
  } else {
    reduce = mapInfo.width / width;
    translateY = (height - mapInfo.height / reduce) / 2;
  }
  for (const element of mapInfo.elements) {
    let item = createShape(element, mapInfo.width, reduce);

    layer.add(item);
    if (!element.description) continue;

    item.on("mouseenter", function () {
      stage.container().style.cursor = "pointer";
    });
    item.on("mouseleave", function () {
      stage.container().style.cursor = "default";
    });
    item.on("click touchstart", function (e) {
      if (e.type !== "click") {
        const touch1 = e.evt.touches[0];
        const touch2 = e.evt.touches[1];
        if (touch1 && touch2) return;
      }

      const mousePos = stage.getPointerPosition();
      const stagePos = stage.position();
      const plusX = stagePos.x < 0 ? 0 : stagePos.x * 2;
      const newX = (Math.abs(stagePos.x) + mousePos.x) / stage.scaleX() - plusX;
      const plusY = stagePos.y < 0 ? 0 : stagePos.y * 2;
      const newY = (Math.abs(stagePos.y) + mousePos.y) / stage.scaleY() - plusY;
      updateTooltip(newX, newY, element.description);
    });
  }

  const newPos = {
    x: translateX,
    y: translateY,
  };
  stage.position(newPos);

  stage.add(layer);
  stage.add(tooltipLayer);
  addStageListeners(stage, updateTooltipScale);
}

draw();
