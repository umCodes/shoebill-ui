import { Flex, Field, Input, Textarea, Stack, Button, Box } from "@chakra-ui/react"
import useFeedback from "./useFeedback"
import { LuLoader } from "react-icons/lu"


function Feedback() {
    const {handleSubmit, submiting, setForm, form} = useFeedback()
    

    return (
    <Flex flexDirection={"column"} h={"full"} >
        <Stack m={"auto"}>
            
                    <Field.Root m={2}>
                        <Field.Label fontWeight={600}>
                            Subject
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            w={320}
                            value={form.subject}
                            onChange={e => setForm(prev => ({...prev, subject: e.target.value}))}
                            placeholder="Feature Suggestion" 
                        />
                        <Field.HelperText >
                        </Field.HelperText>
                        <Field.ErrorText />
                    </Field.Root>
                    
                    <Field.Root margin={2}>
                        <Field.Label fontWeight={600}>
                            Message
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Textarea 
                            value={form.message}
                            onChange={e => setForm(prev => ({...prev, message: e.target.value}))}
                            placeholder="Hey, ....." 
                            w={320}
                            h={150}
                        />
                        <Field.HelperText >
                        </Field.HelperText>
                        <Field.ErrorText />
                    </Field.Root>

                <Button marginY={8} onClick={handleSubmit} disabled={submiting}>
                    {submiting ? <Box animation={"spin"}><LuLoader/></Box> : "Submit" }
                </Button>
        </Stack>
    </Flex>
  )
}

export default Feedback