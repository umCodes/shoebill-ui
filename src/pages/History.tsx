import { useState, useMemo, useContext, useEffect, useRef } from 'react';
import '../styles/History.css';
import { useQuiz } from '../contexts/QuizesContext';
import { difficultyLevels, questionTypes, type ClearUp, type DifficultyLevels, type QuestionTypes, type Quiz, type Sorts } from '../types/quiz.types';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FiZap, FiDownload, FiTrash2 } from 'react-icons/fi';
import { generateExamPaper } from '../utils/pdf';
import { useToast } from '../contexts/ToastContext';
import { logger } from '../utils/logs';

const SORT_OPTIONS: { value: Sorts; label: string }[] = [
  { value: 'default',    label: 'Default'     },
  { value: 'topic',      label: 'Topic'       },
  { value: 'credits',    label: 'Credits'     },
  { value: 'questions',  label: 'Questions'   },
  { value: 'difficulty', label: 'Difficulty'  },
];

const sorts = {
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

const PAGE_SIZE = 6;

// ── Sub-components ─────────────────────────────────────────────────────────

interface CheckboxProps {
  label: QuestionTypes;
  checked: boolean;
  onChange: () => void;
}

function HistoryCheckbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="history-checkbox" onClick={onChange}>
      <div className={`history-checkbox__box${checked ? ' history-checkbox__box--checked' : ''}`}>
        {checked && <span className="history-checkbox__tick">✓</span>}
      </div>
      {label}
    </label>
  );
}

interface QuizCardProps {
  quiz: Quiz | ClearUp;
  onDelete: (id: string) => void;
}

function QuizCard({ quiz, onDelete }: QuizCardProps) {
  const {toast} = useToast()
  const navigateTo = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirmDelete) {
      onDelete(quiz._id);
      toast("Quiz Deleted", "error")
    } else {
      setConfirmDelete(true);
      confirmTimerRef.current = setTimeout(() => setConfirmDelete(false), 2500);
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

  return (
    <div className="history-card">
      <div className="history-card__left" onClick={() => navigateTo(`/quiz/${quiz._id}`)}>
        <div className="history-card__topic">{quiz.type}</div>
        <div className="history-card__title">{quiz.type === "Quiz" ? quiz.topic : quiz.title}</div>
        <div className="history-card__meta">
          <span className="history-card__meta-item">{quiz.number} questions</span>
          <span className="history-card__meta-sep">·</span>
          <span className="history-card__meta-item">{quiz.created_at.split("T")[0]}</span>
        </div>
      </div>
      <div className="history-card__right">
        <div className="history-card__actions">
          <button
            className="history-card__action-btn history-card__action-btn--export"
            onClick={() => generateExamPaper(quiz)}
            title="Export as JSON"
            aria-label="Export quiz"
          >
            <FiDownload size={12} />
          </button>
          <button
            className={`history-card__action-btn history-card__action-btn--delete${confirmDelete ? ' history-card__action-btn--confirm' : ''}`}
            onClick={handleDeleteClick}
            title={confirmDelete ? "Click again to confirm" : "Delete quiz"}
            aria-label={confirmDelete ? "Confirm delete" : "Delete quiz"}
          >
            {confirmDelete ? (
              <span className="history-card__action-btn-label">confirm?</span>
            ) : (
              <FiTrash2 size={12} />
            )}
          </button>
        </div>
        <span className={`history-badge history-badge--${quiz.type === "Quiz" ? quiz.difficulty : quiz.generated_from}`}>
          {quiz.type === "Quiz" ? quiz.difficulty : quiz.generated_from}
        </span>
        <div className="history-card__types">
          {quiz.question_types.map((t) => (
            <span key={t} className="history-card__type-pill">{t}</span>
          ))}
        </div>
        <span className="history-card__credits"><FiZap size={10} color="#a777e3" /> {quiz.credits}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="history-empty">
      {/* <div className="history-empty__icon">◻</div> */}
      <div className="history-empty__title">No quizzes yet</div>
      <div className="history-empty__desc">
        Try generating new ones in{' '}
        <Link to="/" className="history-empty__link"><u>Lab</u></Link>.
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function History() {
  const { user } = useContext(AuthContext);
  const { quizes, handleDeleteQuiz } = useQuiz()
  const [sortedBy, setSortedBy] = useState<Sorts>('default');
  const [activeTypes, setActiveTypes] = useState<Set<QuestionTypes>>(new Set([]));
  const [page, setPage] = useState(1);

  const totalCredits = useMemo(() => quizes?.reduce((s, q) => s + q.credits, 0), [quizes]);

  const filtered = useMemo(() => {
    return quizes ? [...quizes].sort(sorts[sortedBy])
      .filter((q) =>
        activeTypes.size === 0
          ? true
          : [...activeTypes].every((t) => q.question_types.includes(t))
      ): []
  }, [quizes, sortedBy, activeTypes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageSlice  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const fromItem = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const toItem   = Math.min(safePage * PAGE_SIZE, filtered.length);

  function toggleType(type: QuestionTypes) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) 
        next.delete(type) 
      else 
        next.add(type);
      return next;
    });
    setPage(1);
  }

  function handleSort(value: string) {
    setSortedBy(value as Sorts);
    setPage(1);
  }

  function handleDelete(id: string) {
    handleDeleteQuiz(id);
  }

  useEffect(() => {
    logger.raw(`quizes: ${quizes}`);
  }, [quizes, user]);

  return (
    <div className="history-page">
      <div className="history-inner">

        {/* Header */}
        <header className="history-header">
          <div className="history-header__badge">
          </div>
        </header>

        {/* Controls */}
        <div className="history-controls">
          <div className="history-controls__group">
            <span className="history-controls__label">Sort by</span>
            <div className="history-controls__select-wrap">
              <select
                className="history-controls__select"
                value={sortedBy}
                onChange={(e) => handleSort(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="history-controls__select-arrow">▾</span>
            </div>
          </div>

          <div className="history-controls__group">
            <span className="history-controls__label">Question Types</span>
            <div className="history-controls__checkboxes">
              {questionTypes.map((type) => (
                <HistoryCheckbox
                  key={type}
                  label={type}
                  checked={activeTypes.has(type)}
                  onChange={() => toggleType(type)}
                />
              ))}
            </div>
          </div>

          {user && (<nav className="history-header__nav">
            <div className="history-header__item">
              <span className="history-header__value"><FiZap size={12} color="#a777e3" /> {totalCredits?.toFixed(2)}</span>
              <span className="history-header__label">Credits Spent</span>
            </div>
            <div className="history-header__item">
              <span className="history-header__value">{quizes?.length}</span>
              <span className="history-header__label">Total Quizzes</span>
            </div>
          </nav>)}
        </div>

        

        {/* Page info */}
        {filtered.length > 0 && (
          <div className="history-page-info">
            showing {fromItem}–{toItem} of {filtered.length}
          </div>
        )}

        {/* Quiz list */}
        <div className="history-list">
          {pageSlice.length === 0
            ? <EmptyState />
            : pageSlice.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  onDelete={handleDelete}
                />
              ))
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="history-pagination">
            <button
              className="history-pagination__btn"
              onClick={() => setPage((p) => p - 1)}
              disabled={safePage === 1}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`history-pagination__btn${n === safePage ? ' history-pagination__btn--active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="history-pagination__btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={safePage === totalPages}
            >
              ›
            </button>
          </div>
        )}

      </div>
    </div>
  );
}