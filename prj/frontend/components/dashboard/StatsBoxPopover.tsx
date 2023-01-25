import React, { useEffect, useState } from 'react';
import { Flex, Button } from "@chakra-ui/react"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
} from "@chakra-ui/react"

import Select, {MultiValue} from "react-select"
import { ViewsSessionGroupsListResponse } from '../../../shared/src/endpoints/viewsSessionGroups';
import { apiGet } from '../../util/api';


interface PropsPopover {
  handleChange: (event: MultiValue<any>) => void;
}

export const StatsBoxPopover = ({handleChange}: PropsPopover) =>{
  
  const [allSessionGroups, setSessionGroups] = useState([]);

  const getSessionGroups = () => {
    apiGet<ViewsSessionGroupsListResponse>("views/sessiongroups/")
      .then((res) => {
        let sessionsData =[];
        res.forEach(item => {
            let session = {
                value: item.sessionGroupID,
                label: item.title,
            }
            sessionsData.push(session);
        });
        setSessionGroups(sessionsData);
        
      })
      .catch(() => {
        console.log("Error");
      });
  }

  useEffect(() => {
    getSessionGroups();
  }, []);

  return(
    <Flex>
        <Popover>
        <PopoverTrigger>
            <Button>Select Session Groups</Button>
        </PopoverTrigger>
        <PopoverContent bg="#f3f6f4">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Session Groups</PopoverHeader>
            <PopoverBody>
                <Select 
                options={allSessionGroups} 
                onChange={newValues => handleChange(newValues)}
                isMulti
                />
            </PopoverBody>
        </PopoverContent>
        </Popover>

    </Flex>
    )       
}