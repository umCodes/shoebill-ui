import { QuizesContext } from "@/contexts/QuizesContext"
import { Badge, Box, Button, ButtonGroup, Card, Checkbox, Grid, Heading, HStack, IconButton, NativeSelect, Pagination, Stack, Text } from "@chakra-ui/react"
import { useContext } from "react"
import useHistory, { levelColorsHex, sorts } from "./useHistory";
import { LuChevronLeft, LuChevronRight, LuCoins, LuDownload, LuTrash } from "react-icons/lu";
import { useColorMode } from "@/components/ui/color-mode";
import { questionTypes, type ClearUp, type Quiz, type Sorts } from "@/types/quiz.types";
import { Link } from "react-router-dom";
import { generateExamPaper } from "@/utils/pdf";
import DialogBtn from "@/ui/DialogBtn";
import HistorySkeleton from "./History.skeleton";


const sortingWays = ['default', 'topic', 'credits', 'questions', 'difficulty'];

function History() {
  const {quizes, quizesTotalLength, page, setPage, handleDeleteQuiz} = useContext(QuizesContext);
  const {order, sortedBy, setSortedBy, qTypes, handleQTypes} = useHistory();
  const quizesToRender =  [...quizes]
    .sort((a,b) => order * sorts[sortedBy](a,b))
    .filter(q => qTypes.every(type => q.question_types.includes(type)))
    .slice((page * 10) - 10, page*10)
  const skeleton = [0,0,0].map(() => <HistorySkeleton />)
  
  return (
    <Grid templateRows={'auto 1fr'} w={"full"} alignItems={"center"} justifyContent={"center"}>
      <HStack align={"flex-start"}>
        <Stack  margin={2} maxW={280}>
            <Heading marginY={2} size="sm">Difficulty</Heading>
            <NativeSelect.Root size="lg">
            <NativeSelect.Field textTransform={"capitalize"} value={sortedBy} onChange={(e) => setSortedBy(e.target.value as Sorts)} backgroundColor={useColorMode().colorMode === 'dark' ? "black" : "white"}>
                {sortingWays.map((s) => (<option key={s} className="capitalize" value={s}>{s}</option>))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
            </NativeSelect.Root>
        </Stack>

        <Stack  margin={2}>
            <Heading size="sm" marginY={2} >Question Types</Heading>
            <HStack marginTop={"auto"}flex="1" gap="4" marginLeft={2}>  
                {questionTypes.map((type) => 
                (<Checkbox.Root key={type} variant="subtle" value={type} checked={qTypes.includes(type)} onCheckedChange={() => handleQTypes(type)}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{type}</Checkbox.Label>
                </Checkbox.Root>)
                )}    
            </HStack>  
        </Stack>
      </HStack>
      <Pagination.Root count={quizesTotalLength} pageSize={10} defaultPage={page}>
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton onClick={() => setPage(prev => prev - 1)}>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton onClick={() => setPage(page.value)} variant={{ base: "ghost", _selected: "outline" }}>
              {page.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton onClick={() => setPage(prev => prev + 1)}>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
      <Box w={{mdTo2xl: 620, mdDown: "full" }}>
        {
          quizesToRender ? quizesToRender?.map((quiz: ClearUp | Quiz) => (
            <Card.Root key={quiz._id} size="sm" margin={4} >
              <Card.Header>
                <Heading size={{base: "md", mdDown: "sm"}}>{quiz.type === "Quiz" ? quiz.topic : quiz.title}</Heading>
              </Card.Header>
              <Card.Body color="fg.muted">
                    <Stack direction="row" wrap={"wrap"}>
                      <Badge>{quiz.type}</Badge>
                        {quiz.type === "Quiz" && <Badge> <Text color={levelColorsHex[quiz.difficulty]}>{quiz.difficulty}</Text></Badge>}
                      <Badge>{quiz.number} questions</Badge>
                      <Badge>{quiz.generated_from}</Badge>
                      <Badge><LuCoins/>{quiz.credits}</Badge>
                      <Badge>
                          {quiz.question_types?.join(", ")}
                      </Badge>
                    </Stack>
              </Card.Body>
              <Card.Footer >
                <Box>
                  <Text color={"GrayText"} fontSize="sm" fontStyle={"italic"}>
                     created at {quiz.created_at.split('T')[0]}
                  </Text>
                </Box>
                <Box marginLeft={"auto"}>
                    <DialogBtn 
                      button={<IconButton variant={"outline"} size={"md"} >
                        <LuTrash />
                      </IconButton>}
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      title={`Delete ${quiz.type}:  ${quiz.type === "Quiz" ? quiz.topic : quiz.title}`}
                      text="This cannot be undone"
                      colorPalette="red"
                      yes="Delete"
                      no="Cancel"
                    />
                </Box>
                <Box>
                    <Button onClick={() => generateExamPaper(quiz) } variant={"outline"} size={"md"} >
                      <LuDownload />
                      Export
                    </Button>
                </Box>
                <Box>
                  <Link to={`/quiz/${quiz._id}`}>
                    <Button size={"md"} paddingX={8} >
                    View
                    </Button>
                  </Link>
                </Box>
              </Card.Footer>
            </Card.Root>   
          )): skeleton
        }
      </Box>

      
    
    </Grid>
  )
}

export default History