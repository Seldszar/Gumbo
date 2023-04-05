import { FC } from "react";

import { ClickAction, ClickBehavior } from "~/common/constants";
import { t } from "~/common/helpers";

import { useSettingsContext } from "~/browser/contexts";

import FormField from "~/browser/components/FormField";
import Section from "~/browser/components/Section";
import Select from "~/browser/components/Select";

const GeneralSettings: FC = () => {
  const { register } = useSettingsContext();

  return (
    <div>
      <Section>
        <FormField title={t("optionTitle_fontSize")}>
          <Select
            {...register("general.fontSize")}
            fullWidth
            options={[
              {
                label: t("optionValue_fontSize_smallest"),
                value: "smallest",
              },
              {
                label: t("optionValue_fontSize_small"),
                value: "small",
              },
              {
                label: t("optionValue_fontSize_medium"),
                value: "medium",
              },
              {
                label: t("optionValue_fontSize_large"),
                value: "large",
              },
              {
                label: t("optionValue_fontSize_largest"),
                value: "largest",
              },
            ]}
          />
        </FormField>
        <FormField title={t("optionTitle_theme")}>
          <Select
            {...register("general.theme")}
            fullWidth
            options={[
              {
                label: t("optionValue_theme_system"),
                value: "system",
              },
              {
                label: t("optionValue_theme_dark"),
                value: "dark",
              },
              {
                label: t("optionValue_theme_light"),
                value: "light",
              },
            ]}
          />
        </FormField>
        <FormField title={t("optionTitle_clickAction")}>
          <Select
            {...register("general.clickAction")}
            fullWidth
            options={[
              {
                label: t("optionValue_openChannel"),
                value: ClickAction.OpenChannel,
              },
              {
                label: t("optionValue_openChat"),
                value: ClickAction.OpenChat,
              },
              {
                label: t("optionValue_popout"),
                value: ClickAction.Popout,
              },
            ]}
          />
        </FormField>
        <FormField title={t("optionTitle_clickBehavior")}>
          <Select
            {...register("general.clickBehavior")}
            fullWidth
            options={[
              {
                label: t("optionValue_clickBehavior_createTab"),
                value: ClickBehavior.CreateTab,
              },
              {
                label: t("optionValue_clickBehavior_createWindow"),
                value: ClickBehavior.CreateWindow,
              },
              {
                label: t("optionValue_clickBehavior_createCurrentTab"),
                value: ClickBehavior.CreateCurrentTab,
              },
            ]}
          />
        </FormField>
      </Section>
    </div>
  );
};

export default GeneralSettings;
