import React, { useState, useEffect } from "react";

import { Heading, VStack, HStack, Divider, Button, InputGroup, InputRightElement, Input, Box, Text, useToast } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";
import { GrRefresh } from "react-icons/gr"
import { ParentLayout } from "../../components/layout/Layout"

import { ViewsMentorResponse } from "../../../shared/src/endpoints/viewsMentor";
import { MentorAccountEditRequest, MentorAccountListResponse, MentorAccountResponse } from "../../../shared/src/endpoints/mentorAccount";
import { apiGet, apiPost, apiDelete } from "../../util/api";
import { ErrorResponseDisplay, LoadingSpinner } from "../../components/apiResponseHandler";
import MentorCreate from "./create";
import MentorDelete from "./delete";
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";

const CreatePage = () => {
  useAdminAccessPolicy();
  const toast = useToast();

  const mentorAccountsEndpoint: string = "mentor-accounts/";
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [nameQuery, setNameQuery] = useState("");

  const [accountIdToBeDeleted, setAccountIdToBeDeleted] = useState("");

  const [mentorAccounts, setMentorAccounts] = useState<MentorAccountResponse[]>();
  const [searchedAccounts, setSearchedAccounts] = useState<MentorAccountResponse[]>();
  const [accountError, setAccountError] = useState(false);

  const [accountUpdating, setAccountUpdating] = useState(false);

  const onCreateModalClose = () => {
    setCreateModalOpen(false);
    reloadMentorAccounts();
  };

  const onDeleteModalClose = (confirmed: boolean) => {
    setDeleteModalOpen(false);
    
    if (confirmed) {
      apiDelete(mentorAccountsEndpoint, accountIdToBeDeleted)
        .then(() => {
          toast({
            title: "Account successfully deleted",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          
          reloadMentorAccounts();
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "The account was not able to be deleted.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  }

  const reloadMentorAccounts = () => {
    setSearchedAccounts(undefined);
    loadMentorAccounts();
  };

  const loadMentorAccounts = () => {
    apiGet<MentorAccountListResponse>(mentorAccountsEndpoint)
      .then((res) => {
        setMentorAccounts(res.data);
      })
      .catch((e) => {
        console.error(e);
        setAccountError(true);
      });
  };

  const refreshMentorAccount = (viewsId: string, id: string) => {
    apiGet<ViewsMentorResponse>("views/mentors/", viewsId)
      .then((res) => {
        apiPost<never, MentorAccountEditRequest>(mentorAccountsEndpoint, id, {
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          mentorTypes: res.mentorTypes,
        })
          .then(() => {
            toast({
              title: "Account successfully updated",
              status: "success",
              duration: 5000,
              isClosable: true,
            });

            setAccountUpdating(false);
            reloadMentorAccounts();
          })
          .catch((e) => {
            mentorUpdateError(e);
          });
      })
      .catch((e) => {
        mentorUpdateError(e)
      });
  }

  const mentorUpdateError = (e) => {
    console.error(e);
    setAccountUpdating(false);

    toast({
      title: "Error",
      description: "Something went wrong in trying to update the account.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  useEffect(() => loadMentorAccounts(), [])

  useEffect(() => {
    let lowercaseNameQuery: string = nameQuery.toLowerCase();

    if (mentorAccounts !== undefined) {
      setSearchedAccounts(
        mentorAccounts.filter((account) => {
          let accountFullName = `${account.firstName} ${account.lastName}`.toLowerCase();
          return accountFullName.includes(lowercaseNameQuery);
        })
      );
    } else {
      setSearchedAccounts(mentorAccounts);
    }
  }, [nameQuery, mentorAccounts]);

  return (
    <ParentLayout>
      <VStack height="full" width="full" align="flex-start" p={3}>
        <Heading>Mentor Accounts</Heading>
        <Button colorScheme="green" onClick={() => setCreateModalOpen(true)}>
          Create Mentor Account
        </Button>
        <Divider />
        <InputGroup>
          <Input placeholder="Search by Name" value={nameQuery} onChange={(e) => setNameQuery(e.target.value)}/>
          <InputRightElement children={<SearchIcon color="grey.300" />} />
        </InputGroup>
        { accountError ? <ErrorResponseDisplay /> : (searchedAccounts ? (
          <VStack w="full">
            { searchedAccounts.map((account) => (
              <Box
                key={account.id}
                bgColor="gray.50"
                border="1px"
                borderRadius="8px"
                borderColor="gray.100"
                boxShadow="base"
                w="full"
                px={4}
                py={2}
                mt={3}
              >
                <HStack justifyContent="space-between">
                  <Box>
                    <Heading size="md">{account.firstName} {account.lastName}</Heading>
                    <Text><Text as="strong">Mentor Roles:</Text> {account.mentorTypes.join(", ")}</Text>
                    <Text>{account.email}</Text>
                    <Text>{account.username}</Text>
                  </Box>
                  <Box>
                    <Button
                      variant="ghost"
                      isDisabled={accountUpdating}
                      onClick={() => {
                        setAccountUpdating(true);
                        refreshMentorAccount(account.viewsId, account.id);
                      }}
                    >
                        <GrRefresh />
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      isDisabled={accountUpdating}
                      onClick={() => {
                        setAccountIdToBeDeleted(account.id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        ) : (
          <Box width="full">
            <LoadingSpinner />
          </Box>
        ))}
      </VStack>
      { createModalOpen && <MentorCreate onClose={onCreateModalClose} existingAccounts={mentorAccounts} /> }
      { deleteModalOpen && <MentorDelete onClose={onDeleteModalClose} /> }
    </ParentLayout>
  );
};

export default CreatePage;
