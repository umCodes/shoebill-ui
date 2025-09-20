import { toaster } from "@/components/ui/toaster";
import { maxNumOfQuestions, minNumOfQuestions } from "@/constants/constriants.constants";
import { creditsPerPage } from "@/constants/credits.constants";
import { AuthContext } from "@/contexts/AuthContext";
import { LabContext } from "@/contexts/LabContext";
import { createClearUp, createQuiz } from "@/services/quiz.services";
import { difficultyLevels, questionTypes, type DifficultyLevels,  type QuestionTypes } from "@/types/quiz.types";
import { useContext, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom";


function useLab() {
    const {form, setForm, filePages, setFilePages, generating, setGenerating} = useContext(LabContext)
    const {user} = useContext(AuthContext)
    const navigateTo = useNavigate();
    const credits = creditsPerPage[form.file_type === "text" ? "textPDF" : "imagePDF"] * filePages;



    function handleNumberChange(e: ChangeEvent<HTMLInputElement>){

      setForm({...form, number: Math.round(Number(e.target.value))})
    }

    
    function handleDifficultyChange(e: ChangeEvent<HTMLSelectElement>){
    
        const difficulty = e.target.value as DifficultyLevels;
      if(difficultyLevels.includes(difficulty))
        setForm({...form, difficulty
          })
    }

    function handleQTypesChange(type: QuestionTypes){

      
      if(!form.qTypes.includes(type) && questionTypes.includes(type))
        setForm({...form, qTypes: [...form.qTypes, type]
          })
      else if(form.qTypes.length > 1) setForm({...form, qTypes: [...form.qTypes.filter(t => t !== type)]
        })
    }

    function handleFileUpload(e: ChangeEvent<HTMLInputElement>){

        const selectedFile = e.target.files?.[0] ?? null;

        if(!selectedFile)return;

        setFilePages(0)
        setForm({
            ...form, file: selectedFile,
            file_type: 'text'
        })

      }

      
      const handleFileType = (e: ChangeEvent<HTMLInputElement>) => {
             setForm({
              ...form,
              file_type: e.target.value as "text" |"image"
             })

        }

        async function handleQuizGeneration(){
            if(!user) return navigateTo("/register");
           
            if(user.credits < credits)
                return toaster.create({
                        description: "Insufficient Credits",
                        type: "info",
                    })

            if(!form.file)
                return toaster.create({
                        description: "Please upload a file",
                        type: "info",
                    })
  
            if(!form.number || form.number > maxNumOfQuestions || form.number < minNumOfQuestions)
                return toaster.create({
                        description: `Number of questions must be between ${minNumOfQuestions} and ${maxNumOfQuestions}`,
                        type: "info",
                    })

            const QuizForm = new FormData();

            QuizForm.append('file', form.file)
            QuizForm.append('number', String(form.number))
            QuizForm.append('difficulty', form.difficulty)
            QuizForm.append('file_type', form.file_type)
            QuizForm.append('qTypes', JSON.stringify(form.qTypes))

            try {
                setGenerating(true)
                const quiz = await createQuiz(QuizForm);
                toaster.create({
                    description: "Quiz Generated Successfully",
                    type: "success",
                })
                navigateTo(`/quiz/${quiz._id}`)

                console.log(quiz);
            } catch (error) {
                console.log(error);   
                toaster.create({
                    description: "Something went wrong, please try again.",
                    type: "error",
                })             
            }
            setGenerating(false)
            return
        }
        
        async function handleClearUpGeneration(){
            
            if(!user) return navigateTo("/register");
           
            if(user.credits < credits)
                return toaster.create({
                        description: "Insufficient Credits",
                        type: "info",
                    })

            if(!form.file)
                return toaster.create({
                        description: "Please upload a file",
                        type: "info",
                    })
            const QuizForm = new FormData();

            QuizForm.append('file', form.file)
            QuizForm.append('file_type', form.file_type)
            QuizForm.append('qTypes', JSON.stringify(form.qTypes))

            try {
                setGenerating(true)
                const clearup = await createClearUp(QuizForm);
                toaster.create({
                    description: "Clear Up Generated Successfully",
                    type: "success",
                })
                navigateTo(`/history/${clearup._id}`)

                console.log(clearup);
            } catch (error) {
                console.log(error); 
                toaster.create({
                    description: "Something went wrong, please try again.",
                    type: "error",
                })                            
            }
            
            setGenerating(false)
            return
        }

        return({
            form,
            generating,
            filePages,
            credits,
            handleFileUpload,
            handleNumberChange,
            handleDifficultyChange,
            handleQTypesChange,
            handleFileType,
            handleQuizGeneration,
            handleClearUpGeneration
        })
    
}

export default useLab