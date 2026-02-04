import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  tr: {
    // Navbar
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımda',
    'nav.featured': 'Öne Çıkan',
    'nav.projects': 'Projeler',
    'nav.skills': 'Yetenekler',
    'nav.contact': 'İletişim',
    
    // Hero
    'hero.greeting': 'Merhaba, Ben',
    'hero.aiAssistant': 'AI Asistan',
    'hero.aiStatus': 'Bana soru sorabilirsiniz',
    'hero.inputPlaceholder': 'Bir soru sorun...',
    'hero.aiWelcome': 'Merhaba! 👋 Ben Laçin\'in AI asistanıyım. Bana Laçin hakkında her şeyi sorabilirsiniz: deneyimleri, projeleri, yetenekleri, iletişim bilgileri ve daha fazlası!',
    
    // Suggested Questions
    'suggestion.who': '🧑‍💻 Laçin kimdir?',
    'suggestion.security': '🔐 Siber Güvenlik',
    'suggestion.projects': '🚀 Projeleri',
    'suggestion.ai': '🤖 AI Yetenekleri',
    'suggestion.experience': '💼 Deneyim',
    'suggestion.contact': '📫 İletişim',
    'suggestion.education': '🎓 Eğitim',
    'suggestion.languages': '🌍 Diller',
    
    // About
    'about.title': 'Hakkımda',
    'about.subtitle': 'Beni Tanıyın',
    'about.experience': 'Deneyim',
    'about.education': 'Eğitim',
    'about.certifications': 'Sertifikalar',
    'about.exchange': 'Değişim Programları',
    
    // Featured Projects
    'featured.title': 'Öne Çıkan Projeler',
    'featured.subtitle': 'Üzerinde çalıştığım en kapsamlı projeler',
    'featured.comingSoon': '🚀 Yakında',
    'featured.demoSoon': 'Demo Yakında',
    'featured.liveDemo': 'Canlı Demo',
    
    // Projects
    'projects.title': 'Projelerim',
    
    // Skills
    'skills.title': 'Yetenekler',
    'skills.languages': 'Programlama Dilleri',
    'skills.security': 'Siber Güvenlik',
    'skills.ai': 'Yapay Zeka & ML',
    'skills.backend': 'Backend',
    'skills.frontend': 'Frontend',
    'skills.tools': 'Araçlar & Platformlar',
    
    // Contact
    'contact.title': 'İletişim',
    'contact.subtitle': 'Benimle iletişime geçin',
    'contact.getInTouch': 'Bana Ulaşın',
    'contact.description': 'Proje teklifleri, iş fırsatları veya sadece merhaba demek için benimle iletişime geçmekten çekinmeyin. En kısa sürede yanıt vereceğim.',
    'contact.email': 'E-posta',
    'contact.phone': 'Telefon',
    'contact.location': 'Konum',
    'contact.sendMessage': 'Mesaj Gönder',
    'contact.sendEmail': 'E-posta Gönder',
    'contact.name': 'Adınız',
    'contact.message': 'Mesajınız',
    'contact.send': 'Gönder',
    
    // Footer
    'footer.rights': 'Tüm hakları saklıdır.',
    'footer.madeWith': 'ile yapıldı',
    
    // Common
    'common.viewMore': 'Daha Fazla',
    'common.close': 'Kapat',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.featured': 'Featured',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.contact': 'Contact',
    
    // Hero
    'hero.greeting': 'Hello, I\'m',
    'hero.aiAssistant': 'AI Assistant',
    'hero.aiStatus': 'Ask me anything',
    'hero.inputPlaceholder': 'Ask a question...',
    'hero.aiWelcome': 'Hello! 👋 I\'m Laçin\'s AI assistant. You can ask me anything about Laçin: experience, projects, skills, contact info and more!',
    
    // Suggested Questions
    'suggestion.who': '🧑‍💻 Who is Laçin?',
    'suggestion.security': '🔐 Cyber Security',
    'suggestion.projects': '🚀 Projects',
    'suggestion.ai': '🤖 AI Skills',
    'suggestion.experience': '💼 Experience',
    'suggestion.contact': '📫 Contact',
    'suggestion.education': '🎓 Education',
    'suggestion.languages': '🌍 Languages',
    
    // About
    'about.title': 'About Me',
    'about.subtitle': 'Get to Know Me',
    'about.experience': 'Experience',
    'about.education': 'Education',
    'about.certifications': 'Certifications',
    'about.exchange': 'Exchange Programs',
    
    // Featured Projects
    'featured.title': 'Featured Projects',
    'featured.subtitle': 'My most comprehensive projects',
    'featured.comingSoon': '🚀 Coming Soon',
    'featured.demoSoon': 'Demo Coming Soon',
    'featured.liveDemo': 'Live Demo',
    
    // Projects
    'projects.title': 'My Projects',
    
    // Skills
    'skills.title': 'Skills',
    'skills.languages': 'Programming Languages',
    'skills.security': 'Cyber Security',
    'skills.ai': 'AI & Machine Learning',
    'skills.backend': 'Backend',
    'skills.frontend': 'Frontend',
    'skills.tools': 'Tools & Platforms',
    
    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Get in touch with me',
    'contact.getInTouch': 'Get In Touch',
    'contact.description': 'Feel free to reach out for project proposals, job opportunities, or just to say hello. I\'ll respond as soon as possible.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.location': 'Location',
    'contact.sendMessage': 'Send Message',
    'contact.sendEmail': 'Send Email',
    'contact.name': 'Your Name',
    'contact.message': 'Your Message',
    'contact.send': 'Send',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.madeWith': 'Made with',
    
    // Common
    'common.viewMore': 'View More',
    'common.close': 'Close',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('portfolio-language');
    return (saved as Language) || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
