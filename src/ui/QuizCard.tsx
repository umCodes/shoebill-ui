import { Badge, Box, Button, Card, Heading, IconButton, Stack, Text } from "@chakra-ui/react"
import DialogBtn from "./DialogBtn"
import { LuCoins, LuDownload, LuTrash } from "react-icons/lu"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { QuizesContext } from "@/contexts/QuizesContext"
import { generateExamPaper } from "@/utils/pdf"
import type { ClearUp, Quiz } from "@/types/quiz.types"
import { levelColorsHex } from "@/pages/History/useHistory"


const QuizCard = ({quiz}: {quiz: Quiz | ClearUp}) => {
    const {handleDeleteQuiz} = useContext(QuizesContext);
    
    return (
        <Card.Root size="sm" margin={4} >
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
        </Card.Root>)
}

export default QuizCard