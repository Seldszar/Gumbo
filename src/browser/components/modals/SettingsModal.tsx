import { get, set } from "lodash-es";
import React, { FC, MouseEventHandler, useState } from "react";
import tw, { styled } from "twin.macro";

import { ClickAction, ClickBehavior, LANGUAGE_OPTIONS } from "@/common/constants";
import { sendRuntimeMessage, t } from "@/common/helpers";

import { useFollowedUsers, useSettings } from "@/browser/helpers/hooks";

import Accordion from "../Accordion";
import Button from "../Button";
import CheckboxGrid from "../CheckboxGrid";
import ColorSelect from "../ColorSelect";
import FormField from "../FormField";
import Modal from "../Modal";
import Panel from "../Panel";
import Section from "../Section";
import Select from "../Select";
import Switch from "../Switch";

import ResetModal from "./ResetModal";

const StyledAccordion = styled(Accordion)`
  ${tw`mb-3 last:mb-0`}
`;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const ButtonGroup = styled.div`
  ${tw`gap-3 grid`}
`;

interface SettingsModalProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  isOpen?: boolean;
}

const SettingsModal: FC<SettingsModalProps> = (props) => {
  const [isResetModalOpen, setResetModalOpen] = useState(false);

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
    <Modal isOpen={props.isOpen}>
      <Panel title={t("titleText_settings")} onClose={props.onClose}>
        <StyledAccordion title={t("titleText_general")}>
          <Section>
            <FormField title={t("optionTitle_fontSize")}>
              <Select
                {...register("general.fontSize")}
                fullWidth
                options={[
                  {
                    label: t("optionValue_fontSize_smallest"),
                    value: "smallest",
                  },
                  {
                    label: t("optionValue_fontSize_small"),
                    value: "small",
                  },
                  {
                    label: t("optionValue_fontSize_medium"),
                    value: "medium",
                  },
                  {
                    label: t("optionValue_fontSize_large"),
                    value: "large",
                  },
                  {
                    label: t("optionValue_fontSize_largest"),
                    value: "largest",
                  },
                ]}
              />
            </FormField>
            <FormField title={t("optionTitle_theme")}>
              <Select
                {...register("general.theme")}
                fullWidth
                options={[
                  {
                    label: t("optionValue_theme_dark"),
                    value: "dark",
                  },
                  {
                    label: t("optionValue_theme_light"),
                    value: "light",
                  },
                ]}
              />
            </FormField>
            <FormField title={t("optionTitle_clickAction")}>
              <Select
                {...register("general.clickAction")}
                fullWidth
                options={[
                  {
                    label: t("optionValue_openChannel"),
                    value: ClickAction.OpenChannel,
                  },
                  {
                    label: t("optionValue_openChat"),
                    value: ClickAction.OpenChat,
                  },
                  {
                    label: t("optionValue_popout"),
                    value: ClickAction.Popout,
                  },
                ]}
              />
            </FormField>
            <FormField title={t("optionTitle_clickBehavior")}>
              <Select
                {...register("general.clickBehavior")}
                fullWidth
                options={[
                  {
                    label: t("optionValue_clickBehavior_createTab"),
                    value: ClickBehavior.CreateTab,
                  },
                  {
                    label: t("optionValue_clickBehavior_createWindow"),
                    value: ClickBehavior.CreateWindow,
                  },
                ]}
              />
            </FormField>
            <StyledSwitch {...register("badge.enabled")}>
              {t("inputLabel_showIconBadge")}
            </StyledSwitch>
            <ColorSelect {...register("badge.color")} disabled={!settings.badge.enabled} />
          </Section>
        </StyledAccordion>

        <StyledAccordion title={t("titleText_notifications")}>
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
                title: user.display_name || user.login,
                value: user.id,
              }))}
            />
          </Section>
        </StyledAccordion>

        <StyledAccordion title={t("titleText_search")}>
          <Section title={t("titleText_channels")}>
            <StyledSwitch {...register("channels.liveOnly")}>
              {t("inputLabel_showLiveChannelsOnly")}
            </StyledSwitch>
          </Section>
        </StyledAccordion>

        <StyledAccordion title={t("titleText_streams")}>
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
        </StyledAccordion>

        <StyledAccordion title={t("titleText_advanced")}>
          <Section title={t("titleText_settingsManagement")}>
            <ButtonGroup>
              <Button
                onClick={onImportClick}
                fullWidth
                icon={
                  <svg viewBox="0 0 24 24">
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                    <polyline points="7 9 12 4 17 9" />
                    <line x1="12" y1="4" x2="12" y2="16" />
                  </svg>
                }
              >
                {t("buttonText_importSettings")}
              </Button>
              <Button
                onClick={onExportClick}
                fullWidth
                icon={
                  <svg viewBox="0 0 24 24">
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                    <polyline points="7 11 12 16 17 11" />
                    <line x1="12" y1="4" x2="12" y2="16" />
                  </svg>
                }
              >
                {t("buttonText_exportSettings")}
              </Button>
            </ButtonGroup>
          </Section>
          <Section title={t("titleText_dangerZone")}>
            <Button
              onClick={() => setResetModalOpen(true)}
              color="red"
              fullWidth
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4v.01" />
                  <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                </svg>
              }
            >
              {t("buttonText_resetExtension")}
            </Button>
          </Section>
        </StyledAccordion>
      </Panel>

      <ResetModal
        isOpen={isResetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirm={() => sendRuntimeMessage("reset")}
      />
    </Modal>
  );
};

export default SettingsModal;
