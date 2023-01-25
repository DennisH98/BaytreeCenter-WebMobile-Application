import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import {
  Container,
  VStack,
  Img,
  Box,
  Heading,
  Text,
  Center,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react';

import { useToast } from "@chakra-ui/react";

import { apiGet, apiPost } from "../../util/api";
import { MentorAccountResetPasswordRequest } from '../../../shared/src/endpoints/mentorAccount';

import { LoadingSpinner } from '../../components/apiResponseHandler';
import { useAdminAccessPolicy } from "../../util/auth/accessPolicyHook";

export default function MentorPasswordResetPage() {
  const router = useRouter();
  const toast = useToast();

  const token = router.query.token;

  const [tokenValidating, setTokenValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState<boolean>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    apiGet("mentors/password-reset/", token.toString())
      .then((res) => {
        setTokenValidating(false);
        setTokenValid(true);
      })
      .catch((e) => {
        console.error(e);

        setTokenValidating(false);
        setTokenValid(false);
      });
  }, [token]);

  const resetPassword = () => {
    if (!token) {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);
    setIsSubmitting(true);

    apiPost<never, MentorAccountResetPasswordRequest>("mentors/password-reset/", "", {
      token: token.toString(),
      newPassword: newPassword,
    })
      .then(() => {
        setIsSubmitting(false);

        toast({
          title: "Password Successfully Reset",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(() => {
        setIsSubmitting(false);

        toast({
          title: "Error",
          description: "Something went wrong in resetting the password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Container>
      <VStack m="auto">
        <Img src="/baytree-logo.png"  width="108px" height="130px" mt="25px" mb="15px" />            
      </VStack>
      { tokenValidating ? (
        <LoadingSpinner />
      ) : tokenValid ? (
        <Box>
          <Box p={3} mt={5} border="2px" borderRadius="5px" borderColor="#E5E5E5">
            <Text fontSize="lg">Please enter your new password below.</Text>
            <Box mt={3}>
              <FormControl isRequired mb={2}>
                <FormLabel fontSize="xs">New Password</FormLabel>
                <Input type="password" onChange={(e) => setNewPassword(e.target.value)}></Input>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="xs">Confirm New Password</FormLabel>
                <Input type="password" onChange={(e) => setConfirmNewPassword(e.target.value)}></Input>
              </FormControl>
            </Box>
            <Center mt={5}>
              <VStack>
                { !passwordsMatch ? (
                  <Text color="red">Error: Passwords do not match</Text>
                ) : (
                  <></>
                )}
                <Button
                  colorScheme="green"
                  isDisabled={newPassword === "" || confirmNewPassword === ""}
                  onClick={() => resetPassword()}
                  isLoading={isSubmitting}
                >
                  Reset Password
                </Button>
              </VStack>
            </Center>
          </Box>
        </Box>
      ) : (
        <Heading mt={5} color="red">Error: Invalid token</Heading>
      )}
    </Container>
  );
}
