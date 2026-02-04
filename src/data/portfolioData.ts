export interface Project {
  name: string;
  description: string;
  longDescription: string;
  technologies: string[];
  github: string;
  icon: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  period: string;
  details?: string[];
}

export interface PortfolioData {
  name: string;
  firstName: string;
  title: string;
  bio: string;
  longBio: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  avatar: string;
  skills: {
    languages: string[];
    security: string[];
    ai: string[];
    backend: string[];
    frontend: string[];
    tools: string[];
  };
  spokenLanguages: string[];
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  certifications: string[];
  exchangePrograms: string[];
  stats: {
    projects: string;
    contributions: string;
    technologies: string;
  };
  interests: string[];
}

export const portfolioData: PortfolioData = {
  name: "Laçin Temel",
  firstName: "Laçin",
  title: "Cyber Security Analyst | Software Developer",
  bio: "Siber güvenlik alanında kariyer yapmaya tutkuyla bağlı bir profesyonelim. Hızlı öğrenen, takım odaklı ve işbirlikçi bir yaklaşıma sahibim.",
  longBio: `Merhaba, ben Laçin Temel. Siber güvenlik ve yazılım geliştirme alanlarında uzmanlaşmaya odaklanan bir Bilgisayar Mühendisliği öğrencisiyim. Özellikle penetrasyon testleri, güvenlik açığı analizleri ve bug bounty programları konusunda pratik deneyime sahibim. Daha önce Vulnerday’de Cyber Security Analyst olarak görev alarak hem iç sistemler hem de müşteri sistemleri üzerinde güvenlik testleri gerçekleştirdim.
Siber güvenliğin yanı sıra Full Stack yazılım geliştirme alanında da aktif olarak projeler üretiyorum. Python, JavaScript, TypeScript, Java ve C# başta olmak üzere modern teknolojilerle ölçeklenebilir ve sürdürülebilir uygulamalar geliştirdim. Fintech, yapay zekâ destekli uygulamalar, biletleme ve belediye hizmet sistemleri gibi farklı alanlarda projeler üzerinde çalıştım.
Ege Üniversitesi Bilgisayar Mühendisliği öğrencisi olarak, hızla gelişen teknoloji dünyasında sürekli öğrenmeyi, kendimi teknik ve analitik açıdan geliştirmeyi ve edindiğim bilgileri gerçek dünya problemlerine uygulamayı hedefliyorum. Takım çalışmasına yatkın, öğrenmeye açık ve sorumluluk almaktan çekinmeyen bir yapıya sahibim.`,
  location: "Türkiye",
  email: "lacintemel7@gmail.com",
  phone: "+90 536 717 97 31",
  github: "https://github.com/lacintemel",
  linkedin: "https://www.linkedin.com/in/lacintemel/",
  avatar: "https://avatars.githubusercontent.com/u/148385081?v=4",
  
  skills: {
    languages: ["Python", "JavaScript", "TypeScript", "Java", "C#", "C"],
    security: ["Penetration Testing", "Red Teaming", "Vulnerability Assessment", "Bug Bounty", "AI Security", "Network Security", "SIEM", "Threat Intelligence"],
    ai: ["Machine Learning", "NLP", "LLM Integration", "Prompt Engineering", "Computer Vision", "Data Analysis"],
    backend: ["Node.js", "Express.js", "Flask", "REST API", "GraphQL", "PostgreSQL", "MongoDB", "Supabase"],
    frontend: ["React", "HTML5", "CSS3", "TailwindCSS"],
    tools: ["Git", "GitHub", "VS Code", "Kali Linux", "Burp Suite", "Nmap", "Docker", "Wireshark"]
  },

  spokenLanguages: [
    "Türkçe (Anadil)",
    "İngilizce (C1)",
    "Boşnakça (A2)",
    "Hırvatça (A2)",
    "Rusça (A2)"
  ],
  
  experiences: [
    {
      title: "Cyber Security Analyst",
      company: "Vulnerday",
      location: "Türkiye",
      period: "Kasım 2023 - Mayıs 2024",
      description: [
        "İç ve dış sistemler için penetrasyon testleri gerçekleştirdim",
        "Güvenlik açıklarını tespit edip iyileştirme önerileri sundum",
        "Bug bounty programlarına katılarak güvenlik açıkları raporladım",
        "Saldırı vektörlerini belirleme ve güvenlik stratejileri tasarlama deneyimi kazandım"
      ]
    }
  ],
  
  educations: [
    {
      degree: "Bilgisayar Mühendisliği Lisans",
      school: "Ege Üniversitesi",
      location: "İzmir, Türkiye",
      period: "2022 - 2027",
      details: [
        "Bilgisayar Mühendisliği Bölümü"
      ]
    }
  ],

  certifications: [
    "CAPT (Certified Associate Penetration Tester) - Hackviser (2026)"
  ],

  exchangePrograms: [
    "Work and Travel USA (Temmuz 2025 - Ekim 2025)"
  ],
  
  projects: [
    {
      name: "InterviewAI",
      description: "NLP tabanlı akıllı mülakat simülasyon uygulaması",
      longDescription: "InterviewAI, doğal dil işleme (NLP) ve makine öğrenmesi teknolojileri kullanarak mülakat pratiği yapmanıza olanak tanıyan masaüstü uygulamasıdır. Sentence Transformers ile semantik analiz, duygu analizi, anahtar kelime çıkarımı ve yanıt puanlama özellikleri sunar. CustomTkinter ile modern bir arayüze sahiptir.",
      technologies: ["Python", "CustomTkinter", "Sentence Transformers", "KeyBERT", "NLP"],
      github: "https://github.com/lacintemel/InterviewAI",
      icon: "brain"
    },
    {
      name: "PayMaki",
      description: "Modern İnsan Kaynakları Yönetim Sistemi",
      longDescription: "PayMaki, kurumsal İK süreçlerini dijitalleştiren kapsamlı bir web uygulamasıdır. Bordro yönetimi, izin takibi, satış performansı, zaman takibi, işe alım süreci ve çalışan yönetimi gibi modüller içerir. Supabase backend, Excel/PDF export ve rol tabanlı erişim kontrolü sunar.",
      technologies: ["React", "Vite", "TailwindCSS", "Supabase", "PostgreSQL"],
      github: "https://github.com/lacintemel/PayMaki",
      icon: "users"
    },
    {
      name: "ThatTicket.com",
      description: "Java Swing bilet rezervasyon sistemi",
      longDescription: "ThatTicket.com, otobüs ve uçak seferleri için bilet rezervasyonu yapılabilen Java Swing tabanlı masaüstü uygulamasıdır. Observer, Command ve Factory design pattern'leri kullanılmıştır. SQLite veritabanı, müşteri bildirimleri ve admin panel özellikleri sunar.",
      technologies: ["Java", "Swing", "SQLite", "Maven", "Design Patterns"],
      github: "https://github.com/lacintemel/ThatTicket.com",
      icon: "ticket"
    },
    {
      name: "MSRS - Municipal Service Request System",
      description: "Belediye hizmet talep sistemi",
      longDescription: "MSRS, vatandaşların belediye hizmetleri için talep oluşturmasını, takip etmesini ve güncellemeler almasını sağlayan full-stack bir uygulamadır. Harita entegrasyonu, gerçek zamanlı bildirimler (Socket.io), dosya yükleme, admin dashboard ve KVKK uyumlu kayıt sistemi sunar.",
      technologies: ["TypeScript", "React", "Node.js", "MongoDB", "Socket.io"],
      github: "https://github.com/lacintemel/munucipality",
      icon: "city"
    },
    {
      name: "Gayrimenkul Merkezim",
      description: "Apartman sakinleri için yönetim portalı",
      longDescription: "Gayrimenkul Merkezim (Resident Center), apartman sakinlerinin bakım talepleri oluşturmasına, ödemelerini takip etmesine, duyuruları görmesine ve yönetimle iletişim kurmasına olanak tanıyan modern bir web uygulamasıdır. Dashboard, mesajlaşma, doküman yönetimi ve profil ayarları modülleri içerir.",
      technologies: ["React", "Vite", "TailwindCSS", "Lucide Icons"],
      github: "https://github.com/lacintemel/Gayrimenkul_Merkezim",
      icon: "home"
    }
  ],
  
  stats: {
    projects: "5+",
    contributions: "285+",
    technologies: "10+"
  },
  
  interests: ["Siber Güvenlik", "Penetrasyon Testi", "Web Geliştirme", "Bug Bounty", "Network Security"]
};
