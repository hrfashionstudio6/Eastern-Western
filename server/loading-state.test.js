import test from "node:test";
import assert from "node:assert/strict";
import { withLoading, loadingMessage, subscribeLoading } from "../src/loading-state.js";

test("loading spans the action, prevents duplicate submissions and clears on success", async () => {
  const updates = [];
  const stop = subscribeLoading(() => updates.push(loadingMessage()));
  let finish;
  const pending = withLoading("Adding product…", () => new Promise((resolve) => { finish = resolve; }));
  assert.equal(loadingMessage(), "Adding product…");
  let duplicate = false;
  await withLoading("Adding product…", () => { duplicate = true; });
  assert.equal(duplicate, false);
  finish(42);
  assert.equal(await pending, 42);
  assert.equal(loadingMessage(), "");
  assert.deepEqual(updates, ["Adding product…", ""]);
  stop();
});

test("failed operations clear the popup and allow retry", async () => {
  await assert.rejects(withLoading("Placing your order…", async () => { throw new Error("Offline"); }), /Offline/);
  assert.equal(loadingMessage(), "");
  assert.equal(await withLoading("Retrying…", async () => "saved"), "saved");
});

