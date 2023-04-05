import { FC } from "react";
import tw, { styled } from "twin.macro";

import { LANGUAGE_OPTIONS } from "~/common/constants";
import { t } from "~/common/helpers";

import { useSettingsContext } from "~/browser/contexts";

import CheckboxGrid from "~/browser/components/CheckboxGrid";
import Section from "~/browser/components/Section";
import Switch from "~/browser/components/Switch";

const Wrapper = styled.div``;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const StreamSettings: FC = () => {
  const { register, settings } = useSettingsContext();

  return (
    <Wrapper>
      <Section>
        <StyledSwitch {...register("streams.withReruns")}>
          {t("inputLabel_showRerunsInFollowedStreams")}
        </StyledSwitch>
        <StyledSwitch {...register("streams.withFilters")}>
          {t("inputLabel_filterStreamsByLanguage")}
        </StyledSwitch>
      </Section>
      <Section>
        <CheckboxGrid
          {...register("streams.selectedLanguages")}
          disabled={!settings.streams.withFilters}
          options={LANGUAGE_OPTIONS}
        />
      </Section>
    </Wrapper>
  );
};

export default StreamSettings;
