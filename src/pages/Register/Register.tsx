import { AuthContext } from "@/contexts/AuthContext";
import { Flex, Button, Card, Field, Input, Stack, Box } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useContext } from "react";
import { Link, Navigate } from "react-router-dom"
import useSignup from "./useSignup";
import { LuLoader } from "react-icons/lu";

function Register() {
    const {
        form,
        isValid,
        isMatching,
        isLoading, 
        handleNameChange,
        handleEmailChange, 
        handlePasswordChange, 
        handleConfirmPassChange, 
        handleSignup
    } = useSignup();
    
    const {user} = useContext(AuthContext);     
    console.log(user);
    if(user) return <Navigate to="/" /> 
  return (
    <Flex w={"full"} h={"full"}>
          <Card.Root minW="sm" m={"auto"}>
            <Card.Header>
            <Card.Title>Sign Up</Card.Title>
            <Card.Description>
                Fill in the form below to create an account.
            </Card.Description>
            </Card.Header>
            <Card.Body>
            <Stack gap="4" w="full">
                <Field.Root invalid={!isValid.name}>
                <Field.Label>Name</Field.Label>
                    <Input value={form.name} onChange={handleNameChange}/>
                        <Field.ErrorText>Please enter a name.</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!isValid.email}>
                <Field.Label>Email</Field.Label>
                    <Input value={form.email} onChange={handleEmailChange} />
                    <Field.ErrorText>Please enter a valid email address.</Field.ErrorText>
                    
                </Field.Root>
                <Field.Root invalid={!isValid.password}>
                <Field.Label>Password</Field.Label>
                    <PasswordInput value={form.password} onChange={handlePasswordChange}/>
                    <Field.ErrorText>Password: 8+ characters, at least 1 letter.</Field.ErrorText>
                    
                </Field.Root>
                <Field.Root invalid={!isMatching}>
                <Field.Label>Confirm Password</Field.Label>
                    <PasswordInput value={form.confirmPass} onChange={handleConfirmPassChange}/>
                    <Field.ErrorText>Passwords do not match.</Field.ErrorText>
                </Field.Root>
            </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Link to="/login">
                    <Button variant="outline">Login</Button>
                </Link>
                <Button variant="solid" onClick={handleSignup}>
                    {isLoading ? <Box animation={"spin"}><LuLoader/></Box> : "Submit" }
                </Button>
            </Card.Footer>
        </Card.Root>
    </Flex>
  )
}

export default Register