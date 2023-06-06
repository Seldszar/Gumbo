import { useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "../Button";
import FormField from "../FormField";
import Input from "../Input";

const ActionList = styled.div`
  ${tw`flex gap-2 justify-end`}
`;

export interface IgnoredCategoryFormProps {
  value?: string;

  onSubmit(value: string): void;
  onCancel(): void;
}

function IgnoredCategoryForm(props: IgnoredCategoryFormProps) {
  const [value, setValue] = useState(props.value ?? "");

  return (
    <>
      <FormField>
        <Input value={value} onChange={setValue} />
      </FormField>
      <ActionList>
        <Button color="transparent" onClick={() => props.onCancel()}>
          {t("buttonText_cancel")}
        </Button>
        <Button color="purple" disabled={!value.length} onClick={() => props.onSubmit(value)}>
          {t("buttonText_submit")}
        </Button>
      </ActionList>
    </>
  );
}

export default IgnoredCategoryForm;
