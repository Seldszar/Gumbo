import tw, { styled } from "twin.macro";

import { LANGUAGE_OPTIONS } from "~/common/constants";
import { t } from "~/common/helpers";

import { useSettingsContext } from "~/browser/contexts";

import CheckboxGrid from "~/browser/components/CheckboxGrid";
import Section from "~/browser/components/Section";
import Switch from "~/browser/components/Switch";

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

export function Component() {
  const { register, settings } = useSettingsContext();

  return (
    <div>
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
    </div>
  );
}
