import React, { useState } from 'react';
import { VStack, Heading, Flex } from "@chakra-ui/react"
import { StatsBox } from './StatsBox';
import { DemographicBox } from './DemographicsBox';


export const Dashboard = () =>{
  
  return(
    <VStack w="full" h="full" p={5} alignItems="flex-start" bg="#f3f6f4">

      <Flex>
        <Heading>Dashboard</Heading>
      </Flex>

      <StatsBox />
      <DemographicBox />

    </VStack>
    ) 
      
}