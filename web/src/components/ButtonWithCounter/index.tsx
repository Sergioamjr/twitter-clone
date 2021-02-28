import React from "react";
import Button, { ButtonProps } from "~components/button";
import * as Styles from "./styles";

type Props = {
  counter?: number;
  Icon: React.ReactNode;
} & Pick<ButtonProps, "onClick" | "rounded" | "variant">;

export default function ButtonWithCounter({
  Icon,
  counter,
  ...props
}: Props): JSX.Element {
  return (
    <Styles.Wrapper>
      <Button {...props}>{Icon}</Button>
      {!!counter && <Styles.Counter>{counter}</Styles.Counter>}
    </Styles.Wrapper>
  );
}
