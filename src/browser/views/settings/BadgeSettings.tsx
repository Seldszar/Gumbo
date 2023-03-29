import { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import ColorPicker from "~/browser/components/ColorPicker";
import Section from "~/browser/components/Section";
import Switch from "~/browser/components/Switch";

import { useSettingsContext } from "~/browser/pages/settings";

const Wrapper = styled.div``;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const BadgeSettings: FC = () => {
  const { register, settings } = useSettingsContext();

  return (
    <Wrapper>
      <Section>
        <StyledSwitch {...register("badge.enabled")}>{t("inputLabel_showIconBadge")}</StyledSwitch>
      </Section>
      <Section title={t("titleText_backgroundColor")}>
        <ColorPicker {...register("badge.color")} disabled={!settings.badge.enabled} />
      </Section>
    </Wrapper>
  );
};

export default BadgeSettings;
