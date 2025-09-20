import { useEffect, useState, type ReactNode } from "react"
import { defaultState, LabContext, type QuizForm} from "../contexts/LabContext"
import { getPages } from "@/services/file.services";
import { maxNumOfPagesPerPdf } from "@/constants/constriants.constants";
import { toaster } from "@/components/ui/toaster";

const LabProvider = ({children}: {children: ReactNode}) => {

    const [generating, setGenerating] = useState(false);
    const [form, setForm] = useState<QuizForm>(defaultState.form)
    const [filePages, setFilePages] = useState(0);

    useEffect(() =>{
        (async () => {
            if (!form.file) return;
            const { pages } = await getPages(form.file);
            if(pages > maxNumOfPagesPerPdf){ 
                toaster.create({
                    description: `Max number of pages is ${maxNumOfPagesPerPdf}`,
                    type: "error",
                })
                setForm(prev => ({...prev, file: null}));
                return;
            }
            setFilePages(pages);
        })()
    }, [form.file])
    return (
    <LabContext.Provider value={{form, setForm, filePages, generating, setGenerating, setFilePages}}>
        {children}
    </LabContext.Provider>
  )
}

export default LabProvider