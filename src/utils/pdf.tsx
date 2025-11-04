import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { ClearUp, FIB, MCQ, Quiz, SAQ, TF } from '../types/quiz.types';
import Logo from '../../public/logo.png';

const websiteLink = "";
const appName = "ShoeBill AI"

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => void;
  }
}

export const generateExamPaper = (data: Quiz | ClearUp) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Plain white background with black text - minimalistic style
  const colors = {
    primary: [0, 0, 0] as [number, number, number],
    text: [0, 0, 0] as [number, number, number],
    lightText: [0, 0, 0] as [number, number, number],
    background: [255, 255, 255] as [number, number, number]
  };

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number): void => {
    if (yPosition + requiredHeight > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
      addHeader();
    }
  };

  // Header function for consistency across pages
  const addHeader = (): void => {
    // Logo space reserved at top
    doc.addImage(Logo, 'PNG', margin, 10, 15, 15);
    
    // Brand text next to logo
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.text);
    doc.text(appName , margin + 20, 20);
    
    yPosition = 40;
  };

  // Add initial header
  addHeader();

  // Main Title Section - moderate font size, clear and readable
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  
  const titleText = data.type === "Quiz" ? data.topic.toUpperCase() : data.title.toUpperCase();
  const availableWidth = pageWidth - 2 * margin;
  
  // Calculate optimal title font size (moderate, readable)
  let titleFontSize = 16;
  doc.setFontSize(titleFontSize);
  let titleWidth = doc.getTextWidth(titleText);
  
  while (titleWidth > availableWidth && titleFontSize > 12) {
    titleFontSize--;
    doc.setFontSize(titleFontSize);
    titleWidth = doc.getTextWidth(titleText);
  }
  
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(titleText, titleX, yPosition);
  yPosition += titleFontSize;

  // Quiz metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Description:', margin, yPosition);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition += 10;
  doc.setTextColor(...colors.lightText);
  doc.setFontSize(10);
  
  const topic = data.type === "Quiz" ? data.topic : "Clear-up";
  const difficulty = data.type === "Quiz" ? data.difficulty : undefined;
  
  doc.text(`Topic: ${topic}`, margin, yPosition);
  yPosition += 6;
  
  if (difficulty) {
    doc.text(`Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, margin, yPosition);
    yPosition += 6;
  }
  
  doc.text(`Total Questions: ${data.questions.length}`, margin, yPosition);
  yPosition += 15;

  // Separate questions by type
  const MCQQuestions = data.questions.filter((q): q is MCQ => q.type === "MCQ");
  const TFQuestions = data.questions.filter((q): q is TF => q.type === "TF");
  const SAQQuestions = data.questions.filter((q): q is SAQ => q.type === "SAQ");
  const FIBQuestions = data.questions.filter((q): q is FIB => q.type === "FIB");

  // Section configuration
  const sectionConfig = {
    'MCQ': {
      title: 'SECTION A: MULTIPLE CHOICE QUESTIONS',
      instruction: 'Choose the best answer and circle the corresponding letter.',
      questions: MCQQuestions
    },
    'TF': {
      title: 'SECTION B: TRUE/FALSE QUESTIONS',
      instruction: 'Circle T for True or F for False.',
      questions: TFQuestions
    },
    'SAQ': {
      title: 'SECTION C: SHORT ANSWER QUESTIONS', 
      instruction: 'Write your answers in the space provided.',
      questions: SAQQuestions
    },
    'FIB': {
      title: 'SECTION D: FILL IN THE BLANKS',
      instruction: 'Complete each sentence by filling in the blank(s).',
      questions: FIBQuestions
    }
  };

  const answerKey: Array<{section: string, question: number, answer: string, explanation: string}> = [];

  // Function to render question sections
  const renderSection = (sectionKey: keyof typeof sectionConfig): void => {
    const section = sectionConfig[sectionKey];
    if (section.questions.length === 0) return;

    checkPageBreak(30);
    
    // Section header - clear and professional
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text(section.title, margin, yPosition);
    yPosition += 8;
    
    // Section instruction
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text(section.instruction, margin, yPosition);
    yPosition += 12;

    // Questions in this section
    section.questions.forEach((question, index) => {
      const questionNum = index + 1;
      
      checkPageBreak(30);
      
      // Question number and text - moderate font size, readable
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.text);
      doc.text(`${questionNum}.`, margin, yPosition);
      
      // Question text with proper wrapping
      doc.setFont('helvetica', 'normal');
      const questionLines = doc.splitTextToSize(question.question, pageWidth - 50);
      doc.text(questionLines, margin + 5, yPosition);
      yPosition += questionLines.length * 5 + 5;

      // Handle different question types
      if (sectionKey === 'MCQ' && question.type === 'MCQ') {
        question.options.forEach((option, optIndex) => {
          const optionLabel = String.fromCharCode(65 + optIndex); // A, B, C, D
          checkPageBreak(8);
          
          doc.setFontSize(10);
          doc.text(`${optionLabel})`, margin + 5, yPosition);
          
          const optionLines = doc.splitTextToSize(option.answer, pageWidth - 80);
          doc.text(optionLines, margin + 10, yPosition);
          yPosition += Math.max(optionLines.length * 5, 6);
          
          if (option.correct) {
            answerKey.push({
              section: sectionKey,
              question: questionNum,
              answer: `${optionLabel}) ${option.answer}`,
              explanation: question.explanation
            });
          }
        });
        yPosition += 8;
        
      } else if (sectionKey === 'TF' && question.type === 'TF') {
        doc.setFontSize(10);
        doc.text('T    /    F', margin + 20, yPosition);
        yPosition += 15;
        
        const correctAnswer = question.options.find(opt => opt.correct);
        answerKey.push({
          section: sectionKey,
          question: questionNum,
          answer: correctAnswer?.answer ? 'True' : 'False',
          explanation: question.explanation
        });
        
      } else if ((sectionKey === 'SAQ' && question.type === 'SAQ') || 
                 (sectionKey === 'FIB' && question.type === 'FIB')) {
        // Add answer lines with decent spacing
        yPosition += 5;
        for (let i = 0; i < 4; i++) {
          doc.line(margin + 20, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;
        }
        yPosition += 5;
        
        answerKey.push({
          section: sectionKey,
          question: questionNum,
          answer: question.answers,
          explanation: question.explanation
        });
      }
    });
    
    yPosition += 10;
  };

  // Render all sections (only those with questions)
  Object.keys(sectionConfig).forEach(key => {
    renderSection(key as keyof typeof sectionConfig);
  });

  // Answer Key Section - starts on new page
  doc.addPage();
  yPosition = 20;
  addHeader();

  // Answer Key header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  const answerTitle = 'ANSWER KEY';
  const answerTitleX = (pageWidth - doc.getTextWidth(answerTitle)) / 2;
  doc.text(answerTitle, answerTitleX, yPosition);
  yPosition += 20;

  // Function to render answers by section
  const renderAnswers = (sectionKey: keyof typeof sectionConfig): void => {
    const sectionAnswers = answerKey.filter(answer => answer.section === sectionKey);
    if (sectionAnswers.length === 0) return;

    checkPageBreak(20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text(sectionConfig[sectionKey].title, margin, yPosition);
    yPosition += 10;

    sectionAnswers.forEach(answer => {
      checkPageBreak(25);
      
      // Question number and answer
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${answer.question}.`, margin + 5, yPosition);
      
      doc.setFont('helvetica', 'normal');
      const answerLines = doc.splitTextToSize(answer.answer, pageWidth - 60);
      doc.text(answerLines, margin + 20, yPosition);
      yPosition += answerLines.length * 5 + 3;
      
      // Explanation
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const explanationLines = doc.splitTextToSize(`Explanation: ${answer.explanation}`, pageWidth - 40);
      doc.text(explanationLines, margin + 5, yPosition);
      yPosition += explanationLines.length * 4 + 8;
    });
    
    yPosition += 8;
  };

  // Render all answer sections
  Object.keys(sectionConfig).forEach(key => {
    renderAnswers(key as keyof typeof sectionConfig);
  });

  // Footer on all pages - space for marketing link
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    doc.setTextColor(...colors.lightText);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Marketing link and app branding
    doc.text(`Generated by ${appName} - Exam Paper Generator`, margin, pageHeight - 15);
    doc.text(`${websiteLink}`, margin, pageHeight - 10);
    
    // Page numbering
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 30, pageHeight - 10);
  }

  // Save with appropriate filename
  const filename = data.type === 'Quiz' ? data.topic : data.title;
  doc.save(`${filename}_exam_paper.pdf`);
};
