import * as React from "react";
import cx from "clsx";
import { scope } from "../lib/utils";

interface RadioGroupContextValue {
  checked: string | null | undefined;
  onChange(value: string): void;
  name: string;
}

interface RadioContextValue {
  id: string;
  value: string;
}

const RadioGroupContext = React.createContext<null | RadioGroupContextValue>(
  null
);

const RadioGroup = ({ children, checked, onChange, name }: RadioGroupProps) => {
  return (
    <RadioGroupContext.Provider value={{ checked, onChange, name }}>
      {children}
    </RadioGroupContext.Provider>
  );
};

const RadioContext = React.createContext<null | RadioContextValue>(null);

const Radio = ({ children, id, value }: RadioProps) => {
  return (
    <RadioContext.Provider value={{ id: String(id), value: String(value) }}>
      {children}
    </RadioContext.Provider>
  );
};

const RadioInput = React.forwardRef<HTMLInputElement>(
  ({ children, className, ...props }: RadioInputProps, forwardedRef) => {
    let { id, value } = useRadioContext("RadioInput");
    let { checked, onChange, name } = useRadioGroupContext("RadioInput");

    return (
      <input
        {...props}
        className={cx(className, scope("radio__input"))}
        type="radio"
        id={id}
        ref={forwardedRef}
        name={name}
        value={value}
        onChange={(event) => {
          props.onChange?.(event);
          if (!event.defaultPrevented) {
            onChange(event.target.value);
          }
        }}
        checked={checked === value}
      >
        {children}
      </input>
    );
  }
);

RadioInput.displayName = "RadioInput";

const RadioLabel = React.forwardRef<HTMLLabelElement>(
  ({ children, className, ...props }: RadioLabelProps, forwardedRef) => {
    let { id } = useRadioContext("RadioLabel");

    return (
      <label
        {...props}
        className={cx(scope("radio__label"), className)}
        htmlFor={id}
        ref={forwardedRef}
      >
        {children}
      </label>
    );
  }
);

RadioLabel.displayName = "RadioLabel";

export { RadioGroup, Radio, RadioInput, RadioLabel };

interface RadioGroupProps {
  children: React.ReactNode;
  checked: string | null | undefined;
  onChange(value: string): void;
  name: string;
}

function useRadioGroupContext(name: string) {
  let ctx = React.useContext(RadioGroupContext);

  if (!ctx) {
    throw Error(
      `A ${name} was rendered outside a RadioGroup component. Wrap he ${name} with a RadioGroup to get rid of this error.`
    );
  }

  return ctx;
}

function useRadioContext(name: string) {
  let ctx = React.useContext(RadioContext);

  if (!ctx) {
    throw Error(
      `A ${name} was rendered outside a RadioGroup component. Wrap he ${name} with a Radio to get rid of this error.`
    );
  }

  return ctx;
}

interface RadioProps {
  children: React.ReactNode;
  id: string | number;
  value: string | number;
}

interface RadioLabelProps
  extends Omit<React.ComponentPropsWithRef<"label">, "htmlfor"> {}

interface RadioInputProps
  extends Omit<React.ComponentPropsWithRef<"input">, "htmlfor"> {}
