
declare module 'data/icons.json' {
  const set: {
    [index: string]: {
      viewBox: string;
      paths?: genericObject[],
      rects?: genericObject[],
      colors?: genericObject[],
    };
  };

  export default set;
}
