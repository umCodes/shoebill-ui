import { useEffect, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router";
import type { ClearUp, FIB, MCQ, Quiz, SAQ, TF } from "../types/quiz.types";
import { getQuiz } from "../services/quiz.services";
import "../styles/Quiz.css";
import { logger } from "../utils/logs";

// ─── Types ────────────────────────────────────────────────────────────────────

type Choice = {
  answer: string | boolean;
  correct: boolean;
};

// ─── useQuiz hook ─────────────────────────────────────────────────────────────

function useQuiz() {
  const { id } = useParams();

  const [points, setPoints] = useState(0);
  const [quiz, setQuiz] = useState<Quiz | ClearUp>();
  const [question, setQuestion] = useState<MCQ | TF | SAQ | FIB | null>(null);
  const [answered, setAnswered] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [opted, setOpted] = useState(false);
  const [answer, setAnswer] = useState("");

  function handleNext() {
    if (!quiz) return;
    if (index === quiz.questions.length - 1) {
      setAnswered([]);
      setPoints(0);
      setIndex(0);
      return;
    }
    setIndex((prev) =>
      prev + 1 < quiz.questions.length ? prev + 1 : prev
    );
    setOpted(false);
  }

  function handleBack() {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setOpted(false);
  }

  function handleAnswer(e: ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(e.target.value);
    setOpted(false);
  }

  function handleOpted(opt: Choice) {
    setOpted((prev) => !prev);
    setAnswered((prev) => [...prev, index]);
    if (!answered.includes(index) && opt.correct)
      setPoints((prev) => prev + 1);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (quiz) setQuestion(quiz.questions[index]);
  }, [index, quiz]);

  useEffect(() => {
    async function handleQuiz() {
      if (!id) return;
      try {
        const response = await getQuiz(id);
        setQuiz(response);
      } catch (error) {
        logger.error(error);
      }
    }
    handleQuiz();
  }, [id]);

  return {
    quiz,
    points,
    question,
    index,
    answer,
    setIndex,
    opted,
    setOpted,
    setPoints,
    answered,
    setAnswered,
    handleAnswer,
    handleNext,
    handleBack,
    handleOpted,
  };
}

// ─── Quiz Component ───────────────────────────────────────────────────────────

export default function Quiz() {
  const {
    quiz,
    points,
    index,
    setOpted,
    opted,
    question,
    handleOpted,
    handleBack,
    handleNext,
  } = useQuiz();
  // const navigate = useNavigate();
  if (!quiz) return null;

  const progress = ((index + 1) / quiz.questions.length) * 100;
  const quizTitle =
    quiz.type === "Quiz"
      ? (quiz as Quiz).topic
      : (quiz as ClearUp).title;

  return (
    <div className="quiz-wrap">
      {/* Breadcrumb */}
      <nav className="quiz-breadcrumb">
        <Link to="/history">History</Link>
        <span className="quiz-breadcrumb-sep">›</span>
        <span className="quiz-breadcrumb-current">{quizTitle}</span>

        <span className="quiz-pts-badge">{points} / {quiz.questions.length} pts</span>
      </nav>
      <div className="scrollable">
        {/* Question */}
        <div className="quiz-question-section">
          <p className="quiz-badge">
          <span className="quiz-badge-dot"/>
            Question {index + 1} of {quiz.questions.length}
          </p>
          <div className="quiz-progress-track">
            <div
              className="quiz-progress-range"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="quiz-question-text">{question?.question}</p>
        </div>

        {/* Options */}
        <div>
          <div className="quiz-options">
            {(question?.type === "MCQ" || question?.type === "TF") &&
              question.options.map((option: Choice) => {
                let cls = "quiz-option-btn";
                if (opted) {
                  cls += option.correct ? " correct" : " incorrect";
                }
                return (
                  <button
                    key={String(option.answer)}
                    className={cls}
                    onClick={() => handleOpted(option)}
                  >
                    {String(option.answer)}
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Controls */}

      <div className="quiz-footer">
        <div className="quiz-explanation">
          <p className="quiz-explanation-label">Explanation</p>
          {opted ? (
            <p className="quiz-explanation-text">{question?.explanation}</p>
          ) : (
            <p className="quiz-explanation-placeholder">
              Select an answer or click "Show" to reveal
            </p>
          )}
        </div>

      <div className="quiz-controls">
        <button className="quiz-ctrl-btn" onClick={handleBack}>
          ← Back
        </button>
        <button
          className="quiz-ctrl-btn show"
          onClick={() => setOpted(true)}
          >
          👁 Show
        </button>
        <button className="quiz-ctrl-btn primary" onClick={handleNext}>
          Next →
        </button>
      </div>
      </div>
    </div>
  );
}
