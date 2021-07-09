/* eslint-disable no-console */
import { anyObj } from '@utils/typings';
import { isBrowser } from '@utils/isBrowser';
import { round } from '@utils/math';
import { throttle } from '@utils/throttle';

type CheckFunction = (value?: any) => boolean;
type Id = number | string;

const records: anyObj<{
  values: anyObj;
  ended: boolean;
  timeoutId: number | undefined;
  start: number;
  checkEnd: CheckFunction | false;
  addValue: (value: any) => void;
}> = {};
const throttleLogs: anyObj<{
  log: (value: any) => void;
  lastDep: any;
}> = {};
const watchValues: anyObj<{
  value: any;
  roundPrecision: number;
}> = {};
let watchViewIsInitialized = false;

export function __stopRecord(id: Id) {
  if (import.meta.env.DEV) {
    if (records[id] && !records[id].ended) {
      records[id].ended = true;
      console.table(records[id].values);
    }
  }
}

export function __recordValuesOverTime(
  id: Id,
  value: any,
  limit = 200,
  triggerCondition?: CheckFunction,
  endCondition?: CheckFunction | number,
) {
  if (import.meta.env.DEV) {
    const record = records[id];

    const onStart = () => {
      if (triggerCondition && !triggerCondition(value)) return;

      if (record) clearTimeout(records[id].timeoutId);

      console.log(`Recording ${id} started`);

      records[id] = {
        values: { 0: value },
        ended: false,
        start: Date.now(),
        timeoutId:
          typeof endCondition === 'number'
            ? window.setTimeout(() => __stopRecord(id), endCondition)
            : undefined,
        checkEnd:
          !endCondition || typeof endCondition === 'number'
            ? false
            : endCondition,
        addValue: throttle((newValue) => {
          records[id].values[Date.now() - records[id].start] = newValue;
        }, limit),
      };
    };

    if (record) {
      if (record.ended) {
        onStart();
      } else if (record.checkEnd && record.checkEnd(value)) {
        __stopRecord(id);
      } else {
        record.addValue(value);
      }
    } else {
      onStart();
    }
  }
}

function log(label: Id, value: any) {
  if (typeof value === 'number' || typeof value === 'string') {
    console.warn(`${label}: ${value}`);
  } else {
    console.warn(value);
  }
}

export function __log(
  id: Id,
  value: any,
  dependency = value,
  diffOnly = true,
  throttleLimit = 300,
) {
  if (import.meta.env.DEV) {
    if (throttleLogs[id]) {
      if (diffOnly) {
        if (
          JSON.stringify(throttleLogs[id].lastDep) !==
          JSON.stringify(dependency)
        ) {
          throttleLogs[id].log(value);
          throttleLogs[id].lastDep = dependency;
        }
      } else {
        throttleLogs[id].log(value);
      }
    } else {
      log(id, value);
      throttleLogs[id] = {
        log: throttle((val) => {
          log(id, val);
        }, throttleLimit),
        lastDep: dependency,
      };
    }
  }
}

let watchView = isBrowser ? document.getElementById('debug-watch-view') : null;
let tickerTimeout = -1;

function watchValuesViewTicker() {
  if (!watchView) {
    const style = document.createElement('style');
    const css = `
      #debug-watch-view {
        position: fixed;
        top: 10px;
        left: 10px;
        bottom: 8px;
        max-width: 300px;
        height: min-content;
        max-height: 400px;
        z-index: 10000000000;
        padding: 8px;
        border-radius: 4px;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        overflow-y: auto;
      }

      #debug-watch-view.hide {
        height: 4px;
        width: 4px;
        overflow: hidden;
      }
    `;
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    watchView = document.createElement('div');
    watchView.id = 'debug-watch-view';
    document.body.appendChild(watchView);
    watchView.addEventListener('click', () =>
      watchView!.classList.toggle('hide'),
    );

    watchViewIsInitialized = true;
  }

  const values = Object.entries(watchValues);

  const content = values
    .map(([id, { value, roundPrecision }]) => {
      let showValue = value;

      if (typeof value === 'function') {
        const returnedValue = value();

        showValue =
          typeof returnedValue === 'number'
            ? round(returnedValue, roundPrecision)
            : returnedValue;
      } else if (Array.isArray(value)) {
        showValue = value.join(', ');
      }

      return `${id}: ${showValue}`;
    })
    .join('<br>');

  if (content !== watchView.innerHTML) {
    watchView.innerHTML = content;
  }

  tickerTimeout = window.setTimeout(watchValuesViewTicker, 100);
}

export function __watchValue(id: Id, value: any, roundPrecision = 3) {
  if (import.meta.env.DEV) {
    const name = `${(window as any).__debugScopeStart || ''}${id}`;

    if (watchValues[name] && watchValues[name].value === value) return;

    if (!watchViewIsInitialized) watchValuesViewTicker();

    if (typeof value === 'number') {
      watchValues[name] = {
        value: round(value, roundPrecision),
        roundPrecision,
      };
    } else {
      watchValues[name] = { value, roundPrecision };
    }
  }
}

const numOfCalls: anyObj<number> = {};

export function __setScope(id: any) {
  if (import.meta.env.DEV && id) {
    (window as any).__debugScopeStart = `${id} - `;
  }
}

export function __countCalls(
  id: Id,
  {
    countIf,
    multiplyBy,
  }: { countIf?: () => boolean; multiplyBy?: number } = {},
) {
  if (import.meta.env.DEV) {
    if (!numOfCalls[id]) numOfCalls[id] = 0;

    if (countIf) {
      if (countIf()) {
        numOfCalls[id]++;
      }
    } else {
      numOfCalls[id]++;
    }

    __watchValue(id, multiplyBy ? multiplyBy * numOfCalls[id] : numOfCalls[id]);
  }

  return () => {
    numOfCalls[id] = 0;
  };
}

module.hot?.dispose(() => {
  clearTimeout(tickerTimeout);
});
