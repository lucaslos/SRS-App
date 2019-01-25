import iconsSet from 'data/icons.json';
import * as React from 'react';

interface Icon {
  name: string;
  color?: string;
  size?: number;
}

const Icon = ({ name, color = '#fff', size = 32 }: Icon) => {
  if (!iconsSet[name]) throw new Error(`Icon ${name} do not exists`);

  const { viewBox, paths, rects, colors } = iconsSet[name];

  return (
    <svg
      css={{
        height: size,
        width: size,
        fill: color,
      }}
      // className="icon"
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
        ))
      }
      {rects &&
        rects.map(rectElem => (
          <rect />
        ))
      }
    </svg>
  );
};

export default Icon;
