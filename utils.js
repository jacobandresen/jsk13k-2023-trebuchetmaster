import {
  getContext,
  clamp,
  getWorldRect
} from './kontra.mjs';

export function roundRect(x, y, w, h, r, color) {
  let context = getContext();
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.fill();
}

export function circleRectCollision(circle, rect) {
  let { x, y, width, height } = getWorldRect(rect);

  let dx = circle.x - clamp(x, x + width, circle.x);
  let dy = circle.y - clamp(y, y+ height, circle.y);
  return dx * dx + dy * dy < circle.radius * circle.radius;
}

export function vectorAngle(vector) {
  return Math.atan2(vector.y, vector.x) + Math.PI / 2
}

export function getSideOfCollision(ball, block) {
  let rect = getWorldRect(block);
  let isAboveAC = isOnUpperSideOfLine(
    { x: rect.x + rect.width, y: rect.y + rect.height },
    rect,
    ball
  );
  let isAboveDB = isOnUpperSideOfLine(
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x, y: rect.y + rect.height },
    ball
  );

  if (isAboveAC) {
    if (isAboveDB) {
      return { x: 0, y: -1 };
    }
    else {
      return { x: 1, y: 0 };
    }
  }
  else {
    if (isAboveDB) {
      return { x: -1, y: 0 };
    }
    else {
      return { x: 0, y: 1 };
    }
  }
}

function isOnUpperSideOfLine(corner1, oppositeCorner, ball) {
  return ((oppositeCorner.x - corner1.x) * (ball.y - corner1.y) - (oppositeCorner.y - corner1.y) * (ball.x - corner1.x)) > 0;
}