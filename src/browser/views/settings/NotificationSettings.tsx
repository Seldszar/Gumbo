import { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useFollowedChannels } from "~/browser/helpers/queries";

import ChannelName from "~/browser/components/ChannelName";
import CheckboxGrid from "~/browser/components/CheckboxGrid";
import ListManager from "~/browser/components/ListManager";
import Section from "~/browser/components/Section";
import Switch from "~/browser/components/Switch";

import { useSettingsContext } from "~/browser/pages/settings";

const Wrapper = styled.div``;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const NotificationSettings: FC = () => {
  const { register, settings } = useSettingsContext();

  const { data: followedChannels = [] } = useFollowedChannels();

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
          options={followedChannels.map((follow) => ({
            title: <ChannelName login={follow.broadcasterLogin} name={follow.broadcasterName} />,
            value: follow.broadcasterId,
          }))}
        />
      </Section>
      <Section title={t("titleText_ignoredCategories")}>
        <ListManager
          {...register("notifications.ignoredCategories")}
          placeholder={t("placeholderText_ignoredCategories")}
          emptyMessage={t("errorText_emptyIgnoredCategories")}
        />
      </Section>
    </Wrapper>
  );
};

export default NotificationSettings;
