import { CTASection, FeatureSection } from "./_components";
import { FEATURES } from "./_components/FEATURES_CONST";

const page = () => {
  return (
    <section className="flex-col-center h-base">
      {FEATURES.map((props, index) => (
        <FeatureSection key={index} {...props} />
      ))}

      <CTASection />
    </section>
  );
};

export default page;
