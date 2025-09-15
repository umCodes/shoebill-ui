import { Box, Button } from "@chakra-ui/react";
import type { JSX} from "react";



export type Choice = {
    answer: string | boolean;
    correct: boolean;
}

type Props = {
  choice: Choice;
  style: string;
} &  JSX.IntrinsicElements['div'];


const Options = ({ choice, style, ...rest }: Props) => {
  return (
    <Box
      {...rest}
    >
      <Button variant={"outline"} py={2} size={"lg"} borderColor={style} m={2} textWrap={"wrap"} textAlign={"start"} marginX={"auto"} minW={"full"} justifyContent={"flex-start"}>
        {String(choice.answer)}
      </Button>
    </Box>
  );
};


export default Options