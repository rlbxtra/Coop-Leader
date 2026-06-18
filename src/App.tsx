/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  User, 
  Info, 
  CheckCircle, 
  Lock, 
  HelpCircle,
  Home,
  Egg,
  TrendingDown
} from 'lucide-react';
import { CoopStyle, Question, ResultDetails, Answer } from './types';
import { QUESTIONS, RESULTS, HERO_IMAGE_PATH } from './data';
import CoopCertificate from './components/CoopCertificate';
import CoopOracle from './components/CoopOracle';

type ActiveScreen = 'welcome' | 'quiz' | 'drumroll' | 'results';

// Fun random placeholders to inspire users
const FUN_NAME_SUGGESTIONS = [
  'Hen-ry Cavill',
  'Yoke-o Ono',
  'Egg-ward Scissorhands',
  'Lady Cluckcluck',
  'Tyrannosaurus Pecks',
  'Goldie Hen'
];

export default function App() {
  const [screen, setScreen] = useState<ActiveScreen>('welcome');
  const [userName, setUserName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<CoopStyle, number>>({
    rooster: 0,
    hen: 0,
    rebel: 0
  });

  // Track answer selections in current session
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  // Results cache
  const [finalStyle, setFinalStyle] = useState<CoopStyle>('rebel');

  const handleStartQuiz = () => {
    setScreen('quiz');
    setCurrentQuestionIndex(0);
    setScores({ rooster: 0, hen: 0, rebel: 0 });
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
  };

  const handleSelectAnswer = (answer: Answer) => {
    if (isAnswerRevealed) return; // Prevent double clicking
    
    setSelectedAnswer(answer);
    setIsAnswerRevealed(true);

    // Increment style scores
    setScores(prev => ({
      ...prev,
      [answer.style]: prev[answer.style] + 1
    }));
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    // Reset answer reveal state
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);

    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Calculate outcome and trigger Hatching screen
      let highestStyle: CoopStyle = 'rebel';
      let maxScore = -1;
      
      const stylesList: CoopStyle[] = ['rooster', 'hen', 'rebel'];
      stylesList.forEach(style => {
        if (scores[style] > maxScore) {
          maxScore = scores[style];
          highestStyle = style;
        }
      });

      setFinalStyle(highestStyle);
      setScreen('drumroll');

      // Stay on drumroll for 3 seconds for beautiful hatching animation
      setTimeout(() => {
        setScreen('results');
      }, 3200);
    }
  };

  const applyRandomName = () => {
    const randIdx = Math.floor(Math.random() * FUN_NAME_SUGGESTIONS.length);
    setUserName(FUN_NAME_SUGGESTIONS[randIdx]);
  };

  // Determine current leading trajectory
  const getCurrentPrediction = (): { style: CoopStyle; levelPercent: number } => {
    let best: CoopStyle = 'rebel';
    let maxVal = -1;
    const stylesList: CoopStyle[] = ['rooster', 'hen', 'rebel'];
    stylesList.forEach(s => {
      if (scores[s] > maxVal) {
        maxVal = scores[s];
        best = s;
      }
    });

    const totalVotes = scores.rooster + scores.hen + scores.rebel || 1;
    const calculated = Math.round((scores[best] / totalVotes) * 100);
    return {
      style: best,
      levelPercent: calculated > 0 ? calculated : 50
    };
  };

  const currentPrediction = getCurrentPrediction();
  const currentLeaderDetails = RESULTS[currentPrediction.style];

  // Map total answers compiled into raw Score Points
  const totalCluckXP = 150 + (scores.rooster * 50) + (scores.hen * 50) + (scores.rebel * 50);

  const heroImgSrc = HERO_IMAGE_PATH;

  return (
    <div id="app-root-container" className="min-h-screen bg-[#FDFBF7] text-[#3D405B] selection:bg-[#F2CC8F] selection:text-[#3D405B] flex flex-col font-sans transition-colors duration-300">
      
      {/* Decorative Warm Farmhouse Header Banner in Bento Neobrutalist design */}
      <header id="app-header" className="border-b-4 border-[#3D405B] bg-white sticky top-0 z-40 py-5 px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E07A5F] border-2 border-[#3D405B] flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(61,64,91,1)]">
              🐔
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tighter text-[#E07A5F] leading-none">
                What Kind of Coop Leader Are You?
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#5D6D5F] font-serif italic mt-0.5">
                Determining your place in the backyard pecking order since 2024.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Real Stats badging as shown in Design HTML */}
            <div className="bg-[#F2CC8F] px-4 py-1.5 rounded-full border-2 border-[#3D405B] font-bold text-xs shadow-[2px_2px_0px_0px_rgba(61,64,91,1)]">
              CLUCKS: {totalCluckXP} XP
            </div>
            <div className="bg-[#81B29A] px-4 py-1.5 rounded-full border-2 border-[#3D405B] font-bold text-xs text-white shadow-[2px_2px_0px_0px_rgba(61,64,91,1)]">
              {screen === 'results' ? 'RANK: MASTER BREEDER' : 'RANK: CHICK-IN-TRAINING'}
            </div>

            {screen !== 'welcome' && (
              <button
                onClick={() => setScreen('welcome')}
                id="btn-nav-home"
                className="flex items-center gap-1 text-xs font-extrabold text-white bg-[#3D405B] hover:bg-[#E07A5F] border-2 border-[#3D405B] px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150-all shadow-[2px_2px_0px_0px_rgba(61,64,91,1)]"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="app-main" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: WELCOME / LANDING - BENTO GRID DESIGN */}
          {screen === 'welcome' && (
            <motion.div
              key="welcome-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-6xl mx-auto w-full"
            >
              {/* Bento Box 1: Left Main Box (span-8) */}
              <div className="md:col-span-8 bg-white border-4 border-[#3D405B] rounded-3xl p-6 sm:p-8 relative shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] flex flex-col justify-between space-y-6">
                
                {/* Rotated badge in upper left */}
                <div className="absolute -top-4 -left-4 bg-[#E07A5F] text-white px-5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-[#3D405B] rotate-[-2deg] z-10 shadow-[2px_2px_0px_0px_rgba(61,64,91,1)]">
                  Backyard Personality Quiz 🌾
                </div>

                <div className="space-y-4 pt-4">
                  <h2 className="font-serif italic text-3xl sm:text-5xl text-[#3D405B] tracking-tight font-black leading-tight">
                    Are you the master of the roost or a master of fences?
                  </h2>

                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                    Every backyard flock is a complex soap opera played out in feathers, scratching dust, and dramatic vocalized outbursts. Explore how your everyday human decisions relate to genuine chicken survival instinct! Are you the strutting supremo, the meticulous caretaker, or the boundary defier? Let’s cluck and find out!
                  </p>
                </div>

                {/* Step selector styled elegantly as a Bento Inner panel */}
                <div className="bg-[#FAF6F0] p-4 sm:p-5 rounded-2xl border-2 border-[#3D405B] space-y-3 shadow-inner">
                  <label htmlFor="user-name-input" className="block text-xs font-display font-black uppercase tracking-widest text-[#3D405B]">
                    ✍️ STEP 1: Enter Your Human Nom De Plume
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E07A5F]" />
                      <input
                        type="text"
                        id="user-name-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Buckbeak McGuire"
                        className="w-full bg-white border-2 border-[#3D405B] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#3D405B] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] placeholder-stone-400 font-bold"
                        maxLength={25}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={applyRandomName}
                      id="btn-randomize-name"
                      className="px-4 py-2 bg-[#81B29A] hover:bg-[#6c9c84] text-white border-2 border-[#3D405B] rounded-xl text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(61,64,91,1)] transition-transform active:translate-y-0.5 cursor-pointer"
                      title="Generate a comical chicken name placeholder"
                    >
                      🎲 Comical Name
                    </button>
                  </div>
                  
                  <span className="text-[10px] text-stone-500 font-mono block">
                    * This name will be hand-printed on your downloadable insignia certificate!
                  </span>
                </div>

                {/* Submitting Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
                  <button
                    onClick={handleStartQuiz}
                    id="btn-enter-coop"
                    className="wood-button flex items-center gap-2 px-8 py-4 rounded-2xl font-bold cursor-pointer text-base text-[#3D405B]"
                  >
                    Hatch the Scenarios
                    <ChevronRight className="w-5 h-5 text-[#3D405B]" />
                  </button>
                  <p className="text-xs text-stone-500 flex items-center gap-1 font-mono font-bold">
                    <Info className="w-4 h-4 text-[#81B29A]" /> 6 Laugh-worthy dilemmas
                  </p>
                </div>

              </div>

              {/* Bento Box 2: Right Image & Dynamic Badging (span-4) */}
              <div className="md:col-span-4 bg-[#81B29A] border-4 border-[#3D405B] rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] text-white flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                
                <div>
                  <span className="text-[10px] bg-white/20 text-white px-2.5 py-1 rounded-full uppercase tracking-wider font-mono font-bold">
                    Yard Mascot Co-Pilot
                  </span>
                  <h3 className="text-2xl font-black uppercase mt-2 tracking-tight leading-none text-amber-100">
                    Chickens.rlbdesigns.com
                  </h3>
                  <p className="text-xs text-emerald-50/90 font-serif leading-relaxed mt-2 italic">
                    Inspired by real farm wisdom. Your ultimate guide to high-elevation vocal cord training, nesting container optimization, and fence jumping.
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-4 border-[#3D405B] bg-white p-1 shadow-md">
                  <img
                    src={heroImgSrc}
                    alt="Cute comical chickens"
                    className="w-full h-auto rounded-xl object-contain animate-float"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#F2CC8F] text-[#3D405B] text-[9px] font-mono uppercase font-black py-0.5 px-2 rounded-full border border-[#3D405B]">
                    Backyard Squad
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-3 rounded-xl border-2 border-[#3D405B] text-[#3D405B] text-center rotate-[2deg] shadow-sm">
                  <span className="text-xs font-mono font-extrabold text-[#E07A5F]">CURRENT MOTTO:</span>
                  <p className="text-xs font-black italic mt-0.5">"If it shines, it must be mine!"</p>
                </div>

              </div>

            </motion.div>
          )}

          {/* SCREEN: QUIZ ACCORDION WITH THEMED SIDEBAR IN BENTO GRID */}
          {screen === 'quiz' && (
            <motion.div
              key="quiz-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto w-full"
            >
              {/* Main Scenario Bento Card: Left (span-8) */}
              <div className="lg:col-span-8 bg-white border-4 border-[#3D405B] rounded-3xl p-6 sm:p-8 relative shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] flex flex-col justify-between">
                
                {/* Rotated layout ornament card header style */}
                <div className="absolute -top-4 -left-4 bg-[#E07A5F] text-white px-5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-[#3D405B] rotate-[-2deg] z-10 shadow-[2px_2px_0px_0px_rgba(61,64,91,1)]">
                  SCENARIO #{currentQuestionIndex + 1}
                </div>

                <div className="mt-4 space-y-4">
                  <span className="text-xs font-mono text-[#81B29A] tracking-wider font-black uppercase block">
                    [ CONFLICT: {QUESTIONS[currentQuestionIndex].scenario.toUpperCase()} ]
                  </span>

                  <h2 className="font-serif italic text-2xl sm:text-3xl text-[#3D405B] font-black leading-tight">
                    {QUESTIONS[currentQuestionIndex].context}
                  </h2>

                  <div className="h-0.5 bg-dashed border-t border-dashed border-stone-300 my-4" />

                  {/* Answers Stack */}
                  <div className="space-y-4 pt-1">
                    {QUESTIONS[currentQuestionIndex].answers.map((ans, idx) => {
                      const isPicked = selectedAnswer?.id === ans.id;
                      const isAnyPicked = selectedAnswer !== null;

                      let hoverStyleClasses = "hover:bg-[#F2CC8F]";
                      if (ans.style === 'hen') hoverStyleClasses = "hover:bg-[#81B29A] hover:text-white";
                      if (ans.style === 'rebel') hoverStyleClasses = "hover:bg-[#E07A5F] hover:text-white";

                      return (
                        <button
                          key={ans.id}
                          disabled={isAnyPicked}
                          onClick={() => handleSelectAnswer(ans)}
                          className={`w-full text-left p-4 sm:p-5 border-2 border-[#3D405B] rounded-2xl transition-all cursor-pointer flex gap-4 items-start ${
                            isPicked
                              ? 'bg-[#F2CC8F] border-[#3D405B] font-bold ring-2 ring-[#3D405B]/10 shadow-inner'
                              : isAnyPicked
                              ? 'bg-stone-50 border-stone-200 text-stone-400 opacity-50'
                              : `bg-[#FDFBF7] border-[#3D405B] ${hoverStyleClasses} shadow-[2px_2px_0px_0px_rgba(61,64,91,1)] hover:-translate-y-0.5 active:translate-y-0`
                          }`}
                        >
                          {/* Option Badge */}
                          <span className="w-8 h-8 flex items-center justify-center bg-[#3D405B] text-white rounded-full font-black text-xs shrink-0 mt-0.5">
                            {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                          </span>

                          <span className="text-sm sm:text-base leading-relaxed font-bold block">
                            {ans.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instant Comical Feedback overlay under answers */}
                <AnimatePresence>
                  {isAnswerRevealed && selectedAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-4 border-t-2 border-dashed border-stone-200 space-y-4"
                    >
                      <div className="bg-emerald-50 border-2 border-[#81B29A] rounded-2xl p-4 text-[#334e3f] text-sm flex gap-3 items-start">
                        <span className="text-xl">💡</span>
                        <div>
                          <strong className="font-display uppercase tracking-widest text-[10px] text-[#81B29A] font-black block mb-0.5">
                            Coop Reaction Feedback:
                          </strong>
                          <p className="font-serif italic leading-relaxed font-bold">
                            "{selectedAnswer.comicalFeedback}"
                          </p>
                        </div>
                      </div>

                      {/* Proceed button */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextQuestion}
                          id="btn-next-question"
                          className="wood-button flex items-center gap-2 px-6 py-3 rounded-xl font-bold cursor-pointer text-xs"
                        >
                          <span>{currentQuestionIndex + 1 === QUESTIONS.length ? 'Write Leadership Insignia' : 'Next Scenario'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

              {/* Sidebar Bento Grid Layout: Right (span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* 1. Trajectory Card (Sage Green / bento style) */}
                <div className="bento-card-green p-6 flex flex-col justify-between min-h-[220px]">
                  <div>
                    <h3 className="text-md font-black uppercase mb-1 tracking-wider text-emerald-50">
                      Live Trajectory
                    </h3>
                    <p className="opacity-90 font-medium text-xs">
                      Your choices are showing strong characteristics of a...
                    </p>
                  </div>

                  <div className="bg-white border-2 border-[#3D405B] p-4 rounded-2xl rotate-[3deg] flex items-center gap-4 text-[#3D405B] my-2">
                    <div className="w-12 h-12 bg-[#F2CC8F] rounded-full border-2 border-[#3D405B] flex items-center justify-center text-2xl">
                      {currentPrediction.style === 'rooster' ? '🐓' : currentPrediction.style === 'hen' ? '🐔' : '🎒'}
                    </div>
                    <div>
                      <p className="font-black text-[#E07A5F] leading-none uppercase text-sm">
                        {currentLeaderDetails.title}
                      </p>
                      <p className="text-[10px] text-[#5D6D5F] font-bold uppercase tracking-wider mt-1">
                        Confidence: {currentPrediction.levelPercent}%
                      </p>
                    </div>
                  </div>

                  <p className="text-white text-[11px] font-bold leading-relaxed italic mt-2">
                    "{currentLeaderDetails.tagline}"
                  </p>
                </div>

                {/* 2. Mini Coop Tracker Stats Card */}
                <div className="bento-card-yellow p-6 flex flex-col justify-between">
                  <h3 className="text-sm font-black uppercase mb-3 tracking-wider text-[#3D405B]">
                    Current Tendencies
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-white p-2.5 border-2 border-[#3D405B] rounded-xl">
                      <p className="text-[10px] font-black uppercase text-[#E07A5F] leading-none mb-1">STRUT/VOLUME</p>
                      <div className="w-full bg-[#eee] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#E07A5F] h-full" style={{ width: `${(scores.rooster / QUESTIONS.length) * 100}%` }} />
                      </div>
                    </div>

                    <div className="bg-white p-2.5 border-2 border-[#3D405B] rounded-xl">
                      <p className="text-[10px] font-black uppercase text-[#81B29A] leading-none mb-1">ORGANIZATION</p>
                      <div className="w-full bg-[#eee] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#81B29A] h-full" style={{ width: `${(scores.hen / QUESTIONS.length) * 100}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="bg-white p-2 border-2 border-[#3D405B] rounded-xl text-center">
                        <p className="text-[8px] font-black uppercase text-stone-500">TRES-PASSING</p>
                        <p className="text-sm font-black mt-0.5">{scores.rebel * 15}%</p>
                      </div>
                      <div className="bg-white p-2 border-2 border-[#3D405B] rounded-xl text-center">
                        <p className="text-[8px] font-black uppercase text-stone-500">REBELLION</p>
                        <p className="text-sm font-black mt-0.5">{scores.rebel * 20}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Comical Unlock Card */}
                <div className="bg-[#3D405B] border-4 border-[#3D405B] rounded-3xl p-5 text-white flex justify-between items-center shadow-[6px_6px_0px_0px_rgba(61,64,91,1)]">
                  <div className="space-y-1.5 flex-1 pr-2">
                    <span className="text-[9px] font-bold text-[#F2CC8F] uppercase tracking-wider block">
                      STATED RECEPTACLE
                    </span>
                    <h4 className="text-xs font-black uppercase">
                      Finish To Claim Card
                    </h4>
                    <p className="text-[10px] opacity-80 leading-tight">
                      A water-colored High-Res leadership seal will be granted instantly!
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#E07A5F] border-2 border-white rounded-2xl flex items-center justify-center text-xl animate-bounce">
                    🎁
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* SCREEN: HATCHING DRUMROLL */}
          {screen === 'drumroll' && (
            <motion.div
              key="drumroll-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto w-full text-center space-y-6 py-12"
            >
              <div className="bento-card p-8 flex flex-col items-center justify-center space-y-6 bg-white border-4 border-[#3D405B]">
                {/* Grand spinning egg animation! */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#F2CC8F]/30 rounded-full blur-2xl animate-pulse" />
                  
                  <motion.div
                    className="text-8xl select-none relative z-10 cursor-default"
                    animate={{
                      y: [0, -12, 0],
                      rotate: [0, -10, 10, -15, 12, -5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🥚
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-serif italic text-3xl text-[#3D405B] font-bold">
                    Hatching Your Score...
                  </h3>
                  <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                    writing custom lead cluck insignia
                  </p>
                  <div className="w-48 h-2 bg-stone-100 border border-[#3D405B]/20 mx-auto rounded-full overflow-hidden mt-1 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3 }}
                      className="h-full bg-[#E07A5F] rounded-full"
                    />
                  </div>
                </div>

                <p className="text-xs text-stone-500 font-serif italic max-w-xs mx-auto">
                  * Alert: Sudden urge to stands on chairs or scream-sing after diagnosis is normal backyard procedure.
                </p>
              </div>
            </motion.div>
          )}

          {/* SCREEN: RESULTS SECTION - MASSIVE BENTO DASHBOARD */}
          {screen === 'results' && (
            <motion.div
              key="results-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto w-full space-y-8"
            >
              
              {/* TOP HEADER CONGRATS PANEL */}
              <div className="bg-white border-4 border-[#3D405B] rounded-3xl p-6 relative shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] text-center space-y-3 max-w-3xl mx-auto overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#E07A5F]" />
                
                <span className="bg-[#F2CC8F] text-[#3D405B] font-mono text-[10px] uppercase font-black tracking-widest border-2 border-[#3D405B] py-1 px-4 rounded-full">
                  COOP DESTINY OFFICIALLY REVEALED
                </span>
                
                <h2 className="font-serif italic text-4xl sm:text-5xl text-[#3D405B] font-black leading-tight">
                  Congratulations, <span className="text-[#E07A5F] not-italic font-black block sm:inline">{userName || 'Dear Farmer'}!</span>
                </h2>
                
                <p className="text-stone-600 text-sm leading-relaxed max-w-xl mx-auto">
                  Your results have successfully broken out of their shells! The Board of Poultry Scholars has determined your final core style of supremacy:
                </p>
              </div>

              {/* CORE RESULTS STATS & ANALYSIS BENTO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Result Main Info Left (5 Cols) */}
                <div className="lg:col-span-12 xl:col-span-5 bg-white border-4 border-[#3D405B] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF6F0]/50 rounded-full blur-xl pointer-events-none" />

                  {/* Icon Representation */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#3D405B] shadow bg-amber-50 relative p-1 bg-white">
                      <img 
                        src={RESULTS[finalStyle].imagePath} 
                        alt="Mascot Mascot" 
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#E07A5F] uppercase tracking-wider font-extrabold blocking">
                        Certified Status:
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black text-[#3D405B] uppercase leading-none">
                        {RESULTS[finalStyle].title}
                      </h3>
                    </div>
                  </div>

                  <div className="h-0.5 bg-stone-200" />

                  {/* Detailed descriptions */}
                  <div className="space-y-4">
                    <p className="font-serif italic text-stone-700 text-base leading-relaxed font-bold">
                      "{RESULTS[finalStyle].tagline}"
                    </p>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {RESULTS[finalStyle].description}
                    </p>
                    <p className="text-stone-600 text-sm leading-relaxed border-l-4 border-[#81B29A] pl-3.5 italic bg-[#81B29A]/5 py-2.5 rounded-r font-serif font-medium">
                      {RESULTS[finalStyle].fullAnalysis}
                    </p>
                  </div>

                  {/* Character Traits Bento Row */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display text-xs font-black text-[#3D405B] uppercase tracking-wider block mb-2">
                        🐓 Character Strengths:
                      </h4>
                      <ul className="space-y-1.5">
                        {RESULTS[finalStyle].strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-stone-600 flex gap-2 items-start leading-relaxed">
                            <span className="text-[#81B29A] font-bold shrink-0">✔</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-display text-xs font-black text-[#3D405B] uppercase tracking-wider block mb-2">
                        ⚠️ Egg-centric Weaknesses:
                      </h4>
                      <ul className="space-y-1.5">
                        {RESULTS[finalStyle].weaknesses.map((weak, idx) => (
                          <li key={idx} className="text-xs text-stone-600 flex gap-2 items-start leading-relaxed">
                            <span className="text-[#E07A5F] font-bold shrink-0">✖</span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Coping Advice */}
                  <div className="bg-[#FDFBF7] rounded-xl p-4 border-2 border-[#3D405B] space-y-1">
                    <h4 className="font-display text-xs font-black text-[#E07A5F] uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Advice for Your Nest Box
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      {RESULTS[finalStyle].copingMechanism}
                    </p>
                  </div>

                  {/* Retake Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleStartQuiz}
                      id="btn-restart-quiz"
                      className="wood-button w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold cursor-pointer text-sm"
                    >
                      <RotateCcw className="w-4 h-4 text-[#3D405B]" />
                      Return to Nest (Retake Quiz)
                    </button>
                  </div>

                </div>

                {/* Right Area (7 Cols): Dynamic Certificate Display */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                  
                  <div className="bg-white border-4 border-[#3D405B] rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#F2CC8F] border-b-2 border-l-2 border-[#3D405B] rotate-[45deg] translate-x-8 -translate-y-8" />
                    
                    <div className="flex gap-2 items-center">
                      <span className="text-xl">📢</span>
                      <div>
                        <h4 className="font-display font-black text-[#3D405B] text-sm uppercase tracking-tight">
                          Shareable Insignia Badge & Card
                        </h4>
                        <p className="text-xs text-stone-500">
                          Click the custom download control to retrieve your hand-painted watercolor certification banner. It's pre-formatted for smooth printing, Twitter notifications, or your personal blog!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rendering the dynamic certificate element */}
                  <CoopCertificate 
                    userName={userName.trim()} 
                    style={finalStyle} 
                    details={RESULTS[finalStyle]} 
                  />

                </div>

              </div>

              {/* SECTION: AI CHICKEN ORACLE CHAT DYNAMIC WRAPPER */}
              <div className="border-t-4 border-[#3D405B] pt-12 space-y-6 text-center">
                <div className="max-w-2xl mx-auto space-y-3">
                  <span className="bg-[#FAF6F0] text-[#3D405B] font-mono text-[10px] uppercase font-black tracking-widest border-2 border-[#3D405B] py-1.5 px-4 rounded-full shadow-[2px_2px_0px_0px_rgba(61,64,91,1)] inline-block">
                    COOP DISPENSATION CHALICE
                  </span>
                  <h3 className="font-serif italic text-3xl sm:text-4xl text-[#3D405B] font-black tracking-tight">
                    Consult the Oracle: Ask Clarissa!
                  </h3>
                  <p className="text-stone-600 text-sm sm:text-base leading-relaxed px-4">
                    Got a secular struggle in your daily career, roommate boundaries, or alarm-clock routine? Clarissa the Wise Chicken Oracle stands ready to translate your real-life issues into farm-logic advice!
                  </p>
                </div>

                <div className="pt-2">
                  <CoopOracle 
                    userName={userName.trim()} 
                    style={finalStyle} 
                    styleTitle={RESULTS[finalStyle].title} 
                  />
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Decorative Warm Farmhouse Footer */}
      <footer id="app-footer" className="bg-[#3D405B] text-white py-8 px-6 mt-12 border-t-4 border-[#E07A5F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-bold">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-display font-black text-[#F2CC8F] tracking-wide uppercase text-sm block">
              What Kind of Coop Leader Are You?
            </span>
            <p className="text-stone-300 text-xs font-normal max-w-md leading-relaxed">
              A lighthearted backyard exploration program. Beautiful country-style typography customized to synchronize with the <strong>chickens.rlbdesigns.com</strong> blog aesthetic.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-xs text-stone-300">
            <span className="text-[10px] font-mono text-[#F2CC8F] tracking-widest uppercase font-bold">
              Deployment Environment
            </span>
            <span className="font-serif italic block">
              GitHub & Cloudflare Pages Production-Ready Stack
            </span>
            <p className="text-[10px] uppercase tracking-tighter opacity-80 mt-1">© 2026 CHICKENS.RLBDESIGNS.COM • NO BIRDS WERE HARMED IN THE MAKING</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

