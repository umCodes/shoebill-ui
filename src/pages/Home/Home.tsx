import { Button, Flex, Heading, HStack, Image, Text } from "@chakra-ui/react"
import Logo from "../../../public/Logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

function Home() {
    const {user} = useContext(AuthContext);

  return (
    <Flex w={"full"} h={"full"} gap={2} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
        <Image src={Logo} height={"150px"} />
        <Heading size="4xl">
            ShoeBill AI
        </Heading>
        <Text>
            Generate quizzes instantly and study smarter.
        </Text>
        <HStack gap={2} my={4}>
            {!user ? <>
            <Link to={"/login"}>
                <Button variant={"outline"}>
                    Login
                </Button>
            </Link>
            <Link to={"/register"}>
                <Button>
                    Get Started
                </Button>
            </Link>
            </>: <Link to={"/lab"}>
                <Button>
                    Go to Lab
                </Button>
            </Link>}
            
        </HStack>
        <Text p={4} color="GrayText" >
            © 2025 ShoeBill, All rights reserved.
        </Text>
    </Flex>
  )
}

export default Home