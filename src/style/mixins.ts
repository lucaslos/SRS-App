import css from "@emotion/css";

export function rectSize(size: number) {
  return css`
    width: ${size}px;
    height: ${size}px;
  `
}

export function circle(size: number) {
  return css`
    width: ${size}px;
    height: ${size}px;
    border-radius: ${size}px;
  `
}
