import {
  Heading,
  Text,
  VStack,
  Badge,
  Divider,
  Accordion,
  AccordionButton,
  AccordionItem,
  Box,
  AccordionIcon,
  AccordionPanel,
  SimpleGrid,
} from "@chakra-ui/react";
import { parseDateStrToDate } from "../../util/parseDate";

export default function MentorInformation(props) {

  return (
    <VStack w="full" alignItems="flex-start">
      <Heading size='4xl'>{props.mentorInformation.firstName + " " + props.mentorInformation.lastName}</Heading>
      <Text color="gray.500" fontSize="2xl">{props.mentorInformation.volunteerRole.replaceAll("|", ", ")}</Text>
      <Text color="gray.500">
        Status: <Badge colorScheme={props.mentorInformation.volunteerStatus == "Active" ? "green" : "red"}>{props.mentorInformation.volunteerStatus}</Badge>
      </Text>
      <Divider />
      <Accordion defaultIndex={[0]} allowMultiple w="100%">

        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontSize="2xl">
                General Information
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <SimpleGrid columns={2} spacing={5}>
              <Text>Age: {props.mentorInformation.age}</Text>
              <Text>Date of Birth: {parseDateStrToDate(props.mentorInformation.dateOfBirth).toDateString()}</Text>
              <Text>Gender: {props.mentorInformation.gender}</Text>
              <Text>Ethnicity: {props.mentorInformation.ethnicity}</Text>
              <Text>First Language: {props.mentorInformation.firstLanguage}</Text>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontSize="2xl">
                Contact Information
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
          <SimpleGrid columns={2} spacing={5}>
              <Text>Mobile: {props.mentorInformation.mobile}</Text>
              <Text>Email: {props.mentorInformation.email}</Text>
              <Text>Address: {props.mentorInformation.address}</Text>
              <Text>County: {props.mentorInformation.county}</Text>
              <Text>Town: {props.mentorInformation.town}</Text>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontSize="2xl">
                Volunteer Information
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
          <SimpleGrid columns={2} spacing={5}>
              <Text>Department: {props.mentorInformation.department}</Text>
              <Text>Type: {props.mentorInformation.volunteerRole.replaceAll("|", ", ")}</Text>
              <Text>Status: {props.mentorInformation.volunteerStatus}</Text>
              <Text>Start Date: {parseDateStrToDate(props.mentorInformation.startDate).toDateString()}</Text>
              <Text>End Date: {props.mentorInformation.endDate ? parseDateStrToDate(props.mentorInformation.endDate).toDateString() : "--"}</Text>
              <Text>Notes: {props.mentorInformation.volunteerStatusNotes}</Text>
            </SimpleGrid>
          </AccordionPanel>
        </AccordionItem>

      </Accordion>
    </VStack>
  );
}