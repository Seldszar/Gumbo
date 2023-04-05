import { IconTrash } from "@tabler/icons-react";
import { concat, map, without } from "lodash-es";
import { FormEventHandler, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "./Button";
import Input from "./Input";

const Form = styled.form`
  ${tw`flex gap-x-3 mb-3`}
`;

const StyledInput = styled(Input)`
  ${tw`flex-1`}
`;

const List = styled.div`
  ${tw`bg-neutral-800 overflow-hidden rounded shadow`}
`;

const Item = styled.div`
  ${tw`border-b border-neutral-900 flex px-4 py-3 last:border-none`}
`;

const ItemValue = styled.div`
  ${tw`flex-1`}
`;

const DeleteButton = styled.button`
  ${tw`flex-none text-red-500 hover:text-red-400`}
`;

const EmptyMessage = styled.div`
  ${tw`bg-black/10 py-5 rounded text-center text-neutral-500 dark:bg-black/25`}
`;

export interface ListManagerProps<T> {
  onChange(value: T[]): void;
  className?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  value: T[];
}

function ListManager(props: ListManagerProps<any>) {
  const [inputText, setInputText] = useState("");

  const handleSubmit: FormEventHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

    props.onChange(concat(props.value, inputText));

    setInputText("");
  };

  return (
    <fieldset className={props.className} disabled={props.disabled}>
      <Form onSubmit={handleSubmit}>
        <StyledInput placeholder={props.placeholder} value={inputText} onChange={setInputText} />
        <Button color="purple">{t("buttonText_add")}</Button>
      </Form>

      {props.value.length > 0 ? (
        <List>
          {map(props.value, (option, index) => (
            <Item key={index}>
              <ItemValue>{option}</ItemValue>
              <DeleteButton onClick={() => props.onChange(without(props.value, option))}>
                <IconTrash size="1.25rem" />
              </DeleteButton>
            </Item>
          ))}
        </List>
      ) : (
        <EmptyMessage>{props.emptyMessage}</EmptyMessage>
      )}
    </fieldset>
  );
}

export default ListManager;
