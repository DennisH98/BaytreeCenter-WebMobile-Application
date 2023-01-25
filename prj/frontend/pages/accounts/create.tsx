import React, { useState, useEffect } from "react";

import { Modal, ModalContent, ModalBody, ModalCloseButton, ModalHeader, ModalFooter, ModalOverlay } from "@chakra-ui/react";
import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import { Divider, Heading, Text } from "@chakra-ui/react"; 
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { Select } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

import { IViewsMentor } from "../../../shared/src/entities/viewsMentor";
import { ViewsMentorListResponse } from "../../../shared/src/endpoints/viewsMentor";

import { IViewsMentee } from "../../../shared/src/entities/viewsMentee";
import { ViewsMenteeListResponse } from "../../../shared/src/endpoints/viewsMentee";

import { MentorAccountCreateRequest, MentorAccountListResponse, MentorAccountResponse } from "../../../shared/src/endpoints/mentorAccount";

import { apiGet, apiPost } from "../../util/api";

import { ErrorResponseDisplay, LoadingSpinner } from "../../components/apiResponseHandler";
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";

interface ModalProps {
  onClose: () => void;
  existingAccounts: MentorAccountResponse[];
}

const MentorCreate = ({ onClose, existingAccounts }: ModalProps) => {
  useAdminAccessPolicy();
  const toast = useToast();

  const [query, setQuery] = useState("");

  const [allMentors, setAllMentors] = useState<ViewsMentorListResponse>([]);
  const [searchedMentors, setSearchedMentors] = useState<ViewsMentorListResponse>();
  const [mentorsWithoutAccount, setMentorsWithoutAccount] = useState<ViewsMentorListResponse>();

  const [selectedMentor, setSelectedMentor] = useState<IViewsMentor>();

  const [mentees, setMentees] = useState<ViewsMenteeListResponse>();
  const [selectedMentee, setSelectedMentee] = useState<IViewsMentee>();

  const [mentorError, setMentorError] = useState(false);
  const [menteeError, setMenteeError] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const loadMentors = () => {
    apiGet<ViewsMentorListResponse>("views/mentors/")
      .then((res) => {
        setAllMentors(res);
        setSearchedMentors(res);
      })
      .catch((e) => {
        console.error(e);
        setMentorError(true);
      });
  };

  const loadMentees = () => {
    apiGet<ViewsMenteeListResponse>("views/mentees/")
      .then((res) => {
        setMentees(res);
      })
      .catch((e) => {
        console.error(e);
        setMenteeError(true);
      });
  }

  useEffect(() => {
    let caseInsensitiveQuery = query.toLowerCase();

    setSearchedMentors(
      allMentors.filter((mentor) => {
        let fullName: string = `${mentor.firstName} ${mentor.lastName}`.toLowerCase();

        return fullName.includes(caseInsensitiveQuery) || 
          ((mentor.email !== undefined) ? mentor.email.toLowerCase().includes(query) : true);
      })
    );
  }, [query]);

  useEffect(() => {
    loadMentors();
    loadMentees();
  }, []);

  useEffect(() => {
    if (!searchedMentors) {
      return;
    }

    setMentorsWithoutAccount(
      searchedMentors.filter((mentor) => {
        let viewsId: string = mentor.viewsId;
        return !existingAccounts.some((account) => account.viewsId === viewsId);
      })
    );
  }, [existingAccounts, searchedMentors]);

  const submitMentor = () => {
    setIsCreating(true);

    apiPost<never, MentorAccountCreateRequest>("mentor-accounts/", "", {
      ...selectedMentor,
      mentees: [selectedMentee]
    })
      .then(() => {
        toast({
          title: "Mentor Account Created",
          description: "An email should have been sent to the mentor with their credentials.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        onClose();
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "The account was not able to be created.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        setIsCreating(false);
        console.log(e);
      });
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Mentor Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Divider />
          <Heading size="md" mt={2} mb={2}>Select a Mentor to Create an Account for</Heading>
          <InputGroup mb={3}>
            <Input placeholder="Search by Name or Email" value={query} onChange={(e) => setQuery(e.target.value)}/>
            <InputRightElement children={<SearchIcon color="grey.300" />} />
          </InputGroup>
          { selectedMentor ? (
            <Text>Selected Mentor: {selectedMentor.firstName} {selectedMentor.lastName}</Text>
          ) : (
            <></>
          )}
          { mentorError ? <ErrorResponseDisplay /> : (mentorsWithoutAccount ? (
            <Table variant="striped" colorScheme="gray" mb={2}>
              <Thead>
                <Tr>
                  <Th>Mentor Name</Th>
                  <Th>Mentor Email</Th>
                </Tr>
              </Thead>
              <Tbody>
              { mentorsWithoutAccount.map((mentor, index) => (
                <Tr
                  key={index}
                  onClick={() => {
                    if (!mentorsWithoutAccount[index].email) {
                      toast({status: "error", title: "The mentor must have an email in Views!"});
                    } else {
                      setSelectedMentor(mentorsWithoutAccount[index]);
                    }
                  }}
                  _hover={{cursor: "pointer", border: "1px", borderColor: "blue.300"}}
                >
                  <Td>{`${mentor.firstName} ${mentor.lastName}`}</Td>
                  <Td>{mentor.email}</Td>
                </Tr>
              ))}
              </Tbody>
            </Table>
          ) : (
            <LoadingSpinner />
          ))}
          <Divider />
          <Heading size="md" mt={2} mb={2}>Select the Mentee that belongs to the Mentor</Heading>
          { menteeError ? <ErrorResponseDisplay /> : (mentees ? (
            <Select
              placeholder="Select Mentee"
              onChange={(e) => {
                if (e.target.value === "") {
                  return;
                }

                setSelectedMentee(mentees[e.target.value]);
              }}
            >
              { mentees.map((mentee, index) => (
                <option key={index} value={index}>{mentee.firstName} {mentee.lastName}</option>
              ))}
            </Select>
          ) : (
            <LoadingSpinner />
          ))}
        </ModalBody>
        <ModalFooter>
          { selectedMentor && selectedMentee ? (
            <Button
              colorScheme="blue"
              isLoading={isCreating}
              loadingText="Creating"
              onClick={submitMentor}
            >Create Account</Button>
          ) : (
            <></>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MentorCreate;
