import React, { useEffect, useState } from 'react';
import { 
  VStack, 
  Heading, 
  Flex, 
  HStack, 
  Text, 
  Box, 
  Center,
  useDisclosure,
  Spinner
  } from "@chakra-ui/react"

import { 
  BarChart, 
  Bar,  
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, } from 'recharts';
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import {ViewsAllSessionsFromGroupResponse} from '../../../shared/src/endpoints/viewsAllSessionsFromGroup';
import { apiGet } from '../../util/api';
import {StatsBoxPopover} from './StatsBoxPopover'
import {ModalComponent} from './ModalComponent'
import {SessionList} from './SessionList';
import {SessionData} from './dashboardData/data';

export const StatsBox = () =>{

  //Multiple Modal Contexts
  const { isOpen: isCompletedOpen, onOpen: onCompletedOpen, onClose: onCompletedClose } = useDisclosure();
  const { isOpen: isUpcomingOpen, onOpen: onUpcomingOpen, onClose: onUpcomingClose } = useDisclosure();
  const { isOpen: isPendingOpen, onOpen: onPendingOpen, onClose: onPendingClose } = useDisclosure();
  const { isOpen: isCancelledOpen, onOpen: onCancelledOpen, onClose: onCancelledClose } = useDisclosure();

  const [opacity, setOpacity] = useState({
    numOfCompletedSessions: 1,
    numOfUpcomingSessions: 1,
    numOfPendingSessions: 1,
    numOfCanceledSessions: 1,
  });
  const [dateRange, setDateRange] = useState<any>([null, null]);
  const [startDate, endDate] = dateRange;
  const [chartData, setChartData] = useState(SessionData);
  const [completeSessionData, setCompleteSessionData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  
  const handleChartMouseEnter = (o) =>{
    const barName = o.tooltipPayload[0].dataKey;
    setOpacity({...opacity, [barName]: 0.8});
  }

  const handleChartMouseLeave = (o) =>{
    const barName = o.tooltipPayload[0].dataKey;
    setOpacity({...opacity, [barName]: 1});
  }

  const getSessionsCount = async (id) => { 
    
    let completedSessions;
       
    await apiGet<ViewsAllSessionsFromGroupResponse>("views/sessiongroups/allsessions/"+ id)
    .then((res) => {
      completedSessions = res;
    })
      .catch(() => {
        console.log("Error");
    });
    
    
    return completedSessions;
     
  }

  const handleSessionGroupsChange = (sessions) =>{
  
    let fetches = [];
    let completedSessionsCount = 0;
    let completedSessionsData = [];
    setIsLoading(true);
    sessions.forEach( element => {

      fetches.push(getSessionsCount(element.value));
      
    });

    
    Promise.all(fetches).then((values) => {
      values.forEach(item =>{
        
        completedSessionsCount += item.count;
        completedSessionsData.push(item.sessionsData);
        
      });
      
      let updatedData = [
        {
        numOfCompletedSessions: completedSessionsCount,
        numOfUpcomingSessions: 30,
        numOfPendingSessions: 8,
        numOfCanceledSessions: 10
        }, 
      ];
      setCompleteSessionData(completedSessionsData);
      setChartData(updatedData);
      setIsLoading(false);
    });
    
  }

  return(
    <Flex>
     <VStack bg="white"> 
      <Flex>   
        <Center width="20vw" pl={3}>
          <StatsBoxPopover handleChange={handleSessionGroupsChange} />
        </Center>
        <Center>
            <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
                setDateRange(update);
            }}
            isClearable={true}
            className="date-input"
            placeholderText=" Filter by Date"
            />
        </Center>

        <HStack pl={10}>
            <Box h="50px" w="50px" bg="#9AE6B4"></Box>
            <VStack alignItems="flex-start">
            <Text fontSize="sm">Completed Sessions</Text>
            <Heading size="md">{isLoading ? <Spinner /> : chartData[0].numOfCompletedSessions}</Heading>
            </VStack>
            <Box h="50px" w="50px" bg="#90CDF4"></Box>
            <VStack alignItems="flex-start">
            <Text fontSize="sm" >Upcoming Sessions</Text>
            <Heading size="md">{isLoading ? <Spinner /> : chartData[0].numOfUpcomingSessions}</Heading>
            </VStack>
            <Box h="50px" w="50px" bg="#F6AD55"></Box>
            <VStack alignItems="flex-start">
            <Text fontSize="sm">Pending Sessions to Report</Text>
            <Heading size="md">{isLoading ? <Spinner /> : chartData[0].numOfPendingSessions}</Heading>
            </VStack>
            <Box h="50px" w="50px" bg="#FC8181"></Box>
            <VStack alignItems="flex-start">
            <Text fontSize="sm">Canceled Sessions</Text>
            <Heading size="md">{isLoading ? <Spinner /> : chartData[0].numOfCanceledSessions}</Heading>
            </VStack>
        </HStack>
      </Flex>  
      <Flex width="full" height="30vh">
      <ResponsiveContainer width="100%" height="100%" >
        <BarChart
          data={chartData}
          barGap={50}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis  />  
          
          <Bar name="Completed Sessions" dataKey="numOfCompletedSessions"  fill="#2F855A" opacity={opacity.numOfCompletedSessions} onClick={onCompletedOpen} cursor="pointer" onMouseEnter={handleChartMouseEnter} onMouseLeave={handleChartMouseLeave} />
          <Bar name="Upcoming Sessions" dataKey="numOfUpcomingSessions" fill="#3182CE" opacity={opacity.numOfUpcomingSessions} onClick={onUpcomingOpen} cursor="pointer" onMouseEnter={handleChartMouseEnter} onMouseLeave={handleChartMouseLeave} />
          <Bar name="Pending Sessions" dataKey="numOfPendingSessions" fill="#DD6B20" opacity={opacity.numOfPendingSessions} onClick={onPendingOpen} cursor="pointer" onMouseEnter={handleChartMouseEnter} onMouseLeave={handleChartMouseLeave}/>
          <Bar name="Canceled Sessions" dataKey="numOfCanceledSessions" fill="#E53E3E" opacity={opacity.numOfCanceledSessions} onClick={onCancelledOpen} cursor="pointer" onMouseEnter={handleChartMouseEnter} onMouseLeave={handleChartMouseLeave}/>
        </BarChart>
      </ResponsiveContainer> 
      </Flex>
     </VStack>

     <ModalComponent 
        modalTitle="Completed Sessions" 
        isOpen={isCompletedOpen}
        onClose={onCompletedClose}
     >
       
       <SessionList sessionsList={completeSessionData} />
     </ModalComponent> 

      <ModalComponent 
        modalTitle="Upcoming Sessions" 
        isOpen={isUpcomingOpen}
        onClose={onUpcomingClose} 
      >

      </ModalComponent>  

      <ModalComponent 
        modalTitle="Pending Sessions to Report" 
        isOpen={isPendingOpen}
        onClose={onPendingClose} 
      >

      </ModalComponent>    

      <ModalComponent 
        modalTitle="Cancelled Sessions"
        isOpen={isCancelledOpen}
        onClose={onCancelledClose}
      >
      </ModalComponent>            
    </Flex>
    ) 
      
}