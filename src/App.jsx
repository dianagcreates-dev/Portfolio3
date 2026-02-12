import React, { useEffect, useRef, useState } from 'react';

// Translation content
const translations = {
  en: {
    nav: {
      home: 'Home',
      work: 'Work',
      about: 'About',
      contact: 'Contact'
    },
    home: {
      headline: 'Where Design Thinks',
      subheadline: 'UX/UI Designer & AI Specialist building beautiful, functional digital experiences',
      cta: 'View Projects'
    },
    work: {
      backButton: '← Back to Projects',
      skills: ['Figma', 'Prototyping', 'User Research']
    },
    about: {
      title: 'Design Philosophy',
      description: "My design philosophy blends aesthetics with functionality, and artificial intelligence with human intuition. I create digital products that don't just look good—they feel natural to use.",
      skills: ['Strategy', 'Interaction', 'Visual', 'Research'],
      skillLabel: 'Core Focus',
      tools: ['Figma', 'HTML', 'CSS', 'JavaScript', 'React', 'Adobe XD'],
      toolsLabel: 'Tools & Technologies'
    },
    contact: {
      title: "Let's Connect",
      subtitle: 'Open to new opportunities and collaborations',
      email: 'Email',
      linkedin: 'LinkedIn',
      dribbble: 'Dribbble'
    },
    projects: [
      {
        id: 1,
        title: "Palmi",
        category: "AI Product Design",
        year: "2026",
        description: "Helping Parents Understand  their Child's Emotions",
        color: "#6366F1",
        content: {
          challenge: "There is a critical gap in early emotional communication. Children frequently experience feelings they cannot yet articulate, leaving parents to interpret meaning through behavior rather than dialogue. This dynamic limits emotional clarity at a formative developmental stage.",
          solution: "Palmi is an emotional companion that bridges the gap between a child's feelings and a parent's understanding. It offers children a safe space to express emotions while quietly tracking emotional patterns over time.",
          quote: "Understanding emotions early helps build resilience for life.",
          designApproach: "The device inspiration from the form language of a woman's compact an object associated with privacy,care,and personal ritual. This reference informed both the physical interaction and emotional symbolism of the product. The compact 70 mm X 70 mm dimension was deliberately selected to fit comfortably within a child's hands. The scale reinfores a sense of ownership and wmotional safety,preventing the object from feeling technical or intimidating. The dual states open and closed were designed as metaphors for emotional bounderies. Opening represent readiness for expression ans engagement closing signals privacy, containment, and emotional rest.",
          purposeOfData: "The purpose of this data is to support awareness and conversation. It is not meant to diagnose or assess, but to help parents better understand their child and seek professional support when needed.",
          metrics: [
            { value: '150%', label: 'User Growth' },
            { value: '85%', label: 'Satisfaction' },
            { value: '40%', label: 'Faster Tasks' }
          ],
          features: [
            {
              title: "Facial Expression Tracking",
              description: "Supports the system's understanding of a child's emotional cues while avoiding the capture of raw image data."
            },
            {
              title: "Voice Pattern Analysis",
              description: "Palmi listens to how something is said, such as tone and rhythm, rather than what is being said, allowing patterns to be understood without capturing speech content."
            },
            {
              title: "Emotional Pattern Insights",
              description: "Facial and voice cues are combined over time into emotional patterns that parents can view through the app to support a clearer understanding of their child's emotions."
            }
          ]
        },
        images: {
          hero: "/images/palmi/hero.png",              // 1920x1200px (16:10)
          process1: "/images/palmi/process1.png",      // 1920x1200px (16:10)
          process2: "/images/palmi/process6.png",      // 800x600px (4:3)
          process3: "/images/palmi/process7.png",      // 800x600px (4:3)
          process4: "/images/palmi/process8.png",      // 800x600px (4:3)
          processWide: "/images/palmi/process-wide2.png", // 2100x900px (21:9)
          detail1: "/images/palmi/detail1.png",        // 800x600px (4:3)
          detail2: "/images/palmi/detail2.png",        // 800x600px (4:3)
          portrait: "/images/palmi/portrait1.png",      // 600x800px (3:4)
          solution: "/images/palmi/solution.png",      // 800x600px (4:3)
          screen1: "/images/palmi/screen1.3.png",        // 800x800px (1:1)
          screen2: "/images/palmi/screen2.2.png",        // 800x800px (1:1)
          screen3: "/images/palmi/screen3.2.png",        // 800x800px (1:1)
          screen4: "/images/palmi/screen5.png",        // 800x800px (1:1)
          final: "/images/palmi/final2.png"             // 2100x900px (21:9)
     },
      },
      {
        id: 2,
        title: "Synkro",
        category: "Digital Experience ",
        year: "2025",
        description: "Digital Business Card",
        color: "#EC4899",
        content: {
          challenge: "Traditional business cards are easily lost and fail to capture the full scope of professional identity in today's digital world.",
          solution: "Synkro transforms networking with a dynamic digital business card that updates in real-time and creates meaningful connections.",
          quote: "Your network is your net worth.",
          deviceObjective: "To revolutionize networking: enable instant sharing, real-time updates, and seamless contact management across all platforms.",
          purposeOfData: "The data collected helps professionals track networking effectiveness, understand connection patterns, and optimize their professional presence.",
          metrics: [
            { value: '200%', label: 'Connections Made' },
            { value: '92%', label: 'Retention Rate' },
            { value: '3x', label: 'Faster Sharing' }
          ],
          features: [
            {
              title: "Instant QR Sharing",
              description: "Share your digital card instantly via QR code, NFC, or link - no app download required for recipients."
            },
            {
              title: "Real-Time Updates",
              description: "Update your information once and all shared cards automatically reflect the changes across all contacts."
            },
            {
              title: "Analytics Dashboard",
              description: "Track who viewed your card, when connections were made, and measure your networking effectiveness over time."
            }
          ]
        },
        images: {
            hero: "/images/synkro/hero2.png",
          process1: "/images/synkro/process1.2.png",
          process2: "/images/synkro/process2.png",
          process3: "/images/synkro/process3.png",
          process4: "/images/synkro/process4.png",
          processWide: "/images/synkro/process-wide2.png",
          detail1: "/images/synkro/detail1.png",
          detail2: "/images/synkro/detail2.png",
          portrait: "/images/synkro/portrait.png",
          solution: "/images/synkro/solution.png",
          screen1: "/images/synkro/screen1.png",
          screen2: "/images/synkro/screen2.png",
          screen3: "/images/synkro/screen3.png",
          screen4: "/images/synkro/screen4.png",
          final: "/images/synkro/final.png"
        }
      },
      {
        id: 3,
        title: "Social Media",
        category: "Graphic Design",
        year: "2024",
        description: "Product Post Design",
        color: "#F59E0B",
        content: {
          challenge: "Standing out in crowded social feeds requires eye-catching designs that communicate product value instantly.",
          solution: "Strategic visual designs that blend aesthetics with clear messaging to drive engagement and conversions.",
          quote: "Design is the silent ambassador of your brand.",
          deviceObjective: "To maximize social media impact: create scroll-stopping visuals, communicate value instantly, and drive measurable engagement.",
          purposeOfData: "Analytics help understand which design elements resonate most with audiences, enabling data-driven creative decisions.",
          metrics: [
            { value: '300%', label: 'Engagement Boost' },
            { value: '95%', label: 'Brand Recall' },
            { value: '2.5x', label: 'Conversion Rate' }
          ],
          features: [
            {
              title: "Platform Optimization",
              description: "Designs optimized for each platform's specific requirements, aspect ratios, and best practices for maximum reach."
            },
            {
              title: "Brand Consistency",
              description: "Maintain cohesive visual identity across all social channels while adapting to platform-specific aesthetics."
            },
            {
              title: "Engagement-Driven Design",
              description: "Every element is crafted to stop scrolling, communicate value instantly, and drive meaningful user actions."
            }
          ]
        },
        images: {
          hero: "/images/social-media/hero.jpg",
          process1: "/images/social-media/process1.jpg",
          process2: "/images/social-media/process2.jpg",
          process3: "/images/social-media/process3.jpg",
          process4: "/images/social-media/process4.jpg",
          processWide: "/images/social-media/process-wide.jpg",
          detail1: "/images/social-media/detail1.jpg",
          detail2: "/images/social-media/detail2.jpg",
          portrait: "/images/social-media/portrait.jpg",
          solution: "/images/social-media/solution.jpg",
          screen1: "/images/social-media/screen1.jpg",
          screen2: "/images/social-media/screen2.jpg",
          screen3: "/images/social-media/screen3.jpg",
          screen4: "/images/social-media/screen4.jpg",
          final: "/images/social-media/final.jpg"
        }
      },
      {
        id: 4,
        title: "Magi",
        category: "Mobile App",
        year: "2023",
        description: "Augmented Reality Greeting Cards",
        color: "#10B981",
        content: {
          challenge: "Traditional greeting cards lack the personal touch and interactive experience modern users expect.",
          solution: "Magi brings greeting cards to life through AR technology, creating memorable and shareable moments.",
          quote: "The future of connection is augmented reality.",
          deviceObjective: "To modernize greeting cards: blend physical cards with digital AR experiences, enable personalization, and create shareable moments.",
          purposeOfData: "User interaction data helps improve AR experiences, personalize content recommendations, and enhance card creation features.",
          metrics: [
            { value: '500%', label: 'Engagement Time' },
            { value: '88%', label: 'Share Rate' },
            { value: '4x', label: 'Repeat Usage' }
          ],
          features: [
            {
              title: "AR Card Scanning",
              description: "Point your phone at any Magi card to unlock immersive 3D animations, videos, and interactive experiences."
            },
            {
              title: "Personalization Studio",
              description: "Create custom AR experiences with photos, videos, messages, and animations tailored to your recipient."
            },
            {
              title: "Memory Preservation",
              description: "AR experiences are saved in the cloud, allowing recipients to relive special moments anytime, anywhere."
            }
          ]
        },
        images: {
          hero: "/images/magi/hero.png",
          process1: "/images/magi/process1.png",
          process2: "/images/magi/process2.png",
          process3: "/images/magi/process3.png",
          process4: "/images/magi/process4.png",
          processWide: "/images/magi/process-wide.png",
          detail1: "/images/magi/detail1.png",
          detail2: "/images/magi/detail2.png",
          portrait: "/images/magi/portrait.png",
          solution: "/images/magi/solution.png",
          screen1: "/images/magi/screen1.png",
          screen2: "/images/magi/screen2.png",
          screen3: "/images/magi/screen3.png",
          screen4: "/images/magi/screen4.png",
          final: "/images/magi/final.png"
        }
      }
    ]
  },
  de: {
    nav: {
      home: 'Start',
      work: 'Arbeit',
      about: 'Über',
      contact: 'Kontakt'
    },
    home: {
      headline: 'Wo Design denkt',
      subheadline: 'UX/UI Designer & KI-Spezialist für schöne, funktionale digitale Erlebnisse',
      cta: 'Projekte Ansehen'
    },
    work: {
      backButton: '← Zurück zu Projekten',
      skills: ['Figma', 'Prototyping', 'Nutzerforschung']
    },
    about: {
      title: 'Design-Philosophie',
      description: 'Meine Designphilosophie verbindet Ästhetik mit Funktionalität sowie künstliche Intelligenz mit menschlicher Intuition. Ich gestalte digitale Produkte, die nicht nur gut aussehen, sondern sich auch natürlich anfühlen.',
      skills: ['Strategie', 'Interaktion', 'Visuell', 'Forschung'],
      skillLabel: 'Kernfokus',
      tools: ['Figma', 'HTML', 'CSS', 'JavaScript', 'React', 'Adobe XD'],
      toolsLabel: 'Tools & Technologien'
    },
    contact: {
      title: 'Kontakt Aufnehmen',
      subtitle: 'Offen für neue Möglichkeiten und Zusammenarbeit',
      email: 'E-Mail',
      linkedin: 'LinkedIn',
      dribbble: 'Dribbble'
    },
    projects: [
      {
        id: 1,
        title: "Palmi",
        category: "AI Produktdesign",
        year: "2026",
        description: "Eltern dabei helfen, die Gefühle ihres Kindes zu verstehen",
        color: "#6366F1",
        content: {
          challenge: "Es besteht eine wesentliche Lücke in der frühkindlichen emotionalen Kommunikation. Kinder erleben häufig Gefühle, die sie noch nicht sprachlich ausdrücken können, wodurch Eltern gezwungen sind, Bedeutungen eher über Verhalten als über Dialog zu interpretieren. Diese Dynamik begrenzt die emotionale Klarheit in einer prägenden Entwicklungsphase.",
          solution: "Palmi ist ein emotionaler Begleiter, der die Lücke zwischen den Gefühlen eines Kindes und dem Verständnis der Eltern überbrückt. Es bietet Kindern einen sicheren Raum, um Emotionen auszudrücken, während es emotionale Muster im Laufe der Zeit leise verfolgt.",
          quote: "Emotionen frühzeitig zu verstehen hilft, Resilienz fürs Leben aufzubauen.",
          DeviceApproach: "Das Gerät orientiert sich formal an einem klassischen Damenkompaktspiegel einem Objekt, das mit Privatsphäre,Fürsorge und persönlichem Ritual verbunden wird. Diese Referenz prägte sowohl  die physische Interaktion als auch die emotionale Symbolik des Produkts. Die kompakte Größe von 70 mm × 70 mm wurde bewusst gewählt, um ergonomisch in die Hände eines Kindes zu passen. Der Maßstab unterstützt ein Gefühl von Eigenständigkeit und emotionaler Sicherheit, ohne technisch oder überfordernd zu wirken.Die beiden Zustände – geöffnet und geschlossen – fungieren als Metaphern für emotionale Grenzen Das Öffnen steht für Bereitschaft zur Ausdrucksfähigkeit und Interaktion. Das Schließen signalisiert Rückzug, Schutz und emotionale Ruhe.",
          purposeOfData: "Der Zweck dieser Daten besteht darin, Bewusstsein und Gespräche zu unterstützen. Sie sind nicht zur Diagnose oder Bewertung gedacht, sondern sollen Eltern helfen, ihr Kind besser zu verstehen und bei Bedarf professionelle Unterstützung zu suchen.",
          metrics: [
            { value: '150%', label: 'Nutzerwachstum' },
            { value: '85%', label: 'Zufriedenheit' },
            { value: '40%', label: 'Schnellere Aufgaben' }
          ],
          features: [
            {
              title: "Gesichtsausdruck-Tracking",
              description: "Unterstützt das Verständnis des Systems für die emotionalen Signale eines Kindes und vermeidet dabei die Erfassung von Roh-Bilddaten."
            },
            {
              title: "Stimmungsmuster-Analyse",
              description: "Palmi hört darauf, wie etwas gesagt wird, wie Tonfall und Rhythmus, anstatt was gesagt wird, sodass Muster verstanden werden können, ohne Sprachinhalte zu erfassen."
            },
            {
              title: "Emotionale Muster-Einblicke",
              description: "Gesichts- und Stimmsignale werden im Laufe der Zeit zu emotionalen Mustern kombiniert, die Eltern über die App einsehen können, um ein klareres Verständnis für die Emotionen ihres Kindes zu erhalten."
            }
          ]
        },
        images: {
          hero: "/images/palmi/hero.png",
          process1: "/images/palmi/process1.png",
          process2: "/images/palmi/process6.png",
          process3: "/images/palmi/process7.png",
          process4: "/images/palmi/process8.png",
          processWide: "/images/palmi/process-wide2.png",
          detail1: "/images/palmi/detail1.png",
          detail2: "/images/palmi/detail2.png",
          portrait: "/images/palmi/portrait1.png",
          solution: "/images/palmi/solution.png",
          screen1: "/images/palmi/screen1.3.png",
          screen2: "/images/palmi/screen2.2.png",
          screen3: "/images/palmi/screen3.2.png",
          screen4: "/images/palmi/screen5.png",
          final: "/images/palmi/fina2.png"
        }
      },
      {
        id: 2,
        title: "Synkro",
        category: "digitales Erlebnis",
        year: "2025",
        description: "Digitale Visitenkarte",
        color: "#EC4899",
        content: {
          challenge: "Traditionelle Visitenkarten gehen leicht verloren und erfassen nicht das volle Spektrum der beruflichen Identität in der heutigen digitalen Welt.",
          solution: "Synkro revolutioniert das Networking mit einer dynamischen digitalen Visitenkarte, die sich in Echtzeit aktualisiert und bedeutungsvolle Verbindungen schafft.",
          quote: "Ihr Netzwerk ist Ihr Vermögen.",
          deviceObjective: "Um das Networking zu revolutionieren: Sofortiges Teilen ermöglichen, Echtzeit-Updates und nahtloses Kontaktmanagement über alle Plattformen hinweg.",
          purposeOfData: "Die gesammelten Daten helfen Fachleuten, die Networking-Effektivität zu verfolgen, Verbindungsmuster zu verstehen und ihre professionelle Präsenz zu optimieren.",
          metrics: [
            { value: '200%', label: 'Verbindungen' },
            { value: '92%', label: 'Bindungsrate' },
            { value: '3x', label: 'Schnelleres Teilen' }
          ],
          features: [
            {
              title: "Sofortiges QR-Teilen",
              description: "Teilen Sie Ihre digitale Karte sofort per QR-Code, NFC oder Link - kein App-Download für Empfänger erforderlich."
            },
            {
              title: "Echtzeit-Updates",
              description: "Aktualisieren Sie Ihre Informationen einmal und alle geteilten Karten spiegeln automatisch die Änderungen bei allen Kontakten wider."
            },
            {
              title: "Analytics-Dashboard",
              description: "Verfolgen Sie, wer Ihre Karte angesehen hat, wann Verbindungen hergestellt wurden, und messen Sie Ihre Networking-Effektivität im Laufe der Zeit."
            }
          ]
        },
        images: {
          hero: "/images/synkro/hero2.png",
          process1: "/images/synkro/process1.2.png",
          process2: "/images/synkro/process2.png",
          process3: "/images/synkro/process3.png",
          process4: "/images/synkro/process4.png",
          processWide: "/images/synkro/process-wide2.png",
          detail1: "/images/synkro/detail1.png",
          detail2: "/images/synkro/detail2.png",
          portrait: "/images/synkro/portrait.png",
          solution: "/images/synkro/solution.png",
          screen1: "/images/synkro/screen1.png",
          screen2: "/images/synkro/screen2.png",
          screen3: "/images/synkro/screen3.png",
          screen4: "/images/synkro/screen4.png",
          final: "/images/synkro/final.png"
        }
      },
      {
        id: 3,
        title: "Soziale Medien",
        category: "Grafikdesign",
        year: "2024",
        description: "Produkt-Post-Design",
        color: "#F59E0B",
        content: {
          challenge: "Sich in überfüllten Social-Media-Feeds abzuheben erfordert auffällige Designs, die den Produktwert sofort kommunizieren.",
          solution: "Strategische visuelle Designs, die Ästhetik mit klarer Botschaft verbinden, um Engagement und Conversions zu steigern.",
          quote: "Design ist der stille Botschafter Ihrer Marke.",
          deviceObjective: "Um die Social-Media-Wirkung zu maximieren: Scroll-stoppende Visuals erstellen, Wert sofort kommunizieren und messbares Engagement fördern.",
          purposeOfData: "Analysen helfen zu verstehen, welche Designelemente beim Publikum am besten ankommen und ermöglichen datengesteuerte kreative Entscheidungen.",
          metrics: [
            { value: '300%', label: 'Engagement-Boost' },
            { value: '95%', label: 'Markenerinnerung' },
            { value: '2.5x', label: 'Conversion-Rate' }
          ],
          features: [
            {
              title: "Plattform-Optimierung",
              description: "Designs optimiert für die spezifischen Anforderungen, Seitenverhältnisse und Best Practices jeder Plattform für maximale Reichweite."
            },
            {
              title: "Marken-Konsistenz",
              description: "Wahren Sie eine kohärente visuelle Identität über alle Social-Media-Kanäle hinweg und passen Sie sich gleichzeitig an plattformspezifische Ästhetiken an."
            },
            {
              title: "Engagement-gesteuertes Design",
              description: "Jedes Element ist darauf ausgelegt, das Scrollen zu stoppen, Wert sofort zu kommunizieren und bedeutungsvolle Nutzeraktionen zu fördern."
            }
          ]
        },
        images: {
          hero: "/images/social-media/hero.jpg",
          process1: "/images/social-media/process1.jpg",
          process2: "/images/social-media/process2.jpg",
          process3: "/images/social-media/process3.jpg",
          process4: "/images/social-media/process4.jpg",
          processWide: "/images/social-media/process-wide.jpg",
          detail1: "/images/social-media/detail1.jpg",
          detail2: "/images/social-media/detail2.jpg",
          portrait: "/images/social-media/portrait.jpg",
          solution: "/images/social-media/solution.jpg",
          screen1: "/images/social-media/screen1.jpg",
          screen2: "/images/social-media/screen2.jpg",
          screen3: "/images/social-media/screen3.jpg",
          screen4: "/images/social-media/screen4.jpg",
          final: "/images/social-media/final.jpg"
        }
      },
      {
        id: 4,
        title: "Magi",
        category: "Mobile Anwendung",
        year: "2023",
        description: "Grußkarten mit erweiterter Realität",
        color: "#10B981",
        content: {
          challenge: "Traditionelle Grußkarten fehlt die persönliche Note und das interaktive Erlebnis, das moderne Nutzer erwarten.",
          solution: "Magi erweckt Grußkarten durch AR-Technologie zum Leben und schafft unvergessliche und teilbare Momente.",
          quote: "Die Zukunft der Verbindung ist erweiterte Realität.",
          deviceObjective: "Um Grußkarten zu modernisieren: Physische Karten mit digitalen AR-Erlebnissen verbinden, Personalisierung ermöglichen und teilbare Momente schaffen.",
          purposeOfData: "Benutzerinteraktionsdaten helfen, AR-Erlebnisse zu verbessern, Inhaltsempfehlungen zu personalisieren und Kartenerstellungsfunktionen zu optimieren.",
          metrics: [
            { value: '500%', label: 'Engagement-Zeit' },
            { value: '88%', label: 'Teilungsrate' },
            { value: '4x', label: 'Wiederholte Nutzung' }
          ],
          features: [
            {
              title: "AR-Karten-Scannen",
              description: "Richten Sie Ihr Telefon auf jede Magi-Karte, um immersive 3D-Animationen, Videos und interaktive Erlebnisse freizuschalten."
            },
            {
              title: "Personalisierungs-Studio",
              description: "Erstellen Sie benutzerdefinierte AR-Erlebnisse mit Fotos, Videos, Nachrichten und Animationen, die auf Ihren Empfänger zugeschnitten sind."
            },
            {
              title: "Erinnerungs-Bewahrung",
              description: "AR-Erlebnisse werden in der Cloud gespeichert, sodass Empfänger besondere Momente jederzeit und überall wieder erleben können."
            }
          ]
        },
        images: {
          hero: "/images/magi/hero.png",
          process1: "/images/magi/process1.png",
          process2: "/images/magi/process2.png",
          process3: "/images/magi/process3.png",
          process4: "/images/magi/process4.png",
          processWide: "/images/magi/process-wide.png",
          detail1: "/images/magi/detail1.png",
          detail2: "/images/magi/detail2.png",
          portrait: "/images/magi/portrait.png",
          solution: "/images/magi/solution.png",
          screen1: "/images/magi/screen1.png",
          screen2: "/images/magi/screen2.png",
          screen3: "/images/magi/screen3.png",
          screen4: "/images/magi/screen4.png",
          final: "/images/magi/final.png"
        }
      }
    ]
  }
};

export default function DesignerPortfolio() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const contentRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
  const [carouselRotation, setCarouselRotation] = useState(0);
  const carouselAnimationRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRotation, setDragStartRotation] = useState(0);
  const [showDragGuide, setShowDragGuide] = useState(true);
  const targetMousePosition = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [mouseTrail, setMouseTrail] = useState([]);
  const mouseTrailRef = useRef([]);
  const [frequencyData, setFrequencyData] = useState(new Array(32).fill(0));
 

  // Get current translations
  const t = translations[language];

  // Nebula galaxy background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const numParticles = 200;
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 300;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        baseSpeed: Math.random() * 0.3 + 0.1,
        angle: angle,
        orbitRadius: radius,
        orbitSpeed: (Math.random() - 0.5) * 0.02,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.2,
        hue: Math.random() * 60 + 200
      });
    }

    const stars = [];
    const numStars = 150;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1,
        opacity: Math.random() * 0.2 + 0.05
      });
    }

    const glowParticles = [];
    const numGlowParticles = 15;
    for (let i = 0; i < numGlowParticles; i++) {
      glowParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.8,
        baseSize: Math.random() * 1.5 + 0.8,
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.3 + 0.2,
        hue: Math.random() * 20 + 45,
        glowIntensity: Math.random() * 0.4 + 0.4
      });
    }

    const render = () => {
      timeRef.current += 0.005;
      const time = timeRef.current;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      glowParticles.forEach((glow) => {
        glow.pulsePhase += glow.pulseSpeed;
        const pulse = Math.sin(glow.pulsePhase);
        glow.size = glow.baseSize + pulse * 0.8;
        
        glow.x += Math.cos(glow.angle) * glow.speed;
        glow.y += Math.sin(glow.angle) * glow.speed;

        if (glow.x < -50) glow.x = width + 50;
        if (glow.x > width + 50) glow.x = -50;
        if (glow.y < -50) glow.y = height + 50;
        if (glow.y > height + 50) glow.y = -50;

        const currentOpacity = glow.opacity * (0.7 + pulse * 0.3);

        const glowGradient = ctx.createRadialGradient(
          glow.x, glow.y, 0,
          glow.x, glow.y, glow.size * 12
        );
        glowGradient.addColorStop(0, `hsla(${glow.hue}, 85%, 65%, ${currentOpacity * glow.glowIntensity * 0.8})`);
        glowGradient.addColorStop(0.2, `hsla(${glow.hue}, 75%, 55%, ${currentOpacity * glow.glowIntensity * 0.5})`);
        glowGradient.addColorStop(0.5, `hsla(${glow.hue}, 65%, 45%, ${currentOpacity * glow.glowIntensity * 0.2})`);
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.size * 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${glow.hue}, 95%, 75%, ${currentOpacity * glow.glowIntensity})`;
        ctx.beginPath();
        ctx.arc(glow.x, glow.y, glow.size, 0, Math.PI * 2);
        ctx.fill();
      });

      const shapeCount = 3;
      const shapeCenters = [];
      for (let i = 0; i < shapeCount; i++) {
        shapeCenters.push({
          x: width / 2 + Math.sin(time * 0.3 + i * 2) * width * 0.3,
          y: height / 2 + Math.cos(time * 0.25 + i * 2.5) * height * 0.25
        });
      }

      particles.forEach((particle, index) => {
        const shapeIndex = index % shapeCount;
        const center = shapeCenters[shapeIndex];

        particle.angle += particle.orbitSpeed;
        particle.phase += 0.01;

        const waveOffset = Math.sin(particle.phase + index * 0.1) * 50;
        particle.x = center.x + Math.cos(particle.angle) * (particle.orbitRadius + waveOffset);
        particle.y = center.y + Math.sin(particle.angle) * (particle.orbitRadius * 0.6 + waveOffset);

        particle.x += Math.sin(time + index) * particle.baseSpeed;
        particle.y += Math.cos(time + index * 0.8) * particle.baseSpeed;

        if (particle.x < -50) particle.x = width + 50;
        if (particle.x > width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = height + 50;
        if (particle.y > height + 50) particle.y = -50;

        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.6})`);
        gradient.addColorStop(0.5, `hsla(${particle.hue}, 60%, 50%, ${particle.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1, i + 20).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (1 - distance / 100) * 0.1;
            const avgHue = (p1.hue + p2.hue) / 2;
            ctx.strokeStyle = `hsla(${avgHue}, 70%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Custom cursor tracking with smooth interpolation for easier control
  useEffect(() => {
    let animationFrameId;
    const targetPos = { x: 0, y: 0 };
    const currentPos = { x: 0, y: 0 };
    
    const handleMouseMove = (e) => {
      targetPos.x = e.clientX;
      targetPos.y = e.clientY;
    };

    const smoothUpdate = () => {
      // Smooth interpolation - lower value = smoother but slower
      const smoothing = 0.1;
      
      currentPos.x += (targetPos.x - currentPos.x) * smoothing;
      currentPos.y += (targetPos.y - currentPos.y) * smoothing;
      
      setMousePosition({ x: currentPos.x, y: currentPos.y });
      
      // Update trail with smoother positions
      const newPos = { x: currentPos.x, y: currentPos.y, id: Date.now() };
      mouseTrailRef.current = [...mouseTrailRef.current, newPos].slice(-15);
      setMouseTrail(mouseTrailRef.current);
      
      animationFrameId = requestAnimationFrame(smoothUpdate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(smoothUpdate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Carousel auto-rotation (continuous, doesn't reset)
  useEffect(() => {
    if (activeSection === 'work' && !selectedProject && !isDragging) {
      let animationId;
      const rotationSpeed = 360 / 30000; // 360 degrees in 30 seconds
      let lastTime = Date.now();
      
      const animate = () => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        setCarouselRotation(prev => prev + (deltaTime * rotationSpeed));
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
      
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    }
  }, [activeSection, selectedProject, isDragging]);

  // Carousel drag control only (no auto-rotation)
  useEffect(() => {
    if (activeSection === 'work' && !selectedProject) {
      const handleMouseMove = (e) => {
        if (isDragging) {
          const deltaX = e.clientX - dragStartX;
          // Sensitivity: 0.5 means dragging 100px = 50 degrees rotation
          const rotationDelta = deltaX * 0.5;
          const newRotation = (dragStartRotation + rotationDelta) % 360;
          setCarouselRotation(newRotation < 0 ? newRotation + 360 : newRotation);
        }
      };

      const handleMouseUp = () => {
        if (isDragging) {
          setIsDragging(false);
          // Update the drag start rotation to current position for smooth continuation
          setDragStartRotation(carouselRotation);
        }
      };

      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStartX, dragStartRotation, carouselRotation, activeSection, selectedProject]);

  // Handle wheel scroll for section navigation
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't hijack scroll when in project view
      if (selectedProject) return;
      
      if (isScrolling) return;
      
      e.preventDefault();
      
      const sections = ['home', 'work', 'about', 'contact'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        setIsScrolling(true);
        setActiveSection(sections[currentIndex + 1]);
        setSelectedProject(null);
        setTimeout(() => setIsScrolling(false), 800);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setIsScrolling(true);
        setActiveSection(sections[currentIndex - 1]);
        setSelectedProject(null);
        setTimeout(() => setIsScrolling(false), 800);
      }
    };

    const contentEl = contentRef.current;
    if (contentEl) {
      contentEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (contentEl) {
        contentEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [activeSection, isScrolling, selectedProject]);

  // Audio visualization loop
  useEffect(() => {
    if (!isPlaying || !analyzerRef.current || !dataArrayRef.current) {
      return;
    }

    let animationId;
    const visualize = () => {
      if (analyzerRef.current && dataArrayRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
        setFrequencyData([...dataArrayRef.current]);
      }
      animationId = requestAnimationFrame(visualize);
    };
    
    visualize();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  // Initialize audio analyzer
  const initializeAudioAnalyzer = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
        analyzerRef.current.smoothingTimeConstant = 0.7;
        analyzerRef.current.minDecibels = -90;
        analyzerRef.current.maxDecibels = -10;
        const bufferLength = analyzerRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        source.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current.destination);
      } catch (err) {
        console.log('Audio context initialization failed:', err);
      }
    }
  };

  // Toggle audio play/pause
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        initializeAudioAnalyzer();
        
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.log('Audio play failed:', err);
        });
      }
    }
  };

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'work', label: t.nav.work },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      fontFamily: '"Space Mono", "Courier New", monospace'
    }}>
      {/* Particle Cursor */}
      {/* Trail particles - glowing orbs */}
      {mouseTrail.map((pos, index) => {
        const opacity = (index / mouseTrail.length) * 0.6;
        const size = ((index / mouseTrail.length) * 10) + 4;
        return (
          <div
            key={pos.id}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, rgba(147, 197, 253, ${opacity}), rgba(59, 130, 246, ${opacity * 0.7}), transparent)`,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9998,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 ${size * 3}px rgba(59, 130, 246, ${opacity * 0.8})`,
              filter: 'blur(0.5px)'
            }}
          />
        );
      })}
      
      <audio
        ref={audioRef}
        src="/background1.mp3"
        loop
      />

      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />

      {showStartPrompt && (
        <div
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.volume = 0.5;
              initializeAudioAnalyzer();
              audioRef.current.play().then(() => {
                setIsPlaying(true);
              }).catch(err => {
                console.log('Audio play failed:', err);
              });
            }
            setShowStartPrompt(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            border: '2px solid rgba(255,255,255,0.3)',
            maxWidth: '500px'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}>🎵</div>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#ffffff',
              marginBottom: '1rem',
              fontFamily: '"Archivo Black", sans-serif'
            }}>
              Click to Start
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: '"Inter", sans-serif'
            }}>
              Enable background music for the full experience
            </p>
          </div>
        </div>
      )}

      <nav style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(2rem, 5vw, 4rem)',
        opacity: 0,
        animation: 'fadeIn 1s ease 0.2s forwards'
      }}>
        <div style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          fontFamily: '"Archivo Black", sans-serif'
        }}>
          DIANA×STUDIO
        </div>

        <div style={{
          display: 'flex',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)'
        }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSelectedProject(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.5)',
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease',
                position: 'relative',
                padding: '0.5rem 0',
                fontFamily: '"Space Mono", monospace',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.5)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          {['EN', 'DE'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang.toLowerCase())}
              style={{
                background: language === lang.toLowerCase() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${language === lang.toLowerCase() ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
                color: language === lang.toLowerCase() ? '#ffffff' : 'rgba(255,255,255,0.6)',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.05em',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (language !== lang.toLowerCase()) {
                  e.target.style.background = 'rgba(255,255,255,0.15)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.toLowerCase()) {
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                }
              }}
            >
              {lang}
            </button>
          ))}
          
          <button
            onClick={toggleAudio}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ffffff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '0.5rem',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isPlaying ? (
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '3px', height: '14px', background: '#ffffff', borderRadius: '2px' }} />
                <div style={{ width: '3px', height: '14px', background: '#ffffff', borderRadius: '2px' }} />
              </div>
            ) : (
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid #ffffff',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                marginLeft: '3px'
              }} />
            )}
          </button>
          
          {/* Frequency Visualizer */}
          <div style={{
            display: 'flex',
            gap: '2px',
            alignItems: 'center',
            height: '40px',
            marginLeft: '1rem',
            padding: '0 0.5rem'
          }}>
            {frequencyData.slice(0, 20).map((value, i) => {
              const normalizedHeight = (value / 255) * 100;
              const height = isPlaying ? Math.max(normalizedHeight * 0.35, 3) : 3;
              
              return (
                <div
                  key={i}
                  style={{
                    width: '2.5px',
                    height: `${height}px`,
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '1.5px',
                    transition: 'none',
                    opacity: isPlaying ? 1 : 0.25,
                    boxShadow: isPlaying && value > 80 ? '0 0 8px rgba(255,255,255,0.9)' : 'none',
                    transform: 'scaleY(1)',
                    transformOrigin: 'center'
                  }}
                />
              );
            })}
          </div>
        </div>
      </nav>

      <div style={{
        position: 'fixed',
        right: 'clamp(2rem, 3vw, 3rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: selectedProject ? 'none' : 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        opacity: 0,
        animation: 'fadeIn 1s ease 0.5s forwards'
      }}>
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setSelectedProject(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              justifyContent: 'flex-end'
            }}
          >
            <div style={{
              position: 'relative',
              width: '12px',
              height: '12px'
            }}>
              {activeSection === item.id && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.5)',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
              )}
              
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: activeSection === item.id ? '12px' : '8px',
                height: activeSection === item.id ? '12px' : '8px',
                borderRadius: '50%',
                background: activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
                boxShadow: activeSection === item.id ? '0 0 20px rgba(255,255,255,0.5)' : 'none'
              }} />
            </div>
          </div>
        ))}
      </div>

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2rem, 4vw, 3rem)',
          paddingTop: 'clamp(5rem, 10vh, 7rem)'
        }}
      >
        {activeSection === 'home' && (
          <div style={{
            textAlign: 'center',
            maxWidth: '900px',
            opacity: 0,
            animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 10vw, 6rem)',
              fontWeight: 900,
              margin: 0,
              marginBottom: '1rem',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              fontFamily: '"Archivo Black", sans-serif',
              textShadow: '0 4px 20px rgba(0,0,0,0.4)'
            }}>
              {t.home.headline.split('').map((char, index) => {
                if (char === ' ' && index === t.home.headline.indexOf('Design') - 1) {
                  return <br key={index} />;
                }
                if (char === ' ') {
                  return <span key={index}> </span>;
                }
                return (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      position: 'relative',
                      transition: 'text-shadow 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left - rect.width / 2;
                      const y = e.clientY - rect.top - rect.height / 2;
                      e.currentTarget.style.textShadow = `${x * 0.15}px ${y * 0.15}px 25px rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = '0 4px 20px rgba(0,0,0,0.4)';
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              fontFamily: '"Inter", sans-serif'
            }}>
              {t.home.subheadline}
            </p>
            <button
              onClick={() => setActiveSection('work')}
              onMouseEnter={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.color = '#1a1a1a';
                e.target.style.transform = 'translateY(-2px)';
                setIsHovering(true);
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(0)';
                setIsHovering(false);
              }}
              style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                fontWeight: 600,
                padding: 'clamp(0.9rem, 2vw, 1.1rem) clamp(2rem, 4vw, 2.8rem)',
                border: '2px solid #ffffff',
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                fontFamily: '"Space Mono", monospace'
              }}
            >
              {t.home.cta}
            </button>
          </div>
        )}

        {activeSection === 'work' && !selectedProject && (
          <div style={{
            width: '100%',
            height: '80vh',
            maxWidth: '1200px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            animation: 'fadeIn 0.6s ease 0.1s forwards',
            perspective: '2000px',
            cursor: isDragging ? 'grabbing' : 'grab',
            paddingBottom: '3rem'
          }}
          onMouseDown={(e) => {
            // Only start dragging if clicking on background, not on project cards
            if (e.target === e.currentTarget || e.target.closest('[data-carousel-container]')) {
              setIsDragging(true);
              setDragStartX(e.clientX);
              setDragStartRotation(carouselRotation);
              setShowDragGuide(false); // Hide guide when user starts dragging
            }
          }}
          >
            <div 
              ref={carouselAnimationRef}
              data-carousel-container="true"
              style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${carouselRotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                userSelect: 'none'
              }}
            >
              {t.projects.map((project, index) => {
                const totalProjects = t.projects.length;
                const angle = (360 / totalProjects) * index;
                const radius = 450;
                
                return (
                  <div
                    key={project.id}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '320px',
                      transform: `
                        translate(-50%, -50%)
                        rotateY(${angle}deg)
                        translateZ(${radius}px)
                      `,
                      transformStyle: 'preserve-3d',
                      opacity: 0,
                      animation: `fadeIn 0.8s ease ${index * 0.15}s forwards`
                    }}
                  >
                    <div
                      onClick={(e) => {
                        // Only open project if we didn't drag
                        if (!isDragging) {
                          setSelectedProject(project);
                        }
                      }}
                      onMouseDown={(e) => {
                        // Stop propagation so card click doesn't trigger carousel drag
                        e.stopPropagation();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `rgba(0,0,0,0.8)`;
                        e.currentTarget.style.border = `2px solid ${project.color}`;
                        e.currentTarget.style.boxShadow = `0 20px 80px rgba(0,0,0,0.5), 0 0 60px ${project.color}80, 0 0 100px ${project.color}40`;
                        e.currentTarget.style.transform = 'scale(1.05)';
                        setIsHovering(true);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                        e.currentTarget.style.boxShadow = '0 10px 50px rgba(0,0,0,0.2)';
                        e.currentTarget.style.transform = 'scale(1)';
                        setIsHovering(false);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '20px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 10px 50px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: `linear-gradient(90deg, ${project.color}, transparent)`,
                        borderRadius: '20px 20px 0 0'
                      }} />

                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: `${project.color}20`,
                        border: `2px solid ${project.color}60`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 900,
                        color: project.color,
                        fontFamily: '"Archivo Black", sans-serif'
                      }}>
                        {index + 1}
                      </div>

                      <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        {project.category} · {project.year}
                      </div>
                      
                      <h3 style={{
                        fontSize: '1.8rem',
                        color: '#ffffff',
                        margin: '0 0 1rem 0',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        lineHeight: 1.2
                      }}>
                        {project.title}
                      </h3>
                      
                      <p style={{
                        fontSize: '0.95rem',
                        color: 'rgba(255,255,255,0.75)',
                        lineHeight: 1.6,
                        margin: 0,
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        {project.description}
                      </p>

                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '100px',
                        background: `linear-gradient(to top, ${project.color}15, transparent)`,
                        pointerEvents: 'none',
                        borderRadius: '0 0 20px 20px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              zIndex: 10
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <span style={{
                  width: '30px',
                  height: '1px',
                  background: 'rgba(255,255,255,0.3)'
                }}></span>
                Auto-rotating carousel
                <span style={{
                  width: '30px',
                  height: '1px',
                  background: 'rgba(255,255,255,0.3)'
                }}></span>
              </div>

              {/* Drag Guide - shows once */}
              {showDragGuide && (
                <div style={{
                  pointerEvents: 'none',
                  opacity: 0,
                  animation: 'fadeIn 1s ease 1.5s forwards'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem',
                    fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                    color: '#ffffff',
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em'
                  }}>
                    <div style={{
                      animation: 'slideLeft 2s ease-in-out infinite',
                      fontSize: '1.2rem'
                    }}>←</div>
                    <div style={{
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50px',
                      padding: '0.6rem 1.5rem',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                      Click & Drag
                    </div>
                    <div style={{
                      animation: 'slideRight 2s ease-in-out infinite',
                      fontSize: '1.2rem'
                    }}>→</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'work' && selectedProject && (
          <div style={{
            width: '100%',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 'clamp(2rem, 4vw, 3rem)',
            paddingTop: 'clamp(5rem, 10vh, 7rem)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          className="hide-scrollbar"
          >
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {/* Header with back button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards'
              }}>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#ffffff',
                    fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                    cursor: 'pointer',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    fontFamily: '"Space Mono", monospace',
                    letterSpacing: '0.05em'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateX(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateX(0)';
                  }}
                >
                  {t.work.backButton}
                </button>

                <div style={{
                  fontSize: 'clamp(0.8rem, 1.3vw, 0.9rem)',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: '"Space Mono", monospace'
                }}>
                  {selectedProject.category} · {selectedProject.year}
                </div>
              </div>

              {/* Project title */}
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                color: '#ffffff',
                margin: '0 0 1rem 0',
                fontWeight: 900,
                fontFamily: '"Archivo Black", sans-serif',
                lineHeight: 1.1,
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards'
              }}>
                {selectedProject.title}
              </h1>

              {/* Project description */}
              <p style={{
                fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.7,
                marginBottom: '3rem',
                maxWidth: '800px',
                fontFamily: '"Inter", sans-serif',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards'
              }}>
                {selectedProject.description}
              </p>

              {/* Hero Image */}
              <div style={{
                width: '100%',
                height: '500px',
                background: `linear-gradient(135deg, ${selectedProject.color}60, ${selectedProject.color}20)`,
                borderRadius: '20px',
                marginBottom: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${selectedProject.color}80`,
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
                backgroundImage: selectedProject.images?.hero ? `url(${selectedProject.images.hero})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
                {/* Placeholder text - only shows if no image */}
                {!selectedProject.images?.hero && (
                  <div style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    color: 'rgba(255,255,255,0.15)',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    textAlign: 'center',
                    padding: '2rem',
                    zIndex: 1
                  }}>
                    Hero Image
                  </div>
                )}
                
                
              
                
              </div>

              {/* Skills and Project Details - Compact Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem'
              }}>
                {/* Skills section */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  opacity: 0,
                  animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '1rem',
                    fontFamily: '"Space Mono", monospace'
                  }}>
                    Skills Used
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem'
                  }}>
                    {t.work.skills.map((skill) => (
                      <div key={skill} style={{
                        fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                        color: '#ffffff',
                        fontFamily: '"Inter", sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}>
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: selectedProject.color
                        }} />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project info */}
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  opacity: 0,
                  animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards'
                }}>
                  <h3 style={{
                    fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    marginBottom: '1rem',
                    fontFamily: '"Space Mono", monospace'
                  }}>
                    Project Details
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem'
                  }}>
                    <div>
                      <div style={{
                        fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '0.2rem',
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        Category
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                        color: '#ffffff',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        {selectedProject.category}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '0.2rem',
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        Year
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                        color: '#ffffff',
                        fontFamily: '"Inter", sans-serif'
                      }}>
                        {selectedProject.year}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: '0.2rem',
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        Status
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                        color: selectedProject.color,
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600
                      }}>
                        Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Content Sections - Easy to customize */}
              
              {/* Section 1: Full-width text */}
              <div style={{
                marginBottom: '4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontFamily: '"Archivo Black", sans-serif',
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>
                  The Challenge
                </h2>
                <p style={{
                  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.8,
                  fontFamily: '"Inter", sans-serif',
                  maxWidth: '900px'
                }}>
                  {selectedProject.content?.challenge || "Many children experience emotions they cannot yet put into words, while parents often rely on behavior alone to understand how their child feels. Research from the World Health Organization and the Centers for Disease Control and Prevention shows that 70% of children under 10 struggle to name complex emotions, creating a widespread emotional gap."}
                </p>
                
                {/* Loading bar statistic */}
                <div style={{
                  marginTop: '2.5rem',
                  maxWidth: '600px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.8rem'
                  }}>
                    <span style={{
                      fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 600
                    }}>
                      Children under 10 struggle to name complex emotions
                    </span>
                    <span style={{
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      color: '#ffffff',
                      fontFamily: '"Archivo Black", sans-serif',
                      fontWeight: 900
                    }}>
                      70%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: '70%',
                      height: '100%',
                      background: `linear-gradient(90deg, ${selectedProject.color}, ${selectedProject.color}cc)`,
                      borderRadius: '10px',
                      position: 'relative',
                      animation: 'loadBar 1.5s ease-out 0.5s forwards',
                      transformOrigin: 'left',
                      boxShadow: `0 0 20px ${selectedProject.color}80`
                    }} />
                  </div>
                </div>
              </div>

              {/* Section 2: Process 1 - Large full-width image (16:10) */}
              <div style={{
                width: '100%',
                aspectRatio: '16/10',
                background: `linear-gradient(45deg, ${selectedProject.color}40, ${selectedProject.color}15)`,
                borderRadius: '20px',
                border: `1px solid ${selectedProject.color}50`,
                marginBottom: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards',
                backgroundImage: selectedProject.images?.process1 ? `url(${selectedProject.images.process1})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
                {!selectedProject.images?.process1 && (
                  <div style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: 'rgba(255,255,255,0.15)',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    Process Image 1<br/>
                    <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>1920x1200px (16:10)</span>
                  </div>
                )}
              </div>

              {/* Section 2b: Process 2, 3, 4 - Three images in a row (4:3) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem'
              }}>
                {[2, 3, 4].map((num) => (
                  <div key={num} style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    background: `linear-gradient(${45 + num * 60}deg, ${selectedProject.color}35, ${selectedProject.color}10)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.85 + num * 0.1}s forwards`,
                    backgroundImage: selectedProject.images?.[`process${num}`] ? `url(${selectedProject.images[`process${num}`]})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    overflow: 'hidden'
                  }}>
                    {!selectedProject.images?.[`process${num}`] && (
                      <div style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center'
                      }}>
                        Process {num}<br/>
                        <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>800x600px (4:3)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Section 3: Device Objective / Design Approach Text */}
              {(selectedProject.content?.designApproach || selectedProject.content?.deviceObjective) && (
                <div style={{
                  marginBottom: '4rem',
                  opacity: 0,
                  animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.15s forwards'
                }}>
                  <h2 style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    marginBottom: '1.2rem',
                    lineHeight: 1.2
                  }}>
                    {selectedProject.content?.designApproach ? 'Design Approach' : 'Device Objective'}
                  </h2>
                  <p style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.7,
                    fontFamily: '"Inter", sans-serif',
                    maxWidth: '900px'
                  }}>
                    {selectedProject.content?.designApproach || selectedProject.content?.deviceObjective || "To bridge this emotional gap: any solution must allow children to express feelings, offer guidance in the moment, and track emotion patterns."}
                  </p>
                </div>
              )}

              {/* Section 3b: Full width process image */}
              <div style={{
                width: '100%',
                aspectRatio: '21/9',
                background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}10, ${selectedProject.color}30)`,
                borderRadius: '20px',
                border: `1px solid ${selectedProject.color}50`,
                marginBottom: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.25s forwards',
                backgroundImage: selectedProject.images?.processWide ? `url(${selectedProject.images.processWide})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
                {!selectedProject.images?.processWide && (
                  <div style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: 'rgba(255,255,255,0.15)',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    Wide Process Image<br/>
                    <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>21:9 Aspect Ratio</span>
                  </div>
                )}
              </div>

              {/* Section 4: Two images side by side */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
              }}>
                {[1, 2].map((num) => (
                  <div key={num} style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    background: `linear-gradient(${num === 1 ? '45deg' : '225deg'}, ${selectedProject.color}40, ${selectedProject.color}15)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${1.35 + num * 0.1}s forwards`,
                    backgroundImage: selectedProject.images?.[`detail${num}`] ? `url(${selectedProject.images[`detail${num}`]})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    overflow: 'hidden'
                  }}>
                    {!selectedProject.images?.[`detail${num}`] && (
                      <div style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center'
                      }}>
                        Detail {num}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Section 4b: Single portrait image */}
              <div style={{
                maxWidth: '600px',
                margin: '0 auto 4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.55s forwards'
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: `linear-gradient(180deg, ${selectedProject.color}40, ${selectedProject.color}15)`,
                  borderRadius: '20px',
                  border: `1px solid ${selectedProject.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundImage: selectedProject.images?.portrait ? `url(${selectedProject.images.portrait})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                  {!selectedProject.images?.portrait && (
                    <div style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: 'rgba(255,255,255,0.15)',
                      fontWeight: 900,
                      fontFamily: '"Archivo Black", sans-serif',
                      textAlign: 'center',
                      padding: '2rem'
                    }}>
                      Portrait Image<br/>
                      <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>3:4 Aspect Ratio</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 5: Image + Text (reversed layout) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
                marginBottom: '4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards'
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  background: `linear-gradient(315deg, ${selectedProject.color}35, ${selectedProject.color}10)`,
                  borderRadius: '16px',
                  border: `1px solid ${selectedProject.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  order: 1,
                  backgroundImage: selectedProject.images?.solution ? `url(${selectedProject.images.solution})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  overflow: 'hidden'
                }}>
                  {!selectedProject.images?.solution && (
                    <div style={{
                      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                      color: 'rgba(255,255,255,0.15)',
                      fontWeight: 900,
                      fontFamily: '"Archivo Black", sans-serif',
                      textAlign: 'center'
                    }}>
                      Solution Image
                    </div>
                  )}
                </div>
                <div style={{ order: 2 }}>
                  <h2 style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    marginBottom: '1.2rem',
                    lineHeight: 1.2
                  }}>
                    The Solution
                  </h2>
                  <p style={{
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.7,
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {selectedProject.content?.solution || "Palmi is an emotional companion that bridges the gap between a child's feelings and a parent's understanding. It offers children a safe space to express emotions while quietly tracking emotional patterns over time."}
                  </p>
                </div>
              </div>

              {/* Section 6: Quote/Highlight block */}
              <div style={{
                background: `linear-gradient(135deg, ${selectedProject.color}15, ${selectedProject.color}05)`,
                border: `2px solid ${selectedProject.color}40`,
                borderRadius: '20px',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                marginBottom: '4rem',
                textAlign: 'center',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.3s forwards'
              }}>
                <div style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                  color: selectedProject.color,
                  fontWeight: 900,
                  fontFamily: '"Archivo Black", sans-serif',
                  marginBottom: '1rem',
                  lineHeight: 1.3
                }}>
                  " {selectedProject.content?.quote || selectedProject.description}"
                </div>
                <div style={{
                  fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: '"Inter", sans-serif',
                  fontStyle: 'italic'
                }}>
                  — {selectedProject.title}
                </div>
              </div>

              {/* Section 7: Three column grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
              }}>
                {(selectedProject.content?.features || [
                  { title: "Feature 1", description: "Description for feature 1" },
                  { title: "Feature 2", description: "Description for feature 2" },
                  { title: "Feature 3", description: "Description for feature 3" }
                ]).map((feature, index) => (
                  <div key={index} style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '2rem',
                    opacity: 0,
                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${1.5 + index * 0.1}s forwards`
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: `${selectedProject.color}30`,
                      border: `2px solid ${selectedProject.color}60`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: selectedProject.color,
                      fontFamily: '"Archivo Black", sans-serif'
                    }}>
                      {index + 1}
                    </div>
                    <h3 style={{
                      fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontFamily: '"Archivo Black", sans-serif',
                      marginBottom: '0.8rem'
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(0.9rem, 1.6vw, 1rem)',
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6,
                      fontFamily: '"Inter", sans-serif'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Section 8: Three square screen images (1, 2, 3) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
              }}>
                {[1, 2, 3].map((num) => (
                  <div key={num} style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    background: `linear-gradient(${num * 90}deg, ${selectedProject.color}35, ${selectedProject.color}10)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    animation: `fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${1.7 + num * 0.08}s forwards`,
                    backgroundImage: selectedProject.images?.[`screen${num}`] ? `url(${selectedProject.images[`screen${num}`]})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    overflow: 'hidden'
                  }}>
                    {!selectedProject.images?.[`screen${num}`] && (
                      <div style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center'
                      }}>
                        Screen {num}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Section 8b: Screen 4 - Portrait style (same as portrait image) */}
              <div style={{
                maxWidth: '600px',
                margin: '0 auto 4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.94s forwards'
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: `linear-gradient(180deg, ${selectedProject.color}40, ${selectedProject.color}15)`,
                  borderRadius: '20px',
                  border: `1px solid ${selectedProject.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  backgroundImage: selectedProject.images?.screen4 ? `url(${selectedProject.images.screen4})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                  {!selectedProject.images?.screen4 && (
                    <div style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: 'rgba(255,255,255,0.15)',
                      fontWeight: 900,
                      fontFamily: '"Archivo Black", sans-serif',
                      textAlign: 'center',
                      padding: '2rem'
                    }}>
                      Screen 4<br/>
                      <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>3:4 Portrait</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 9: Final full-width image */}
              {/* Section 10: Results/Outcomes */}
              <div style={{
                marginBottom: '4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.1s forwards'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontFamily: '"Archivo Black", sans-serif',
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>
                  Purpose of the Data
                </h2>
                <p style={{
                  fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.8,
                  fontFamily: '"Inter", sans-serif',
                  maxWidth: '900px',
                  marginBottom: '2rem'
                }}>
                  {selectedProject.content?.purposeOfData || "The purpose of this data is to support awareness and conversation. It is not meant to diagnose or assess, but to help parents better understand their child and seek professional support when needed."}
                </p>
                
                {/* Metrics grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '2rem',
                  marginTop: '2rem'
                }}>
                  {(selectedProject.content?.metrics || [
                    { value: '150%', label: 'User Growth' },
                    { value: '85%', label: 'Satisfaction' },
                    { value: '40%', label: 'Faster Tasks' }
                  ]).map((metric, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: 900,
                        color: selectedProject.color,
                        fontFamily: '"Archivo Black", sans-serif',
                        marginBottom: '0.5rem'
                      }}>
                        {metric.value}
                      </div>
                      <div style={{
                        fontSize: 'clamp(0.9rem, 1.6vw, 1rem)',
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: '"Space Mono", monospace'
                      }}>
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Image - moved to bottom */}
              <div style={{
                width: '100%',
                aspectRatio: '21/9',
                background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}10, ${selectedProject.color}30)`,
                borderRadius: '20px',
                border: `1px solid ${selectedProject.color}50`,
                marginBottom: '4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.2s forwards',
                backgroundImage: selectedProject.images?.final ? `url(${selectedProject.images.final})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
                {!selectedProject.images?.final && (
                  <div style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: 'rgba(255,255,255,0.15)',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    textAlign: 'center',
                    padding: '2rem'
                  }}>
                    Final Mockup<br/>
                    <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>21:9 Aspect Ratio</span>
                  </div>
                )}
              </div>

              {/* Bottom navigation */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '2rem',
                paddingBottom: '4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s forwards'
              }}>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    fontSize: 'clamp(0.9rem, 1.6vw, 1rem)',
                    fontWeight: 600,
                    padding: 'clamp(1rem, 2vw, 1.2rem) clamp(2.5rem, 5vw, 3.5rem)',
                    border: `2px solid ${selectedProject.color}`,
                    background: `${selectedProject.color}20`,
                    color: '#ffffff',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    fontFamily: '"Space Mono", monospace'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = selectedProject.color;
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = `${selectedProject.color}20`;
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Back to Projects
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'about' && (
          <div style={{
            maxWidth: '700px',
            textAlign: 'center',
            opacity: 0,
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards'
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 7vw, 4rem)',
              color: '#ffffff',
              margin: '0 0 1.5rem 0',
              fontWeight: 900,
              fontFamily: '"Archivo Black", sans-serif',
              lineHeight: 1.2
            }}>
              {t.about.title.split('').map((char, index) => {
                if (char === ' ') {
                  return <span key={index}> </span>;
                }
                return (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      position: 'relative',
                      transition: 'text-shadow 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left - rect.width / 2;
                      const y = e.clientY - rect.top - rect.height / 2;
                      e.currentTarget.style.textShadow = `${x * 0.15}px ${y * 0.15}px 25px rgba(255,255,255,0.8)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.8,
              marginBottom: '2rem',
              fontFamily: '"Inter", sans-serif'
            }}>
              {t.about.description}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem'
            }}>
              {t.about.skills.map((skill, i) => (
                <div key={skill} style={{
                  opacity: 0,
                  animation: `fadeIn 0.5s ease ${0.3 + i * 0.1}s forwards`
                }}>
                  <div style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    fontFamily: '"Archivo Black", sans-serif'
                  }}>
                    {skill}
                  </div>
                </div>
              ))}
            </div>

            {/* Software Tools Section */}
            <div style={{
              marginTop: '4rem',
              paddingTop: '3rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              opacity: 0,
              animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '2rem',
                fontFamily: '"Space Mono", monospace'
              }}>
                {t.about.toolsLabel}
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {t.about.tools.map((tool, i) => (
                  <div
                    key={tool}
                    style={{
                      padding: '0.8rem 1.5rem',
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '50px',
                      fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                      color: '#ffffff',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      opacity: 0,
                      animation: `fadeIn 0.5s ease ${0.8 + i * 0.1}s forwards`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            opacity: 0,
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards'
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 7vw, 4rem)',
              color: '#ffffff',
              margin: '0 0 1rem 0',
              fontWeight: 900,
              fontFamily: '"Archivo Black", sans-serif'
            }}>
              {t.contact.title.split('').map((char, index) => {
                if (char === ' ') {
                  return <span key={index}> </span>;
                }
                return (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      position: 'relative',
                      transition: 'text-shadow 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left - rect.width / 2;
                      const y = e.clientY - rect.top - rect.height / 2;
                      e.currentTarget.style.textShadow = `${x * 0.15}px ${y * 0.15}px 25px rgba(255,255,255,0.8)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '3rem',
              lineHeight: 1.6,
              fontFamily: '"Inter", sans-serif'
            }}>
              {t.contact.subtitle}
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              alignItems: 'center'
            }}>
              {[
                { label: t.contact.email, value: 'dianaxstudio@gmail.com' },
                { label: t.contact.linkedin, value: 'linkedin.com/in/diana' },
                { label: 'Location', value: 'Brandenburg, Germany' }
              ].map((item, i) => (
                <div key={item.label} style={{
                  padding: 'clamp(1rem, 2vw, 1.3rem) clamp(2rem, 4vw, 3rem)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  animation: `fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s forwards`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.transform = 'translateX(8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}>
                  <div style={{
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '0.3rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: '"Space Mono", monospace'
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    color: '#ffffff',
                    fontWeight: 500,
                    fontFamily: '"Inter", sans-serif'
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body, #root {
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          position: fixed;
          margin: 0;
          padding: 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes carousel3DRotate {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        @keyframes loadBar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes slideLeft {
          0%, 100% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(-10px);
            opacity: 0.5;
          }
        }

        @keyframes slideRight {
          0%, 100% {
            transform: translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(10px);
            opacity: 0.5;
          }
        }

        @keyframes handDrag {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          25% {
            transform: translateX(-15px) rotate(-5deg);
          }
          50% {
            transform: translateX(0) rotate(0deg);
          }
          75% {
            transform: translateX(15px) rotate(5deg);
          }
        }

        @keyframes dragLineLeft {
          0%, 100% {
            opacity: 0;
            transform: translateX(10px);
          }
          25% {
            opacity: 1;
            transform: translateX(0);
          }
          50%, 75% {
            opacity: 0;
            transform: translateX(-10px);
          }
        }

        @keyframes dragLineRight {
          0%, 25% {
            opacity: 0;
            transform: translateX(-10px);
          }
          50% {
            opacity: 0;
            transform: translateX(10px);
          }
          75% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(10px);
          }
        }

        body {
          overflow: hidden !important;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        button {
          font-family: inherit;
        }

        /* Hide scrollbar for project page */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
