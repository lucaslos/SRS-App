import iconsSet from 'data/icons.ts';
import * as React from 'react';
import { colorPrimary } from 'style/theme';

type JsonIcon = {
  viewBox: string;
  paths?: anyObject[];
  rects?: anyObject[];
  colors?: anyObject[];
};

type Icon = {
  name: keyof typeof iconsSet;
  color?: string;
  size?: number;
};

const Icon = ({ name, color = colorPrimary, size = 32 }: Icon) => {
  if (!iconsSet[name]) throw new Error(`Icon ${name} do not exists`);

  const { viewBox, paths, rects, colors }: JsonIcon = iconsSet[name];

  return (
    <svg
      css={{
        height: size,
        width: size,
        fill: color,
      }}
      className="icon"
      viewBox={viewBox}
    >
      {paths &&
        paths.map((pathElem, i) => (
          <path
            key={i}
            d={pathElem.d}
            opacity={pathElem.opacity}
            fillRule={pathElem.evenodd ? 'evenodd' : undefined}
            clipRule={pathElem.evenodd ? 'evenodd' : undefined}
          />
        ))}
      {/* {rects && rects.map(rectElem => <rect />)} */}
    </svg>
  );
};

export default Icon;
