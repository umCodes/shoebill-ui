import { useContext, useState } from "react"
import { difficultyLevels, type DifficultyLevels, type Quiz, type QuestionTypes, type Sorts, type ClearUp } from "../../types/quiz.types";
import { deleteQuiz } from "../../services/quiz.services";
import { QuizesContext } from "../../contexts/QuizesContext";
import { useNavigate } from "react-router-dom";


export const sorts = {
    'default': (a: (Quiz | ClearUp), b: (Quiz | ClearUp)) => a.credits * b.credits * 0,
    'credits': (a: (Quiz | ClearUp), b: (Quiz | ClearUp)) => b.credits - a.credits,
    'topic': (a: (Quiz | ClearUp), b: (Quiz | ClearUp)) => {
        const el1 = a.type === "Quiz" ? a.topic : a.title;
        const el2 = b.type === "Quiz" ? b.topic : b.title;
        return el1.localeCompare(el2); 
    },
    'questions': (a: (Quiz | ClearUp), b: (Quiz | ClearUp)) => b.questions.length - a.questions.length,
    'difficulty': (a: (Quiz | ClearUp), b: (Quiz | ClearUp)) => { 
        return (a.type === "Quiz" && b.type === "Quiz") ? difficultyLevels.indexOf(b.difficulty.toLowerCase() as DifficultyLevels) - difficultyLevels.indexOf(a.difficulty.toLowerCase()as DifficultyLevels) : 1; 
    },


}

export const levelColorsHex = {
  basic: "#22c55e",        // green-500
  regular: "#3b82f6",      // blue-500
  intermediate: "#ca8a04", // yellow-600
  advanced: "#f97316",     // orange-600
  expert: "#dc2626",       // red-600
};

const useHistory = () => {
    const {quizes, isLoading, setIsLoading} = useContext(QuizesContext)
    const [isDeleting, setIsDeleting] = useState(false);
    const navigateTo = useNavigate();
    const [sortedBy, setSortedBy] = useState<Sorts>('default');
    const [order, setOrder] = useState<1 | -1>(1);
    const [qTypes, setQTypes] = useState<QuestionTypes[]>([]);

      const handleDownload = (quiz: Quiz) => {
        const link = document.createElement("a");
        link.href = `${String(import.meta.env.VITE_BASE_API_PATH)}/api/export/${quiz._id}`; // calls Express
        link.download = `${quiz.topic}.png`; // suggested filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    function handleQTypes(value: QuestionTypes){
         
        if(qTypes.includes(value)){
            console.log(qTypes);
            
            setQTypes([...qTypes.filter(quiz => quiz !== value)])
        }
        else setQTypes([...qTypes, value])
    }

    async function handleDelete(id: string){
                setIsDeleting(true);

            try {
                await deleteQuiz(id);  
                setIsDeleting(false);
                setIsLoading(true);
                navigateTo('/history');

            } catch (error) {
                console.error(error);
                setIsDeleting(false);            
            }
       

    }



    return {
        isLoading,
        handleDelete,
        quizes,
        sortedBy,
        setSortedBy,
        setOrder,
        order,
        qTypes,
        handleQTypes,
        isDeleting,
        handleDownload
    }
}

export default useHistory