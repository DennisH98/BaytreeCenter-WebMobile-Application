import { Input as ChakraInput, InputRightElement } from "@chakra-ui/input";
import { InputGroup as ChakraInputGroup, forwardRef } from "@chakra-ui/react";
import { useTheme } from "@chakra-ui/system";
import React, { ReactElement, useState } from "react";

export interface InputProps extends React.ComponentProps<typeof ChakraInput> {}

const InputGroupWrapper = forwardRef<InputProps, "input">((props, ref) => {
  const theme = useTheme();

  const { children, ...propsWithoutChildren } = props;

  return (
    <ChakraInputGroup width={props.width}>
      {children}

      <ChakraInput
        _focus={{
          boxShadow: `0 0 3px 1.5px ${theme.colors.primary[500]}`,
        }}
        {...propsWithoutChildren}
        ref={ref}
      ></ChakraInput>
    </ChakraInputGroup>
  );
});

export default InputGroupWrapper;
