/** this is a more legible way to create [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), also a alternative to do expressions https://github.com/tc39/proposal-do-expressions while they are not implemented */
export function iife<T>(callback: () => T): T {
  return callback();
}
