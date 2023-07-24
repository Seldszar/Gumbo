import { useMemo, useState } from "react";
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

  const isFormValid = useMemo(() => {
    if (value.length === 0) {
      return false;
    }

    return true;
  }, [value]);

  return (
    <form onSubmit={(event) => (event.preventDefault(), props.onSubmit(value))}>
      <FormField>
        <Input value={value} onChange={setValue} />
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

export default IgnoredCategoryForm;
