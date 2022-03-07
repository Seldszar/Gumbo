import { get, set } from "lodash-es";
import React, { FC } from "react";
import { useStateList } from "react-use";
import tw, { styled } from "twin.macro";

import { useFollowedUsers, useSettings } from "@/browser/helpers/hooks";

import { LANGUAGE_OPTIONS } from "@/common/constants";

import CheckboxGrid from "../CheckboxGrid";
import Modal from "../Modal";
import Section from "../Section";
import Switch from "../Switch";

const TabList = styled.div`
  ${tw`bg-gradient-to-b from-transparent to-black/20 flex mb-6 -mt-8 -mx-6 px-4 pt-8`}
`;

interface TabProps {
  isActive?: boolean;
}

const Tab = styled.button<TabProps>`
  ${tw`flex-auto px-4 py-2 rounded-t text-center hover:text-white`}

  ${(props) => props.isActive && tw`(bg-neutral-900 text-purple-500)!`}
`;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

interface SettingsModalProps {
  onClose?(): void;
  isOpen?: boolean;
}

const SettingsModal: FC<SettingsModalProps> = (props) => {
  const [settings, store] = useSettings();
  const [followedUsers] = useFollowedUsers();

  const register = (path: string) => ({
    value: get(settings, path),
    onChange(value: unknown) {
      store.set(set(settings, path, value));
    },
  });

  const pageTabs = [
    {
      title: "Notifications",
      children: (
        <>
          <Section>
            <StyledSwitch {...register("notifications.enabled")}>Enable notifications</StyledSwitch>
            <StyledSwitch {...register("notifications.withFilters")}>
              Filter notifications by channel
            </StyledSwitch>
          </Section>
          <Section>
            <CheckboxGrid
              {...register("notifications.selectedUsers")}
              disabled={!settings.notifications.withFilters}
              options={followedUsers.map((user) => ({
                title: user.display_name || user.login,
                value: user.id,
              }))}
            />
          </Section>
        </>
      ),
    },
    {
      title: "Search",
      children: (
        <Section title="Channels">
          <Switch {...register("channels.liveOnly")}>Show live channels only</Switch>
        </Section>
      ),
    },
    {
      title: "Streams",
      children: (
        <>
          <Section>
            <StyledSwitch {...register("streams.withReruns")}>
              Show Reruns in followed streams
            </StyledSwitch>
            <StyledSwitch {...register("streams.withFilters")}>
              Filter streams by language
            </StyledSwitch>
          </Section>
          <Section>
            <CheckboxGrid
              {...register("streams.selectedLanguages")}
              disabled={!settings.streams.withFilters}
              options={LANGUAGE_OPTIONS}
            />
          </Section>
        </>
      ),
    },
  ];

  const { currentIndex, state, setStateAt } = useStateList(pageTabs);

  return (
    <Modal isOpen={props.isOpen} title="Settings" onClose={props.onClose}>
      <TabList>
        {pageTabs.map((pageTab, index) => (
          <Tab key={index} isActive={currentIndex === index} onClick={() => setStateAt(index)}>
            {pageTab.title}
          </Tab>
        ))}
      </TabList>

      {state.children}
    </Modal>
  );
};

export default SettingsModal;
