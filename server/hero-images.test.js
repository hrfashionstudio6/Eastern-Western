import test from "node:test";
import assert from "node:assert/strict";
import { compactHeroSlides } from "../shared/hero-images.js";

test("saving and reloading preserves separate desktop and mobile hero assets", () => {
  const slides = [{ label: "Summer", image: "/desktop.webp", mobileImage: "/mobile.webp" }];
  const saved = JSON.parse(JSON.stringify(compactHeroSlides(slides)));
  assert.deepEqual(saved, slides);
  assert.equal(slides[0].image, "/desktop.webp");
});

test("legacy slides remain compatible and mobile-only slides are retained", () => {
  assert.deepEqual(compactHeroSlides([{ label: " Everyday ", image: " /desktop.webp " }]), [
    { label: "Everyday", image: "/desktop.webp", mobileImage: "" },
  ]);
  assert.deepEqual(compactHeroSlides([{ label: "", image: "", mobileImage: "/mobile.webp" }, {}]), [
    { label: "", image: "", mobileImage: "/mobile.webp" },
  ]);
});

test("removing one device image leaves the other device image intact", () => {
  const slides = [{ label: "First", image: "/wide.webp", mobileImage: "" }, { label: "Second", image: "", mobileImage: "/portrait.webp" }];
  assert.deepEqual(compactHeroSlides(slides), slides);
});
