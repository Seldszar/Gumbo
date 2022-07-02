import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import Section from "@/browser/components/Section";
import Switch from "@/browser/components/Switch";

import { useSettingsContext } from "@/browser/pages/settings";

const Wrapper = styled.div``;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const SearchSettings: FC = () => {
  const { register } = useSettingsContext();

  return (
    <Wrapper>
      <Section title={t("titleText_channels")}>
        <StyledSwitch {...register("channels.liveOnly")}>
          {t("inputLabel_showLiveChannelsOnly")}
        </StyledSwitch>
      </Section>
    </Wrapper>
  );
};

export default SearchSettings;
