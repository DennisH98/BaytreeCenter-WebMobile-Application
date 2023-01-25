import { VStack, Heading, List, ListItem, Img } from "@chakra-ui/react"
import { sidebarItems } from "./data"
import { SideBarItem, fulfillContextCallback } from "./Items"

export const SideBar = () =>{
    return(
        <VStack
            width="15vw"
            height="full"
            bg="#ffffff"
            position="fixed"
            left="0"
            top="0"    
        >
            
            <Img src="/baytree-logo.png"  width="108px" height="130px" mt="25px" mb="15px" />
            <List width="full">
                {sidebarItems.map((item) => (
                    <ListItem key={item.label}>
                        <SideBarItem item={item} contextCallback={fulfillContextCallback(item)} />
                    </ListItem>
                ))}
            </List>  
            
        </VStack>
    ) 
    
    
}


