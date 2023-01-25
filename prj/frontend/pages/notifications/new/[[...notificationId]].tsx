import {
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Divider,
  Collapse,
  useToast,
  useTheme,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { MentorTypeResponse } from "../../../../shared/src/endpoints/mentorTypes";
import { MentorAccountResponse } from "../../../../shared/src/endpoints/mentorAccount";
import NotificationGlobalSelect from "../../../components/notifications/new/notificationGlobalSelect";
import NotificationMentorTypesSelect from "../../../components/notifications/new/notificationMentorTypesSelect";
import NotificationMentorsSelect from "../../../components/notifications/new/notificationMentorsSelect";
import NotificationTitle from "../../../components/notifications/new/notificationTitle";
import NotificationBody from "../../../components/notifications/new/notificationBody";
import NotificationScheduledSelect from "../../../components/notifications/new/notificationScheduledSelect";
import DatePicker from "react-datepicker";
import NotificationRecurringMonthlySelect from "../../../components/notifications/new/notificationRecurringMonthlySelect";
import Button from "../../../components/shared/button";
import {
  getNotifications,
  postNotifications,
  putNotifications,
  sendNotifications,
} from "../../../services/notifications";
import { AddIcon } from "@chakra-ui/icons";
import OverlaySpinner from "../../../components/shared/overlaySpinner";
import { getMentorAccounts } from "../../../services/mentorAccounts";
import { BsSave } from "react-icons/bs";
import {
  NotificationRequest,
  NotificationResponse,
} from "../../../../shared/src/endpoints/notifications";
import { ParentLayout } from "../../../components/layout/Layout";
import { getMentorTypes } from "../../../services/mentorTypes";
import { useAdminAccessPolicy } from "../../../util/auth/accessPolicyHook";

export enum ActionType {
  SetPageHeading = "SET_PAGE_HEADING",
  SetGlobal = "SET_GLOBAL",
  SetNonGlobal = "SET_NON_GLOBAL",
  SetMentorsSendingTo = "SET_MENTORS_SENDING_TO",
  SetMentorTypesSendingTo = "SET_MENTOR_TYPES_SENDING_TO",
  SetScheduled = "SET_SCHEDULED",
  SetScheduledDate = "SET_SCHEDULED_DATE",
  SetIsRecurringMonthly = "SET_RECURRING_MONTHLY",
  SetNotificationTitle = "SET_NOTFICATION_TITLE",
  SetNotificationBody = "SET_NOTIFICATION_BODY",
  SetTitleError = "SET_TITLE_ERROR",
  SetBodyError = "SET_BODY_ERROR",
  SetNonGlobalNoRecipientsError = "SET_NON_GLOBAL_NO_RECIPIENTS_ERROR",
  SetDisplayLoadingSpinner = "SET_DISPLAY_LOADING_SPINNER",
}

export type Action = {
  type: ActionType;
  payload?: any;
};

interface State {
  isGlobal: boolean;
  isScheduled: boolean;
  scheduledDate: Date;
  notificationTitle: string;
  notificationBody: string;
  isRecurringMonthly: boolean;
  titleError: string;
  bodyError: string;
  nonGlobalNoRecipientsError: string;
  displayLoadingSpinner: boolean;
  mentorTypesSendingTo: MentorTypeResponse[];
  mentorsSendingTo: MentorAccountResponse[];
}

const reducer: React.Reducer<State, Action> = (prevState, action): State => {
  switch (action.type) {
    case ActionType.SetGlobal:
      return {
        ...prevState,
        isGlobal: true,
      };
    case ActionType.SetNonGlobal:
      return {
        ...prevState,
        isGlobal: false,
      };
    case ActionType.SetScheduled:
      return {
        ...prevState,
        isScheduled: action.payload,
      };
    case ActionType.SetScheduledDate:
      return {
        ...prevState,
        scheduledDate: action.payload,
      };
    case ActionType.SetNotificationTitle:
      return {
        ...prevState,
        notificationTitle: action.payload,
      };
    case ActionType.SetNotificationBody:
      return {
        ...prevState,
        notificationBody: action.payload,
      };
    case ActionType.SetIsRecurringMonthly:
      return {
        ...prevState,
        isRecurringMonthly: action.payload,
      };
    case ActionType.SetTitleError:
      return {
        ...prevState,
        titleError: action.payload,
      };
    case ActionType.SetBodyError:
      return {
        ...prevState,
        bodyError: action.payload,
      };
    case ActionType.SetNonGlobalNoRecipientsError:
      return {
        ...prevState,
        nonGlobalNoRecipientsError: action.payload,
      };
    case ActionType.SetDisplayLoadingSpinner:
      return {
        ...prevState,
        displayLoadingSpinner: action.payload,
      };
    case ActionType.SetMentorTypesSendingTo:
      return {
        ...prevState,
        mentorTypesSendingTo: action.payload,
      };
    case ActionType.SetMentorsSendingTo:
      return {
        ...prevState,
        mentorsSendingTo: action.payload,
      };
    default:
      return prevState;
  }
};

export async function getServerSideProps(content) {
  const { notificationId } = content.query;
  return { props: { notificationId: notificationId ?? null } };
}

const NewNotificationPage: React.FC<{ notificationId: string[] | null }> = (
  props
) => {
  useAdminAccessPolicy();
  const initialState = {
    isGlobal: true,
    isScheduled: false,
    scheduledDate: new Date(),
    notificationTitle: "",
    notificationBody: "",
    isRecurringMonthly: false,
    titleError: "",
    bodyError: "",
    nonGlobalNoRecipientsError: "",
    displayLoadingSpinner: false,
    mentorTypesSendingTo: [],
    mentorsSendingTo: [],
  };

  const isEditingNotification =
    props.notificationId !== null && props.notificationId !== undefined;

  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const theme = useTheme();

  useEffect(() => {
    if (isEditingNotification) {
      const getEditingNotificationData = async () => {
        dispatch({ type: ActionType.SetDisplayLoadingSpinner, payload: true });
        const notificationRes = (
          await getNotifications({ id: props.notificationId[0] })
        ).data[0];

        if (
          notificationRes.mentorTypes &&
          notificationRes.mentorTypes.length > 0
        ) {
          dispatch({
            type: ActionType.SetMentorTypesSendingTo,
            payload: notificationRes.mentorTypes.map((mentorType) => ({
              name: mentorType,
            })),
          });
        }

        if (
          notificationRes.mentorAccountIds &&
          notificationRes.mentorAccountIds.length > 0
        ) {
          const mentorsResponse = await getMentorAccounts({
            id: notificationRes.mentorAccountIds,
          });
          dispatch({
            type: ActionType.SetMentorsSendingTo,
            payload: mentorsResponse.data,
          });
        }

        if (!notificationRes.isGlobal) {
          dispatch({ type: ActionType.SetNonGlobal });
        }
        dispatch({
          type: ActionType.SetNotificationTitle,
          payload: notificationRes.notificationTitle,
        });
        dispatch({
          type: ActionType.SetNotificationBody,
          payload: notificationRes.notificationBody,
        });
        dispatch({ type: ActionType.SetScheduled, payload: true });
        dispatch({
          type: ActionType.SetScheduledDate,
          payload: new Date(notificationRes.sendingAt),
        });
        dispatch({
          type: ActionType.SetIsRecurringMonthly,
          payload: notificationRes.isRecurringMonthly,
        });
        dispatch({
          type: ActionType.SetPageHeading,
          payload: "Edit Notification",
        });
        dispatch({ type: ActionType.SetDisplayLoadingSpinner, payload: false });
      };

      getEditingNotificationData();
    }
  }, []);

  const toast = useToast();

  const createNotificationRequest: () => NotificationRequest = () => {
    return {
      id: isEditingNotification ? props.notificationId[0] : undefined,
      isGlobal:
        state.isGlobal ||
        (state.mentorTypesSendingTo.length === 0 &&
          state.mentorsSendingTo.length === 0),
      mentorTypes: state.mentorTypesSendingTo.map(
        (mentorType) => mentorType.name
      ),
      mentorAccountIds: state.mentorsSendingTo.map((mentor) => mentor.id),
      notificationTitle: state.notificationTitle,
      notificationBody: state.notificationBody,
      sendingAt: state.isScheduled ? state.scheduledDate : new Date(),
      isRecurringMonthly: state.isRecurringMonthly,
    };
  };

  const checkFormForErrors = () => {
    let formHasErrors = false;

    if (!state.notificationTitle) {
      dispatch({
        type: ActionType.SetTitleError,
        payload: "Notification title required.",
      });

      formHasErrors = true;
    }

    if (!state.notificationBody) {
      dispatch({
        type: ActionType.SetBodyError,
        payload: "Notification body required.",
      });

      formHasErrors = true;
    }

    if (
      !state.isGlobal &&
      state.mentorTypesSendingTo.length === 0 &&
      state.mentorsSendingTo.length === 0
    ) {
      dispatch({
        type: ActionType.SetNonGlobalNoRecipientsError,
        payload: "Mentor roles and mentors cannot both be empty.",
      });

      formHasErrors = true;
    }
    return formHasErrors;
  };

  const submitForm = async () => {
    if (!checkFormForErrors()) {
      dispatch({
        type: ActionType.SetDisplayLoadingSpinner,
        payload: true,
      });

      let res: NotificationResponse[];

      if (isEditingNotification) {
        res = await putNotifications(createNotificationRequest());
      } else {
        res = await postNotifications(createNotificationRequest());
      }

      if (!res) {
        toast({
          status: "error",
          position: "top",
          title: `Failed to ${
            isEditingNotification ? "edit" : "create a new"
          } notification. Ensure that your internet connection is working.`,
        });

        dispatch({
          type: ActionType.SetDisplayLoadingSpinner,
          payload: false,
        });
      } else {
        if (!state.isScheduled) {
          await sendNotifications();
        }

        router.push("/notifications");
        toast({
          status: "success",
          position: "top",
          title: `Successfully ${
            isEditingNotification ? "changed the" : "created a new"
          } notification!`,
        });
      }
    } else {
      toast({
        status: "warning",
        position: "top",
        title:
          "There are errors in the red highlighted fields. Please fix them and try again.",
      });
    }
  };

  return (
    <>
      <OverlaySpinner isOpen={state.displayLoadingSpinner}></OverlaySpinner>
      <ParentLayout>
        <div style={{ width: "100%", height: "100vh", overflowY: "auto" }}>
          <div
            style={{
              margin: "0 auto",
              padding: "60px",
              height: "auto",
              width: "100%",
              maxWidth: "1460px",
            }}
          >
            <VStack height="100%" alignItems="flex-start">
              <Heading>
                {isEditingNotification
                  ? "Edit Notification"
                  : "New Notification"}
              </Heading>
              <Divider></Divider>

              <NotificationGlobalSelect
                value={state.isGlobal}
                dispatch={dispatch}
              />

              <Collapse
                style={{ width: "100%" }}
                in={!state.isGlobal}
                animateOpacity
              >
                <NotificationMentorTypesSelect
                  mentorTypesSendingTo={state.mentorTypesSendingTo}
                  dispatch={dispatch}
                  error={state.nonGlobalNoRecipientsError}
                />
                <NotificationMentorsSelect
                  mentorsSendingTo={state.mentorsSendingTo}
                  dispatch={dispatch}
                  error={state.nonGlobalNoRecipientsError}
                />
              </Collapse>

              <NotificationTitle
                value={state.notificationTitle}
                dispatch={dispatch}
                error={state.titleError}
              />
              <NotificationBody
                value={state.notificationBody}
                dispatch={dispatch}
                error={state.bodyError}
              />

              <NotificationScheduledSelect
                value={state.isScheduled}
                dispatch={dispatch}
              />

              <Collapse
                style={{ width: "100%" }}
                in={state.isScheduled}
                animateOpacity
              >
                <FormControl required>
                  <FormLabel>Schedule notification for:</FormLabel>
                  <DatePicker
                    showTimeSelect
                    selected={state.scheduledDate}
                    onChange={(date) =>
                      dispatch({
                        type: ActionType.SetScheduledDate,
                        payload: date,
                      })
                    }
                    dateFormat={theme.formats.reactDatePickerDateFormat}
                  ></DatePicker>
                </FormControl>
              </Collapse>

              <NotificationRecurringMonthlySelect
                value={state.isRecurringMonthly}
                dispatch={dispatch}
              />

              <Button
                style={{ marginTop: "40px" }}
                leftIcon={
                  isEditingNotification ? (
                    <BsSave></BsSave>
                  ) : (
                    <AddIcon></AddIcon>
                  )
                }
                buttonStyle="primary"
                onClick={submitForm}
              >
                {isEditingNotification ? "Save Changes" : "New Notification"}
              </Button>
            </VStack>
          </div>
        </div>
      </ParentLayout>
    </>
  );
};

export default NewNotificationPage;
