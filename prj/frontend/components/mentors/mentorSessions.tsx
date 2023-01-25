import {
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,

} from "@chakra-ui/react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { useState } from "react"
import { IViewsMentorSessions } from "../../../shared/src/entities/viewsSessions";
import { parseDateStrToDate } from "../../util/parseDate";

export default function MentorSessions(props) {
  
  const filterSessions = () => {
    return props.mentorSessions.filter((session: IViewsMentorSessions) => {
      const sessionDate: Date = parseDateStrToDate(session.startDate.toString());
      const startDate: Date = new Date(Date.UTC(dates.startDate.getFullYear(), dates.startDate.getMonth(), dates.startDate.getDate()));
      const endDate: Date = new Date(Date.UTC(dates.endDate.getFullYear(), dates.endDate.getMonth(), dates.endDate.getDate()));
      return (sessionDate >= startDate && sessionDate <= endDate);
    })
  }

  const today: Date = new Date;
  const startDate: Date = props.mentorStartDate;

  const [dates, setDates] = useState(
    {
      startDate: startDate,
      endDate: today,
      key: 'selection'
    }
  );
  const filteredSessions = filterSessions();

  return (
    <VStack w="full" h="full" alignItems="flex-start" pt={10}>
      <Heading size="xl" p={5}>Session History</Heading>
      <DateRangePicker 
        ranges={[dates]}
        onChange={item => setDates(item.selection)}
      />
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Date</Th>
              <Th>Duration (Hours:Minutes)</Th>
              <Th>Attended</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSessions.map(session => (
                <Tr key={session.sessionID}>
                  <Td>{session.title}</Td>
                  <Td>{parseDateStrToDate(session.startDate.toString()).toUTCString().slice(0, 16)}</Td>
                  <Td>{session.duration}</Td>
                  <Td>{session.status == "Attended" ? "Yes" : "No"}</Td>
                </Tr>
            ))}
          </Tbody>
        </Table>
    </VStack>
  );
}