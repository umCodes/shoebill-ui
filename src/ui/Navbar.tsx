import { Button, Flex } from "@chakra-ui/react"
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({close}: {close: () => void}) => {
  const location = useLocation();
  const style = (path: string) => location.pathname === path ? "solid" : "ghost";

  return (
    <Flex flexDirection={"column"} gap={1} w={"full"} >
      <Link onClick={close} to="/">
        <Button variant={style("/")} w={"full"} justifyContent={"start"}>Home</Button>
      </Link>
      <Link onClick={close} to="/lab">
        <Button variant={style("/lab")} w={"full"} justifyContent={"start"}>Lab</Button>
      </Link>
      <Link onClick={close} to="/history">
        <Button variant={style("/history")} w={"full"} justifyContent={"start"}>History</Button>
      </Link>
      <Link onClick={close} to="/feedback">
        <Button variant={style("/feedback")} w={"full"} justifyContent={"start"}>Feedback</Button>
      </Link>
    </Flex>)
}

export default Navbar