import { xor } from "lodash-es";
import { useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { MenuItem } from "~/common/types";

import Button from "../Button";
import FormField from "../FormField";
import Input from "../Input";
import Checkbox from "../Checkbox";

const Contexts = styled.div`
  ${tw`flex flex-wrap gap-8`}
`;

const ActionList = styled.div`
  ${tw`flex gap-2 justify-end`}
`;

export interface ContextActionFormProps {
  value?: MenuItem;

  onSubmit(value: MenuItem): void;
  onCancel(): void;
}

function ContextActionForm(props: ContextActionFormProps) {
  const [value, setValue] = useState<MenuItem>(
    props.value ?? {
      id: crypto.randomUUID(),
      contexts: [],
      title: "",
      url: "",
    }
  );

  return (
    <>
      <FormField title="Title">
        <Input value={value.title} onChange={(title) => setValue({ ...value, title })} />
      </FormField>
      <FormField title="URL">
        <Input value={value.url} onChange={(url) => setValue({ ...value, url })} />
      </FormField>
      <FormField title="Contexts">
        <Contexts>
          <Checkbox
            value={value.contexts.includes("channel")}
            onChange={() =>
              setValue((value) => ({ ...value, contexts: xor(value.contexts, ["channel"]) }))
            }
          >
            Channel
          </Checkbox>
          <Checkbox
            value={value.contexts.includes("stream")}
            onChange={() =>
              setValue((value) => ({ ...value, contexts: xor(value.contexts, ["stream"]) }))
            }
          >
            Stream
          </Checkbox>
          <Checkbox
            value={value.contexts.includes("user")}
            onChange={() =>
              setValue((value) => ({ ...value, contexts: xor(value.contexts, ["user"]) }))
            }
          >
            User
          </Checkbox>
        </Contexts>
      </FormField>
      <ActionList>
        <Button color="transparent" onClick={() => props.onCancel()}>
          {t("buttonText_cancel")}
        </Button>
        <Button
          color="purple"
          disabled={!value.title.length || !value.url.length || !value.contexts.length}
          onClick={() => props.onSubmit(value)}
        >
          {t("buttonText_submit")}
        </Button>
      </ActionList>
    </>
  );
}

export default ContextActionForm;
