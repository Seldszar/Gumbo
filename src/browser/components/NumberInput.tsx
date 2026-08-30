import Input, { InputProps } from "./Input";

export interface NumberInputProps extends Omit<InputProps, "onChange"> {
  min?: number;
  max?: number;

  onChange?(value: number): void;
}

function NumberInput(props: NumberInputProps) {
  const onChangeEvent = (value: string) => {
    let parsedValue = Number.parseFloat(value);

    if (Number.isFinite(parsedValue)) {
      if (typeof props.min === "number") {
        parsedValue = Math.max(parsedValue, props.min);
      }

      if (typeof props.max === "number") {
        parsedValue = Math.min(parsedValue, props.max);
      }

      props.onChange?.(parsedValue);
    }
  };

  return <Input {...props} type="number" value={props.value} onChange={onChangeEvent} />;
}

export default NumberInput;
