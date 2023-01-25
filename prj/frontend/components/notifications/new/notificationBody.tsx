import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import TextArea from "../../shared/textArea";
import { Action, ActionType } from "../../../pages/notifications/new/[[...notificationId]]";

interface NotificationBodyProps {
  value: string;
  dispatch: React.Dispatch<Action>;
  error: string;
}

const NotificationBody: React.FC<NotificationBodyProps> = (props) => {
  return (
    <FormControl as="fieldset" isRequired isInvalid={props.error !== ""}>
      <FormLabel>Notification Body:</FormLabel>
      <TextArea
        value={props.value}
        onFocus={() =>
          props.dispatch({ type: ActionType.SetBodyError, payload: "" })
        }
        placeholder="Notification Body"
        onChange={(event) => {
          props.dispatch({
            type: ActionType.SetNotificationBody,
            payload: event.target.value,
          });
        }}
      ></TextArea>
      <FormErrorMessage>{props.error}</FormErrorMessage>
    </FormControl>
  );
};

export default NotificationBody;
