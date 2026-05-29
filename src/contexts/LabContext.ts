import { createContext, type Dispatch, type SetStateAction } from "react";
import type { DifficultyLevels, FileType, QuestionTypes } from "../types/quiz.types";


export type QuizForm = {
    qTypes: QuestionTypes[];
    difficulty: DifficultyLevels; 
    number: number;
    file: null | File;
    file_type: FileType;
    // mode: "quiz" | "extract";
}

export const defaultState = {
    form: {
        difficulty: 'regular' as DifficultyLevels,
        qTypes: ['MCQ'] as QuestionTypes[],
        number: 5,
        file: null,
        file_type: 'text' as FileType,
        // mode: "quiz" as "quiz" | "extract"
    },
    setForm: () => {},
    generating: false,
    filePages: 0,
    setFilePages: () => {},
    setGenerating: () => {},
}

export const LabContext = createContext<{
    form: QuizForm;
    filePages: number;
    setFilePages: Dispatch<SetStateAction<number>>,
    setForm: Dispatch<SetStateAction<QuizForm>>,
    generating: boolean,
    setGenerating: Dispatch<SetStateAction<boolean>>,
}>(defaultState);