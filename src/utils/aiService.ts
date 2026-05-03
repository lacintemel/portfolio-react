import { portfolioData } from '../data/portfolioData';

// ─── Types ───────────────────────────────────────────────────────────
export interface AIResponse {
  text: string;
  confidence: number;
}

interface KeywordMatch {
  keywords: RegExp;
  keywordsEN: RegExp;
  weight: number;
  category: string;
}

interface ScoredCategory {
  category: string;
  score: number;
}

interface ConversationEntry {
  question: string;
  category: string;
  timestamp: number;
}

// ─── Conversation Memory ─────────────────────────────────────────────
const conversationHistory: ConversationEntry[] = [];
const MAX_HISTORY = 20;

function pushHistory(question: string, category: string) {
  conversationHistory.push({ question, category, timestamp: Date.now() });
  if (conversationHistory.length > MAX_HISTORY) conversationHistory.shift();
}

function getLastCategory(): string | null {
  if (conversationHistory.length === 0) return null;
  return conversationHistory[conversationHistory.length - 1].category;
}

// ─── Follow‑up Detection ────────────────────────────────────────────
const followUpPatternsTR = /^(daha fazla|devam|devamı|detay|daha detaylı|anlat|anlatır mısın|peki|peki ya|ya|başka|başka ne|evet|bir de|ayrıca|özellikle|mesela|örneğin|bi de|bunun dışında|daha|daha çok|ek olarak|bunlar hakkında|hepsini|tamamını)/i;
const followUpPatternsEN = /^(more|tell me more|continue|go on|details|elaborate|what else|and|also|specifically|for example|anything else|expand|keep going|yes|yeah|sure)/i;

function isFollowUp(question: string): boolean {
  const q = question.trim();
  return followUpPatternsTR.test(q) || followUpPatternsEN.test(q);
}

// ─── Keyword Table (TR + EN patterns) ───────────────────────────────
const keywordMatches: KeywordMatch[] = [
  {
    keywords: /merhaba|selam|hey|hi|hello|naber|nasılsın|günaydın|iyi günler|iyi akşamlar|sa|selamlar|nbr/i,
    keywordsEN: /hello|hey|hi|howdy|good morning|good evening|what'?s up|greetings|yo/i,
    weight: 1.0, category: 'greeting'
  },
  {
    keywords: /la[cç]in kim|kimdir|kendini tanıt|hakkında|kim bu|sen kimsin|kimsin|tanı|özet|genel|profil/i,
    keywordsEN: /who is|about|introduce|tell me about|who are you|profile|summary|overview|background/i,
    weight: 1.0, category: 'who'
  },
  {
    keywords: /proje|projeler|yaptığı|geliştirdiği|çalışma|portfolio|portföy|ne yaptı|neler yaptı|ürün|uygulama/i,
    keywordsEN: /project|projects|portfolio|what did he (make|build|create|develop)|application|apps?/i,
    weight: 1.0, category: 'projects'
  },
  {
    keywords: /interviewai|interview\s?ai|mülakat|iş görüşmesi|mülakatai/i,
    keywordsEN: /interviewai|interview\s?ai|interview simulator|mock interview/i,
    weight: 2.0, category: 'interviewai'
  },
  {
    keywords: /msrs|municipality|belediye|şehir|yerel yönetim|talep|municipal/i,
    keywordsEN: /msrs|municipality|municipal|city|local government|service request/i,
    weight: 2.0, category: 'municipality'
  },
  {
    keywords: /thatticket|bilet|etkinlik|konser|sinema|rezervasyon/i,
    keywordsEN: /thatticket|ticket|booking|reservation|event|concert|cinema/i,
    weight: 2.0, category: 'ticket'
  },
  {
    keywords: /paymaki|ödeme|fintech|para|transfer|bordro|ik|insan kaynakları/i,
    keywordsEN: /paymaki|payment|fintech|payroll|hr|human resource/i,
    weight: 2.0, category: 'paymaki'
  },
  {
    keywords: /kaz[ıi]k|kaz[ıi]km[ıi]|araç|araba|fiyat\s?analiz|oto|otomobil|ikinci\s?el|sahibinden|amortisman|araç\s?değerleme|piyasa\s?fiyat|araç\s?fiyat|vehicle|car\s?price/i,
    keywordsEN: /kaz[ıi]k|kaz[ıi]km[ıi]|vehicle|car|price\s?analy|auto|automobile|second\s?hand|depreciation|valuation|market\s?price|overpriced/i,
    weight: 2.5, category: 'kazikmi'
  },
  {
    keywords: /gayrimenkul|emlak|ev|konut|arsa|daire|apartman|resident/i,
    keywordsEN: /real\s?estate|apartment|property|housing|resident/i,
    weight: 2.0, category: 'realestate'
  },
  {
    keywords: /siber|güvenlik|security|pentest|penetrasyon|red.?team|hack(er|ing)?|vulnerability|zafiyet|bug.?bounty|capt|sızma|owasp|cve|exploit|malware|firewall|ids|ips|siem|soc|threat|offensive|defensive|ctf|blue.?team/i,
    keywordsEN: /cyber|security|pentest|penetration|red.?team|hack(er|ing)?|vulnerability|bug.?bounty|owasp|exploit|malware|firewall|siem|soc|threat|offensive|defensive|ctf|blue.?team|infosec/i,
    weight: 2.0, category: 'security'
  },
  {
    keywords: /yetenek|beceri|teknoloji|programlama|ne biliyor|hangi dil|skill|stack|tech|uzman|yetkinlik/i,
    keywordsEN: /skill|tech|technology|stack|competenc|proficien|what does he know|expertise|capable/i,
    weight: 1.0, category: 'skills'
  },
  {
    keywords: /python|flask|django|fastapi/i,
    keywordsEN: /python|flask|django|fastapi/i,
    weight: 1.5, category: 'python'
  },
  {
    keywords: /javascript|js|node|nodejs|express|react|frontend|nextjs|next\.js/i,
    keywordsEN: /javascript|js|node|nodejs|express|react|frontend|nextjs|next\.js/i,
    weight: 1.5, category: 'javascript'
  },
  {
    keywords: /typescript|ts/i,
    keywordsEN: /typescript|ts/i,
    weight: 1.5, category: 'typescript'
  },
  {
    keywords: /java(?!script)|spring|backend/i,
    keywordsEN: /java(?!script)|spring|backend/i,
    weight: 1.5, category: 'java'
  },
  {
    keywords: /\bai\b|yapay\s?zeka|openai|gpt|machine\s?learning|ml|makine\s?öğrenmesi|llm|chatgpt|artificial|transformer|neural|deep\s?learning|nlp|prompt|langchain|huggingface|computer\s?vision|büyük\s?dil\s?modeli/i,
    keywordsEN: /\bai\b|artificial\s?intelligence|openai|gpt|machine\s?learning|ml|llm|chatgpt|transformer|neural|deep\s?learning|nlp|prompt|langchain|huggingface|computer\s?vision|large\s?language/i,
    weight: 2.0, category: 'ai'
  },
  {
    keywords: /iletişim|contact|ulaş|mail|email|e-posta|sosyal\s?medya|telefon|numara|ara|yaz|mesaj|bağlantı/i,
    keywordsEN: /contact|reach|email|e-mail|social\s?media|phone|message|get in touch|connect/i,
    weight: 2.0, category: 'contact'
  },
  {
    keywords: /linkedin/i,
    keywordsEN: /linkedin/i,
    weight: 1.5, category: 'linkedin'
  },
  {
    keywords: /github|repo|repository|kod|kaynak/i,
    keywordsEN: /github|repo|repository|source\s?code/i,
    weight: 1.5, category: 'github'
  },
  {
    keywords: /deneyim|tecrübe|experience|çalıştı|iş\s?hayat|iş\s?tec|kariyer|geçmiş|vulnerday|staj/i,
    keywordsEN: /experience|career|work history|worked|job|internship|professional/i,
    weight: 1.0, category: 'experience'
  },
  {
    keywords: /ne yapabilir|ne sorabilir|yardım|help|nasıl kullan|komut|özellik|neler sorulabilir/i,
    keywordsEN: /what can (i|you)|help|how to use|feature|command|guide|capabilities/i,
    weight: 1.0, category: 'help'
  },
  {
    keywords: /teşekkür|sağol|eyvallah|thanks|thank\s?you|memnun|saol/i,
    keywordsEN: /thanks?|thank\s?you|appreciate|grateful|cheers/i,
    weight: 1.0, category: 'thanks'
  },
  {
    keywords: /nerede|lokasyon|şehir|ülke|konum|yaşıyor|location|nereli/i,
    keywordsEN: /where|location|city|country|live|based|from/i,
    weight: 1.0, category: 'location'
  },
  {
    keywords: /eğitim|okul|üniversite|mezun|öğrenci|education|university|degree|ege|fakülte|bölüm/i,
    keywordsEN: /education|school|university|graduate|student|degree|college|academic/i,
    weight: 1.0, category: 'education'
  },
  {
    keywords: /hobi|ilgi\s?alan|interest|merak|boş\s?zaman|sevdiği/i,
    keywordsEN: /hobb|interest|free\s?time|passion|enjoy|leisure/i,
    weight: 1.0, category: 'interests'
  },
  {
    keywords: /dil(?!ler)|language|ingilizce|türkçe|english|konuşuyor|boşnakça|hırvatça|rusça|kaç dil/i,
    keywordsEN: /language|english|turkish|speak|multilingual|how many languages|bosnian|croatian|russian/i,
    weight: 1.0, category: 'languages'
  },
  {
    keywords: /web|website|site|sayfa|full.?stack/i,
    keywordsEN: /web|website|site|full.?stack/i,
    weight: 1.0, category: 'web'
  },
  {
    keywords: /database|veritabanı|sql|mongo|postgres|supabase|redis/i,
    keywordsEN: /database|sql|mongo|postgres|supabase|redis|data storage/i,
    weight: 1.5, category: 'database'
  },
  {
    keywords: /api|rest|endpoint|entegrasyon|graphql|websocket/i,
    keywordsEN: /api|rest|endpoint|integration|graphql|websocket/i,
    weight: 1.5, category: 'api'
  },
  {
    keywords: /güçlü|zayıf|avantaj|dezavantaj|artı|eksi/i,
    keywordsEN: /strength|weakness|advantage|disadvantage|pros?|cons?/i,
    weight: 1.0, category: 'strengths'
  },
  {
    keywords: /hedef|gelecek|plan|vizyon|amaç|istek/i,
    keywordsEN: /goal|future|plan|vision|aim|objective|ambition/i,
    weight: 1.0, category: 'goals'
  },
  {
    keywords: /cv|özgeçmiş|resume|portfolio indir/i,
    keywordsEN: /cv|resume|download|portfolio download/i,
    weight: 1.0, category: 'cv'
  },
  {
    keywords: /işe al|hire|çalış(?!ma)|takım|proje teklif|freelance|iş\s?birliği/i,
    keywordsEN: /hire|work with|team|project proposal|freelance|collaborat|recruit/i,
    weight: 1.0, category: 'hire'
  },
  {
    keywords: /fiyat|ücret|maliyet|bütçe|price|cost/i,
    keywordsEN: /price|cost|budget|rate|fee|charge|how much/i,
    weight: 1.0, category: 'pricing'
  },
  {
    keywords: /ne kadar süre|zaman|hız|deadline|teslim/i,
    keywordsEN: /timeline|deadline|how long|duration|delivery|timeframe/i,
    weight: 1.0, category: 'timeline'
  },
  {
    keywords: /work.?and.?travel|amerika|usa|abd|exchange/i,
    keywordsEN: /work.?and.?travel|america|usa|exchange program/i,
    weight: 1.0, category: 'exchange'
  },
  {
    keywords: /sertifika|certificate|certification/i,
    keywordsEN: /certificate|certification|certified/i,
    weight: 1.0, category: 'certification'
  },
  {
    keywords: /docker|kubernetes|k8s|container|devops|ci.?cd|jenkins|github.?actions/i,
    keywordsEN: /docker|kubernetes|k8s|container|devops|ci.?cd|jenkins|github.?actions/i,
    weight: 1.0, category: 'devops'
  },
  {
    keywords: /neden|motivasyon|başla|ilham|inspire|story|hikaye/i,
    keywordsEN: /why|motivation|start|inspire|story|how did he begin|what drives/i,
    weight: 1.0, category: 'motivation'
  },
  {
    keywords: /şaka|espri|komik|gül|eğlen|fun|joke/i,
    keywordsEN: /joke|funny|humor|laugh|fun|entertain/i,
    weight: 1.0, category: 'fun'
  },
];

// ─── Scoring Engine ──────────────────────────────────────────────────
// ─── Fuzzy Matching Helper ────────────────────────────────────────────
function fuzzyMatch(input: string, target: string, threshold = 0.7): boolean {
  const a = input.toLowerCase();
  const b = target.toLowerCase();
  if (a.includes(b) || b.includes(a)) return true;
  if (a.length < 3 || b.length < 3) return a === b;
  
  // Simple bigram similarity
  const getBigrams = (s: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) bigrams.add(s.substring(i, i + 2));
    return bigrams;
  };
  const aBigrams = getBigrams(a);
  const bBigrams = getBigrams(b);
  let matches = 0;
  aBigrams.forEach(bg => { if (bBigrams.has(bg)) matches++; });
  const similarity = (2 * matches) / (aBigrams.size + bBigrams.size);
  return similarity >= threshold;
}

// ─── Enhanced Scoring Engine ─────────────────────────────────────────
function scoreCategories(question: string, lang: 'tr' | 'en'): ScoredCategory[] {
  const q = question.toLocaleLowerCase(lang === 'tr' ? 'tr-TR' : 'en-US').trim();
  const scores = new Map<string, number>();

  for (const match of keywordMatches) {
    const pattern = lang === 'en' ? match.keywordsEN : match.keywords;
    // Also check the other language pattern with reduced weight for bilingual tolerance
    const altPattern = lang === 'en' ? match.keywords : match.keywordsEN;

    if (pattern.test(q)) {
      scores.set(match.category, (scores.get(match.category) || 0) + match.weight);
    } else if (altPattern.test(q)) {
      // Cross-language fallback at 70% weight
      scores.set(match.category, (scores.get(match.category) || 0) + match.weight * 0.7);
    }
  }

  // Fuzzy matching for project names (catches typos like "kazikm", "paymkı", etc.)
  const projectFuzzyMap: Record<string, string> = {
    'kazikmi': 'kazikmi', 'kazıkmı': 'kazikmi', 'kazik': 'kazikmi',
    'interviewai': 'interviewai', 'interview': 'interviewai',
    'paymaki': 'paymaki', 'thatticket': 'ticket',
    'msrs': 'municipality', 'gayrimenkul': 'realestate', 'gelatte': 'projects'
  };
  
  const words = q.split(/\s+/);
  for (const word of words) {
    if (word.length < 3) continue;
    for (const [target, category] of Object.entries(projectFuzzyMap)) {
      if (fuzzyMatch(word, target, 0.65) && !scores.has(category)) {
        scores.set(category, (scores.get(category) || 0) + 1.5);
      }
    }
  }

  // Contextual boost: if conversation is about projects, boost project-related matches
  const lastCat = getLastCategory();
  if (lastCat === 'projects' && scores.size > 0) {
    const projectCategories = ['interviewai', 'municipality', 'ticket', 'paymaki', 'realestate', 'kazikmi'];
    for (const cat of projectCategories) {
      if (scores.has(cat)) {
        scores.set(cat, (scores.get(cat) || 0) + 0.5);
      }
    }
  }

  return Array.from(scores.entries())
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score);
}

function detectCategories(question: string, lang: 'tr' | 'en'): string[] {
  const scored = scoreCategories(question, lang);
  if (scored.length === 0) return ['unknown'];

  const topScore = scored[0].score;
  // Return top category + any category within 40% of top score
  const threshold = topScore * 0.6;
  const relevant = scored.filter(s => s.score >= threshold).map(s => s.category);

  // Cap at 3 categories to keep responses focused
  return relevant.slice(0, 3);
}

// ─── Response Builder ────────────────────────────────────────────────
function buildResponse(categories: string[], lang: 'tr' | 'en'): string {
  const responseMap = lang === 'en' ? responsesEN : responses;

  if (categories.length === 1) {
    const fn = responseMap[categories[0]] || responseMap.unknown;
    return fn();
  }

  // Multi-category: primary response in full, secondary as brief extras
  const primary = responseMap[categories[0]] || responseMap.unknown;
  let text = primary();

  // Append brief pointers for secondary categories
  const secondaryLabels: Record<string, { tr: string; en: string }> = {
    projects: { tr: '💡 Projeleri hakkında da sorabilirsiniz!', en: '💡 You can also ask about his projects!' },
    skills: { tr: '🛠️ Teknik yetenekleri hakkında da bilgi verebilirim.', en: '🛠️ I can also tell you about his technical skills.' },
    security: { tr: '🔐 Siber güvenlik deneyimi hakkında da sorun!', en: '🔐 Ask about his cybersecurity experience too!' },
    ai: { tr: '🤖 AI yetenekleri hakkında detay isteyebilirsiniz.', en: '🤖 You can ask for details about his AI skills.' },
    contact: { tr: '📬 İletişim bilgileri için "iletişim" yazın.', en: '📬 Type "contact" for his contact info.' },
    experience: { tr: '💼 Deneyimleri hakkında da sorabilirsiniz.', en: '💼 You can also ask about his experience.' },
    education: { tr: '🎓 Eğitimi hakkında da bilgi verebilirim.', en: '🎓 I can also share his education info.' },
  };

  for (const cat of categories.slice(1)) {
    const label = secondaryLabels[cat];
    if (label) {
      text += '\n\n' + (lang === 'en' ? label.en : label.tr);
    }
  }

  return text;
}

// ─── Turkish Responses ───────────────────────────────────────────────
const responses: Record<string, () => string> = {
  greeting: () => {
    const greetings = [
      `Merhaba! 👋 Ben Laçin'in AI asistanıyım. Size ${portfolioData.firstName} hakkında her türlü bilgiyi verebilirim!\n\nProjelerini, yeteneklerini, iletişim bilgilerini veya deneyimlerini sorabilirsiniz.`,
      `Selam! 🙌 Laçin Temel'in portfolio asistanıyım. Size nasıl yardımcı olabilirim?\n\nProjeleri, teknik becerileri veya iletişim bilgileri hakkında sorular sorabilirsiniz!`,
      `Hoş geldiniz! 😊 Ben Laçin'in dijital asistanıyım. Kendisi hakkında merak ettiklerinizi yanıtlamak için buradayım.`,
      `Hey! 🖐️ ${portfolioData.firstName}'in AI asistanı olarak hizmetinizdeyim. Siber güvenlik, projeler, teknik yetenekler — ne isterseniz sorun!`
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
📧 E-posta: ${portfolioData.email}`,

  projects: () => {
    const projectList = portfolioData.projects.map(p =>
      `• **${p.name}**: ${p.description}`
    ).join('\n');
    return `${portfolioData.firstName}'in öne çıkan projeleri 🚀

${projectList}

Herhangi bir proje hakkında daha fazla bilgi almak için proje adını sorabilirsiniz!`;
  },

  interviewai: () => {
    const project = portfolioData.projects.find(p => p.name === 'InterviewAI')!;
    return `**${project.name}** 🎯

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  security: () => `${portfolioData.firstName} ve Siber Güvenlik 🔐

Laçin, **Cyber Security Analyst** ve **Red Teamer** olarak çalışıyor!

**💼 Deneyim:**
• Vulnerday'de Cyber Security Analyst (2023-2024)
• Penetrasyon testleri ve zafiyet değerlendirmeleri
• Bug Bounty programlarına katılım

**🔒 Güvenlik Yetenekleri:**
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
    const project = portfolioData.projects.find(p => p.name === 'MSRS - Municipal Service Request System')!;
    return `**${project.name}** 🏛️

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  ticket: () => {
    const project = portfolioData.projects.find(p => p.name === 'ThatTicket.com')!;
    return `**${project.name}** 🎫

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  paymaki: () => {
    const project = portfolioData.projects.find(p => p.name === 'PayMaki')!;
    return `**${project.name}** 💳

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  realestate: () => {
    const project = portfolioData.projects.find(p => p.name === 'Gayrimenkul Merkezim')!;
    return `**${project.name}** 🏠

${project.longDescription}

💻 **Kullanılan Teknolojiler:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  kazikmi: () => {
    const project = portfolioData.projects.find(p => p.name === 'Kazıkmı.com')!;
    return `**${project.name}** 🚗💰

${project.longDescription}

**🎯 Temel Özellikler:**
• Kazık Skoru — İlanın piyasa fiyatına göre aşırı fiyatlandırılıp fiyatlandırılmadığını tespit eder
• Piyasa Fiyat Analizi — Milyonlarca ilan verisinden gerçek piyasa değerini hesaplar
• Benzer Araç Karşılaştırması — Aynı model, yıl ve km aralığındaki ilanlarla kıyaslama
• Amortisman Tahmini — Aracın gelecekteki değer kaybını tahmin eder
• Pazar Trend Analizi — Seçili modelin fiyat trendlerini görselleştirir

**🧠 Yapay Zeka Altyapısı:**
• Playwright ile otonom veri toplama (web scraping)
• Pandas ile büyük veri işleme ve feature engineering
• scikit-learn ile ML fiyat modelleme
• Supabase ile gerçek zamanlı veri yönetimi

💻 **Teknolojiler:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}
🌐 Web: https://kazikmi.com`;
  },

  skills: () => `${portfolioData.firstName}'in Teknik Yetenekleri 🛠️

💻 **Programlama Dilleri:**
${portfolioData.skills.languages.join(', ')}

🔐 **Siber Güvenlik:**
${portfolioData.skills.security.join(', ')}

🤖 **Yapay Zeka & ML:**
${portfolioData.skills.ai.join(', ')}

⚙️ **Backend:**
${portfolioData.skills.backend.join(', ')}

🎨 **Frontend:**
${portfolioData.skills.frontend.join(', ')}

🔧 **Araçlar:**
${portfolioData.skills.tools.join(', ')}

🌍 **Konuştuğu Diller:**
${portfolioData.spokenLanguages.join(', ')}`,

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
• **MSRS** - Belediye yönetim sistemi (React + Node.js)

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
• OOP prensipleri
• Design Pattern kullanımı (Observer, Command, Factory)`,

  ai: () => `${portfolioData.firstName} ve Yapay Zeka 🤖

Yapay zeka, ${portfolioData.firstName}'in en tutkulu olduğu alanlardan biri!

**🧠 AI & ML Yetenekleri:**
${portfolioData.skills.ai.map(skill => `• ${skill}`).join('\n')}

**🚀 AI Projeleri:**
• **InterviewAI** - AI destekli mülakat simülasyonu (Sentence Transformers, KeyBERT, NLP)
• **YouTube AI Assistant** - Video içerik analizi ve özetleme
• **Portfolio AI Asistanı** - Şu an konuştuğunuz bu asistan!

**💡 AI Uygulama Alanları:**
• Doğal Dil İşleme (NLP)
• Prompt Engineering & Optimization
• LLM entegrasyonu ve fine-tuning
• AI güvenliği ve adversarial attacks
• Semantic Analysis & Keyword Extraction

Yapay zekayı gerçek dünya problemlerini çözmek için kullanmayı seviyor ve bu alanda sürekli kendini geliştiriyor! 🌟`,

  contact: () => `${portfolioData.firstName}'e Ulaşın 📬

📧 **E-posta:** ${portfolioData.email}

🔗 **Sosyal Medya:**
• GitHub: ${portfolioData.github}
• LinkedIn: ${portfolioData.linkedin}
• Instagram: ${portfolioData.instagram}

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
• "Laçin kimdir?"
• "Nerede yaşıyor?"
• "Motivasyonu nedir?"

**🔐 Siber Güvenlik:**
• "Güvenlik yetenekleri neler?"
• "Penetrasyon testi deneyimi"
• "Sertifikaları neler?"

**🤖 Yapay Zeka:**
• "AI yetenekleri neler?"
• "Hangi AI projeleri var?"

**💻 Teknik Beceriler:**
• "Hangi teknolojileri biliyor?"
• "Python / JavaScript / Java hakkında"

**🚀 Projeler:**
• "Projeleri nelerdir?"
• "InterviewAI / PayMaki / MSRS..."

**📞 İletişim:**
• "E-posta, LinkedIn, GitHub"

💡 **İpucu:** Bir konuyu sorduktan sonra "daha fazla" veya "devam" diyerek detay alabilirsiniz! Ayrıca "şaka yap" demeyi deneyin! 😄`,

  thanks: () => {
    const opts = [
      `Rica ederim! 😊 Başka bir sorunuz varsa yardımcı olmaktan mutluluk duyarım.`,
      `Ne demek, yardımcı olabildiysem ne mutlu! 🙌 Başka sorunuz olursa çekinmeyin.`,
      `Rica ederim! ${portfolioData.firstName} ile iletişime geçmek isterseniz: ${portfolioData.email} 📧`,
      `Memnuniyetle! 💙 Başka merak ettiğiniz bir konu varsa sormaktan çekinmeyin.`
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  },

  location: () => `${portfolioData.firstName}'in Konumu 📍

${portfolioData.firstName}, **${portfolioData.location}**'de yaşıyor.

🏫 Ege Üniversitesi, İzmir'de eğitimine devam ediyor.

Uzaktan çalışmaya açık ve farklı lokasyonlardan projeler kabul ediyor.

📧 İletişim: ${portfolioData.email}`,

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

Özellikle yapay zeka ve siber güvenlik kesişiminde projeler üretmeyi seviyor. AI Security ve adversarial ML favori konuları arasında!`,

  languages: () => `${portfolioData.firstName}'in Dil Becerileri 🌍

${portfolioData.spokenLanguages.map(l => `• ${l}`).join('\n')}

Teknik dokümantasyon okuma ve yazma konusunda İngilizce'ye hakim. Çok dilli geçmişi uluslararası projelerde avantaj sağlıyor.`,

  web: () => `${portfolioData.firstName} ve Web Geliştirme 🌐

${portfolioData.firstName}, Full Stack Web Developer olarak hem frontend hem de backend tarafında deneyimli.

**Frontend:**
${portfolioData.skills.frontend.join(', ')}

**Backend:**
${portfolioData.skills.backend.join(', ')}

**Araçlar:**
${portfolioData.skills.tools.join(', ')}

Modern, responsive ve kullanıcı dostu web uygulamaları geliştiriyor.`,

  database: () => `${portfolioData.firstName} ve Veritabanları 🗄️

**Veritabanı Becerileri:**
• PostgreSQL
• MongoDB
• MySQL / MariaDB
• Supabase
• SQLite

Hem SQL hem de NoSQL veritabanlarında deneyimli. Veritabanı tasarımı, optimizasyon ve veri modelleme konularında bilgi sahibi.`,

  api: () => `${portfolioData.firstName} ve API Geliştirme 🔌

${portfolioData.firstName}, RESTful API tasarımı ve geliştirmesinde deneyimli.

**API Becerileri:**
• REST API tasarımı
• GraphQL
• OpenAI API entegrasyonu
• Socket.io / WebSocket
• Third-party API kullanımı
• Flask / Express ile API geliştirme

Projelerinin çoğunda API tabanlı mimari kullanıyor.`,

  strengths: () => `${portfolioData.firstName}'in Güçlü Yönleri 💪

**Teknik:**
• Full Stack geliştirme yetkinliği
• Siber güvenlik uzmanlığı
• AI ve modern teknolojilere hakimiyet
• Hızlı öğrenme ve adaptasyon

**Kişisel:**
• Problem çözme odaklı yaklaşım
• Detaylara dikkat
• Sürekli öğrenme tutkusu
• Takım çalışmasına yatkınlık
• Sorumluluk almaktan çekinmeme

**Proje Bazlı:**
• End-to-end proje geliştirme
• Kullanıcı deneyimi odaklı tasarım
• Clean code prensipleri
• Design pattern kullanımı`,

  goals: () => `${portfolioData.firstName}'in Hedefleri 🎯

**Kısa Vadeli:**
• AI ve siber güvenlik projelerinde derinleşmek
• Yeni teknolojiler öğrenmek
• Open source katkılarını artırmak

**Uzun Vadeli:**
• Kendi ürünlerini geliştirmek
• Siber güvenlik alanında uzman olmak
• Yazılım topluluğuna katkıda bulunmak
• AI Security alanında araştırma yapmak

Sürekli kendini geliştirmeye ve yeni zorluklar aramaya odaklı!`,

  cv: () => `${portfolioData.firstName}'in CV / Özgeçmiş Bilgisi 📄

Detaylı özgeçmiş ve portfolio bilgileri için:

📧 E-posta ile iletişime geçin: ${portfolioData.email}

🔗 LinkedIn: ${portfolioData.linkedin}
🔗 GitHub: ${portfolioData.github}

CV talebinizi mail ile iletebilirsiniz!`,

  hire: () => `${portfolioData.firstName} ile Çalışmak 🤝

${portfolioData.firstName} yeni projeler ve iş birliklerine açık!

**Uzmanlık Alanları:**
• Cyber Security & Penetration Testing
• Full Stack Web Development
• AI / ML Entegrasyonları
• API Tasarımı & Geliştirme

**İletişim:**
📧 E-posta: ${portfolioData.email}
💼 LinkedIn: ${portfolioData.linkedin}

Proje detaylarınızı paylaşın, en kısa sürede dönüş yapılacaktır! 🚀`,

  pricing: () => `Fiyatlandırma Hakkında 💰

Proje bazlı fiyatlandırma, projenin kapsamına ve süresine göre belirlenir.

Teklif almak için:
📧 ${portfolioData.email}

adresinden iletişime geçip proje detaylarınızı paylaşabilirsiniz.

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
    const opts = [
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
    return opts[Math.floor(Math.random() * opts.length)];
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

Her yazılımcının günlük hayatı, değil mi? 😅`,

      `İşte bir tane daha! 🎪

🔒 **Güvenli şifre nasıl olur?**
"correcthorsebatterystaple" — ama lütfen bunu kullanmayın!

${portfolioData.firstName} sizin güvenliğinizi de düşünüyor! 😄`
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },

  unknown: () => {
    const opts = [
      `Bu konuda size yardımcı olmaya çalışayım! 🤔

${portfolioData.firstName} hakkında şunları sorabilirsiniz:
• **Projeler:** "Projeleri nelerdir?"
• **Yetenekler:** "Hangi teknolojileri biliyor?"
• **İletişim:** "E-posta adresi ne?"
• **Güvenlik:** "Siber güvenlik deneyimi ne?"
• **Deneyim:** "İş deneyimi ne?"

Farklı bir şekilde sormayı deneyin veya "yardım" yazın!`,

      `Hmm, tam olarak anlayamadım. 🧐

Şu konularda size yardımcı olabilirim:
• "${portfolioData.firstName} kimdir?"
• "Hangi teknolojileri biliyor?"
• "İletişim bilgileri nedir?"
• "Projeleri nelerdir?"
• "Yapay zeka yetenekleri ne?"

💡 **İpucu:** "Yardım" yazarak tüm konuları görebilirsiniz!`,

      `Bu soruyu tam anlayamadım ama endişelenmeyin! 😊

**Popüler sorular:**
• 🔐 "Siber güvenlik hakkında bilgi ver"
• 🤖 "AI yetenekleri neler?"
• 🚀 "Projelerini anlat"
• 📬 "Nasıl iletişime geçebilirim?"

Bunlardan birini deneyin veya daha detaylı sorun!`
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  }
};

// ─── English Responses ───────────────────────────────────────────────
const responsesEN: Record<string, () => string> = {
  greeting: () => {
    const greetings = [
      `Hello! 👋 I'm Laçin's AI assistant. I can tell you anything about ${portfolioData.firstName}!\n\nYou can ask about his projects, skills, contact info, or experience.`,
      `Hi there! 🙌 I'm Laçin Temel's portfolio assistant. How can I help you?\n\nFeel free to ask about projects, technical skills, or contact information!`,
      `Welcome! 😊 I'm Laçin's digital assistant. I'm here to answer your questions about him.`,
      `Hey! 🖐️ I'm ${portfolioData.firstName}'s AI assistant. Cybersecurity, projects, technical skills — ask me anything!`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  },

  who: () => `**${portfolioData.name}** 👨‍💻

Hello, I'm Laçin Temel. I'm a Computer Engineering student specializing in cybersecurity and software development. I have practical experience in penetration testing, vulnerability analysis, and bug bounty programs. Previously, I worked as a Cyber Security Analyst at Vulnerday, performing security tests on both internal and client systems.

📊 **Statistics:**
• ${portfolioData.stats.contributions} GitHub contributions
• ${portfolioData.stats.projects} projects
• ${portfolioData.stats.technologies} different technologies

📍 Location: ${portfolioData.location}
📧 Email: ${portfolioData.email}`,

  projects: () => {
    const projectList = portfolioData.projects.map(p =>
      `• **${p.name}**: ${p.description}`
    ).join('\n');
    return `${portfolioData.firstName}'s featured projects 🚀

${projectList}

Ask about any project by name for more details!`;
  },

  interviewai: () => {
    const project = portfolioData.projects.find(p => p.name === 'InterviewAI')!;
    return `**${project.name}** 🎯

${project.longDescription}

💻 **Technologies:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  security: () => `${portfolioData.firstName} and Cyber Security 🔐

Laçin works as a **Cyber Security Analyst** and **Red Teamer**!

**💼 Experience:**
• Cyber Security Analyst at Vulnerday (2023-2024)
• Penetration testing and vulnerability assessments
• Bug Bounty program participation

**🔒 Security Skills:**
${portfolioData.skills.security.map(skill => `• ${skill}`).join('\n')}

**🎯 Areas of Expertise:**
• Offensive Security (Penetration Testing)
• Defensive Security (SOC, SIEM)
• Web Application Security
• Network Security & Threat Intelligence
• AI Security & Adversarial ML

**📜 Certifications:**
${portfolioData.certifications.map(c => `• ${c}`).join('\n')}

He actively works on both offensive and defensive security! 🛡️`,

  municipality: () => {
    const project = portfolioData.projects.find(p => p.name === 'MSRS - Municipal Service Request System')!;
    return `**${project.name}** 🏛️

${project.longDescription}

💻 **Technologies:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  ticket: () => {
    const project = portfolioData.projects.find(p => p.name === 'ThatTicket.com')!;
    return `**${project.name}** 🎫

${project.longDescription}

💻 **Technologies:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  paymaki: () => {
    const project = portfolioData.projects.find(p => p.name === 'PayMaki')!;
    return `**${project.name}** 💳

${project.longDescription}

💻 **Technologies:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  realestate: () => {
    const project = portfolioData.projects.find(p => p.name === 'Gayrimenkul Merkezim')!;
    return `**${project.name}** 🏠

${project.longDescription}

💻 **Technologies:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}`;
  },

  kazikmi: () => {
    const project = portfolioData.projects.find(p => p.name === 'Kazıkmı.com')!;
    return `**${project.name}** 🚗💰

${project.longDescription}

**🎯 Key Features:**
• Overpricing Score — Detects whether a listing is overpriced compared to market value
• Market Price Analysis — Calculates real market value from millions of listing data
• Similar Vehicle Comparison — Compares with listings of same model, year, and mileage range
• Depreciation Prediction — Predicts future value loss of the vehicle
• Market Trend Analysis — Visualizes price trends for selected models

**🧠 AI Infrastructure:**
• Autonomous data collection with Playwright (web scraping)
• Big data processing and feature engineering with Pandas
• ML price modeling with scikit-learn
• Real-time data management with Supabase

💻 **Technologies:** ${project.technologies.join(', ')}

🔗 GitHub: ${project.github}
🌐 Web: https://kazikmi.com`;
  },

  skills: () => `${portfolioData.firstName}'s Technical Skills 🛠️

💻 **Programming Languages:**
${portfolioData.skills.languages.join(', ')}

🔐 **Cyber Security:**
${portfolioData.skills.security.join(', ')}

🤖 **AI & Machine Learning:**
${portfolioData.skills.ai.join(', ')}

⚙️ **Backend:**
${portfolioData.skills.backend.join(', ')}

🎨 **Frontend:**
${portfolioData.skills.frontend.join(', ')}

🔧 **Tools:**
${portfolioData.skills.tools.join(', ')}

🌍 **Spoken Languages:**
${portfolioData.spokenLanguages.join(', ')}`,

  python: () => `${portfolioData.firstName} and Python 🐍

Python is one of ${portfolioData.firstName}'s strongest languages!

**Python Projects:**
• **InterviewAI** - AI-powered interview simulation
• **YouTube AI Assistant** - Flask-based Chrome extension backend

**Python Skills:**
• Flask web framework
• OpenAI API integration
• REST API development
• Data processing and analysis

Especially experienced with AI projects using Python.`,

  javascript: () => `${portfolioData.firstName} and JavaScript/React ⚛️

JavaScript and React are ${portfolioData.firstName}'s primary frontend technologies.

**JavaScript/React Skills:**
• React.js & Next.js
• Node.js backend development
• Express.js
• Chrome Extension development
• Modern ES6+ JavaScript

**Related Projects:**
• Gayrimenkul Merkezim
• YouTube AI Assistant (frontend)
• This portfolio site 😊`,

  typescript: () => `${portfolioData.firstName} and TypeScript 💙

TypeScript is ${portfolioData.firstName}'s go-to for projects requiring type safety.

**TypeScript Projects:**
• **MSRS** - Municipal service request system (React + Node.js)

**TypeScript Advantages:**
• Type safety
• Better IDE support
• Code quality in large projects
• Excellent React integration`,

  java: () => `${portfolioData.firstName} and Java ☕

Java is ${portfolioData.firstName}'s choice for enterprise-level projects.

**Java Projects:**
• **ThatTicket.com** - Online ticket booking platform

**Java Skills:**
• Spring Boot
• RESTful API development
• Enterprise application development
• OOP principles
• Design Patterns (Observer, Command, Factory)`,

  ai: () => `${portfolioData.firstName} and Artificial Intelligence 🤖

AI is one of ${portfolioData.firstName}'s most passionate areas!

**🧠 AI & ML Skills:**
${portfolioData.skills.ai.map(skill => `• ${skill}`).join('\n')}

**🚀 AI Projects:**
• **InterviewAI** - AI-powered interview simulation (Sentence Transformers, KeyBERT, NLP)
• **YouTube AI Assistant** - Video content analysis and summarization
• **Portfolio AI Assistant** - The assistant you're talking to right now!

**💡 AI Applications:**
• Natural Language Processing (NLP)
• Prompt Engineering & Optimization
• LLM integration and fine-tuning
• AI security and adversarial attacks
• Semantic Analysis & Keyword Extraction

He loves using AI to solve real-world problems and continuously improves in this field! 🌟`,

  contact: () => `Contact ${portfolioData.firstName} 📬

📧 **Email:** ${portfolioData.email}

🔗 **Social Media:**
• GitHub: ${portfolioData.github}
• LinkedIn: ${portfolioData.linkedin}
• Instagram: ${portfolioData.instagram}

Don't hesitate to reach out for collaboration, project proposals, or just to say hello!

Usually responds within 24 hours. 📩`,

  linkedin: () => `${portfolioData.firstName}'s LinkedIn Profile 💼

Connect with ${portfolioData.firstName} on LinkedIn:

🔗 ${portfolioData.linkedin}

On LinkedIn you'll find:
• Professional experience
• Connections
• Posts & articles
• Career history`,

  github: () => `${portfolioData.firstName}'s GitHub Profile 🐙

🔗 ${portfolioData.github}

**GitHub Stats:**
• ${portfolioData.stats.contributions} contributions (last year)
• ${portfolioData.stats.projects} repositories

**Featured Repos:**
${portfolioData.projects.slice(0, 4).map(p => `• ${p.name}`).join('\n')}

Check out all open-source projects on GitHub!`,

  experience: () => {
    const exp = portfolioData.experiences[0];
    return `${portfolioData.firstName}'s Work Experience 💼

**${exp.title}** - ${exp.company}
📍 ${exp.location} | 📅 ${exp.period}

**Responsibilities:**
${exp.description.map(d => `• ${d}`).join('\n')}

**Areas of Focus:**
${portfolioData.interests.map(i => `• ${i}`).join('\n')}

For more details, visit his LinkedIn profile!`;
  },

  help: () => `AI Assistant User Guide 🤖

You can ask me about the following topics:

**👤 Personal Info:**
• "Who is Laçin?"
• "Where does he live?"
• "What's his motivation?"

**🔐 Cyber Security:**
• "What are his security skills?"
• "Penetration testing experience"
• "What certifications?"

**🤖 Artificial Intelligence:**
• "What are his AI skills?"
• "What AI projects?"

**💻 Technical Skills:**
• "What technologies does he know?"
• "About Python / JavaScript / Java"

**🚀 Projects:**
• "What are his projects?"
• "InterviewAI / PayMaki / MSRS..."

**📞 Contact:**
• "Email, LinkedIn, GitHub"

💡 **Tip:** After asking about a topic, say "more" or "tell me more" for additional details! Also try "tell me a joke"! 😄`,

  thanks: () => {
    const opts = [
      `You're welcome! 😊 If you have any other questions, I'd be happy to help.`,
      `My pleasure! 🙌 Feel free to ask if you need anything else.`,
      `You're welcome! To contact ${portfolioData.firstName}: ${portfolioData.email} 📧`,
      `Glad I could help! 💙 Don't hesitate to ask more questions.`
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  },

  location: () => `${portfolioData.firstName}'s Location 📍

🏠 Currently living in **${portfolioData.location}**

🏫 Studying at Ege University, İzmir.

Open to remote work and projects from different locations! 🌍`,

  education: () => {
    const eduList = portfolioData.educations.map(edu =>
      `**${edu.degree}**
🏫 ${edu.school}
📍 ${edu.location} | 📅 ${edu.period}
${edu.details ? edu.details.map(d => `• ${d}`).join('\n') : ''}`
    ).join('\n\n');

    return `${portfolioData.firstName}'s Education 🎓

${eduList}

**Certifications:**
${portfolioData.certifications.map(c => `• ${c}`).join('\n')}

Always passionate about continuous learning!`;
  },

  interests: () => `${portfolioData.firstName}'s Interests 🎯

${portfolioData.interests.map(i => `• ${i}`).join('\n')}

He especially enjoys working on projects at the intersection of AI and cybersecurity. AI Security and adversarial ML are among his favorite topics!`,

  languages: () => `Languages ${portfolioData.firstName} Speaks 🌍

${portfolioData.spokenLanguages.map(lang => `• ${lang}`).join('\n')}

Proficient in English for technical documentation. His multilingual background provides advantages in international projects! 🗣️`,

  web: () => `${portfolioData.firstName} and Web Development 🌐

${portfolioData.firstName} is experienced in both frontend and backend as a Full Stack Web Developer.

**Frontend:**
${portfolioData.skills.frontend.join(', ')}

**Backend:**
${portfolioData.skills.backend.join(', ')}

**Tools:**
${portfolioData.skills.tools.join(', ')}

Builds modern, responsive, and user-friendly web applications.`,

  database: () => `${portfolioData.firstName} and Databases 🗄️

**Database Skills:**
• PostgreSQL
• MongoDB
• MySQL / MariaDB
• Supabase
• SQLite

Experienced in both SQL and NoSQL databases. Knowledgeable in database design, optimization, and data modeling.`,

  api: () => `${portfolioData.firstName} and API Development 🔌

${portfolioData.firstName} is experienced in RESTful API design and development.

**API Skills:**
• REST API design
• GraphQL
• OpenAI API integration
• Socket.io / WebSocket
• Third-party API usage
• Flask / Express API development

Most of his projects use API-based architectures.`,

  strengths: () => `${portfolioData.firstName}'s Strengths 💪

**Technical:**
• Full Stack development proficiency
• Cybersecurity expertise
• AI and modern tech mastery
• Fast learning and adaptation

**Personal:**
• Problem-solving approach
• Attention to detail
• Continuous learning passion
• Team collaboration
• Willingness to take responsibility

**Project-based:**
• End-to-end project development
• User experience focused design
• Clean code principles
• Design pattern usage`,

  goals: () => `${portfolioData.firstName}'s Goals 🎯

**Short-term:**
• Deepen expertise in AI and cybersecurity
• Learn new technologies
• Increase open source contributions

**Long-term:**
• Develop his own products
• Become an expert in cybersecurity
• Contribute to the software community
• Research in AI Security

Focused on continuous self-improvement and seeking new challenges!`,

  cv: () => `${portfolioData.firstName}'s CV / Resume 📄

For detailed resume and portfolio info:

📧 Email: ${portfolioData.email}

🔗 LinkedIn: ${portfolioData.linkedin}
🔗 GitHub: ${portfolioData.github}

You can send your CV request via email!`,

  hire: () => `Working with ${portfolioData.firstName} 🤝

${portfolioData.firstName} is open to new projects and collaborations!

**Areas of Expertise:**
• Cyber Security & Penetration Testing
• Full Stack Web Development
• AI / ML Integrations
• API Design & Development

**Contact:**
📧 Email: ${portfolioData.email}
💼 LinkedIn: ${portfolioData.linkedin}

Share your project details and he'll get back to you ASAP! 🚀`,

  pricing: () => `About Pricing 💰

Project-based pricing depends on scope and duration.

For a quote:
📧 ${portfolioData.email}

Share your project details and a quote will typically be prepared within 24-48 hours.`,

  timeline: () => `About Project Timelines ⏱️

Project duration varies depending on size and complexity.

**General Estimates:**
• Small projects: 1-2 weeks
• Medium projects: 2-6 weeks
• Large projects: 1-3+ months

For a detailed timeline, share your requirements:
📧 ${portfolioData.email}`,

  exchange: () => `${portfolioData.firstName}'s International Experience 🌎

**Work and Travel USA**
📍 United States
📅 July 2025 - October 2025

${portfolioData.firstName} participated in the Work and Travel program in the US. This experience provided:
• International work experience
• Cross-cultural communication skills
• English language practice

A valuable experience for personal and professional growth!`,

  certification: () => `${portfolioData.firstName}'s Certifications 📜

${portfolioData.certifications.map(c => `🏆 ${c}`).join('\n')}

**CAPT - Certified Associate Penetration Tester**
This certification from Hackviser validates proficiency in penetration testing.

He continues to actively develop his certifications in cybersecurity!`,

  devops: () => `**DevOps & Infrastructure Skills** ⚙️

${portfolioData.firstName} is experienced in applying modern DevOps practices:

🐳 **Containerization:**
• Docker application containerization
• Multi-stage builds and optimization
• Docker Compose orchestration

☁️ **Cloud & Deployment:**
• Cloud platform deployment
• CI/CD pipeline design
• GitHub Actions automation

🔧 **Tools:**
• Git version control
• Linux system administration
• Shell scripting

These skills are critical for building secure and scalable infrastructures!`,

  motivation: () => {
    const opts = [
      `**${portfolioData.firstName}'s Story** 💫

His passion for software and cybersecurity stems from the desire to make technology safe and accessible.

🎯 **Motivations:**
• Solving complex problems
• Designing secure systems
• Creating innovative solutions
• Continuous learning and growth

💡 **Philosophy:**
"Security is not a product, but a process." With this mindset, he prioritizes security in every project.

Every new project is a new learning opportunity!`,

      `**Why Cybersecurity?** 🔐

For ${portfolioData.firstName}, cybersecurity isn't just a profession — it's a mission.

🌟 **Inspirations:**
• Desire to make the digital world safer
• Curiosity to understand the hacker mindset
• Passion for learning both attack and defense techniques

💪 **Driving Force:**
Every vulnerability he finds means protecting someone's security. That satisfaction is worth everything!`
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  },

  fun: () => {
    const jokes = [
      `Haha! A cyber security joke? 😄

🔐 **Why don't hackers throw parties?**
Because they crash everyone's network!

😅 Jokes aside, ${portfolioData.firstName} takes his work seriously but enjoys it!`,

      `Here for a smile! 😊

💡 **The difference between a developer and a security specialist:**
Developer: "It works!"
Security: "But is it secure?" 🤔

${portfolioData.firstName} understands both perspectives!`,

      `A bit of fun! 🎉

💻 **99 little bugs in the code,**
**99 little bugs...**
**Take one down, patch it around,**
**127 little bugs in the code!**

Every developer's daily life, right? 😅`,

      `Robot humor incoming! 🤖

🔒 **How to make a secure password?**
"correcthorsebatterystaple" — but please don't use this one!

${portfolioData.firstName} cares about your security too! 😄`
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },

  unknown: () => {
    const opts = [
      `Let me try to help you with that! 🤔

You can ask about ${portfolioData.firstName}:
• **Projects:** "What are his projects?"
• **Skills:** "What technologies does he know?"
• **Contact:** "What's his email?"
• **Security:** "Cybersecurity experience?"
• **Experience:** "Work experience?"

Try asking differently or type "help"!`,

      `Hmm, I didn't quite understand. 🧐

I can help you with:
• "Who is ${portfolioData.firstName}?"
• "What technologies does he know?"
• "What are his contact details?"
• "What are his projects?"
• "What are his AI skills?"

💡 **Tip:** Type "help" to see all available topics!`,

      `I didn't quite catch that, but no worries! 😊

**Popular questions:**
• 🔐 "Tell me about cybersecurity"
• 🤖 "What are his AI skills?"
• 🚀 "Tell me about his projects"
• 📬 "How can I contact him?"

Try one of these or ask in more detail!`
    ];
    return opts[Math.floor(Math.random() * opts.length)];
  }
};

// ─── Follow‑up Response Builders ─────────────────────────────────────
const followUpResponsesTR: Record<string, () => string> = {
  who: () => `${portfolioData.firstName} hakkında ek bilgiler 📋

**İlgi Alanları:**
${portfolioData.interests.map(i => `• ${i}`).join('\n')}

**Yurtdışı Deneyimi:**
${portfolioData.exchangePrograms.join(', ')}

**Sertifikaları:**
${portfolioData.certifications.map(c => `• ${c}`).join('\n')}

Daha spesifik bir konu sormak ister misiniz? Projeler, yetenekler, iletişim bilgileri...`,

  projects: () => {
    const details = portfolioData.projects.map(p =>
      `**${p.name}**\n💻 ${p.technologies.join(', ')}\n🔗 ${p.github}`
    ).join('\n\n');
    return `Projelerin detayları 📂\n\n${details}\n\nHerhangi bir projeyi adıyla sorarak daha fazla bilgi alabilirsiniz!`;
  },

  security: () => `Siber güvenlik hakkında ek detaylar 🔐

**Kullanılan Araçlar:**
• Burp Suite (Web güvenlik testi)
• Nmap (Ağ tarama)
• Wireshark (Paket analizi)
• Kali Linux (Pentest dağıtımı)
• Metasploit Framework

**Metodolojiler:**
• OWASP Top 10
• PTES (Penetration Testing Execution Standard)
• NIST Cybersecurity Framework

**Bug Bounty Yaklaşımı:**
Sistemlerdeki güvenlik açıklarını etik hacking prensipleriyle tespit edip raporlama konusunda deneyimli.`,

  skills: () => `Detaylı yetenek bilgisi 🛠️

**En güçlü olduğu alanlar:**
1. 🔐 Penetrasyon testi ve güvenlik analizi
2. 🐍 Python ile AI/ML projeleri
3. ⚛️ React ile modern web uygulamaları
4. 🔌 API tasarımı ve entegrasyonu
5. 🐳 Docker ve DevOps pratikleri

**Aktif olarak geliştirdiği alanlar:**
• AI Security & Adversarial ML
• Cloud Security
• Advanced Exploit Development`,

  ai: () => `AI hakkında ek bilgiler 🤖

**Kullandığı Kütüphaneler & Araçlar:**
• Sentence Transformers (Semantic similarity)
• KeyBERT (Keyword extraction)
• OpenAI API (GPT modelleri)
• HuggingFace Transformers
• scikit-learn

**AI Security Çalışmaları:**
Yapay zeka modellerinin güvenliği, adversarial attacks ve AI sistemlerinin saldırılara karşı korunması konularında bilgi sahibi.`,

  experience: () => `Deneyim hakkında ek bilgiler 💼

**Vulnerday'de yapılan çalışmalar (detay):**
• Web uygulama güvenlik testleri
• API güvenlik değerlendirmeleri
• Ağ penetrasyon testleri
• Zafiyet raporlama ve remediation önerileri
• Müşteri sunumları ve teknik raporlama

Daha fazlası için LinkedIn profilini ziyaret edebilirsiniz: ${portfolioData.linkedin}`,

  contact: () => `Ek iletişim detayları 📬

Her platformdan ulaşabilirsiniz:
• 📧 E-posta: ${portfolioData.email} (en hızlı yanıt)
• 💼 LinkedIn: ${portfolioData.linkedin} (profesyonel iletişim)
• 🐙 GitHub: ${portfolioData.github} (teknik projeler)
• 📸 Instagram: ${portfolioData.instagram}

En hızlı dönüş genellikle e-posta üzerinden olur!`,

  education: () => `Eğitim hakkında ek bilgiler 🎓

**Ege Üniversitesi - Bilgisayar Mühendisliği**
• Algoritma ve veri yapıları
• Ağ güvenliği
• Yazılım mühendisliği
• Veritabanı yönetimi
• İşletim sistemleri

**Kendini Geliştirme:**
Online kurslar, CTF yarışmaları ve kişisel projelerle sürekli öğrenme sürecinde.`,

  kazikmi: () => `Kazıkmı.com hakkında ek detaylar 🚗

**Veri Pipeline Mimarisi:**
• Playwright ile stealth mode web scraping
• Anti-bot korumalarını aşan gelişmiş fingerprinting
• Günlük otomatik veri güncelleme

**ML Model Detayları:**
• Feature engineering: marka, model, yıl, km, yakıt tipi, vites, renk, hasar kaydı
• Gradient Boosting & Random Forest ensemble modelleri
• Cross-validation ile model doğrulama
• R² skoru: 0.92+ doğruluk oranı

**Kazık Skoru Algoritması:**
• 1-10 arası puanlama (10 = çok pahalı)
• Piyasa ortalaması, medyan ve standart sapma analizi
• Benzer araç havuzundan istatistiksel karşılaştırma`,
};

const followUpResponsesEN: Record<string, () => string> = {
  who: () => `Additional info about ${portfolioData.firstName} 📋

**Interests:**
${portfolioData.interests.map(i => `• ${i}`).join('\n')}

**International Experience:**
${portfolioData.exchangePrograms.join(', ')}

**Certifications:**
${portfolioData.certifications.map(c => `• ${c}`).join('\n')}

Want to ask about something more specific? Projects, skills, contact info...`,

  projects: () => {
    const details = portfolioData.projects.map(p =>
      `**${p.name}**\n💻 ${p.technologies.join(', ')}\n🔗 ${p.github}`
    ).join('\n\n');
    return `Project details 📂\n\n${details}\n\nAsk about any project by name for more info!`;
  },

  security: () => `More cybersecurity details 🔐

**Tools Used:**
• Burp Suite (Web security testing)
• Nmap (Network scanning)
• Wireshark (Packet analysis)
• Kali Linux (Pentest distro)
• Metasploit Framework

**Methodologies:**
• OWASP Top 10
• PTES (Penetration Testing Execution Standard)
• NIST Cybersecurity Framework

**Bug Bounty Approach:**
Experienced in identifying and reporting security vulnerabilities using ethical hacking principles.`,

  skills: () => `Detailed skill breakdown 🛠️

**Strongest areas:**
1. 🔐 Penetration testing & security analysis
2. 🐍 Python AI/ML projects
3. ⚛️ React modern web applications
4. 🔌 API design & integration
5. 🐳 Docker and DevOps practices

**Currently developing:**
• AI Security & Adversarial ML
• Cloud Security
• Advanced Exploit Development`,

  ai: () => `More about AI 🤖

**Libraries & Tools Used:**
• Sentence Transformers (Semantic similarity)
• KeyBERT (Keyword extraction)
• OpenAI API (GPT models)
• HuggingFace Transformers
• scikit-learn

**AI Security Work:**
Knowledgeable in AI model security, adversarial attacks, and protecting AI systems against exploits.`,

  experience: () => `More about work experience 💼

**Detailed work at Vulnerday:**
• Web application security testing
• API security assessments
• Network penetration testing
• Vulnerability reporting & remediation recommendations
• Client presentations & technical reporting

For more, visit his LinkedIn: ${portfolioData.linkedin}`,

  contact: () => `Additional contact details 📬

Reach out on any platform:
• 📧 Email: ${portfolioData.email} (fastest response)
• 💼 LinkedIn: ${portfolioData.linkedin} (professional)
• 🐙 GitHub: ${portfolioData.github} (technical projects)
• 📸 Instagram: ${portfolioData.instagram}

Email usually gets the fastest reply!`,

  education: () => `More about education 🎓

**Ege University - Computer Engineering**
• Algorithms and data structures
• Network security
• Software engineering
• Database management
• Operating systems

**Self-improvement:**
Continuous learning through online courses, CTF competitions, and personal projects.`,

  kazikmi: () => `More about Kazıkmı.com 🚗

**Data Pipeline Architecture:**
• Stealth mode web scraping with Playwright
• Advanced fingerprinting to bypass anti-bot protections
• Daily automatic data updates

**ML Model Details:**
• Feature engineering: brand, model, year, mileage, fuel type, transmission, color, damage history
• Gradient Boosting & Random Forest ensemble models
• Cross-validation for model verification
• R² score: 0.92+ accuracy

**Overpricing Score Algorithm:**
• Scoring from 1-10 (10 = very expensive)
• Market average, median, and standard deviation analysis
• Statistical comparison from similar vehicle pool`,
};

// ─── Main Export ─────────────────────────────────────────────────────
export function getAIResponse(question: string, language: 'tr' | 'en' = 'tr'): AIResponse {
  const q = question.trim();

  // 1. Follow‑up detection
  if (isFollowUp(q)) {
    const lastCat = getLastCategory();
    if (lastCat && lastCat !== 'unknown') {
      const followUpMap = language === 'en' ? followUpResponsesEN : followUpResponsesTR;
      const handler = followUpMap[lastCat];
      if (handler) {
        pushHistory(q, lastCat);
        return { text: handler(), confidence: 0.85 };
      }
      // Fallback: re-send the primary response for that category
      const responseMap = language === 'en' ? responsesEN : responses;
      const fallback = responseMap[lastCat];
      if (fallback) {
        pushHistory(q, lastCat);
        return { text: fallback(), confidence: 0.7 };
      }
    }
  }

  // 2. Multi‑category scoring
  const categories = detectCategories(q, language);
  const primaryCategory = categories[0];

  // 3. Build response
  const text = buildResponse(categories, language);

  // 4. Record in history
  pushHistory(q, primaryCategory);

  // 5. Confidence calculation
  const scored = scoreCategories(q, language);
  let confidence: number;
  if (primaryCategory === 'unknown') {
    confidence = 0.2;
  } else if (scored.length > 0) {
    const topScore = scored[0].score;
    confidence = Math.min(0.98, 0.6 + topScore * 0.15);
  } else {
    confidence = 0.3;
  }

  return { text, confidence };
}

export function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// ─── Reset (useful for testing) ──────────────────────────────────────
export function resetConversation(): void {
  conversationHistory.length = 0;
}
