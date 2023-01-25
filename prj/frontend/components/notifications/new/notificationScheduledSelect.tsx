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

interface NotificationScheduledSelectProps {
  value: boolean;
  dispatch: React.Dispatch<Action>;
}

const NotificationScheduledSelect: React.FC<NotificationScheduledSelectProps> =
  (props) => (
    <FormControl as="fieldset">
      <FormLabel as="legend">Is this a Scheduled Notification?</FormLabel>
      <RadioGroup
        value={props.value ? "Scheduled" : "Not Scheduled"}
        colorScheme="primary"
        onChange={(nextOption) => {
          if (nextOption === "Scheduled") {
            props.dispatch({
              type: ActionType.SetScheduledDate,
              payload: new Date(),
            });
            props.dispatch({ type: ActionType.SetScheduled, payload: true });
          } else {
            props.dispatch({ type: ActionType.SetScheduled, payload: false });
          }
        }}
      >
        <HStack spacing="24px">
          <Radio value="Not Scheduled">Not Scheduled</Radio>
          <Radio value="Scheduled">Scheduled</Radio>
        </HStack>
      </RadioGroup>
      <FormHelperText>Not Scheduled: send as soon as possible</FormHelperText>
    </FormControl>
  );

export default NotificationScheduledSelect;
