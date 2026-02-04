import { portfolioData } from '../data/portfolioData';

interface AIResponse {
  text: string;
  confidence: number;
}

// Keyword matching with weights
interface KeywordMatch {
  keywords: RegExp;
  weight: number;
  category: string;
}

const keywordMatches: KeywordMatch[] = [
  { keywords: /merhaba|selam|hey|hi|hello|naber|nasılsın|günaydın|iyi günler|iyi akşamlar/i, weight: 1, category: 'greeting' },
  { keywords: /la[cç]in kim|kimdir|kendini tanıt|hakkında|kim bu|sen kimsin|kimsin|tanı|özet|genel/i, weight: 1, category: 'who' },
  { keywords: /proje|projeler|yaptığı|geliştirdiği|çalışma|portfolio|portföy|ne yaptı|neler yaptı|ürün/i, weight: 1, category: 'projects' },
  { keywords: /interviewai|interview ai|mülakat|iş görüşmesi/i, weight: 2, category: 'interviewai' },
  { keywords: /msrs|municipality|belediye|şehir|yerel yönetim|talep|municipal/i, weight: 2, category: 'municipality' },
  { keywords: /thatticket|bilet|etkinlik|konser|sinema/i, weight: 2, category: 'ticket' },
  { keywords: /paymaki|ödeme|fintech|para|transfer/i, weight: 2, category: 'paymaki' },
  { keywords: /gayrimenkul|emlak|ev|konut|arsa|daire/i, weight: 2, category: 'realestate' },
  { keywords: /siber|güvenlik|security|pentest|penetrasyon|red.?team|hacker|hacking|vulnerability|zafiyet|bug.?bounty|capt|sızma|owasp|cve|exploit|malware|firewall|ids|ips|siem|soc|threat|offensive|defensive|ctf/i, weight: 2, category: 'security' },
  { keywords: /yetenek|beceri|teknoloji|programlama|ne biliyor|hangi dil|skill|stack|tech|bilgi|uzman/i, weight: 1, category: 'skills' },
  { keywords: /python|flask|django/i, weight: 1, category: 'python' },
  { keywords: /javascript|js|node|nodejs|express|react|frontend/i, weight: 1, category: 'javascript' },
  { keywords: /typescript|ts/i, weight: 1, category: 'typescript' },
  { keywords: /java|spring|backend/i, weight: 1, category: 'java' },
  { keywords: /ai|yapay zeka|openai|gpt|machine learning|ml|makine öğrenmesi|llm|chatgpt|artificial|transformer|neural|deep learning|nlp|prompt|langchain|huggingface|computer vision/i, weight: 2, category: 'ai' },
  { keywords: /iletişim|contact|ulaş|mail|email|e-posta|sosyal medya|telefon|numara|ara|yaz|mesaj/i, weight: 1, category: 'contact' },
  { keywords: /linkedin/i, weight: 1, category: 'linkedin' },
  { keywords: /github|repo|repository|kod|kaynak/i, weight: 1, category: 'github' },
  { keywords: /deneyim|tecrübe|experience|çalıştı|iş|kariyer|geçmiş|vulnerday/i, weight: 1, category: 'experience' },
  { keywords: /ne yapabilir|ne sorabilir|yardım|help|nasıl kullan|komut|özellik/i, weight: 1, category: 'help' },
  { keywords: /teşekkür|sağol|eyvallah|thanks|thank you|memnun/i, weight: 1, category: 'thanks' },
  { keywords: /nerede|lokasyon|şehir|ülke|konum|yaşıyor|location/i, weight: 1, category: 'location' },
  { keywords: /eğitim|okul|üniversite|mezun|öğrenci|education|university|degree|ege/i, weight: 1, category: 'education' },
  { keywords: /hobi|ilgi|interest|merak|boş zaman|sevdiği/i, weight: 1, category: 'interests' },
  { keywords: /dil|language|ingilizce|türkçe|english|konuşuyor|boşnakça|hırvatça|rusça/i, weight: 1, category: 'languages' },
  { keywords: /web|website|site|sayfa|full.?stack/i, weight: 1, category: 'web' },
  { keywords: /database|veritabanı|sql|mongo|postgres|supabase|redis/i, weight: 1, category: 'database' },
  { keywords: /api|rest|endpoint|entegrasyon|graphql|websocket/i, weight: 1, category: 'api' },
  { keywords: /güçlü|zayıf|avantaj|dezavantaj|artı|eksi/i, weight: 1, category: 'strengths' },
  { keywords: /hedef|gelecek|plan|vizyon|amaç|istek/i, weight: 1, category: 'goals' },
  { keywords: /cv|özgeçmiş|resume|portfolio indir/i, weight: 1, category: 'cv' },
  { keywords: /işe al|hire|çalış|takım|proje teklif|freelance|iş birliği/i, weight: 1, category: 'hire' },
  { keywords: /fiyat|ücret|maliyet|bütçe|price|cost/i, weight: 1, category: 'pricing' },
  { keywords: /ne kadar|süre|zaman|hız|deadline/i, weight: 1, category: 'timeline' },
  { keywords: /work.?and.?travel|amerika|usa|abd|staj|exchange/i, weight: 1, category: 'exchange' },
  { keywords: /sertifika|certificate|certification/i, weight: 1, category: 'certification' },
  { keywords: /docker|kubernetes|k8s|container|devops|ci.?cd|jenkins|github.?actions/i, weight: 1, category: 'devops' },
  { keywords: /neden|motivasyon|başla|ilham|inspire|story|hikaye/i, weight: 1, category: 'motivation' },
  { keywords: /şaka|espri|komik|gül|eğlen|fun|joke/i, weight: 1, category: 'fun' },
];

function detectCategory(question: string): string {
  const q = question.toLowerCase().trim();
  
  let bestMatch = { category: 'unknown', weight: 0 };
  
  for (const match of keywordMatches) {
    if (match.keywords.test(q)) {
      if (match.weight >= bestMatch.weight) {
        bestMatch = { category: match.category, weight: match.weight };
      }
    }
  }
  
  return bestMatch.category;
}

const responses: Record<string, () => string> = {
  greeting: () => {
    const greetings = [
      `Merhaba! 👋 Ben Laçin'in AI asistanıyım. Size ${portfolioData.firstName} hakkında her türlü bilgiyi verebilirim!\n\nProjelerini, yeteneklerini, iletişim bilgilerini veya deneyimlerini sorabilirsiniz.`,
      `Selam! 🙌 Laçin Temel'in portfolio asistanıyım. Size nasıl yardımcı olabilirim?\n\nProjeleri, teknik becerileri veya iletişim bilgileri hakkında sorular sorabilirsiniz!`,
      `Hoş geldiniz! 😊 Ben Laçin'in dijital asistanıyım. Kendisi hakkında merak ettiklerinizi yanıtlamak için buradayım.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  },

  who: () => `**${portfolioData.name}** 👨‍💻

${portfolioData.longBio}

📊 **İstatistikler:**
• ${portfolioData.stats.contributions} GitHub katkısı
• ${portfolioData.stats.projects} proje
• ${portfolioData.stats.technologies} farklı teknoloji

📍 Konum: ${portfolioData.location}
📧 E-posta: ${portfolioData.email}
📱 Telefon: ${portfolioData.phone}`,

  projects: () => {
    const projectList = portfolioData.projects.map(p => 
      `• **${p.name}**: ${p.description}`
    ).join('\n');
    
    return `${portfolioData.firstName}'in öne çıkan projeleri 🚀

${projectList}

Herhangi bir proje hakkında daha fazla bilgi almak için proje adını sorabilirsiniz!`;
  },

  interviewai: () => {
    const project = portfolioData.projects.find(p => p.name === "InterviewAI")!;
    return `**${project.name}** 🎯

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(", ")}

🔗 GitHub: ${project.github}`;
  },

  security: () => `${portfolioData.firstName} ve Siber Güvenlik 🔐

Laçin, **Cyber Security Analyst** ve **Red Teamer** olarak çalışıyor!

**💼 Deneyim:**
• Vulnerday'de Cyber Security Analyst (2023-2024)
• Penetrasyon testleri ve zafiyet değerlendirmeleri
• Bug Bounty programlarına katılım

**� Güvenlik Yetenekleri:**
${portfolioData.skills.security.map(skill => `• ${skill}`).join('\n')}

**🎯 Uzmanlık Alanları:**
• Offensive Security (Sızma Testi)
• Defensive Security (SOC, SIEM)
• Web Application Security
• Network Security & Threat Intelligence
• AI Security & Adversarial ML

**📜 Sertifikalar:**
${portfolioData.certifications.map(c => `• ${c}`).join('\n')}

Siber güvenlik alanında hem offensive hem defensive tarafta aktif olarak çalışıyor! 🛡️`,

  municipality: () => {
    const project = portfolioData.projects.find(p => p.name === "MSRS - Municipal Service Request System")!;
    return `**${project.name}** 🏛️

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(", ")}

🔗 GitHub: ${project.github}`;
  },

  ticket: () => {
    const project = portfolioData.projects.find(p => p.name === "ThatTicket.com")!;
    return `**${project.name}** 🎫

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(", ")}

🔗 GitHub: ${project.github}`;
  },

  paymaki: () => {
    const project = portfolioData.projects.find(p => p.name === "PayMaki")!;
    return `**${project.name}** 💳

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(", ")}

🔗 GitHub: ${project.github}`;
  },

  realestate: () => {
    const project = portfolioData.projects.find(p => p.name === "Gayrimenkul Merkezim")!;
    return `**${project.name}** 🏠

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(", ")}

🔗 GitHub: ${project.github}`;
  },

  skills: () => `${portfolioData.firstName}'in Teknik Yetenekleri 🛠️

💻 **Programlama Dilleri:**
${portfolioData.skills.languages.join(", ")}

🔐 **Siber Güvenlik:**
${portfolioData.skills.security.join(", ")}

🤖 **Yapay Zeka & ML:**
${portfolioData.skills.ai.join(", ")}

⚙️ **Backend:**
${portfolioData.skills.backend.join(", ")}

🎨 **Frontend:**
${portfolioData.skills.frontend.join(", ")}

🔧 **Araçlar:**
${portfolioData.skills.tools.join(", ")}

🌍 **Konuştuğum Diller:**
${portfolioData.spokenLanguages.join(", ")}`,

  python: () => `${portfolioData.firstName} ve Python 🐍

Python, ${portfolioData.firstName}'in en güçlü olduğu dillerden biri!

**Python Projeleri:**
• **InterviewAI** - AI destekli mülakat simülasyonu
• **YouTube AI Assistant** - Flask tabanlı Chrome eklentisi backend'i

**Python Becerileri:**
• Flask web framework
• OpenAI API entegrasyonu
• REST API geliştirme
• Veri işleme ve analiz

Python ile yapay zeka projelerinde özellikle deneyimli.`,

  javascript: () => `${portfolioData.firstName} ve JavaScript/React ⚛️

JavaScript ve React, ${portfolioData.firstName}'in frontend geliştirmede kullandığı ana teknolojiler.

**JavaScript/React Becerileri:**
• React.js & Next.js
• Node.js backend geliştirme
• Express.js
• Chrome Extension geliştirme
• Modern ES6+ JavaScript

**İlgili Projeler:**
• Gayrimenkul Merkezim
• YouTube AI Assistant (frontend)
• Bu portfolio sitesi 😊`,

  typescript: () => `${portfolioData.firstName} ve TypeScript 💙

TypeScript, ${portfolioData.firstName}'in tip güvenliği gerektiren projelerde tercih ettiği dil.

**TypeScript Projeleri:**
• **Municipality** - Belediye yönetim sistemi

**TypeScript Avantajları:**
• Tip güvenliği
• Daha iyi IDE desteği
• Büyük projelerde kod kalitesi
• React ile mükemmel uyum`,

  java: () => `${portfolioData.firstName} ve Java ☕

Java, ${portfolioData.firstName}'in enterprise seviye projelerinde kullandığı dil.

**Java Projeleri:**
• **ThatTicket.com** - Online bilet satış platformu

**Java Becerileri:**
• Spring Boot
• RESTful API geliştirme
• Enterprise uygulama geliştirme
• OOP prensipleri`,

  ai: () => `${portfolioData.firstName} ve Yapay Zeka 🤖

Yapay zeka, ${portfolioData.firstName}'in en tutkulu olduğu alanlardan biri!

**🧠 AI & ML Yetenekleri:**
${portfolioData.skills.ai.map(skill => `• ${skill}`).join('\n')}

**🚀 AI Projeleri:**
• **InterviewAI** - AI destekli mülakat simülasyonu (OpenAI GPT-4)
• **YouTube AI Assistant** - Video içerik analizi ve özetleme
• **Portfolio AI Asistanı** - Şu an konuştuğunuz bu asistan!

**💡 AI Uygulama Alanları:**
• Doğal Dil İşleme (NLP)
• Prompt Engineering & Optimization
• LLM entegrasyonu ve fine-tuning
• AI güvenliği ve adversarial attacks

Yapay zekayı gerçek dünya problemlerini çözmek için kullanmayı seviyor ve bu alanda sürekli kendini geliştiriyor! 🌟`,

  contact: () => `${portfolioData.firstName}'e Ulaşın 📬

📧 **E-posta:** ${portfolioData.email}
📱 **Telefon:** ${portfolioData.phone}

🔗 **Sosyal Medya:**
• GitHub: ${portfolioData.github}
• LinkedIn: ${portfolioData.linkedin}

İş birliği, proje teklifi veya sadece merhaba demek için iletişime geçmekten çekinmeyin! 

Genellikle 24 saat içinde yanıt verir. 📩`,

  linkedin: () => `${portfolioData.firstName}'in LinkedIn Profili 💼

LinkedIn'de ${portfolioData.firstName} ile bağlantı kurabilirsiniz:

🔗 ${portfolioData.linkedin}

LinkedIn'de:
• Profesyonel deneyimleri
• Bağlantıları
• Paylaşımları
• Kariyer geçmişi

bulabilirsiniz!`,

  github: () => `${portfolioData.firstName}'in GitHub Profili 🐙

🔗 ${portfolioData.github}

**GitHub İstatistikleri:**
• ${portfolioData.stats.contributions} katkı (son 1 yıl)
• ${portfolioData.stats.projects} repository

**Öne Çıkan Repolar:**
${portfolioData.projects.slice(0, 4).map(p => `• ${p.name}`).join('\n')}

Tüm açık kaynak projelerini GitHub'da inceleyebilirsiniz!`,

  experience: () => {
    const expList = portfolioData.experiences.map(exp => 
      `**${exp.title}** - ${exp.company}
📍 ${exp.location} | 📅 ${exp.period}
${exp.description.map(d => `• ${d}`).join('\n')}`
    ).join('\n\n');
    
    return `${portfolioData.firstName}'in İş Deneyimi 💼

${expList}

**Uzmanlık Alanları:**
${portfolioData.interests.map(i => `• ${i}`).join('\n')}

Daha detaylı bilgi için LinkedIn profilini ziyaret edebilirsiniz!`;
  },

  help: () => `AI Asistan Kullanım Rehberi 🤖

Bana şu konularda sorular sorabilirsiniz:

**👤 Kişisel Bilgiler:**
• Laçin kimdir?
• Nerede yaşıyor?
• Motivasyonu nedir?

**🔐 Siber Güvenlik:**
• Güvenlik yetenekleri neler?
• Penetrasyon testi deneyimi
• Sertifikaları neler?

**🤖 Yapay Zeka:**
• AI yetenekleri neler?
• Hangi AI projeleri var?
• Prompt engineering hakkında

**💻 Teknik Beceriler:**
• Hangi teknolojileri biliyor?
• Python/JavaScript/Java hakkında
• DevOps becerileri

**🚀 Projeler:**
• Projeleri nelerdir?
• InterviewAI, PayMaki, MSRS...
• ThatTicket.com hakkında

**📞 İletişim:**
• E-posta, telefon, LinkedIn, GitHub

💡 **İpucu:** Eğlenceli bir şey ister misiniz? "Şaka yap" deyin! 😄`,

  thanks: () => {
    const responses = [
      `Rica ederim! 😊 Başka bir sorunuz varsa yardımcı olmaktan mutluluk duyarım.`,
      `Ne demek, yardımcı olabildiysem ne mutlu! 🙌 Başka sorunuz olursa çekinmeyin.`,
      `Rica ederim! ${portfolioData.firstName} ile iletişime geçmek isterseniz: ${portfolioData.email} 📧`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  location: () => `${portfolioData.firstName}'in Konumu 📍

${portfolioData.firstName}, ${portfolioData.location}'de yaşıyor.

Uzaktan çalışmaya açık ve farklı lokasyonlardan projeler kabul ediyor.

📧 İletişim: ${portfolioData.email}
📱 Telefon: ${portfolioData.phone}`,

  education: () => {
    const eduList = portfolioData.educations.map(edu => 
      `**${edu.degree}**
🏫 ${edu.school}
📍 ${edu.location} | 📅 ${edu.period}
${edu.details ? edu.details.map(d => `• ${d}`).join('\n') : ''}`
    ).join('\n\n');
    
    return `${portfolioData.firstName}'in Eğitimi 🎓

${eduList}

**Sertifikalar:**
${portfolioData.certifications.map(c => `• ${c}`).join('\n')}

Sürekli öğrenme ve kendini geliştirme konusunda tutkulu!`;
  },

  interests: () => `${portfolioData.firstName}'in İlgi Alanları 🎯

${portfolioData.interests.map(i => `• ${i}`).join('\n')}

Özellikle yapay zeka ve web geliştirme kesişiminde projeler üretmeyi seviyor. Chrome eklentileri ve AI entegrasyonları favori konuları arasında!`,

  languages: () => `${portfolioData.firstName}'in Dil Becerileri 🌍

${portfolioData.spokenLanguages.map(l => `• ${l}`).join('\n')}

Teknik dokümantasyon okuma ve yazma konusunda İngilizce'ye hakim.`,

  web: () => `${portfolioData.firstName} ve Web Geliştirme 🌐

${portfolioData.firstName}, Full Stack Web Developer olarak hem frontend hem de backend tarafında deneyimli.

**Frontend:**
${portfolioData.skills.frontend.join(", ")}

**Backend:**
${portfolioData.skills.backend.join(", ")}

**Araçlar:**
${portfolioData.skills.tools.join(", ")}

Modern, responsive ve kullanıcı dostu web uygulamaları geliştiriyor.`,

  database: () => `${portfolioData.firstName} ve Veritabanları 🗄️

**Veritabanı Becerileri:**
• PostgreSQL
• MongoDB
• MySQL/MariaDB

Hem SQL hem de NoSQL veritabanlarında deneyimli. Veritabanı tasarımı ve optimizasyonu konularında bilgi sahibi.`,

  api: () => `${portfolioData.firstName} ve API Geliştirme 🔌

${portfolioData.firstName}, RESTful API tasarımı ve geliştirmesinde deneyimli.

**API Becerileri:**
• REST API tasarımı
• OpenAI API entegrasyonu
• Third-party API kullanımı
• Flask/Express ile API geliştirme

Projelerinin çoğunda API tabanlı mimari kullanıyor.`,

  strengths: () => `${portfolioData.firstName}'in Güçlü Yönleri 💪

**Teknik:**
• Full Stack geliştirme yetkinliği
• AI ve modern teknolojilere hakimiyet
• Hızlı öğrenme ve adaptasyon

**Kişisel:**
• Problem çözme odaklı yaklaşım
• Detaylara dikkat
• Sürekli öğrenme tutkusu
• Takım çalışmasına yatkınlık

**Proje Bazlı:**
• End-to-end proje geliştirme
• Kullanıcı deneyimi odaklı tasarım
• Clean code prensipleri`,

  goals: () => `${portfolioData.firstName}'in Hedefleri 🎯

**Kısa Vadeli:**
• AI projelerinde derinleşmek
• Yeni teknolojiler öğrenmek
• Open source katkılarını artırmak

**Uzun Vadeli:**
• Kendi ürünlerini geliştirmek
• Tech lead pozisyonuna yükselmek
• Yazılım topluluğuna katkıda bulunmak

Sürekli kendini geliştirmeye ve yeni zorluklar aramaya odaklı!`,

  cv: () => `${portfolioData.firstName}'in CV/Özgeçmiş Bilgisi 📄

Detaylı özgeçmiş ve portfolio bilgileri için:

📧 E-posta ile iletişime geçin: ${portfolioData.email}
📱 Veya arayın: ${portfolioData.phone}

🔗 LinkedIn: ${portfolioData.linkedin}
🔗 GitHub: ${portfolioData.github}

CV talebinizi mail ile iletebilirsiniz!`,

  hire: () => `${portfolioData.firstName} ile Çalışmak 🤝

${portfolioData.firstName} yeni projeler ve iş birliklerine açık!

**Uzmanlık Alanları:**
• Full Stack Web Development
• AI/ML Entegrasyonları
• Chrome Extension Geliştirme
• API Tasarımı

**İletişim:**
📧 E-posta: ${portfolioData.email}
📱 Telefon: ${portfolioData.phone}
💼 LinkedIn: ${portfolioData.linkedin}

Proje detaylarınızı paylaşın, en kısa sürede dönüş yapılacaktır! 🚀`,

  pricing: () => `Fiyatlandırma Hakkında 💰

Proje bazlı fiyatlandırma, projenin kapsamına ve süresine göre belirlenir.

Teklif almak için:
📧 ${portfolioData.email}
📱 ${portfolioData.phone}

adreslerinden iletişime geçip proje detaylarınızı paylaşabilirsiniz.

Genellikle 24-48 saat içinde teklif hazırlanır.`,

  timeline: () => `Proje Süreleri Hakkında ⏱️

Proje süreleri, projenin büyüklüğüne ve karmaşıklığına göre değişir.

**Genel Süre Tahminleri:**
• Küçük projeler: 1-2 hafta
• Orta ölçekli projeler: 2-6 hafta
• Büyük projeler: 1-3+ ay

Detaylı timeline için proje gereksinimlerinizi paylaşın:
📧 ${portfolioData.email}`,

  exchange: () => `${portfolioData.firstName}'in Yurtdışı Deneyimi 🌎

**Work and Travel USA**
📍 Amerika Birleşik Devletleri
📅 Temmuz 2025 - Ekim 2025

${portfolioData.firstName}, Work and Travel programı kapsamında Amerika'da bulundu. Bu deneyim sayesinde:
• Uluslararası iş deneyimi
• Kültürlerarası iletişim becerileri
• İngilizce pratik geliştirme

fırsatı buldu!`,

  certification: () => `${portfolioData.firstName}'in Sertifikaları 📜

${portfolioData.certifications.map(c => `🏆 ${c}`).join('\n')}

**CAPT - Certified Associate Penetration Tester**
Hackviser tarafından verilen bu sertifika, penetrasyon testi konusundaki yetkinliği belgeler.

Siber güvenlik alanında aktif olarak sertifikalarını geliştirmeye devam ediyor!`,

  devops: () => `**DevOps & Altyapı Yetenekleri** ⚙️

${portfolioData.firstName} modern DevOps pratiklerini uygulama konusunda deneyimlidir:

🐳 **Containerization:**
• Docker ile uygulama containerization
• Multi-stage builds ve optimizasyon
• Docker Compose ile orchestration

☁️ **Cloud & Deployment:**
• Bulut platformlarında deployment
• CI/CD pipeline tasarımı
• GitHub Actions ile otomasyon

🔧 **Araçlar:**
• Git versiyon kontrolü
• Linux sistem yönetimi
• Shell scripting

Bu yetenekler, güvenli ve ölçeklenebilir altyapılar oluşturmada kritik öneme sahiptir!`,

  motivation: () => {
    const motivations = [
      `**${portfolioData.firstName}'in Hikayesi** 💫

Yazılım ve siber güvenliğe olan tutkusu, teknolojiyi güvenli ve erişilebilir hale getirme arzusundan doğdu.

🎯 **Motivasyonları:**
• Karmaşık problemleri çözmek
• Güvenli sistemler tasarlamak
• Yenilikçi çözümler üretmek
• Sürekli öğrenmek ve gelişmek

💡 **Felsefesi:**
"Güvenlik bir ürün değil, bir süreçtir." Bu anlayışla her projede güvenliği önceliklendiriyor.

Her yeni proje, yeni bir öğrenme fırsatı!`,
      
      `**Neden Siber Güvenlik?** 🔐

${portfolioData.firstName} için siber güvenlik sadece bir meslek değil, bir misyon.

🌟 **İlham Kaynakları:**
• Dijital dünyayı daha güvenli kılma arzusu
• Hacker zihniyetini anlama merakı
• Savunma ve saldırı tekniklerini öğrenme tutkusu

💪 **Sürükleyen Güç:**
Her zafiyet bulduğunda, birinin güvenliğini korumuş oluyor. Bu tatmin, her şeye değer!`
    ];
    return motivations[Math.floor(Math.random() * motivations.length)];
  },

  fun: () => {
    const jokes = [
      `Haha! Bir siber güvenlik espirisi mi? 😄

🔐 **Neden hackerlar parti vermez?**
Çünkü herkesin ağına sızarlar! 

😅 Şaka bir yana, ${portfolioData.firstName} işini çok ciddiye alır ama keyifle yapar!`,
      
      `Bir gülümseme için buradayım! 😊

💡 **Yazılımcı ve siber güvenlikçi farkı:**
Yazılımcı: "Çalışıyor!"
Siber güvenlikçi: "Ama güvenli mi?" 🤔

${portfolioData.firstName} her iki perspektifi de anlıyor!`,
      
      `Biraz eğlence! 🎉

❓ **SQL injection nedir?**
"SELECT * FROM jokes WHERE funny = true" -- ama cevap boş döner 😂

Tamam, tamam... ciddi sorulara dönelim mi?`,

      `Robot olarak espri yapmak zor ama deneyelim! 🤖

💻 **99 little bugs in the code,**
**99 little bugs...**
**Take one down, patch it around,**
**127 little bugs in the code!**

Her yazılımcının günlük hayatı, değil mi? 😅`
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },

  unknown: () => {
    const responses = [
      `Bu konuda size yardımcı olmaya çalışayım! 🤔

${portfolioData.firstName} hakkında şunları sorabiliriniz:
• Projeleri ve yetenekleri
• İletişim bilgileri (email, telefon)
• Teknik becerileri
• Deneyimleri

Farklı bir şekilde sormayı deneyin!`,
      
      `Hmm, tam olarak anlayamadım. 🧐

Şu konularda size yardımcı olabilirim:
• "${portfolioData.firstName} kimdir?"
• "Hangi teknolojileri biliyor?"
• "İletişim bilgileri nedir?"
• "Projeleri nelerdir?"

Bu sorulardan birini deneyebilirsiniz!`,

      `Bu soruyu farklı şekilde sormayı dener misiniz? 😊

**Önerilen sorular:**
• Laçin'in yetenekleri neler?
• Nasıl iletişime geçebilirim?
• Hangi projeleri var?
• E-posta adresi nedir?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
};

export function getAIResponse(question: string): AIResponse {
  const category = detectCategory(question);
  const responseFunction = responses[category] || responses.unknown;
  
  return {
    text: responseFunction(),
    confidence: category === 'unknown' ? 0.3 : 0.9
  };
}

export function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
