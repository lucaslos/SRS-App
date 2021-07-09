import { sleep } from '@utils/sleep';

const lastCalls: Record<string, null | string> = {};

export async function awaitDebouce(
  scope: string,
  callId: string,
  debounce: number,
) {
  lastCalls[scope] = callId;

  await sleep(debounce);

  if (lastCalls[scope] !== callId) {
    return 'skip';
  }

  return 'continue';
}
