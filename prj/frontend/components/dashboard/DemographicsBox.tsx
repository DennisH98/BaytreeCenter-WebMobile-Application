import React, { useState } from 'react';
import { Flex, HStack, useDisclosure} from "@chakra-ui/react"
import { DemographicContent } from './DemographicContent';
import { ModalComponent } from './ModalComponent';
import {COLORS, MentorAgaData,MentorEthnicData,MentorBirthPlaceData,MenteeAgaData} from './dashboardData/data';

export const DemographicBox = () =>{

  const [mentorDataSet, setMentorDataSet] = useState(MentorAgaData);
  const [menteeDataSet, setMenteeDataSet] = useState(MenteeAgaData);
  const { isOpen: isMentorOpen, onOpen: onMentorOpen, onClose: onMentorClose } = useDisclosure();
  const { isOpen: isMenteeOpen, onOpen: onMenteeOpen, onClose: onMenteeClose } = useDisclosure();

  const handleMentorRadioChange = (e) => {
  
    switch (parseInt(e)){
      case 1:
        setMentorDataSet(MentorAgaData);
        break;
      case 2:
        setMentorDataSet(MentorEthnicData);
        break;
      case 3:
        setMentorDataSet(MentorBirthPlaceData);
        break;
    }
    
  }

  const handleMenteeRadioChange = (e) => {
    console.log(e); 
  }

  return(
    <Flex h="full" width="full" >
      <HStack h="full" width="full">
        
        {/* Box on the Left */}

        <DemographicContent 
          title="Mentor Demographic" 
          dataChart={mentorDataSet} 
          colors={COLORS} 
          onOpen={onMentorOpen}
          handleChange = {handleMentorRadioChange}
        /> 
        
        {/* Box on the Right */}

        <DemographicContent 
          title="Mentee Demographic" 
          dataChart={menteeDataSet} 
          colors={COLORS}
          onOpen={onMenteeOpen} 
          handleChange = {handleMenteeRadioChange}
        />              

      </HStack>  
      <ModalComponent 
        modalTitle="Mentor Demographics"
        isOpen={isMentorOpen}
        onClose={onMentorClose}
      > 

      </ModalComponent>   

      <ModalComponent 
        modalTitle="Mentee Demographics" 
        isOpen={isMenteeOpen}
        onClose={onMenteeClose} 
      >
        
      </ModalComponent>   
    </Flex>
    ) 
      
}