import { 
    VStack, 
    Heading, 
    Flex, 
    HStack, 
    Link,
    Center,
    Text, 
    Box, 
    List,
    ListItem, 
    RadioGroup, 
    Radio, 
    Stack } from "@chakra-ui/react"
import { 
    Cell, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Sector } from 'recharts';

interface PropsDemographicContent {
  dataChart: {value:number, text: string}[];
  colors: string[];
  title: string; 
  onOpen:  () => void;
  handleChange: (event:any) => void;
}

export const DemographicContent = ({dataChart,colors,title, onOpen, handleChange}: PropsDemographicContent) =>{
  
  return(
    <Flex h="full" width="42vw" >
    <VStack h="full" w="full" alignItems="flex-start" bg="white">
      <Flex width="full" pt={3}> 
        <Center width="full"> 
          <Heading size="md">{title}</Heading>
        </Center> 
        <Center width="full" justifyContent="flex-end" mr={2}>
          <Link onClick={onOpen}><Heading size="sm">See more details</Heading></Link>
        </Center>
      </Flex>
      <Flex width="full" pl={10}>
        <RadioGroup defaultValue="1" onChange={handleChange}>
          <Stack spacing={5} direction="row">
            <Radio value="1">
              Age
            </Radio>
            <Radio value="2">
              Ethnicity
            </Radio>
            <Radio value="3">
              Location of Birth
            </Radio>
          </Stack>
        </RadioGroup>
      </Flex>  
      <Flex width="full" height="full">
        <ResponsiveContainer width="50%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              data={dataChart}
              cx="50%"
              cy="50%"
              outerRadius={75}
            >
              {dataChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Center>  
          <List>
            {dataChart.map((entry, index) => (
                <ListItem key={index}><HStack><Box h="10px" w="10px" bg={colors[index % colors.length]}></Box><Text>{entry.text}</Text></HStack></ListItem>
              ))}
          </List> 
          
        </Center> 
               
      </Flex>
    </VStack>
  </Flex>
    ) 
      
}