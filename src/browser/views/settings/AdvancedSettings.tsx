import { IconAlertTriangle, IconDownload, IconRefresh, IconUpload } from "@tabler/icons-react";
import { AnimatePresence } from "framer-motion";
import { MouseEventHandler, useState } from "react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";

import Section from "~/browser/components/Section";
import Button from "~/browser/components/Button";

import ResetModal from "~/browser/components/modals/ResetModal";

const ButtonGroup = styled.div`
  ${tw`gap-3 grid`}
`;

function AdvancedSettings() {
  const [isResetOpen, setResetOpen] = useState(false);

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
    <div>
      <Section title={t("titleText_settingsManagement")}>
        <ButtonGroup>
          <Button
            onClick={onImportClick}
            icon={<IconUpload size="1.5rem" strokeWidth={1.5} />}
            fullWidth
          >
            {t("buttonText_importSettings")}
          </Button>
          <Button
            onClick={onExportClick}
            icon={<IconDownload size="1.5rem" strokeWidth={1.5} />}
            fullWidth
          >
            {t("buttonText_exportSettings")}
          </Button>
        </ButtonGroup>
      </Section>
      <Section title={t("titleText_dangerZone")}>
        <ButtonGroup>
          <Button
            onClick={() => browser.runtime.reload()}
            icon={<IconRefresh size="1.5rem" strokeWidth={1.5} />}
            fullWidth
          >
            {t("buttonText_reloadExtension")}
          </Button>
          <Button
            color="red"
            onClick={() => setResetOpen(true)}
            icon={<IconAlertTriangle size="1.5rem" strokeWidth={1.5} />}
            fullWidth
          >
            {t("buttonText_resetExtension")}
          </Button>
        </ButtonGroup>
      </Section>

      <AnimatePresence initial={false}>
        {isResetOpen && (
          <ResetModal onCancel={() => setResetOpen(false)} onConfirm={onResetConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdvancedSettings;
