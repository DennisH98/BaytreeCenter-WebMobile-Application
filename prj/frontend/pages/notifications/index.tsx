import { AddIcon, DeleteIcon, RepeatIcon, SearchIcon } from "@chakra-ui/icons";
import {
  HStack,
  Heading,
  VStack,
  Divider,
  InputRightElement,
  Flex,
  Skeleton,
  Stack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import Button from "../../components/shared/button";
import React, { useEffect, useRef, useState } from "react";
import DataGrid from "../../components/shared/datagrid";
import { SideBar } from "../../components/sidebar/SideBar";
import { useRouter } from "next/router";
import { NotificationResponse } from "../../../shared/src/endpoints/notifications";
import Pager from "../../components/shared/pager";
import {
  deleteNotifications,
  getNotifications,
} from "../../services/notifications";
import InputGroup from "../../components/shared/inputGroup";
import { getMentorAccounts } from "../../services/mentorAccounts";
import { EditIcon } from "@chakra-ui/icons";
import OverlaySpinner from "../../components/shared/overlaySpinner";
import { getUrlQueryParam, setUrlQueryParam } from "../../util/misc";
import { ParentLayout } from "../../components/layout/Layout";
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";
export async function getServerSideProps(content) {
  const { page } = content.query;
  return { props: { page: page ?? null } };
}

const NotificationPage = (props) => {
  useAdminAccessPolicy();

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const toast = useToast();

  const [isOverlaySpinnerOpen, setIsOverlaySpinnerOpen] = useState(false);

  const [deletingNotificationId, setDeletingNotificationId] = useState<
    string | null
  >(null);

  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState<
    (NotificationResponse & {
      mentorNames: string[];
    })[]
  >([]);

  const PAGE_SIZE = 9;
  const [currentPageNumber, setCurrentPageNumber] = useState(-1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    setCurrentPageNumber(
      getUrlQueryParam("page") && parseInt(getUrlQueryParam("page"))
        ? parseInt(getUrlQueryParam("page"))
        : 1
    );
    setUrlQueryParam("page", null);
  }, []);

  const [maxPageNumber, setMaxPageNumber] = useState(1);

  const searchRef = useRef(null);

  const delayTimerRef = useRef(null);

  function doSearch(text) {
    clearTimeout(delayTimerRef.current);
    delayTimerRef.current = setTimeout(function () {
      setSearchQuery(text);
    }, 1000); // Will do the ajax sFtuff after 1000 ms, or 1 s
  }

  const refreshData = () => {
    setLoadingData(true);
    if (currentPageNumber === -1) {
      return;
    }

    const getAndCombineData = async () => {
      let notificationsResponse: {
        data: NotificationResponse[];
        totalCount: number;
      };
      if (searchQuery) {
        notificationsResponse = await getNotifications(
          { notificationTitle: searchQuery, sortSendingAt: "desc" },
          Math.max(currentPageNumber - 1, 0) * PAGE_SIZE,
          PAGE_SIZE
        );
      } else {
        notificationsResponse = await getNotifications(
          { sortSendingAt: "desc" },
          Math.max(currentPageNumber - 1, 0) * PAGE_SIZE,
          PAGE_SIZE
        );
      }

      const mentorIds = notificationsResponse.data.reduce<string[]>(
        (prev: string[], cur: NotificationResponse) => [
          ...prev,
          ...cur.mentorAccountIds.filter((id) => !prev.includes(id)),
        ],
        []
      );
      const mentorsResponse = await getMentorAccounts({
        id: mentorIds,
      });

      const combinedData = notificationsResponse.data.map(
        (notificationResponse) => ({
          ...notificationResponse,
          mentorNames: notificationResponse.mentorAccountIds.map((mentorId) => {
            const mentor = mentorsResponse.data.find(
              (mentor) => mentor.id === mentorId
            );
            return mentor ? mentor.username : "";
          }),
          isGlobal:
            notificationResponse.isGlobal ||
            (notificationResponse.mentorTypes.length === 0 &&
              notificationResponse.mentorAccountIds.length === 0),
        })
      );
      setData(combinedData);
      setLoadingData(false);

      const newMaxPageNumber = Math.ceil(
        notificationsResponse.totalCount / PAGE_SIZE
      );
      setMaxPageNumber(newMaxPageNumber);
      if (currentPageNumber > newMaxPageNumber) {
        setCurrentPageNumber(newMaxPageNumber);
      }
    };
    getAndCombineData();
  };

  useEffect(() => {
    refreshData();
  }, [currentPageNumber, searchQuery]);

  return (
    <>
      <OverlaySpinner isOpen={isOverlaySpinnerOpen}></OverlaySpinner>
      <Modal
        isOpen={deletingNotificationId !== null}
        onClose={() => setDeletingNotificationId(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warning: Deleting Notification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure that you want to delete this notification?
          </ModalBody>

          <ModalFooter>
            <HStack width="100%" overflow="hidden" padding={2}>
              <Button
                colorScheme="red"
                onClick={async () => {
                  setIsOverlaySpinnerOpen(true);
                  const result = await deleteNotifications(
                    deletingNotificationId
                  );

                  if (!result) {
                    toast({
                      status: "error",
                      position: "top",
                      title: "Failed to delete notification!",
                    });
                  } else {
                    toast({
                      status: "success",
                      position: "top",
                      title: "Successfully deleted notification!",
                    });
                  }

                  setIsOverlaySpinnerOpen(false);
                  setDeletingNotificationId(null);
                  refreshData();
                }}
              >
                Delete
              </Button>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={() => setDeletingNotificationId(null)}
              >
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ParentLayout>
        <div
          style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            marginLeft: "0px",
          }}
        >
          <div
            style={{
              padding: "60px",
              overflow: "auto",
              height: "100%",
              width: "100%",
            }}
          >
            <VStack height="full" width="full" alignItems="flex-start">
              <>
                <Flex width="full" justifyContent="space-between">
                  <Heading>Notifications</Heading>
                  <HStack>
                    <Button
                      buttonStyle="primary"
                      leftIcon={<AddIcon />}
                      onClick={() => {
                        setIsOverlaySpinnerOpen(true);
                        router.push(`notifications`, {
                          query: { page: currentPageNumber },
                        });
                        router.push("notifications/new");
                      }}
                    >
                      New Notification
                    </Button>
                    <Button
                      buttonStyle="default"
                      leftIcon={<RepeatIcon />}
                      onClick={() => {
                        refreshData();
                      }}
                    >
                      Refresh
                    </Button>
                  </HStack>
                </Flex>
                <Divider />
                <InputGroup
                  ref={searchRef}
                  defaultValue={searchQuery}
                  onChange={(event) => {
                    doSearch(event.target.value);
                  }}
                  placeholder="Search by title..."
                >
                  <InputRightElement
                    children={<SearchIcon color="gray.300" />}
                  ></InputRightElement>
                </InputGroup>
                {loadingData ? (
                  <Stack height="full" width="full">
                    <Skeleton height="25px" />
                    <Skeleton height="25px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                    <Skeleton height="50px" />
                  </Stack>
                ) : (
                  <DataGrid
                    cols={[
                      { header: "Title", dataField: "notificationTitle" },
                      {
                        header: "Mentor Roles",
                        componentFunc: (dataRow) => (
                          <div>
                            {dataRow.mentorTypes.map((mentorType, i) => (
                              <div key={`${mentorType}_${i}`}>{mentorType}</div>
                            ))}
                          </div>
                        ),
                      },
                      {
                        header: "Mentors",
                        componentFunc: (dataRow) => (
                          <div>
                            {dataRow.mentorNames.map((mentorName, i) => (
                              <div key={`${mentorName}_${i}`}>{mentorName}</div>
                            ))}
                          </div>
                        ),
                      },
                      {
                        header: "Sending At",
                        dataField: "sendingAt",
                        dataType: "dateTime",
                      },
                      { header: "Monthly", dataField: "isRecurringMonthly" },
                      { header: "Global", dataField: "isGlobal" },
                    ]}
                    data={data}
                    dataRowActions={[
                      {
                        name: "Edit",
                        icon: EditIcon,
                        action: (dataRow) => {
                          if (dataRow.sentAt) {
                            toast({
                              status: "error",
                              position: "top",
                              title:
                                "You cannot edit a notification that has already been sent!",
                            });
                          } else {
                            setIsOverlaySpinnerOpen(true);
                            router.push(`notifications`, {
                              query: { page: currentPageNumber },
                            });
                            router.push(`notifications/new/${dataRow.id}`);
                          }
                        },
                      },
                      {
                        name: "Delete",
                        icon: DeleteIcon,
                        action: (dataRow) => {
                          setDeletingNotificationId(dataRow.id);
                        },
                      },
                    ]}
                  ></DataGrid>
                )}
                <Pager
                  onPreviousPagePressed={(prevPageNumber) => {
                    setCurrentPageNumber(prevPageNumber);
                  }}
                  onNextPagePressed={(nextPageNumber) => {
                    setCurrentPageNumber(nextPageNumber);
                  }}
                  onGotoPagePressed={(gotoPageNumber) => {
                    setCurrentPageNumber(gotoPageNumber);
                  }}
                  maxPageNumber={maxPageNumber}
                  currentPageNumber={currentPageNumber}
                ></Pager>
              </>
            </VStack>
          </div>
        </div>
      </ParentLayout>
    </>
  );
};

export default NotificationPage;
