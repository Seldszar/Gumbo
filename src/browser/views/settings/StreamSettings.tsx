import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import { useFollowedUsers } from "@/browser/helpers/hooks";

import ChannelName from "@/browser/components/ChannelName";
import CheckboxGrid from "@/browser/components/CheckboxGrid";
import Section from "@/browser/components/Section";
import Switch from "@/browser/components/Switch";

import { useSettingsContext } from "@/browser/pages/settings";

const Wrapper = styled.div``;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const StreamSettings: FC = () => {
  const { register, settings } = useSettingsContext();

  const [followedUsers] = useFollowedUsers();

  return (
    <Wrapper>
      <Section>
        <StyledSwitch {...register("notifications.enabled")}>
          {t("inputLabel_enableNotifications")}
        </StyledSwitch>
        <StyledSwitch
          {...register("notifications.withCategoryChanges")}
          disabled={!settings.notifications.enabled}
        >
          {t("inputLabel_categoryChangeNotifications")}
        </StyledSwitch>
        <StyledSwitch
          {...register("notifications.withFilters")}
          disabled={!settings.notifications.enabled}
        >
          {t("inputLabel_filterNotificationsByChannel")}
        </StyledSwitch>
      </Section>
      <Section>
        <CheckboxGrid
          {...register("notifications.selectedUsers")}
          disabled={!settings.notifications.enabled || !settings.notifications.withFilters}
          options={followedUsers.map((user) => ({
            title: <ChannelName login={user.login} name={user.display_name} />,
            value: user.id,
          }))}
        />
      </Section>
    </Wrapper>
  );
};

export default StreamSettings;
