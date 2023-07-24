import { ReactElement } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Tooltip from "../Tooltip";

const Wrapper = styled.div``;

const Title = styled.div`
  ${tw`mb-2`}
`;

const Table = styled.table`
  ${tw`text-sm`}

  td {
    ${tw`first-of-type:font-mono last-of-type:pl-4`}
  }
`;

export interface Placeholder {
  value: string;
  label: string;
}

export interface PlaceholderTooltipProps {
  placeholders: Placeholder[];
  children: ReactElement;
}

function PlaceholderTooltip(props: PlaceholderTooltipProps) {
  const { placeholders } = props;

  const content = (
    <Wrapper>
      <Title>{t("inputLabel_availablePlaceholders")}</Title>
      <Table>
        {placeholders.map((placeholder, index) => (
          <tr key={index}>
            <td>{placeholder.value}</td>
            <td>{placeholder.label}</td>
          </tr>
        ))}
      </Table>
    </Wrapper>
  );

  return <Tooltip content={content}>{props.children}</Tooltip>;
}

export default PlaceholderTooltip;
