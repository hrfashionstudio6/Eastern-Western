import test from "node:test";
import assert from "node:assert/strict";
import { cleanSizeChart, parseSizeChart } from "../shared/size-chart.js";

const sheet = [
  ["EASTERN WESTERN", null, null, null, null],
  [null, null, null, null, null],
  ["SHIRT CHART | INCHES", null, null, null, null],
  ["Measurement", "XS", "S", "M", "L"],
  ["Length", 30, 30, 30, 30],
  ["Arm hole", 8.3, 8.8, 9.5, 10.5],
  ["SHALWAR CHART | INCHES", null, null, null, null],
  ["Measurement", "XS", "S", "M", "L"],
  ["Waist-Relax", 26.5, 27, 29, 31],
];

test("reads each chart section with its sizes and measurements", () => {
  assert.deepEqual(parseSizeChart(sheet), { sections: [
    { title: "SHIRT CHART · INCHES", sizes: ["XS", "S", "M", "L"], rows: [["Length", "30", "30", "30", "30"], ["Arm hole", "8.3", "8.8", "9.5", "10.5"]] },
    { title: "SHALWAR CHART · INCHES", sizes: ["XS", "S", "M", "L"], rows: [["Waist-Relax", "26.5", "27", "29", "31"]] },
  ] });
});

test("rejects sheets that are not size charts", () => {
  assert.throws(() => parseSizeChart([["Product name", "Price"], ["Afreen", 6499]]), /size chart/);
});

test("saved charts keep only text cells in the expected shape", () => {
  assert.equal(cleanSizeChart({ sections: "x" }), null);
  assert.deepEqual(cleanSizeChart({ sections: [{ title: "Shirt", sizes: ["S"], rows: [["Length", 30, { bad: 1 }]], extra: true }] }),
    { sections: [{ title: "Shirt", sizes: ["S"], rows: [["Length", "30", "[object Object]"]] }] });
});
