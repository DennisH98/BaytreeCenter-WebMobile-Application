import {
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/form-control";
import { HStack } from "@chakra-ui/layout";
import { RadioGroup, Radio } from "@chakra-ui/radio";
import React from "react";
import {
  Action,
  ActionType,
} from "../../../pages/notifications/new/[[...notificationId]]";

interface NotificationGlobalSelect {
  value: boolean;
  dispatch: React.Dispatch<Action>;
}

const NotificationGlobalSelect: React.FC<NotificationGlobalSelect> = (
  props
) => {
  return (
    <FormControl as="fieldset">
      <FormLabel as="legend">Is this a global notification?</FormLabel>
      <RadioGroup
        value={props.value ? "Global" : "Not Global"}
        colorScheme="primary"
        onChange={(nextOption) => {
          if (nextOption === "Global") {
            props.dispatch({ type: ActionType.SetGlobal });
          } else {
            props.dispatch({ type: ActionType.SetNonGlobal });
          }
        }}
        defaultValue="Global"
      >
        <HStack spacing="24px">
          <Radio value="Global">Global</Radio>
          <Radio value="Not Global">Not Global</Radio>
        </HStack>
      </RadioGroup>
      <FormHelperText>Global: send notification to all mentors</FormHelperText>
    </FormControl>
  );
};

export default NotificationGlobalSelect;
