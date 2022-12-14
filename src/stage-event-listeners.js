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
const scaleBy = 1.01;

export default function addStageListeners(stage, updateTooltipScale) {
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

      if (scale < 1) scale = 1;
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
      updateTooltipScale(scale);
      stage.batchDraw();

      lastDist = dist;
      lastCenter = newCenter;
    }
  });

  stage.on("touchend", function () {
    lastDist = 0;
    lastCenter = null;
  });

  stage.on("wheel", function (event) {
    event.evt.preventDefault();
    const oldScale = stage.scaleX();
    const { x: pointerX, y: pointerY } = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerX - stage.x()) / oldScale,
      y: (pointerY - stage.y()) / oldScale,
    };
    let newScale =
      event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    if (newScale < 1) newScale = 1;
    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointerX - mousePointTo.x * newScale,
      y: pointerY - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    updateTooltipScale(newScale);
    stage.batchDraw();
  });
}
