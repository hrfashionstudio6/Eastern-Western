export default function HeroImage({ image, mobileImage = "", alt = "" }) {
  const desktop = image || mobileImage;
  if (!desktop) return null;
  return <picture className={"responsive-hero-media" + (mobileImage ? " has-mobile-banner" : "")}>
    {mobileImage && <source media="(max-width: 760px)" srcSet={mobileImage} />}
    <img src={desktop} alt={alt} />
  </picture>;
}
