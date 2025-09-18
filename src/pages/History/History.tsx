import { QuizesContext } from "@/contexts/QuizesContext"
import { Box, ButtonGroup, Checkbox, EmptyState, Grid, Heading, HStack, IconButton, NativeSelect, Pagination, Stack, VStack } from "@chakra-ui/react"
import { useContext } from "react"
import useHistory, { sorts } from "./useHistory";
import { LuChevronLeft, LuChevronRight, LuList } from "react-icons/lu";
import { useColorMode } from "@/components/ui/color-mode";
import { questionTypes, type ClearUp, type Quiz, type Sorts } from "@/types/quiz.types";
import HistorySkeleton from "./History.skeleton";
import QuizCard from "@/ui/QuizCard";
import { Link } from "react-router-dom";


const sortingWays = ['default', 'topic', 'credits', 'questions', 'difficulty'];

function History() {
  const { quizes, page, setPage } = useContext(QuizesContext);
  const {order, sortedBy, setSortedBy, qTypes, handleQTypes} = useHistory();
  function renderQuizes(){
    const skeleton = [0,0,0].map(() => <HistorySkeleton />)
    if(!quizes) return skeleton;

    const quizesToRender = [...quizes]
      .sort((a,b) => order * sorts[sortedBy](a,b))
      .filter(q => qTypes.every(type => q.question_types.includes(type)))
      .slice((page * 10) - 10, page*10)
    
    if(quizes.length === 0) return <EmptyHistory />;
    return quizesToRender?.map((quiz: ClearUp | Quiz) => (<QuizCard quiz={quiz} key={quiz._id}/>));


  }

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
      <Pagination.Root count={quizes?.length} pageSize={10} defaultPage={page}>
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
        {renderQuizes()}
      </Box>

      
    
    </Grid>
  )
}





const EmptyHistory = () => {
  return (
    <EmptyState.Root h={"full"}>
      <EmptyState.Content m={"auto"}>
        <EmptyState.Indicator>
          <LuList />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title color="GrayText">You have no Quiz or Clear-up generated yet.</EmptyState.Title>
          <EmptyState.Description color="GrayText">
              Try generating new ones in <Link to="/lab"><u>Lab</u></Link>.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}


export default History