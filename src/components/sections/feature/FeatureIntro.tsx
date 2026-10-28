import { useTranslation } from "react-i18next";

export const FeatureIntro = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-md:max-w-[420px] max-md:mb-10 md:px-6 text-center">
      <h2 className="text-[clamp(28px,7.8vw,42px)] md:text-[clamp(32px,5.62vw,108px)] font-light uppercase tracking-tight leading-[1.04] md:leading-[0.98] text-balance">
        {t("features.headingLine1")}
        <br />
        <span>{t("features.headingLine2")}</span>
      </h2>
      <p className="mt-4 md:mt-11 text-[clamp(15px,3.8vw,18px)] md:text-[clamp(20px,1.72vw,33px)] max-md:opacity-80 font-normal tracking-normal">
        {t("features.subtitle")}
      </p>
    </div>
  );
};

export default FeatureIntro;
