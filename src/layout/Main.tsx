import { Stack } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"



function Main() {

  return (
    <Stack h={"full"}>
      <Outlet />
    </Stack>
  )
}

export default Main