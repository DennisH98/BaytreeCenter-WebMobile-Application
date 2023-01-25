import { HStack,Flex } from "@chakra-ui/react"
import { SideBar } from "../sidebar/SideBar"

export const ParentLayout = ({ children }) => 
<Flex height="100vh" 
 width="100vw"
 flex={1}
 overflow="hidden"
 pl ="15vw"
>
  <SideBar />
  {children}
</Flex>