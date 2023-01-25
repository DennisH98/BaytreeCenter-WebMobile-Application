import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import {
  Action,
  ActionType,
} from "../../../pages/notifications/new/[[...notificationId]]";
import { getMentorAccounts } from "../../../services/mentorAccounts";
import { MentorAccountResponse } from "../../../../shared/src/endpoints/mentorAccount";
import ReactSelectPaginate from "../../shared/reactSelectPaginate";

const loadMentorOptions = async (search, prevOptions) => {
  const MENTORS_SELECT_PAGE_SIZE = 20;

  const response = await getMentorAccounts(
    { username: search ? search.trim() : undefined },
    prevOptions.length,
    MENTORS_SELECT_PAGE_SIZE
  );

  const responseJSON = {
    results: response.data.map((mentorAccount) => {
      return {
        ...mentorAccount,
        value: mentorAccount.id,
        label: mentorAccount.username,
      };
    }),
    has_more:
      prevOptions.length + MENTORS_SELECT_PAGE_SIZE < response.totalCount,
  };

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
  };
};

interface NotificationMentorsSelectProps {
  dispatch: React.Dispatch<Action>;
  mentorsSendingTo: MentorAccountResponse[];
  error: string;
}

const NotificationMentorTypesSelect: React.FC<NotificationMentorsSelectProps> =
  (props) => {
    return (
      <FormControl as="fieldset" isRequired isInvalid={props.error !== ""}>
        <FormLabel as="legend">Select Mentor(s) to Send to:</FormLabel>
        <VStack width="full" alignItems="flex-start">
          <ReactSelectPaginate
            value={props.mentorsSendingTo.map((mentorSendingTo) => ({
              label: mentorSendingTo.username,
              value: mentorSendingTo.id,
            }))}
            onFocus={() =>
              props.dispatch({
                type: ActionType.SetNonGlobalNoRecipientsError,
                payload: "",
              })
            }
            isMulti={true}
            loadOptions={loadMentorOptions}
            onChange={(
              newValue: (MentorAccountResponse & { label: string; value: string })[]
            ) =>
              props.dispatch({
                type: ActionType.SetMentorsSendingTo,
                payload: newValue.map((mentor) => ({
                  ...mentor,
                  username: mentor.label,
                  id: mentor.value,
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
