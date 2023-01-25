import {
  VStack,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { SearchIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { ParentLayout } from "../../components/layout/Layout"
import { apiGet } from "../../util/api"
import { ViewsMentorListResponse } from "../../../shared/src/endpoints/viewsMentor";
import { LoadingSpinner, ErrorResponseDisplay } from "../../components/apiResponseHandler";
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";

export default function MentorsPage() {
  useAdminAccessPolicy();
  
  const filterMentors = (query: string) => {
    if (!allMentors) {
      return [];
    }
    
    if (!query) {
      return allMentors;
    }

    // Removes all space characters
    query = query.replace(/\s+/g, "").toLowerCase();

    return allMentors.filter((mentor) => {
      const mentorFirstName: string = mentor.firstName.toLowerCase();
      const mentorLastName: string = mentor.lastName.toLowerCase();
      const name: string = mentorFirstName + mentorLastName;
      return name.includes(query);
    });
  }

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allMentors, setAllMentors] = useState<ViewsMentorListResponse>([]);
  const filteredMentors = filterMentors(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnavailable, setIsUnavailable] = useState(false);
  

  const getMentors = () => {
    apiGet<ViewsMentorListResponse>("views/mentors/")
      .then((res) => {
        setAllMentors(res);
        setIsLoading(false);
        setIsUnavailable(false);
      })
      .catch(() => {
        setIsUnavailable(true);
        console.log("Error: Could not load mentors");
      });
  }

  useEffect(() => {
    getMentors();
  }, []);

  return (
    <ParentLayout>

      <VStack w="full" h="full" p={10} alignItems="flex-start" overflow="scroll">
        <Heading size="2xl" pb={5}>Mentors</Heading>
        <InputGroup pb={5}>
          <InputRightElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />
          <Input placeholder="Search Mentor" onInput={e => setSearchQuery((e.target as HTMLInputElement).value)} />
        </InputGroup>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Volunteer Type(s)</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          {isUnavailable ? <ErrorResponseDisplay /> : (isLoading ? <LoadingSpinner /> : null)}
          <Tbody>
            {filteredMentors.map((mentor, index) => (
              <Link href={"/mentors/" + mentor.viewsId}>
                <Tr key={index} _hover={{cursor: "pointer", border: "1px", borderColor: "blue.300"}}>
                  <Td>{mentor.firstName}</Td>
                  <Td>{mentor.lastName}</Td>
                  <Td>{mentor.volunteerRole.replaceAll("|", ", ")}</Td>
                  <Td>{mentor.volunteerStatus}</Td>
                </Tr>
              </Link>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </ParentLayout>
  );
}