import fs from "node:fs";
import path from "node:path";
import pptxgen from "pptxgenjs";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "발표용.md");
const OUTPUT = path.join(ROOT, "매점_사전주문_제안서.pptx");

const theme = {
  houseGreen: "1E3932",
  starbucksGreen: "006241",
  greenAccent: "00754A",
  greenLight: "D4E9E2",
  neutralWarm: "F2F0EB",
  ceramic: "EDEBE9",
  white: "FFFFFF",
  text: "1F2933",
  textSoft: "5D6B63",
  gold: "CBA258",
};

const fontFace = "Malgun Gothic";

function parseSlides(markdown) {
  const lines = markdown.split(/\r?\n/);
  const slides = [];
  let current = null;

  for (const line of lines) {
    const titleMatch = line.match(/^(\d+)\.\s+\*\*(.+)\*\*/);
    if (titleMatch) {
      current = {
        number: Number(titleMatch[1]),
        title: titleMatch[2].trim(),
        bullets: [],
      };
      slides.push(current);
      continue;
    }

    const bulletMatch = line.match(/^\s*-\s+(.+)/);
    if (bulletMatch && current) {
      current.bullets.push(bulletMatch[1].trim());
    }
  }

  return slides;
}

function addTopBar(slide, slideNumber, slideCount, variant = "light") {
  const isDark = variant === "dark";
  const barColor = isDark ? theme.greenAccent : theme.houseGreen;
  const textColor = isDark ? theme.white : theme.houseGreen;

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.55,
    y: 0.36,
    w: 2.4,
    h: 0.34,
    rectRadius: 0.08,
    fill: { color: isDark ? theme.white : theme.greenLight, transparency: isDark ? 84 : 0 },
    line: { color: isDark ? theme.white : theme.greenLight, transparency: 100 },
  });
  slide.addText("학교 운영 개선 제안", {
    x: 0.75,
    y: 0.43,
    w: 2,
    h: 0.16,
    fontFace,
    fontSize: 8.8,
    bold: true,
    color: textColor,
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: 10.3,
    y: 0.52,
    w: 1.9,
    h: 0.045,
    fill: { color: isDark ? theme.white : theme.ceramic, transparency: isDark ? 40 : 0 },
    line: { color: isDark ? theme.white : theme.ceramic, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 10.3,
    y: 0.52,
    w: 1.9 * (slideNumber / slideCount),
    h: 0.045,
    fill: { color: barColor },
    line: { color: barColor, transparency: 100 },
  });
}

function addFooter(slide, slideNumber, slideCount, variant = "light") {
  const isDark = variant === "dark";
  slide.addText(`매점 사전주문 웹사이트 제안 · ${slideNumber}/${slideCount}`, {
    x: 0.6,
    y: 7.08,
    w: 5.4,
    h: 0.18,
    fontFace,
    fontSize: 8.6,
    color: isDark ? "DDE8E2" : theme.textSoft,
    margin: 0,
  });
}

function addBulletList(slide, bullets, x, y, w, options = {}) {
  const dotColor = options.dotColor ?? theme.greenAccent;
  const textColor = options.textColor ?? theme.text;
  const fontSize = options.fontSize ?? 18;
  const gap = options.gap ?? 0.52;

  bullets.forEach((bullet, index) => {
    const bulletY = y + index * gap;
    slide.addShape(pptx.ShapeType.ellipse, {
      x,
      y: bulletY + 0.11,
      w: 0.11,
      h: 0.11,
      fill: { color: dotColor },
      line: { color: dotColor },
    });
    slide.addText(bullet, {
      x: x + 0.28,
      y: bulletY,
      w,
      h: 0.38,
      fontFace,
      fontSize,
      color: textColor,
      margin: 0,
      fit: "shrink",
      breakLine: false,
    });
  });
}

function addMetricCard(slide, x, y, label, value) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w: 2.45,
    h: 1.28,
    rectRadius: 0.12,
    fill: { color: theme.white },
    line: { color: "E2E8E1", transparency: 0 },
    shadow: { type: "outer", color: "000000", opacity: 0.12, blur: 1, angle: 45, distance: 1 },
  });
  slide.addText(label, {
    x: x + 0.2,
    y: y + 0.22,
    w: 2.05,
    h: 0.2,
    fontFace,
    fontSize: 10.5,
    bold: true,
    color: theme.textSoft,
    margin: 0,
  });
  slide.addText(value, {
    x: x + 0.2,
    y: y + 0.58,
    w: 2.05,
    h: 0.35,
    fontFace,
    fontSize: 19,
    bold: true,
    color: theme.houseGreen,
    margin: 0,
    fit: "shrink",
  });
}

function createOpeningSlide(pptx, item, slideCount) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.houseGreen };
  addTopBar(slide, item.number, slideCount, "dark");

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.68,
    y: 1.15,
    w: 1.35,
    h: 0.34,
    rectRadius: 0.08,
    fill: { color: theme.greenAccent },
    line: { color: theme.greenAccent },
  });
  slide.addText("제안서", {
    x: 0.99,
    y: 1.24,
    w: 0.8,
    h: 0.12,
    fontFace,
    fontSize: 9.5,
    bold: true,
    color: theme.white,
    margin: 0,
  });

  slide.addText("매점 사전주문\n웹사이트 제안", {
    x: 0.65,
    y: 1.75,
    w: 6.7,
    h: 1.55,
    fontFace,
    fontSize: 37,
    bold: true,
    color: theme.white,
    breakLine: false,
    fit: "shrink",
    margin: 0,
  });
  slide.addText("수업 지각과 쉬는시간 혼잡을 줄이기 위한 학교 운영 개선안", {
    x: 0.68,
    y: 3.58,
    w: 6.9,
    h: 0.28,
    fontFace,
    fontSize: 16,
    color: "DDE8E2",
    margin: 0,
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.05,
    y: 1.24,
    w: 3.85,
    h: 4.75,
    rectRadius: 0.18,
    fill: { color: theme.neutralWarm },
    line: { color: theme.neutralWarm },
    shadow: { type: "outer", color: "000000", opacity: 0.18, blur: 2, angle: 45, distance: 2 },
  });
  slide.addText(item.title, {
    x: 8.42,
    y: 1.66,
    w: 3.15,
    h: 0.42,
    fontFace,
    fontSize: 20,
    bold: true,
    color: theme.houseGreen,
    margin: 0,
  });
  addBulletList(slide, item.bullets, 8.45, 2.38, 2.9, {
    fontSize: 14.5,
    gap: 0.64,
    dotColor: theme.greenAccent,
  });

  addFooter(slide, item.number, slideCount, "dark");
}

function createClosingSlide(pptx, item, slideCount) {
  const slide = pptx.addSlide();
  slide.background = { color: theme.houseGreen };
  addTopBar(slide, item.number, slideCount, "dark");

  slide.addText(item.title, {
    x: 0.75,
    y: 1.24,
    w: 5.8,
    h: 0.62,
    fontFace,
    fontSize: 34,
    bold: true,
    color: theme.white,
    margin: 0,
  });
  slide.addText("제한된 범위의 시범 운영으로 효과와 리스크를 검증한 뒤 확대 여부를 판단합니다.", {
    x: 0.78,
    y: 2.08,
    w: 7.2,
    h: 0.32,
    fontFace,
    fontSize: 15,
    color: "DDE8E2",
    margin: 0,
  });

  item.bullets.forEach((bullet, index) => {
    const y = 3 + index * 0.75;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.78,
      y,
      w: 9.2,
      h: 0.54,
      rectRadius: 0.1,
      fill: { color: theme.white, transparency: 90 },
      line: { color: theme.white, transparency: 100 },
    });
    slide.addText(`${index + 1}`, {
      x: 1.02,
      y: y + 0.14,
      w: 0.26,
      h: 0.16,
      fontFace,
      fontSize: 10,
      bold: true,
      color: theme.gold,
      margin: 0,
    });
    slide.addText(bullet, {
      x: 1.45,
      y: y + 0.11,
      w: 8,
      h: 0.22,
      fontFace,
      fontSize: 16,
      color: theme.white,
      margin: 0,
      fit: "shrink",
    });
  });

  addFooter(slide, item.number, slideCount, "dark");
}

function createContentSlide(pptx, item, slideCount) {
  const slide = pptx.addSlide();
  slide.background = { color: item.number % 2 === 0 ? theme.neutralWarm : theme.ceramic };
  addTopBar(slide, item.number, slideCount);

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 1.08,
    w: 11.95,
    h: 5.65,
    rectRadius: 0.18,
    fill: { color: theme.white },
    line: { color: "E5E7E2" },
    shadow: { type: "outer", color: "000000", opacity: 0.1, blur: 1, angle: 45, distance: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 1.08,
    w: 0.18,
    h: 5.65,
    fill: { color: item.number >= 9 ? theme.houseGreen : theme.greenAccent },
    line: { color: item.number >= 9 ? theme.houseGreen : theme.greenAccent, transparency: 100 },
  });

  slide.addText(String(item.number).padStart(2, "0"), {
    x: 1.05,
    y: 1.42,
    w: 0.65,
    h: 0.28,
    fontFace,
    fontSize: 14,
    bold: true,
    color: theme.greenAccent,
    margin: 0,
  });
  slide.addText(item.title, {
    x: 1.03,
    y: 1.82,
    w: 4.4,
    h: 0.52,
    fontFace,
    fontSize: 28,
    bold: true,
    color: theme.houseGreen,
    margin: 0,
    fit: "shrink",
  });

  const summaryText = makeSummaryText(item);
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.03,
    y: 2.66,
    w: 3.85,
    h: 2.48,
    rectRadius: 0.14,
    fill: { color: theme.greenLight },
    line: { color: theme.greenLight },
  });
  slide.addText(summaryText, {
    x: 1.32,
    y: 3.02,
    w: 3.25,
    h: 1.55,
    fontFace,
    fontSize: 16.5,
    bold: true,
    color: theme.houseGreen,
    valign: "mid",
    fit: "shrink",
    margin: 0,
  });

  addBulletList(slide, item.bullets, 5.7, 1.78, 5.9, {
    fontSize: item.bullets.length >= 5 ? 15.2 : 16.5,
    gap: item.bullets.length >= 5 ? 0.68 : 0.78,
  });

  addFooter(slide, item.number, slideCount);
}

function makeSummaryText(item) {
  const summaries = {
    2: "운영 문제는 단순한 학생 편의 문제가 아니라 수업 시작과 안전관리의 문제입니다.",
    3: "현장 집중형 매점 이용 절차를 사전 처리 구조로 분산해야 합니다.",
    4: "주문과 준비를 먼저 처리하고, 현장에서는 결제와 수령만 남깁니다.",
    5: "역할을 명확히 나누면 책임 범위와 운영 흐름이 단순해집니다.",
    6: "학생 화면은 주문 기능만 제공하여 사용 흐름을 단순화합니다.",
    7: "매점주인은 시간순 주문 목록을 기준으로 준비 효율을 높입니다.",
    8: "교사는 주문 가능 시간과 반별 현황을 관리합니다.",
    9: "주소와 권한을 분리해 학생에게 관리자 기능이 노출되지 않게 합니다.",
    10: "최소 정보 표시와 권한 제한을 기본 원칙으로 삼습니다.",
    11: "초기 버전은 복잡한 결제·재고보다 운영 안정성에 집중합니다.",
    12: "측정 가능한 효과는 시간 절감, 지각 감소, 혼잡 완화입니다.",
    13: "시범 운영으로 효과를 검증한 뒤 확대 여부를 결정합니다.",
    14: "도입 전 기준을 정해야 운영 혼선을 줄일 수 있습니다.",
  };
  return summaries[item.number] ?? item.bullets[0] ?? "";
}

const markdown = fs.readFileSync(SOURCE, "utf8");
const slides = parseSlides(markdown);

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "px-list";
pptx.company = "School Canteen Preorder";
pptx.subject = "매점 사전주문 웹사이트 제안";
pptx.title = "매점 사전주문 웹사이트 제안";
pptx.lang = "ko-KR";
pptx.theme = {
  headFontFace: fontFace,
  bodyFontFace: fontFace,
  lang: "ko-KR",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "LAYOUT_WIDE";

slides.forEach((item) => {
  if (item.number === 1) {
    createOpeningSlide(pptx, item, slides.length);
    return;
  }
  if (item.number === slides.length) {
    createClosingSlide(pptx, item, slides.length);
    return;
  }
  createContentSlide(pptx, item, slides.length);
});

await pptx.writeFile({ fileName: OUTPUT });
console.log(`Created ${OUTPUT}`);
