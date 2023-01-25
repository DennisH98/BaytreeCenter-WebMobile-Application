import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import React from "react";
import {
  Action,
  ActionType,
} from "../../../pages/notifications/new/[[...notificationId]]";

interface NotificationRecurringMonthlySelectProps {
  value: boolean;
  dispatch: React.Dispatch<Action>;
}

const NotificationRecurringMonthlySelect: React.FC<NotificationRecurringMonthlySelectProps> =
  (props) => {
    return (
      <FormControl as="fieldset">
        <FormLabel as="legend">Does this notification recur monthly?</FormLabel>
        <RadioGroup
          value={props.value ? "Recurring Monthly" : "Not Recurring Monthly"}
          colorScheme="primary"
          onChange={(nextOption) =>
            nextOption === "Recurring Monthly"
              ? props.dispatch({
                  type: ActionType.SetIsRecurringMonthly,
                  payload: true,
                })
              : props.dispatch({
                  type: ActionType.SetIsRecurringMonthly,
                  payload: false,
                })
          }
        >
          <HStack spacing="24px">
            <Radio value="Recurring Monthly">Recurring Monthly</Radio>
            <Radio value="Not Recurring Monthly">Not Recurring Monthly</Radio>
          </HStack>
        </RadioGroup>
        <FormHelperText>
          Recurring Monthly: send notification at this date and time every month
          from now on
        </FormHelperText>
      </FormControl>
    );
  };

export default NotificationRecurringMonthlySelect;
