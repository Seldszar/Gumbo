import { t } from "~/common/helpers";
import { CustomAction } from "~/common/types";

import { useSettingsContext } from "~/browser/contexts";

import ListManager from "~/browser/components/ListManager";
import Section from "~/browser/components/Section";

import CustomActionForm from "~/browser/components/forms/CustomActionForm";

export function Component() {
  const { register } = useSettingsContext();

  return (
    <Section title={t("titleText_customActions")}>
      <ListManager<CustomAction>
        {...register("dropdownMenu.customActions")}
        getKey={(value) => value.id}
        renderTitle={(value) => value.title}
        renderForm={(props) => <CustomActionForm {...props} />}
      />
    </Section>
  );
}
