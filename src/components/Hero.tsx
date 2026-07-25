import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { getAIResponse, formatMessage, resetConversation } from '../utils/aiService';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Hero.css';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
}

const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  
  // Typing animation state
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [titleDone, setTitleDone] = useState(false);
  const fullTitle = portfolioData.title;

  useEffect(() => {
    setDisplayedTitle('');
    setTitleDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullTitle.length) {
        setDisplayedTitle(fullTitle.substring(0, i + 1));
        i++;
      } else {
        setTitleDone(true);
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [fullTitle]);

  const getWelcomeMessage = useCallback(() => {
    if (language === 'en') {
      return `Hello! 👋 I'm ${portfolioData.firstName}'s AI assistant. You can ask me anything about ${portfolioData.firstName}: experience, projects, skills, contact info and more!`;
    }
    return `Merhaba! 👋 Ben ${portfolioData.firstName}'in AI asistanıyım. Bana ${portfolioData.firstName} hakkında her şeyi sorabilirsiniz: deneyimleri, projeleri, yetenekleri, iletişim bilgileri ve daha fazlası!`;
  }, [language]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: getWelcomeMessage(),
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdRef = useRef(1);
  const requestVersionRef = useRef(0);
  const busyRef = useRef(false);

  const particles = useMemo(() => (
    Array.from({ length: 15 }, (_, index) => ({
      left: `${(index * 37 + 11) % 100}%`,
      animationDelay: `${((index * 17) % 50) / 10}s`,
      animationDuration: `${10 + ((index * 13) % 15)}s`
    }))
  ), []);

  // Reset messages and conversation memory when language changes
  useEffect(() => {
    requestVersionRef.current += 1;
    busyRef.current = false;
    setIsTyping(false);
    resetConversation();
    setMessages([{
      id: 1,
      content: getWelcomeMessage(),
      isUser: false
    }]);
  }, [language, getWelcomeMessage]);

  useEffect(() => () => {
    requestVersionRef.current += 1;
  }, []);

  // Only scroll within chat container, not the whole page
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const submitQuestion = async (question: string) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || busyRef.current) return;

    busyRef.current = true;
    const requestVersion = ++requestVersionRef.current;

    const userMessage: Message = {
      id: ++messageIdRef.current,
      content: cleanQuestion,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
    if (requestVersion !== requestVersionRef.current) return;

    const response = getAIResponse(cleanQuestion, language);
    
    const botMessage: Message = {
      id: ++messageIdRef.current,
      content: response.text,
      isUser: false
    };

    busyRef.current = false;
    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSendMessage = () => {
    void submitQuestion(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (questionTr: string, questionEn: string) => {
    const question = language === 'en' ? questionEn : questionTr;
    void submitQuestion(question);
  };

  const suggestions = language === 'en' ? [
    { text: "🧑‍💻 Who is Laçin?", questionTr: "Laçin kimdir?", questionEn: "Who is Laçin?" },
    { text: "🔐 Cyber Security", questionTr: "Siber güvenlik alanında ne yapıyor?", questionEn: "What does he do in cyber security?" },
    { text: "🚀 Projects", questionTr: "Projeleri nelerdir?", questionEn: "What are his projects?" },
    { text: "🤖 AI Skills", questionTr: "Yapay zeka ve AI yetenekleri nelerdir?", questionEn: "What are his AI skills?" },
    { text: "💼 Experience", questionTr: "İş deneyimi nedir?", questionEn: "What is his work experience?" },
    { text: "📫 Contact", questionTr: "İletişim", questionEn: "Contact info" },
    { text: "🎓 Education", questionTr: "Eğitim geçmişi nedir?", questionEn: "What is his education background?" },
    { text: "🌍 Languages", questionTr: "Hangi dilleri konuşuyor?", questionEn: "What languages does he speak?" }
  ] : [
    { text: "🧑‍💻 Laçin kimdir?", questionTr: "Laçin kimdir?", questionEn: "Who is Laçin?" },
    { text: "🔐 Siber Güvenlik", questionTr: "Siber güvenlik alanında ne yapıyor?", questionEn: "What does he do in cyber security?" },
    { text: "🚀 Projeleri", questionTr: "Projeleri nelerdir?", questionEn: "What are his projects?" },
    { text: "🤖 AI Yetenekleri", questionTr: "Yapay zeka ve AI yetenekleri nelerdir?", questionEn: "What are his AI skills?" },
    { text: "💼 Deneyim", questionTr: "İş deneyimi nedir?", questionEn: "What is his work experience?" },
    { text: "📫 İletişim", questionTr: "İletişim", questionEn: "Contact info" },
    { text: "🎓 Eğitim", questionTr: "Eğitim geçmişi nedir?", questionEn: "What is his education background?" },
    { text: "🌍 Diller", questionTr: "Hangi dilleri konuşuyor?", questionEn: "What languages does he speak?" }
  ];

  return (
    <section id="home" className="hero">
      {/* Ambient gradient orbs */}
      <div className="hero-ambient">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      {/* Floating particles background */}
      <div className="particles">
        {particles.map((particle, i) => (
          <div key={i} className={`particle particle-${i % 5}`} style={particle} />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-text" style={{ animationDelay: '0.1s' }}>
          <h1 className="fade-in-up">
            {language === 'en' ? 'Hello, I\'m' : 'Merhaba, Ben'}{' '}
            <span className="highlight">{portfolioData.name}</span>
          </h1>
          <p className="subtitle typing-text fade-in-up" style={{ animationDelay: '0.3s' }}>
            {displayedTitle}
            <span className={`typing-cursor ${titleDone ? 'blink' : ''}`}>|</span>
          </p>
          <div className="hero-actions fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="social-links">
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={portfolioData.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href={`mailto:${portfolioData.email}`} aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
            <a href="#contact" className="hero-cta">
              <i className="fas fa-paper-plane"></i>
              {language === 'en' ? 'Get in Touch' : 'İletişime Geç'}
            </a>
          </div>
        </div>

        <div className="ai-chat-container">
          <div className="chat-header">
            <div className="chat-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="chat-title">
              <h3>{t('hero.aiAssistant')}</h3>
              <span className="status">
                <span className="status-dot"></span>
                {t('hero.aiStatus')}
              </span>
            </div>
          </div>

          <div
            className="chat-messages"
            ref={chatContainerRef}
            aria-live="polite"
            aria-busy={isTyping}
          >
            {messages.map(message => (
              <div key={message.id} className={`message ${message.isUser ? 'user' : 'bot'}`}>
                <div 
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t('hero.inputPlaceholder')}
              autoComplete="off"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              aria-label={language === 'en' ? 'Send' : 'Gönder'}
              disabled={isTyping || !inputValue.trim()}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          <div className="suggested-questions">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion.questionTr, suggestion.questionEn)}
                disabled={isTyping}
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <a href="#about">
          <i className="fas fa-chevron-down"></i>
        </a>
      </div>
    </section>
  );
};

export default Hero;
