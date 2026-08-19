import { getTranslations } from "next-intl/server";
import { CTASection, FeatureSection } from "./_components";
import { FourthSection, HeroSection, SecondSection, ThirdSection } from "./_components/ImageSlots";

const page = async () => {
  const t = await getTranslations("HelloPage");
  const features = [
    {
      content: {
        title: t("features.intro.title"),
        description: (
          <>
            {t("features.intro.descriptionLine1")} <br className="hidden tablet:block" />
            {t("features.intro.descriptionLine2")}
          </>
        ),
      },
      imageSlot: <HeroSection />,
    },
    {
      content: {
        title: t("features.browse.title"),
        description: t("features.browse.description"),
      },
      variant: "highlight" as const,
      imageSlot: <SecondSection />,
    },
    {
      content: {
        title: t("features.chat.title"),
        description: t("features.chat.description"),
      },
      imageSlot: <ThirdSection />,
    },
    {
      content: {
        title: t("features.alert.title"),
        description: t("features.alert.description"),
      },
      variant: "highlight" as const,
      imageSlot: <FourthSection />,
    },
  ];

  return (
    <section className="flex-col-center h-base">
      {features.map((props) => (
        <FeatureSection key={props.content.title} {...props} />
      ))}

      <CTASection />
    </section>
  );
};

export default page;
