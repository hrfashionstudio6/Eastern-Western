export function compactHeroSlides(slides = []) {
  return slides.map(slide => ({
    label: String(slide?.label || "").trim(),
    image: String(slide?.image || "").trim(),
    mobileImage: String(slide?.mobileImage || "").trim(),
  })).filter(slide => slide.label || slide.image || slide.mobileImage);
}
