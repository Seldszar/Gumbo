import { IconInfoCircle } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { t, template } from "~/common/helpers";
import { CustomAction } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

import PlaceholderTooltip from "../tooltips/PlaceholderTooltip";

import Button from "../Button";
import FormField from "../FormField";
import Input from "../Input";

const ActionList = styled("div", {
  base: {
    display: "flex",
    gap: 2,
    justifyContent: "end",
  },
});

export interface CustomActionFormProps {
  value?: CustomAction;

  onSubmit(value: CustomAction): void;
  onCancel(): void;
}

function CustomActionForm(props: CustomActionFormProps) {
  const [value, setValue] = useState<CustomAction>(
    props.value ?? { id: crypto.randomUUID(), title: "", url: "" },
  );

  const exampleUrl = useMemo(
    () => template(value.url, { "{login}": "gumbo", "{id}": "42069" }),
    [value.url],
  );

  const isFormValid = useMemo(() => {
    if (value.title.length === 0) {
      return false;
    }

    if (value.url.length === 0) {
      return false;
    }

    return true;
  }, [value]);

  return (
    <form onSubmit={(event) => (event.preventDefault(), props.onSubmit(value))}>
      <FormField title="Title">
        <Input value={value.title} onChange={(title) => setValue({ ...value, title })} />
      </FormField>
      <FormField title="URL" helpText={t("helpText_customAction_url", exampleUrl)}>
        <Input
          value={value.url}
          onChange={(url) => setValue({ ...value, url })}
          rightOrnament={
            <PlaceholderTooltip
              placeholders={[
                {
                  label: t("titleText_channelId"),
                  value: "{id}",
                },
                {
                  label: t("titleText_channelLogin"),
                  value: "{login}",
                },
              ]}
            >
              <IconInfoCircle size="1.25rem" />
            </PlaceholderTooltip>
          }
        />
      </FormField>
      <ActionList>
        <Button type="button" color="transparent" onClick={() => props.onCancel()}>
          {t("buttonText_cancel")}
        </Button>
        <Button color="purple" disabled={!isFormValid}>
          {t("buttonText_submit")}
        </Button>
      </ActionList>
    </form>
  );
}

export default CustomActionForm;
