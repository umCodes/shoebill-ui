import { useColorMode } from "@/components/ui/color-mode";
import { difficultyLevels, questionTypes, questionTypesLongForm } from "@/types/quiz.types";
import { Field, NativeSelect, Input, Checkbox, Stack, Heading, HStack, RadioCard, FileUpload, Button, Box, Text, Grid, Flex } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi"
import { LuCoins, LuInfo, LuLoader } from "react-icons/lu";
import useLab from "../useLab";
import { creditsPerPage } from "@/constants/credits.constants";
import { maxNumOfQuestions } from "@/constants/constriants.constants";
import FileCard from "@/ui/FileCard";

const QuizForm = () => {
    const {form, filePages, credits, generating, handleFileUpload, handleNumberChange, handleDifficultyChange, handleQTypesChange, handleFileType, handleQuizGeneration} = useLab();

    return (
        <Stack maxW={{base: 420, mdDown: 320}}  marginInline={"auto"}>
            {/*File*/}
            <FileUpload.Root margin={2} maxW={280}>
                <Heading size="sm">File</Heading>
                <FileUpload.HiddenInput 
                    accept='.pdf' 
                    onChange={handleFileUpload} 
                />
                <FileUpload.Trigger asChild>
                    <Button variant="outline" size="md">
                        <HiUpload /> Upload file
                    </Button>
                </FileUpload.Trigger>
                <Flex flexDirection={"column"} gap={1}>                    
                    {(form.file) && <FileCard name={form.file.name} pages={filePages}/>}
                </Flex>
            </FileUpload.Root>


            {/*Number*/}
            <Field.Root margin={2}>
                <Field.Label fontWeight={600}>
                    Number
                    <Field.RequiredIndicator />
                </Field.Label>
                <Input 
                    type="number" 
                    placeholder="0" 
                    maxW={280}
                    value={form.number}
                    onChange={handleNumberChange}
                    max={maxNumOfQuestions}
                    min={5}
                />
                <Field.HelperText >
                </Field.HelperText>
                <Field.ErrorText />
            </Field.Root>
        
            {/*Difficulty*/}
            <Stack  margin={2} maxW={240}>
                <Heading size="sm">Difficulty</Heading>
                <NativeSelect.Root size="lg">
                <NativeSelect.Field textTransform={"capitalize"} value={form.difficulty} onChange={handleDifficultyChange} backgroundColor={useColorMode().colorMode === 'dark' ? "black" : "white"}>
                    {difficultyLevels.map((level) => (<option key={level} className="capitalize" value={level}>{level}</option>))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
                </NativeSelect.Root>

            </Stack>

            {/*Question Types*/}
            <Stack  margin={2}>
                <Heading size="sm" marginY={2}>Question Types</Heading>
                <Stack align="flex-start" flex="1" gap="4" marginLeft={2}>  
                    {questionTypes.map((type) => 
                    (<Checkbox.Root key={type} variant="subtle" value={type} checked={form.qTypes.includes(type)} onCheckedChange={() => handleQTypesChange(type)}>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{questionTypesLongForm[type]}</Checkbox.Label>
                    </Checkbox.Root>)
                    )}    
                </Stack>  
            </Stack>

            {/* File Type */}
            <RadioCard.Root defaultValue="next" maxW={420} margin={2} value={form.file_type}>
                <RadioCard.Label fontWeight={600}>Select File Type</RadioCard.Label>
                <HStack align="stretch">
                    <RadioCard.Item value="text">
                        <RadioCard.ItemHiddenInput onChange={handleFileType}/>
                        <RadioCard.ItemControl>
                            <RadioCard.ItemContent>
                                <RadioCard.ItemText>Text PDF</RadioCard.ItemText>
                                <RadioCard.ItemDescription>
                                    <Flex alignItems={"center"} gap={2} marginY={1}>    
                                        <LuCoins/> 
                                        {creditsPerPage["textPDF"]} credits/page
                                    </Flex>
                                </RadioCard.ItemDescription>
                            </RadioCard.ItemContent>
                            <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                    </RadioCard.Item>
                    <RadioCard.Item value="image">
                        <RadioCard.ItemHiddenInput onChange={handleFileType}/>
                        <RadioCard.ItemControl>
                        <RadioCard.ItemContent>
                            <RadioCard.ItemText>Image PDF</RadioCard.ItemText>
                            <RadioCard.ItemDescription>
                                <Flex alignItems={"center"} gap={2} marginY={1}>    
                                    <LuCoins/> 
                                    {creditsPerPage["imagePDF"]} credits/page
                                </Flex>
                            </RadioCard.ItemDescription>
                        </RadioCard.ItemContent>
                        <RadioCard.ItemIndicator />
                        </RadioCard.ItemControl>
                    </RadioCard.Item>
                </HStack>
            </RadioCard.Root>

            <Grid templateColumns="auto 1fr" gap={2} marginY={4} alignItems={"baseline"}>
                <Box color={useColorMode().colorMode === 'dark' ? "white" : "blackAlpha.800"}> 
                    <LuInfo />
                </Box>
                <Box>
                    <Text color="GrayText">
                        This service will generate a quiz based on the uploaded PDF file. Ensure that the file is well-structured and contains clear text.
                    </Text>
                </Box>
            </Grid>
            <Button marginY={8} onClick={handleQuizGeneration} disabled={generating || !filePages}>
                {generating ? <Box animation={"spin"}><LuLoader/></Box> : <> Generate {credits ? <><LuCoins/> {credits}</> : ""}</> }</Button>

        </Stack>
    )
}

export default QuizForm