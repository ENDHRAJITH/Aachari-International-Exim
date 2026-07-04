import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import HeroBackground from "./HeroBackground";
 

export default function Hero() {
  return (
  <section
  className="
    relative
    min-h-screen
    overflow-hidden
    px-6
    lg:px-12
    pt-[140px]
    pb-20
  "
>
  <HeroBackground />
  

  <div
    className="
      mx-auto
      max-w-[1320px]
      grid
      items-center
      gap-[60px]
      lg:grid-cols-[1.15fr_1fr]
      relative
      z-10
    "
  >
    <HeroLeft />
    {/* <HeroRight /> */}
  </div>
</section>
  );
}