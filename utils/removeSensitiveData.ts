function getType(value: any) {
  return value === null ? 'null' : typeof value;
}

export function removeSensitiveData(obj: any, maxDepth = 4) {
  const cleanData: Record<string, any> = {};

  const objType = getType(obj);

  if (objType !== 'object') {
    if (obj === '') return 'empty string';

    return objType;
  }

  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return Array.isArray(obj) ? '[]' : '{}';
  }

  if (Array.isArray(obj)) {
    return `array of: ${obj
      .reduce((acc, val) => {
        let valueType = val === null ? 'null' : typeof val;

        valueType =
          valueType === 'object'
            ? JSON.stringify(removeSensitiveData(val, maxDepth - 1))
            : valueType;

        if (!acc.includes(valueType)) {
          return [...acc, valueType];
        }

        return acc;
      }, [])
      .join(' | ')}`;
  }

  if (maxDepth < 1) {
    return `any ${objType}`;
  }

  entries.forEach(([key, value]) => {
    const valueType = getType(value);

    cleanData[key] =
      valueType === 'object'
        ? removeSensitiveData(value, maxDepth - 1)
        : valueType;
  });

  return cleanData;
}
