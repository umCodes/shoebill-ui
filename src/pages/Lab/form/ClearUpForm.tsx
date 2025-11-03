import { useColorMode } from "@/components/ui/color-mode";
import {  questionTypes, questionTypesLongForm } from "@/types/quiz.types";
import { Checkbox, Stack, Heading, HStack, RadioCard, FileUpload, Button, Box, Text, Grid, Flex } from "@chakra-ui/react";
import { LuCoins, LuInfo, LuLoader } from "react-icons/lu";
import useLab from "../useLab";
import { creditsPerPage } from "@/constants/credits.constants";
import { HiUpload } from "react-icons/hi";
import FileCard from "@/ui/FileCard";

const ClearUpForm = () => {
    const {form, filePages, credits, generating, handleFileUpload, handleQTypesChange, handleFileType, handleClearUpGeneration} = useLab();
    
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
                    {form.file && <FileCard name={form.file.name} pages={filePages}/>}
                </Flex>            
            
            <Grid templateColumns="auto 1fr" gap={2} alignItems={"baseline"}>
                <Box color={useColorMode().colorMode === 'dark' ? "white" : "blackAlpha.800"}> 
                    <LuInfo />
                </Box>
                <Box>
                    <Text color="GrayText">
                        Only the first 5 pages of the file will be considered.
                    </Text>
                </Box>
            </Grid>
            </FileUpload.Root>

        {/*Question Types*/}
        <Stack  margin={2}>
            <Heading size="sm" marginY={2}>Question Types</Heading>
            <Stack align="flex-start" flex="1" gap="4" marginLeft={2}>  
                {questionTypes.map((type) => 
                (<Checkbox.Root key={type + "-clear-up"} variant="subtle" value={type} checked={form.qTypes.includes(type)} onCheckedChange={() => handleQTypesChange(type)}>
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
                    This service will clear up specified question types in the uploaded PDF file from their answers. Ensure that the file is well-structured and contains clear questions.
                </Text>
            </Box>
        </Grid>
        <Button marginY={8} onClick={handleClearUpGeneration} disabled={generating || !filePages}>
            {generating ? <Box animation={"spin"}><LuLoader/></Box> : <> Generate {credits ? <><LuCoins/> {credits}</> : ""}</> }
        </Button>

    </Stack>
  )
}

export default ClearUpForm