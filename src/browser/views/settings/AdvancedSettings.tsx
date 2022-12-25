import React, { FC, MouseEventHandler, useState } from "react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";

import Section from "~/browser/components/Section";
import Button from "~/browser/components/Button";

import ResetModal from "~/browser/components/modals/ResetModal";

const Wrapper = styled.div``;

const ButtonGroup = styled.div`
  ${tw`gap-3 grid`}
`;

const AdvancedSettings: FC = () => {
  const [isResetModalOpen, setResetModalOpen] = useState(false);

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

  const onResetConfirm: MouseEventHandler<HTMLButtonElement> = async () => {
    await sendRuntimeMessage("reset");

    close();
  };

  return (
    <Wrapper>
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
        <ButtonGroup>
          <Button
            onClick={() => browser.runtime.reload()}
            fullWidth
            icon={
              <svg viewBox="0 0 24 24">
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            }
          >
            {t("buttonText_reloadExtension")}
          </Button>
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
        </ButtonGroup>
      </Section>

      <ResetModal
        isOpen={isResetModalOpen}
        onCancel={() => setResetModalOpen(false)}
        onConfirm={onResetConfirm}
      />
    </Wrapper>
  );
};

export default AdvancedSettings;
