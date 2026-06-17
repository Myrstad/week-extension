import {getCurrentWeek} from "@/lib/util/date";

const fonts = ["Inter", "RobotoSerif", "Rochester", "RubikOne", "Silkscreen"];
const fontSizes = [58, 58, 58, 40, 48]

async function setIconAndTitle() {
  const weekNumber = getCurrentWeek()
  browser.action.setTitle({
    title: 'Week Number: ' + weekNumber,
  });


  const canvas = new OffscreenCanvas(64, 64);
  const ctx = canvas.getContext("2d");

  if (ctx == null) {
    throw new Error("Can't find any canvas context")
  }

  const fontIndex = 2;
  const fontName = fonts[fontIndex];
  const fontPath = browser.runtime.getURL(`/font/${fonts[fontIndex]}.ttf` as any)

  const fontRegistry = typeof document !== 'undefined' ? document.fonts : (self as any).fonts;

  if (fontRegistry) {
    const font = new FontFace(fontName, `url(${fontPath})`);
    await font.load();
    fontRegistry.add(font);
  } else {
    console.log("Fuck me...")
  }

  ctx.fillStyle = '#fff0'; // invisible
  ctx.fillRect(0, 0, 64, 64);
  ctx.font = `${fontSizes[fontIndex]}px ${fontName}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = '#111';

  const text = weekNumber.toString();
  const textMetrics = ctx.measureText(text);
  const textOffsetY = (textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent) / 2;
  ctx.fillText(text, 32, 32 + textOffsetY);
  browser.action.setIcon({ imageData: ctx.getImageData(0,0,canvas.width,canvas.height) });
}

export default defineBackground(() => {
  console.log('Hello background!', {id: browser.runtime.id});

  console.log("hello")

  setIconAndTitle().then();
  setInterval(setIconAndTitle, 3600000);
  browser.storage.local.onChanged.addListener((e) => {
    setIconAndTitle().then();
  })
});
