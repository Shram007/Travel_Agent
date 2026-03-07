import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, ChevronDown, ChevronLeft, ChevronRight, Sparkles, X, Pencil, ArrowRight } from 'lucide-react';
import type { ChatMessage, QuestionnaireAnswers } from '../types/travel';
import { questions } from '../data/questionnaireData';
import { QuestionOptionCard } from './QuestionOptionCard';
import { BudgetSlider } from './BudgetSlider';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  quickReplies: string[];
  isTyping: boolean;
  isQuestionnaireOpen: boolean;
  onQuestionnaireClose: () => void;
  onQuestionnaireComplete: (answers: QuestionnaireAnswers) => void;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isExpanded,
  onToggleExpand,
  quickReplies,
  isTyping,
  isQuestionnaireOpen,
  onQuestionnaireClose,
  onQuestionnaireComplete,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Questionnaire state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [customInput, setCustomInput] = useState('');
  const [direction, setDirection] = useState(1);
  const [sliderValue, setSliderValue] = useState(2500);

  const question = questions[currentStep];
  const totalSteps = questions.length;
  const isLastStep = currentStep === totalSteps - 1;

  // Reset questionnaire state when it opens
  useEffect(() => {
    if (isQuestionnaireOpen) {
      setCurrentStep(0);
      setAnswers({});
      setCustomInput('');
      setDirection(1);
      setSliderValue(2500);
    }
  }, [isQuestionnaireOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isExpanded && !isQuestionnaireOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isExpanded, isQuestionnaireOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleQuickReply = (reply: string) => {
    onSendMessage(reply);
  };

  // Questionnaire handlers
  const goNext = useCallback(() => {
    if (isLastStep) {
      onQuestionnaireComplete(answers);
    } else {
      setDirection(1);
      setCustomInput('');
      setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
    }
  }, [isLastStep, answers, onQuestionnaireComplete, totalSteps]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCustomInput('');
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleOptionSelect = useCallback((optionLabel: string) => {
    if (question.inputType === 'multi-select') {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(optionLabel)
        ? current.filter((v) => v !== optionLabel)
        : [...current, optionLabel];
      setAnswers((prev) => ({ ...prev, [question.id]: updated }));
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: optionLabel }));
      setTimeout(() => goNext(), 250);
    }
  }, [question, answers, goNext]);

  const handleCustomSubmit = useCallback(() => {
    if (!customInput.trim()) return;
    if (question.inputType === 'multi-select') {
      const current = (answers[question.id] as string[]) || [];
      setAnswers((prev) => ({ ...prev, [question.id]: [...current, customInput.trim()] }));
      setCustomInput('');
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: customInput.trim() }));
      setTimeout(() => goNext(), 250);
    }
  }, [customInput, question, answers, goNext]);

  const handleSliderContinue = useCallback(() => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: `$${sliderValue.toLocaleString()}`,
    }));
    goNext();
  }, [question, sliderValue, goNext]);

  const isOptionSelected = (optionLabel: string) => {
    const val = answers[question.id];
    if (Array.isArray(val)) return val.includes(optionLabel);
    return val === optionLabel;
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  // Collapsed pill
  if (!isExpanded) {
    return (
      <motion.button
        onClick={onToggleExpand}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white rounded-xl border border-border shadow-sm px-5 py-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="text-sm text-text-secondary">Ask me anything about travel...</span>
        <MessageCircle size={15} className="text-text-secondary" />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[520px] max-w-[calc(100vw-2rem)]"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
    >
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '480px' }}>

        <AnimatePresence mode="wait">
          {isQuestionnaireOpen ? (
            /* ─── QUESTIONNAIRE MODE ─── */
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              {/* Questionnaire Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="text-sm font-semibold text-text flex-1 mr-3">
                  {question.title}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <button
                      onClick={goPrev}
                      disabled={currentStep === 0}
                      className="p-0.5 rounded hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="tabular-nums font-medium">
                      {currentStep + 1} of {totalSteps}
                    </span>
                    <button
                      onClick={goNext}
                      disabled={isLastStep}
                      className="p-0.5 rounded hover:bg-surface-alt disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <button
                    onClick={onQuestionnaireClose}
                    className="p-1 rounded hover:bg-surface-alt transition-colors text-text-secondary"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              {/* Questionnaire Content */}
              <div className="px-5 py-3 overflow-y-auto" style={{ minHeight: '240px', maxHeight: '340px' }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="space-y-2"
                  >
                    {question.inputType === 'slider' ? (
                      <BudgetSlider
                        min={question.sliderMin!}
                        max={question.sliderMax!}
                        step={question.sliderStep!}
                        prefix={question.sliderPrefix!}
                        presets={question.options}
                        value={sliderValue}
                        onChange={setSliderValue}
                      />
                    ) : (
                      <div className="space-y-1.5">
                        {question.options.map((opt, i) => (
                          <QuestionOptionCard
                            key={opt.id}
                            index={i}
                            label={opt.label}
                            sublabel={opt.sublabel}
                            isSelected={isOptionSelected(opt.label)}
                            onClick={() => handleOptionSelect(opt.label)}
                            multiSelect={question.inputType === 'multi-select'}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Questionnaire Footer */}
              <div className="px-5 py-3 border-t border-border space-y-2">
                {question.allowCustom && (
                  <div className="flex items-center gap-2">
                    <Pencil size={12} className="text-text-secondary flex-shrink-0" />
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                      placeholder="Something else"
                      className="flex-1 bg-transparent text-text placeholder:text-text-secondary/50 text-sm outline-none border-b border-border focus:border-primary pb-0.5 transition-colors"
                    />
                    {customInput.trim() && (
                      <button
                        onClick={handleCustomSubmit}
                        className="p-1 rounded bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
                      >
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  {/* Progress dots */}
                  <div className="flex items-center gap-1">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i === currentStep
                            ? 'w-4 bg-primary'
                            : i < currentStep
                            ? 'w-1.5 bg-primary/40'
                            : 'w-1.5 bg-border'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {question.allowSkip && (
                      <button
                        onClick={goNext}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-surface-alt transition-colors"
                      >
                        Skip
                      </button>
                    )}
                    {(question.inputType === 'multi-select' || question.inputType === 'slider') && (
                      <button
                        onClick={question.inputType === 'slider' ? handleSliderContinue : goNext}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                      >
                        {isLastStep ? 'Done' : 'Continue'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─── CHAT MODE ─── */
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
              style={{ maxHeight: '480px' }}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-text">Travel Assistant</span>
                </div>
                <button
                  onClick={onToggleExpand}
                  className="w-6 h-6 rounded flex items-center justify-center text-text-secondary hover:bg-surface-alt transition-colors"
                >
                  <ChevronDown size={15} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: '200px', maxHeight: '340px' }}>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-surface-alt text-text rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-surface-alt px-4 py-3 rounded-xl rounded-bl-sm flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-text-secondary/40 rounded-full typing-dot" />
                        <div className="w-1.5 h-1.5 bg-text-secondary/40 rounded-full typing-dot" />
                        <div className="w-1.5 h-1.5 bg-text-secondary/40 rounded-full typing-dot" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Replies */}
                <AnimatePresence>
                  {quickReplies.length > 0 && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-1.5 pt-1"
                    >
                      {quickReplies.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-alt text-text border border-border hover:bg-border/50 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="flex-1 bg-surface-alt text-text placeholder-text-secondary text-sm rounded-lg px-3.5 py-2 outline-none border border-border focus:border-primary/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white disabled:opacity-30 hover:bg-primary-dark transition-colors"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
