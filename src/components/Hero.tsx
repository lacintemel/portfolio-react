import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  // Reset messages and conversation memory when language changes
  useEffect(() => {
    resetConversation();
    setMessages([{
      id: 1,
      content: getWelcomeMessage(),
      isUser: false
    }]);
  }, [language, getWelcomeMessage]);

  // Only scroll within chat container, not the whole page
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: inputValue,
      isUser: true
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const response = getAIResponse(currentInput, language);
    
    const botMessage: Message = {
      id: Date.now() + 1,
      content: response.text,
      isUser: false
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (questionTr: string, questionEn: string) => {
    const question = language === 'en' ? questionEn : questionTr;
    const userMessage: Message = {
      id: Date.now(),
      content: question,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(async () => {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
      const response = getAIResponse(question, language);
      const botMessage: Message = {
        id: Date.now() + 1,
        content: response.text,
        isUser: false
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 100);
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
      {/* Floating particles background */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`particle particle-${i % 5}`} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 12}s`
          }} />
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
          <div className="social-links fade-in-up" style={{ animationDelay: '0.5s' }}>
            <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i className="fab fa-github"></i>
            </a>
            <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href={`mailto:${portfolioData.email}`} aria-label="Email">
              <i className="fas fa-envelope"></i>
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

          <div className="chat-messages" ref={chatContainerRef}>
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
              onKeyPress={handleKeyPress}
              placeholder={t('hero.inputPlaceholder')}
              autoComplete="off"
            />
            <button onClick={handleSendMessage} aria-label={language === 'en' ? 'Send' : 'Gönder'}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>

          <div className="suggested-questions">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-btn"
                onClick={() => handleSuggestionClick(suggestion.questionTr, suggestion.questionEn)}
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
