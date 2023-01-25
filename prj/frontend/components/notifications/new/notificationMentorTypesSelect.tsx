import {
  VStack,
  FormControl,
  FormLabel,
  useTheme,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import { MentorTypeResponse } from "../../../../shared/src/endpoints/mentorTypes";
import {
  Action,
  ActionType,
} from "../../../pages/notifications/new/[[...notificationId]]";
import { getMentorTypes } from "../../../services/mentorTypes";
import ReactSelectPaginate from "../../shared/reactSelectPaginate";

const loadMentorTypeOptions = async (search, prevOptions) => {
  const MENTOR_TYPES_SELECT_PAGE_SIZE = 20;

  const response = await getMentorTypes(
    { name: search ? search.trim() : undefined, sortName: "1" },
    prevOptions.length,
    MENTOR_TYPES_SELECT_PAGE_SIZE
  );

  const responseJSON = {
    results: response.data.map((mentorType) => {
      return { ...mentorType, value: mentorType.name, label: mentorType.name };
    }),
    has_more:
      prevOptions.length + MENTOR_TYPES_SELECT_PAGE_SIZE < response.totalCount,
  };

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
  };
};

interface NotificationMentorTypesSelectProps {
  dispatch: React.Dispatch<Action>;
  mentorTypesSendingTo: MentorTypeResponse[];
  error: string;
}

const NotificationMentorTypesSelect: React.FC<NotificationMentorTypesSelectProps> =
  (props) => {
    return (
      <FormControl as="fieldset" isRequired isInvalid={props.error !== ""}>
        <FormLabel as="legend">Select Mentor Role(s) to Send to:</FormLabel>
        <VStack width="full" alignItems="flex-start">
          <ReactSelectPaginate
            value={props.mentorTypesSendingTo.map((mentorTypeSendingTo) => ({
              label: mentorTypeSendingTo.name,
              value: mentorTypeSendingTo.name,
            }))}
            onFocus={() =>
              props.dispatch({
                type: ActionType.SetNonGlobalNoRecipientsError,
                payload: "",
              })
            }
            isMulti={true}
            loadOptions={loadMentorTypeOptions}
            onChange={(
              newValue: (MentorTypeResponse & { label: string; value: string })[]
            ) =>
              props.dispatch({
                type: ActionType.SetMentorTypesSendingTo,
                payload: newValue.map((mentorType) => ({
                  ...mentorType,
                  name: mentorType.label,
                  id: mentorType.value,
                })),
              })
            }
          ></ReactSelectPaginate>
        </VStack>
        <FormErrorMessage>{props.error}</FormErrorMessage>
      </FormControl>
    );
  };

export default NotificationMentorTypesSelect;
