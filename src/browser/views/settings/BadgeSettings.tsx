import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useSettingsContext } from "~/browser/contexts";

import ColorPicker from "~/browser/components/ColorPicker";
import Section from "~/browser/components/Section";
import Switch from "~/browser/components/Switch";

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

function BadgeSettings() {
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

export default BadgeSettings;
