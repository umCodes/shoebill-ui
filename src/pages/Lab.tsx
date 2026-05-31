import { useContext, useRef, useState } from "react";
import "../styles/Lab.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { creditsPerPage } from "../constants/credits.constants";
import { maxNumOfQuestions, minNumOfQuestions } from "../constants/constriants.constants";
import type { QuizForm } from "../contexts/LabContext";
import type { DifficultyLevels, QuestionTypes } from "../types/quiz.types";
import { createClearUp, createQuiz } from "../services/quiz.services";
import { useToast } from "../contexts/ToastContext";
import { FiZap } from "react-icons/fi";
import { useConfirm } from "../contexts/ConfirmContext";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
// import { Document, Page, pdfjs } from "react-pdf";

const QTYPES: {
  id: QuestionTypes;
  label: string;
  icon?: string;
  short: QuestionTypes;
}[] = [
  { id: "MCQ", label: "Choices",      icon: "", short: "MCQ" },
  { id: "TF",  label: "True/False",   icon: "", short: "TF"  },
  { id: "SAQ", label: "Short Answer", icon: "", short: "SAQ" },
  { id: "FIB", label: "Fill Blanks",  icon: "", short: "FIB" },
];

const DIFFS: DifficultyLevels[] = ["basic", "regular", "intermediate", "advanced", "expert"];

const Lab = () => {
  const {toast} = useToast()
  const {confirm} = useConfirm()
  const { user, logUser, setIsOpen } = useContext(AuthContext);
  const [form, setForm] = useState<QuizForm & { mode: "quiz" | "clear-up"; }>({
    file:       null as File | null,
    number:     5,
    difficulty: "regular",
    qTypes:     ["MCQ"],
    file_type:  "text",
    mode:       "quiz",     });
  const [drag, setDrag] = useState(false);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigateTo = useNavigate();

const [filePages, setFilePages] = useState(0);

  const handleFile = async (f: File) => {
    if (f?.type !== "application/pdf") return;

    set("file", f);

    const arrayBuffer = await f.arrayBuffer();

    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    setFilePages(pdf.numPages);
  };
  const credits =
  creditsPerPage[form.file_type === "text" ? "textPDF" : "imagePDF"] * filePages +
  (form.mode === "quiz" ? form.number : 0);
  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const toggleType = (id: QuestionTypes) =>
    set("qTypes",
      form.qTypes.includes(id)
        ? form.qTypes.length > 1 ? form.qTypes.filter(t => t !== id) : form.qTypes
        : [...form.qTypes, id]
    );

  // const handleFile = (f: File) => {
  //   if (f?.type === "application/pdf") set("file", f);
  // };

  async function handleQuizGeneration() {
    
    if (!user) return setIsOpen(true)
    if(!(await confirm({
      title: "Confirm Generation",
      description: `Generating this quiz will cost you ${credits} credits (${filePages} page${filePages !== 1 ? "s" : ""} × ${creditsPerPage[form.file_type === "text" ? "textPDF" : "imagePDF"]} + ${form.mode === "quiz" ? `${form.number} questions` : "0 questions"}). Do you want to proceed?`,      
      confirmLabel: "Yes, Generate",
      variant: "info",
    }))) return



    if (user.credits < credits) {
      toast("Insufficient Credits", "error");
      return;
    }

    if (!form.file) {
      toast("Please upload a file", "info");
      return;
    }

    if (!form.number || form.number > maxNumOfQuestions || form.number < minNumOfQuestions) {
      toast(
        `Number of questions must be between ${minNumOfQuestions} and ${maxNumOfQuestions}`, 
        "error"
        );
      return;
    }

    const quizForm = new FormData();
        quizForm.append("file",       form.file);
        quizForm.append("number",     String(form.number));
        quizForm.append("difficulty", form.difficulty);
        quizForm.append("file_type",  form.file_type);
        quizForm.append("qTypes",     JSON.stringify(form.qTypes));

    try {
      setGenerating(true);
      const quiz = await (form.mode == "quiz" ? createQuiz(quizForm): createClearUp(quizForm));
      toast("Quiz Generated Successfully",  "success");
      navigateTo(`/quiz/${quiz._id}`);
      console.log(logUser)
      await logUser()
      console.log(quiz);
    } catch (error) {
      console.log(error);
      toast("Something went wrong, please try again.",  "error");
    }
    setGenerating(false);
  }

  const canGenerate = !!form.file && form.qTypes.length > 0;

  const diffClass = (d: string) =>
    form.difficulty === d ? `diff-btn active-${d.toLowerCase()}` : "diff-btn";


  
  return (
    <div>

      {/* 01 Upload */}
      <div className="label">Source File</div>
      <div className="card">
        {!form.file ? (
          <div
            className={`upload-zone${drag ? " drag-over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={e => e.target.files && handleFile(e.target.files[0])}
            />
            <div className="upload-icon">📄</div>
            <div className="upload-text-wrapper">
              <div className="upload-text"><strong>Click to upload</strong> or drag & drop</div>
              <div className="upload-hint">PDF only · Max 50 MB</div>
            </div>
          </div>
        ) : (
          <div className="file-pill">
            <span className="file-pill-icon">📄</span>
            <span className="file-pill-name">{form.file.name}</span>
            <button className="file-pill-remove" onClick={() => set("file", null)}>✕</button>
          </div>
        )}
      </div>

      
      <div className="card mode-toggle">
        {[
          { id: "quiz",    label: "Quiz Generation"     },
          { id: "clear-up", label: "Question Extraction" },
        ].map(m => (
          <label key={m.id} className={`mode-opt${form.mode === m.id ? " active" : ""}`}>
            <input
              type="radio"
              name="mode"
              value={m.id}
              checked={form.mode === m.id}
              onChange={() => set("mode", m.id as "quiz" | "clear-up")}
            />
            {m.label}
          </label>
        ))}
      </div>

      {/* 02 Number + Difficulty — quiz only */}
      {form.mode === "quiz" && (
        <div className="row" style={{ marginBottom: 12 }}>
          <div style={{ flex: "0 0 120px" }}>
            <div className="label">Questions</div>
            <div className="num-control">
              {/* FIX 4: `form.numQ` → `form.number` */}
              <button className="num-btn" onClick={() => set("number", Math.max(1, form.number - 1))}>−</button>
              <span className="num-val">{form.number}</span>
              <button className="num-btn" onClick={() => set("number", Math.min(50, form.number + 1))}>+</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="label">Difficulty</div>
            <div className="diff-group">
              {DIFFS.map(d => (
                // FIX 3: `form.diff` → `form.difficulty`
                <button key={d} className={diffClass(d)} onClick={() => set("difficulty", d)}>{d}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 03 Question Types */}
      <div className="label">Question Types</div>
      <div className="card">
        <div className="qtype-grid">
          {QTYPES.map(q => (
            <button
              key={q.id}
              // FIX 2: `form.types` → `form.qTypes`
              className={`qtype-btn${form.qTypes.includes(q.id) ? " active" : ""}`}
              onClick={() => toggleType(q.id)}
            >
              <span className="qtype-icon">{q.icon}</span>
              {q.label}
              {form.qTypes.includes(q.id) && <span className="qtype-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* 04 PDF Type */}
      <div className="label">PDF Type</div>
      <div className="card">
        <div className="pdf-toggle">
          {/* FIX 5: `form.pdfKind` is now in state */}
          <button className={`pdf-opt${form.file_type === "text" ? " active" : ""}`} onClick={() => set("file_type", "text")}>
            <div>
              <div>
               📝 Text PDF
              </div>
              <div className="file-type-description">
                <FiZap size={10} color="#a777e3" /> 1 per page
              </div>
            </div>
          </button>
          <button className={`pdf-opt${form.file_type === "image" ? " active" : ""}`} onClick={() => set("file_type", "image")}>
            <div>
               🖼 Image PDF    
            </div>          
            <div className="file-type-description">
              <FiZap size={10} color="#a777e3" /> 2 per page
            </div>
          </button>
        </div>
      </div>

      <button className="gen-btn" disabled={!canGenerate || generating} onClick={handleQuizGeneration}>
        {generating ? "Generating…" : form.mode === "quiz" ? "Generate Quiz" : "Extract Questions"}
        {!generating && (
          <>
            <span className="btn-credits"><FiZap size={11} color="#a777e3" /> {credits}</span>
            <span className="arrow">→</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Lab;