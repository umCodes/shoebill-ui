import { ColorModeButton, useColorMode } from "@/components/ui/color-mode"
import Navbar from "@/ui/Navbar";
import { Avatar, Box, Button, CloseButton, Drawer, Flex, Heading, IconButton, Portal, Text } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { LuCoins, LuLogOut, LuMenu } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import Logo from '../../public/logo.png';
import { AuthContext } from "@/contexts/AuthContext";
import DialogBtn from "@/ui/DialogBtn";

function Header() {
  const {toggleColorMode} = useColorMode()
  const { user, logOutUser } = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const location = useLocation();
  

  const path = location.pathname.replace("/", "");
  return (
    <header>
      <Flex alignItems={"center"} >
        <Avatar.Root variant={"outline"} size={"xl"} m={4} p={2}>
          <Avatar.Image src={Logo} />
        </Avatar.Root>
        <Heading textTransform={"capitalize"} m={2} mx={2}>
            {path || "Home"}
        </Heading>
        
        
        
        <ColorModeButton ml={"auto"} onClick={toggleColorMode}/>
        
        <Drawer.Root open={open} size={"sm"} onOpenChange={(e) => setOpen(e.open)} placement="start">
          <Drawer.Trigger asChild>
            <IconButton variant="outline" size="sm" margin={4}>
                <LuMenu />
            </IconButton>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header display={"flex"} alignItems={"center"} my={8}> 
                  <Avatar.Root variant={"outline"} size={"xl"}  m={2} p={2}>
                      <Avatar.Image src={Logo} />
                  </Avatar.Root>
                  
                  <Box>
                    <Heading>
                      {user?.name || "Menu"}
                    </Heading>
                    <Text fontSize={"sm"} color={"GrayText"}>
                        {user?.email}
                    </Text>
                  </Box>  
                  
                  {user?.credits && <Box fontSize={"sm"} display={"flex"} alignItems={"center"} gap={1} whiteSpace={"nowrap"} color={"GrayText"} my={"auto"} ml={"auto"}>
                          <LuCoins/> 
                          <Text>
                            {user.credits}
                          </Text>
                  </Box>}
                </Drawer.Header>
                <Drawer.Body>
                  <Navbar close={() => setTimeout(() => setOpen(false), 300)} />
                </Drawer.Body>
                <Drawer.Footer my={8}>               
                  {!user ? (<>
                  <Link to="/login">
                    <Button variant={"outline"}>Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                  </>): 
                  <>
                          <DialogBtn 
                        button={<Button bgColor={"red.400"}>
                          Logout <LuLogOut /> 
                      </Button>}
                        onClick={logOutUser}
                        title={`Logout`}
                        text="Do you really want to logout? You can always come back later."
                        colorPalette="red"
                        yes="Logout"
                        no="Cancel"
                    />
                      
                  </>}
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Flex>
    </header>
  )
}

export default Header
