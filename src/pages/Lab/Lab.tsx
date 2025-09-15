import { Flex, SegmentGroup } from "@chakra-ui/react";
import QuizForm from "./form/QuizForm";
import { useState } from "react";
import ClearUpForm from "./form/ClearUpForm";

type Services = "Quiz" | "Clear Up";
const Lab = () => {
  const [service, setService] = useState<Services>("Quiz");

  return (
    <>
      <Flex justifyContent={"center"}>
      <SegmentGroup.Root defaultValue="React" size="lg" value={service}>
        <SegmentGroup.Indicator />
      {["Quiz", "Clear Up"].map(item => (
            <SegmentGroup.Item key={item} value={item}>
              <SegmentGroup.ItemText>{item}</SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput onClick={() => setService(item as Services)}/>
            </SegmentGroup.Item>
      ))}
      </SegmentGroup.Root>
      </Flex>
      {service === "Quiz" && <QuizForm/>}
      {service === "Clear Up" && <ClearUpForm/>}
    </>
  )
}

export default Lab