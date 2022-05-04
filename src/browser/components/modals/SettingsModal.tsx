import { get, set } from "lodash-es";
import React, { FC, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

import { ClickAction, ClickBehavior, LANGUAGE_OPTIONS } from "@/common/constants";

import { useFollowedUsers, useSettings } from "@/browser/helpers/hooks";
import { sendRuntimeMessage } from "@/browser/helpers/runtime";

import Accordion from "../Accordion";
import Button from "../Button";
import CheckboxGrid from "../CheckboxGrid";
import FormField from "../FormField";
import Modal from "../Modal";
import Section from "../Section";
import Select from "../Select";
import Switch from "../Switch";

const StyledAccordion = styled(Accordion)`
  ${tw`mb-3 last:mb-0`}
`;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const ButtonGrid = styled.div`
  ${tw`gap-3 grid grid-cols-2 mt-6`}
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

  const onExportClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(await sendRuntimeMessage("backup"))], {
        type: "application/json",
      })
    );

    const anchor = document.createElement("a");

    anchor.setAttribute("download", `Gumbo-${Date.now()}.json`);
    anchor.setAttribute("href", url);
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const onImportClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const input = document.createElement("input");

    input.addEventListener("change", async () => {
      const file = input.files?.item(0);

      if (file?.type === "application/json") {
        await sendRuntimeMessage("restore", JSON.parse(await file.text()));
      }
    });

    input.setAttribute("type", "file");
    input.click();
  };

  return (
    <Modal isOpen={props.isOpen} title="Settings" onClose={props.onClose}>
      <StyledAccordion title="General">
        <Section>
          <FormField title="Font size">
            <Select
              {...register("general.fontSize")}
              fullWidth
              options={[
                {
                  label: "Smallest",
                  value: "smallest",
                },
                {
                  label: "Small",
                  value: "small",
                },
                {
                  label: "Medium",
                  value: "medium",
                },
                {
                  label: "Large",
                  value: "large",
                },
                {
                  label: "Largest",
                  value: "largest",
                },
              ]}
            />
          </FormField>
          <FormField title="Theme">
            <Select
              {...register("general.theme")}
              fullWidth
              options={[
                {
                  label: "Dark",
                  value: "dark",
                },
                {
                  label: "Light",
                  value: "light",
                },
              ]}
            />
          </FormField>
          <FormField title="Click Action">
            <Select
              {...register("general.clickAction")}
              fullWidth
              options={[
                {
                  label: "Open channel",
                  value: ClickAction.OpenChannel,
                },
                {
                  label: "Open chat",
                  value: ClickAction.OpenChat,
                },
                {
                  label: "Popout",
                  value: ClickAction.Popout,
                },
              ]}
            />
          </FormField>
          <FormField title="Click Behavior">
            <Select
              {...register("general.clickBehavior")}
              fullWidth
              options={[
                {
                  label: "Open in a new tab",
                  value: ClickBehavior.CreateTab,
                },
                {
                  label: "Open in a new window",
                  value: ClickBehavior.CreateWindow,
                },
              ]}
            />
          </FormField>
          <StyledSwitch {...register("general.withBadge")}>Show icon badge</StyledSwitch>
        </Section>
      </StyledAccordion>

      <StyledAccordion title="Notifications">
        <Section>
          <StyledSwitch {...register("notifications.enabled")}>Enable notifications</StyledSwitch>
          <StyledSwitch
            {...register("notifications.gameChangeEnabled")}
            disabled={!settings.notifications.enabled}
          >
            Enable game change notifications
          </StyledSwitch>
          <StyledSwitch
            {...register("notifications.withFilters")}
            disabled={!settings.notifications.enabled}
          >
            Filter notifications by channel
          </StyledSwitch>
        </Section>
        <Section>
          <CheckboxGrid
            {...register("notifications.selectedUsers")}
            disabled={!settings.notifications.enabled || !settings.notifications.withFilters}
            options={followedUsers.map((user) => ({
              title: user.display_name || user.login,
              value: user.id,
            }))}
          />
        </Section>
      </StyledAccordion>

      <StyledAccordion title="Search">
        <Section title="Channels">
          <StyledSwitch {...register("channels.liveOnly")}>Show live channels only</StyledSwitch>
        </Section>
      </StyledAccordion>

      <StyledAccordion title="Streams">
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
      </StyledAccordion>

      <ButtonGrid>
        <Button
          onClick={onImportClick}
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <polyline points="7 9 12 4 17 9" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
          }
        >
          Import Settings
        </Button>
        <Button
          onClick={onExportClick}
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <polyline points="7 11 12 16 17 11" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
          }
        >
          Export Settings
        </Button>
      </ButtonGrid>
    </Modal>
  );
};

export default SettingsModal;
