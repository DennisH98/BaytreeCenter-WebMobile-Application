import { Button as ChakraButton, Flex } from "@chakra-ui/react";
import React, {
  JSXElementConstructor,
  MouseEventHandler,
  ReactElement,
} from "react";

interface ButtonProps extends React.ComponentProps<typeof ChakraButton> {
  buttonStyle?: "primary" | "default";
}

const Button: React.FC<ButtonProps> = (props) => {
  const buttonStyleProps = {
    primary: {
      colorScheme: "primary",
    },
    default: {},
  };

  const { buttonStyle, ...propsWithoutButtonStyle } = props;

  return (
    <ChakraButton
      minHeight="40px"
      {...propsWithoutButtonStyle}
      {...buttonStyleProps[props.buttonStyle ?? "default"]}
    >
      {props.children}
    </ChakraButton>
  );
};

export default Button;
