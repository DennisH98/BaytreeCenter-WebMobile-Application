import React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import InputGroup from "../../shared/inputGroup";
import {
  Action,
  ActionType,
} from "../../../pages/notifications/new/[[...notificationId]]";

interface NotificationTitleProps {
  value: string;
  dispatch: React.Dispatch<Action>;
  error: string;
}

const NotificationTitle: React.FC<NotificationTitleProps> = (props) => {
  return (
    <FormControl as="fieldset" isRequired isInvalid={props.error !== ""}>
      <FormLabel as="legend">Notification Title:</FormLabel>
      <InputGroup
        value={props.value}
        onFocus={() =>
          props.dispatch({ type: ActionType.SetTitleError, payload: "" })
        }
        placeholder="Notification Title"
        onChange={(event) =>
          props.dispatch({
            type: ActionType.SetNotificationTitle,
            payload: event.target.value,
          })
        }
      ></InputGroup>
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  );
};

export default NotificationTitle;
