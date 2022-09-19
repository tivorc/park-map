import Konva from "konva";

const FONT_SIZE = 18;
const PADDING = 5;
const POINTER_SIZE = 10;
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
    pointerWidth: POINTER_SIZE,
    pointerHeight: POINTER_SIZE,
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
    fontSize: FONT_SIZE,
    padding: PADDING,
    fill: "white",
  })
);

tooltipLayer.add(tooltip);

export function updateTooltip(x, y, text) {
  tooltip.getText().text(text);
  tooltip.position({ x, y });
  tooltip.show();
}

export function updateTooltipScale(scale) {
  tooltip.getText().fontSize(FONT_SIZE / scale);
  tooltip.getText().padding(PADDING / scale);
  tooltip.getTag().pointerWidth(POINTER_SIZE / scale);
  tooltip.getTag().pointerHeight(POINTER_SIZE / scale);
}

export default tooltipLayer;
