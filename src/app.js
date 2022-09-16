import './styles.css';

const canvas = document.querySelector("canvas");
const plusBtn = document.querySelector("#plus");
const minusBtn = document.querySelector("#minus");
const rightBtn = document.querySelector("#right");
const leftBtn = document.querySelector("#left");
const topBtn = document.querySelector("#top");
const bottomBtn = document.querySelector("#bottom");
const ctx = canvas.getContext("2d");
const cacheImages = {};
const elements = [
  {
    id: 1,
    name: "Area total",
    description: "Area total",
    x: 235,
    y: 52,
    width: 966,
    height: 1337,
    url: "/all-area.svg",
  },
  {
    id: 2,
    name: "Caminos",
    description: "Caminos",
    x: 329.43,
    y: 258.81,
    width: 871.21,
    height: 908.15,
    url: "/ways.svg",
  },
  {
    id: 3,
    name: "Piscinas",
    description: "Piscinas",
    x: 1017,
    y: 326,
    width: 100.46,
    height: 112.02,
    url: "/pools.svg",
  },
  {
    id: 4,
    name: "Auditorium",
    description: "Auditorium",
    x: 899.73,
    y: 516.48,
    width: 95.91,
    height: 97.95,
    url: "/auditorium.svg",
  },
];

canvas.height = window.innerWidth;
canvas.width = window.innerWidth;

const translatePos = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

let scale = 1.0;
let scaleMultiplier = 0.9;

async function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(translatePos.x, translatePos.y);
  ctx.scale(scale, scale);

  ctx.font = "18px Arial";
  ctx.fillText("Chao", 10 - canvas.width / 2, 28 - canvas.height / 2);

  const reduce = 1400 / canvas.width;
  for (const element of elements) {
    const image = await loadImg(element.url);
    const width = element.width / reduce;
    const height = element.height / reduce;
    const x = element.x / reduce - canvas.width / 2;
    const y = element.y / reduce - canvas.height / 2;
    ctx.drawImage(image, x, y, width, height);
  }

  ctx.restore();
}

function loadImg(url) {
  return new Promise((resolve, reject) => {
    const cached = cacheImages[url];
    if (cached) return resolve(cached);
    const img = new Image();
    img.onload = function () {
      cacheImages[url] = img;
      resolve(img);
    };
    img.onerror = reject;
    img.onclick = () => {
      console.log("click");
    };
    img.src = url;
  });
}

plusBtn.addEventListener("click", () => {
  scale /= scaleMultiplier;
  draw();
});

minusBtn.addEventListener("click", () => {
  scale *= scaleMultiplier;
  if (scale <= 1) scale = 1;
  draw();
});

rightBtn.addEventListener("click", () => {
  translatePos.x -= 30;
  draw();
});

leftBtn.addEventListener("click", () => {
  translatePos.x += 30;
  draw();
});

topBtn.addEventListener("click", () => {
  translatePos.y += 30;
  draw();
});

bottomBtn.addEventListener("click", () => {
  translatePos.y -= 30;
  draw();
});

canvas.addEventListener("click", (e) => {
  console.log(e);
});

draw();
