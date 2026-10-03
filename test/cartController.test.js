import test from "node:test";
import assert from "node:assert/strict";
import { resolveCartItems } from "../controllers/cartController.js";

test("resolves only cart items with a positive quantity", async () => {
  const calls = [];
  const items = await resolveCartItems(
    { salad: 2, hidden: 0 },
    async (ids) => {
      calls.push(ids);
      return [{ _id: "salad", name: "Greek salad", price: 12 }];
    },
  );

  assert.deepEqual(calls, [["salad"]]);
  assert.deepEqual(items, [{ _id: "salad", name: "Greek salad", price: 12 }]);
});
