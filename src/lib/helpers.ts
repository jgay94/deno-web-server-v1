import { sleep } from "@utils/mod.ts";

// Schedule the unload event after a few seconds
export async function triggerUnloadEvent(): Promise<void> {
  await sleep(1000); // Add a delay of 500ms or any other duration that works for you
  console.log("Dispatching unload event");
  const unloadEvent = new Event("unload");
  globalThis.dispatchEvent(unloadEvent);
}
