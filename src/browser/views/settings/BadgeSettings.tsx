import { t } from "~/common/helpers";

import { useSettingsContext } from "~/browser/contexts";
import { styled } from "~/browser/styled-system/jsx";

import ColorPicker from "~/browser/components/ColorPicker";
import Section from "~/browser/components/Section";
import Switch from "~/browser/components/Switch";

const StyledSwitch = styled(Switch, {
  base: {
    mb: { base: 3, _last: 0 },
  },
});

export function Component() {
  const { register, settings } = useSettingsContext();

  return (
    <div>
      <Section>
        <StyledSwitch {...register("badge.enabled")}>{t("inputLabel_showIconBadge")}</StyledSwitch>
      </Section>
      <Section title={t("titleText_backgroundColor")}>
        <ColorPicker {...register("badge.color")} disabled={!settings.badge.enabled} />
      </Section>
    </div>
  );
}
