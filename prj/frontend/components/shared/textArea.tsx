import { useTheme } from "@chakra-ui/system";
import { Textarea } from "@chakra-ui/textarea";
import React from "react";

const TextArea: React.FC<React.ComponentProps<typeof Textarea>> = (props) => {
  const theme = useTheme();

  return (
    <Textarea
      _focus={{ boxShadow: `0 0 3px 1.5px ${theme.colors.primary[500]}` }}
      rows={7}
      {...props}
    ></Textarea>
  );
};

export default TextArea;
