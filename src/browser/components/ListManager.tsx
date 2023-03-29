import { concat, map, without } from "lodash-es";
import { FC, FormEventHandler, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "./Button";
import Input from "./Input";

const Wrapper = styled.fieldset``;

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

  svg {
    ${tw`stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
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

const ListManager: FC<ListManagerProps<any>> = (props) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit: FormEventHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();

    props.onChange(concat(props.value, inputText));

    setInputText("");
  };

  return (
    <Wrapper className={props.className} disabled={props.disabled}>
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
                <svg viewBox="0 0 24 24">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </DeleteButton>
            </Item>
          ))}
        </List>
      ) : (
        <EmptyMessage>{props.emptyMessage}</EmptyMessage>
      )}
    </Wrapper>
  );
};

export default ListManager;
