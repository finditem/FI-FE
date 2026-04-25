import Image, { ImageProps } from "next/image";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <div
      data-testid="intro-section"
      className="relative min-h-[225px] w-full overflow-hidden flex-center"
    >
      <div className="animate-fade-in-float absolute right-[calc(50%+100px)] z-10">
        <HeroSectionImage src="/hello/hero/service-hero-wallet.svg" width={42} height={39} />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="relative flex-center">
          <div className="animate-zoom-in-glass absolute bottom-[5px] right-[70px]">
            <HeroSectionImage src="/hello/hero/service-hero-glass.svg" width={123} height={150} />
          </div>

          <HeroSectionImage
            src="/hello/hero/service-hero-background.svg"
            width={318}
            height={220}
          />
        </div>
      </div>

      <div className="animate-fade-in-float absolute left-[calc(50%+85px)] top-[40px]">
        <HeroSectionImage src="/hello/hero/service-hero-phone.svg" width={54} height={54} />
      </div>

      <div className="animate-fade-in-float absolute left-[calc(50%+95px)] top-[140px]">
        <HeroSectionImage src="/hello/hero/service-hero-bag.svg" width={42} height={42} />
      </div>
    </div>
  );
};

export default HeroSection;

const HeroSectionImage = (props: Omit<ImageProps, "alt">) => {
  return <Image alt="" {...props} draggable={false} className="select-none" priority />;
};
