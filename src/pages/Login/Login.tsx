import { Flex, Button, Card, Field, Input, Stack, Box } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input";
import { Link, Navigate } from "react-router-dom"
import useLogin from "./useLogin";
import { LuLoader } from "react-icons/lu";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function Login() {
      const {
        form,
        isValid,
        isLoading, 
        handleEmailChange, 
        handlePasswordChange, 
        handleLogin
    } = useLogin();

    const {user} = useContext(AuthContext);     
    if(user) return <Navigate to="/" /> 
  
    return (
    <Flex w={"full"} h={"full"}>
          <Card.Root minW="sm" m={"auto"}>
            <Card.Header>
            <Card.Title>Login</Card.Title>
            <Card.Description>
                Fill in the form below to login.
            </Card.Description>
            </Card.Header>
            <Card.Body>
            <Stack gap="4" w="full">
                <Field.Root invalid={!isValid.email}>
                <Field.Label>Email</Field.Label>
                    <Input value={form.email} onChange={handleEmailChange}/>
                    <Field.ErrorText>Please enter a valid email address.</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!isValid.password}>
                <Field.Label>Password</Field.Label>
                    <PasswordInput value={form.password} onChange={handlePasswordChange}/>
                    <Field.ErrorText>
                        Password: 8+ characters, at least 1 letter.
                    </Field.ErrorText>

                </Field.Root>
            </Stack>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <Link to="/register">
                    <Button variant="outline">Sign Up</Button>
                </Link>
                <Button variant="solid" onClick={handleLogin}>
                    {isLoading ? <Box animation={"spin"}><LuLoader/></Box> : "Submit" }
                </Button>
            </Card.Footer>
        </Card.Root>
    </Flex>  )
}

export default Login