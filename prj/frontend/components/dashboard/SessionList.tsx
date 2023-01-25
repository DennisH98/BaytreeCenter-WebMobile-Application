import { Flex } from "@chakra-ui/react"

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
  } from '@chakra-ui/react'

export const SessionList = ({sessionsList}) =>{
  
  return(
    <Table variant='simple' size="lg">
      <Thead>
        <Tr>
          <Th>Session ID</Th>
          <Th>Session Name</Th>
          <Th>Start Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        
          {sessionsList.map(sessionGroup => (
            sessionGroup.map(sessions =>(
              <Tr key={sessions.sessionID}>
                <Td>{sessions.sessionID}</Td>
                <Td>{sessions.name}</Td>
                <Td>{(sessions.startDate).slice(0, 10)}</Td>
              </Tr>
            ))
          ))}
          
        
      </Tbody>
    </Table>

    )       
}