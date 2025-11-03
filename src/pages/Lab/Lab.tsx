import { Flex, SegmentGroup } from "@chakra-ui/react";
import QuizForm from "./form/QuizForm";
import { useEffect, useState } from "react";
import ClearUpForm from "./form/ClearUpForm";
import useLab from "./useLab";

type Services = "Quiz" | "Clear Up";
const Lab = () => {
  const [service, setService] = useState<Services>("Quiz");
  const {setForm} = useLab();

  useEffect(() => {
    if(service === "Quiz") setForm((prev) => ({...prev, file_type: 'text'}));
  }, [service])

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