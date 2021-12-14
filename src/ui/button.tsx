import * as React from "react";
import cx from "clsx";
import { scope } from "../lib/utils";

interface ButtonProps
  extends Omit<React.ComponentPropsWithRef<"button">, "htmlfor"> {}

const Button = React.forwardRef<HTMLButtonElement>(
  (
    {
      children,
      type: buttonType = "button",
      className,
      onPointerDown,
      onPointerUp,
      ...props
    }: ButtonProps,
    forwardedRef
  ) => {
    let [metaPress, setMetaPress] = React.useState(false);
    React.useEffect(() => {
      if (metaPress) {
        let listener = () => {
          setMetaPress(false);
        };
        window.addEventListener("pointerup", listener);
        return () => {
          window.removeEventListener("pointerup", listener);
        };
      }
    }, [metaPress]);

    return (
      <button
        ref={forwardedRef}
        type={buttonType}
        className={cx(scope("button"), className)}
        data-meta-pressed={metaPress ? "" : undefined}
        onPointerDown={(event) => {
          if (event.metaKey) {
            setMetaPress(true);
          }
          onPointerDown(event);
        }}
        onPointerUp={(event) => {
          setMetaPress(false);
          onPointerUp(event);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
