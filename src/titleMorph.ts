// Letter-by-letter morph from a clicked nav word into the new page's big title.
// Every letter of the title leaves from its own spot in the word at the same moment and flies its own
// arc to its place in the title, darkening from the nav's red to the title's black on the way.
// They all move in step, so no letter ever trails behind another.

const DURATION_MS = 300;
// Each letter's arc lifts it this far (px) above its straight path at the halfway point.
const ARC_HEIGHTS = [70, 40, 95, 55, 80, 35, 65];
// Each letter tilts this much (deg) mid-flight, alternating sides.
const TILTS = [-10, 8, -6, 11, -8, 6, -11];
const ARC_STEPS = 6;

let cleanupPrevious: (() => void) | null = null;

/**
 * `from` is the clicked word's box. `fromLetters` are its letters' boxes, used as each title
 * letter's starting point when the word spells the title; otherwise letters spread across `from`.
 */
export function morphTitleFrom(from: DOMRect, fromLetters: DOMRect[] = []) {
  cleanupPrevious?.();

  const title = document.querySelector<HTMLElement>('.display-title');
  const textNode = title?.firstChild;
  if (!title || !textNode || textNode.nodeType !== Node.TEXT_NODE) return;

  const text = textNode.textContent ?? '';
  const titleRect = title.getBoundingClientRect();
  const style = getComputedStyle(title);
  const root = getComputedStyle(document.documentElement);
  const accent = root.getPropertyValue('--accent').trim();
  const ink = root.getPropertyValue('--ink').trim();

  // Measure each letter where it really sits (kerning included), then draw copies on top.
  const layer = document.createElement('div');
  layer.className = 'title-morph';
  layer.setAttribute('aria-hidden', 'true');

  const range = document.createRange();
  const letters: Array<{ span: HTMLSpanElement; rect: DOMRect }> = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') continue;
    range.setStart(textNode, i);
    range.setEnd(textNode, i + 1);
    const rect = range.getBoundingClientRect();
    const span = document.createElement('span');
    span.textContent = text[i];
    Object.assign(span.style, {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      fontVariationSettings: style.fontVariationSettings,
      letterSpacing: style.letterSpacing,
    });
    layer.append(span);
    letters.push({ span, rect });
  }
  if (letters.length === 0) return;

  document.body.append(layer);
  title.classList.add('is-morphing');

  const scale = from.height / titleRect.height;
  const matched = fromLetters.length === letters.length;
  const animations = letters.map(({ span, rect }, index) => {
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;
    let startX: number;
    let startY: number;
    if (matched) {
      const own = fromLetters[index];
      startX = own.left + own.width / 2;
      startY = own.top + own.height / 2;
    } else {
      startX = from.left + from.width * ((endX - titleRect.left) / titleRect.width);
      startY = from.top + from.height / 2;
    }
    const arc = ARC_HEIGHTS[index % ARC_HEIGHTS.length];
    const tilt = TILTS[index % TILTS.length];

    // Sample the arc so the letter follows a smooth curve rather than a straight line.
    const keyframes: Keyframe[] = [];
    for (let step = 0; step <= ARC_STEPS; step++) {
      const t = step / ARC_STEPS;
      const x = (startX - endX) * (1 - t);
      const y = (startY - endY) * (1 - t) - arc * Math.sin(Math.PI * t);
      const size = scale + (1 - scale) * t;
      const rotate = tilt * Math.sin(Math.PI * t);
      keyframes.push({
        offset: t,
        transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${size})`,
        ...(step === 0 ? { color: accent } : step === ARC_STEPS ? { color: ink } : {}),
      });
    }
    return span.animate(keyframes, {
      duration: DURATION_MS,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      fill: 'backwards',
    });
  });

  const cleanup = () => {
    animations.forEach((animation) => animation.cancel());
    layer.remove();
    title.classList.remove('is-morphing');
    if (cleanupPrevious === cleanup) cleanupPrevious = null;
  };
  cleanupPrevious = cleanup;
  Promise.all(animations.map((animation) => animation.finished)).then(cleanup, cleanup);
}
