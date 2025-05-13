import { ReactElement } from "react";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import Tooltip from "../Tooltip";

const Title = styled("div", {
  base: {
    mb: 2,
  },
});

const Table = styled("table", {
  base: {
    fontSize: "sm",

    "& td": {
      fontFamily: { _firstOfType: "mono" },
      pl: { _lastOfType: 4 },
    },
  },
});

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
    <div>
      <Title>{t("inputLabel_availablePlaceholders")}</Title>
      <Table>
        {placeholders.map((placeholder, index) => (
          <tr key={index}>
            <td>{placeholder.value}</td>
            <td>{placeholder.label}</td>
          </tr>
        ))}
      </Table>
    </div>
  );

  return <Tooltip title={content}>{props.children}</Tooltip>;
}

export default PlaceholderTooltip;
