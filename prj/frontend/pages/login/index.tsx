import { ParentLayout } from "../../components/layout/Layout"
import { useState, useContext } from 'react'
import { AdminLoginRequest } from "../../../shared/src/endpoints/adminLogin";
import {Img, Center, Stack, Flex, Box, Heading, FormControl, FormLabel, Input, Button} from '@chakra-ui/react';
import { useAuth } from "../../contexts/auth"

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const auth = useAuth();

    function handleSubmit(e){
        e.preventDefault()

        const parameters: AdminLoginRequest = {
            username: username,
            password: password,
        }

        auth.login(parameters);
    }

    return(
        <Stack >
            <Center>
                <Img src="/baytree-logo.png" margin='50px 0px 10px 0px' align='center top' boxSize='300px'  />
            </Center>
            <Box p={2}>
                <Box textAlign="center">
                    <Heading color='#282828'>Administrator Login</Heading>
                </Box>
            </Box>
            <Flex width="full" align="center" justifyContent="center">
                <Box my={4} maxWidth= "600px" textAlign="left">
                    <form onSubmit={handleSubmit}>
                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input 
                                type="username" 
                                onChange={event => setUsername(event.currentTarget.value)}/>
                        </FormControl>
                        <FormControl mt={6} isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input 
                                type="password" 
                                onChange={event => setPassword(event.currentTarget.value)}/>
                        </FormControl>
                        <Button width="full" mt={4} type="submit">
                            Sign In
                        </Button>
                    </form>
                </Box>
            </Flex>
        </Stack>
      )
}



export default Login
