import { createContext, type Dispatch, type SetStateAction } from "react";
import type { DifficultyLevels, FileType, QuestionTypes } from "../types/quiz.types";


export type QuizForm = {
    qTypes: QuestionTypes[];
    difficulty: DifficultyLevels; 
    number: number;
    file: null | File;
    file_type: FileType;
}

export const defaultState = {
    form: {
        difficulty: 'regular' as DifficultyLevels,
        qTypes: ['MCQ'] as QuestionTypes[],
        number: 5,
        file: null,
        file_type: 'text' as FileType,
    },
    setForm: () => {},
    generating: false,
    filePages: 0,
    setGenerating: () => {},
}

export const LabContext = createContext<{
    form: QuizForm;
    filePages: number;
    setForm: Dispatch<SetStateAction<QuizForm>>,
    generating: boolean,
    setGenerating: Dispatch<SetStateAction<boolean>>,
}>(defaultState);