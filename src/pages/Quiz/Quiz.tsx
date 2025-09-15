import { Box, Breadcrumb, Button, Grid, Heading, Progress, Text } from "@chakra-ui/react"
import useQuiz from "./useQuiz"
import Options from "./Options"
import { LuArrowLeft, LuArrowRight, LuEye } from "react-icons/lu"

function Quiz() {
  const { quiz, index, setOpted, opted, question, handleOpted, handleBack, handleNext } = useQuiz()

  if (!quiz) return <></>

  return (
    <Grid
      p={{mdDown: 4}}
      h="full"
      w="full"
      marginX="auto"
      maxW={420}
      templateRows="auto 1fr auto auto"
    >
      {/* Breadcrumb */}
      <Box paddingY={4} px={2}>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
                <Breadcrumb.Link textWrap={"nowrap"} href="/history">History</Breadcrumb.Link>
            </Breadcrumb.Item>
            <Breadcrumb.Separator />
            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink>
                {quiz.type === "Quiz" ? quiz.topic : quiz.title}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Box>

      {/* Question */}
      <Box py={5}>
        <Heading>
          Question {index + 1} of {quiz.questions.length}
        </Heading>
        <Progress.Root
          value={index + 1}
          max={quiz.questions.length}
          my={2}
          mx={2}
          maxW="240px"
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Text m={2}>{question?.question}</Text>
      </Box>

      {/* Options */}
      <Box my={4}>
        {question?.type === "TF" || (question?.type === "MCQ" &&
          question.options.map(option => {
            const style = option.correct ? "green.400" : "red.300"
            return (
              <Options
                key={option.answer}
                choice={option}
                onClick={() => handleOpted(option)}
                style={opted ? style : ""}
              />
            )
          }))}

        <Box p={4}>
          <Text fontWeight="bold">Explanation:</Text> {opted && question?.explanation}
        </Box>
      </Box>

      {/* Controls */}
      <Grid
        templateColumns="1fr auto 1fr"
        gap={2}
        alignItems="center"
        my={8}
        mx={2}
      >
        <Button onClick={handleBack}>
          <LuArrowLeft /> Back
        </Button>

        <Button onClick={() => setOpted(true)}>
          <LuEye /> Show Explanation
        </Button>

        <Button colorPalette="green" onClick={handleNext}>
          Next <LuArrowRight />
        </Button>
      </Grid>
    </Grid>
  )
}

export default Quiz
