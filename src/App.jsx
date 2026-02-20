import React, { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────
// Image With Loader Component
// Shows the "LOADING" scroll-text animation while
// an image is fetching, then fades it away.
// ─────────────────────────────────────────────
function ImageWithLoader({ src, style, placeholderText, placeholderSubText, accentColor }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no src provided, don't show loader at all
  const hasSrc = Boolean(src);

  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden' }}>
      {/* Actual image – sits behind loader */}
      {hasSrc && (
        <img
          src={src}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(true); setHasError(true); }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
          alt=""
        />
      )}

      {/* Loader overlay */}
      {hasSrc && !loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}>
          {/* The loader widget */}
          <div className="img-loader">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="img-loader__text">
                <span>LOADING</span>
              </div>
            ))}
            <div className="img-loader__line" />
          </div>
        </div>
      )}

      {/* Placeholder when no src */}
      {!hasSrc && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {placeholderText && (
            <div style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'rgba(255,255,255,0.15)',
              fontWeight: 900,
              fontFamily: '"Archivo Black", sans-serif',
              textAlign: 'center',
              padding: '2rem'
            }}>
              {placeholderText}
              {placeholderSubText && (
                <><br/><span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>{placeholderSubText}</span></>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
          BrandPackaging: "Because Palmi is designed for emotional support, the packaging should speak to children first. It's calm, friendly, non-technical, helping the child feel safe even before opening the product ",
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
          beforePurpose: "/images/palmi/before-purpose.png",
          beforeFinal: "/images/palmi/before-final.png",
          final: "/images/palmi/final2.png"
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
          discovery: "Through user research and competitive analysis, we identified key pain points in traditional networking: physical cards get lost, contact information becomes outdated, and follow-up is inconsistent. Users need a solution that bridges physical and digital networking seamlessly.",
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
              title: "Wallet DBC",
              description: "Store all your network's digital business cards in one place and chat directly with your connections without leaving the app."
            }
          ]
        },
        images: {
            hero: "/images/synkro/hero2.png",
          process1: "/images/synkro/process1.2.png",
          process2: "/images/synkro/process2.png",
          process3: "/images/synkro/process3.png",
          process4: "/images/synkro/process4.2.png",
          processWide: "/images/synkro/process-wide2.png",
          beforeDefine: "/images/synkro/before-define.png",
          detail1: "/images/synkro/detail1.png",
          detail2: "/images/synkro/detail2.png",
          beforePortrait: "/images/synkro/before-portrait.png",
          portrait: "/images/synkro/portrait.png",
          beforeDesign1: "/images/synkro/before-design1.png",
          beforeDesign2: "/images/synkro/before-design2.png",
          solution: "/images/synkro/solution.png",
          finalMockup: "/images/synkro/final-mockup.png",
          demoVideo: "/images/synkro/demo-video.mp4",
          beforePurposeVideo: "/images/synkro/before-purpose-video.mp4",
          screen1: "/images/synkro/screen1.png",
          screen2: "/images/synkro/screen2.1.png",
          screen3: "/images/synkro/screen3.png",
          screen4Video: "/images/synkro/screen4-video2.mp4", 
          final: "/images/synkro/finals1.png"
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
          quote: "Great design is invisible until it makes you stop scrolling..",
          designObjective: "To maximize social media impact I create scroll-stopping visuals, communicate value instantly, and drive measurable engagement.",
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
          hero: "/images/social-media/hero1.1.png",
          process1: "/images/social-media/process1.2.png",
          process2: "/images/social-media/process2.png",
          process3: "/images/social-media/process3.png",
          process4: "/images/social-media/process4.1.png",
          processWide: "/images/social-media/process-wide.png",
          detail1: "/images/social-media/detail1.png",
          detail2: "/images/social-media/detail2.png",
          portrait: "/images/social-media/portrait.png",
          solution: "/images/social-media/solution.png",
          screen1: "/images/social-media/screen1.png",
          screen2: "/images/social-media/screen2.png",
          screen3: "/images/social-media/screen3.png",
          screen4: "/images/social-media/screen4.png",
          final: "/images/social-media/final.png"
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
          DeviceApproach: "Das Gerät orientiert sich formal an einem klassischen Damenkompaktspiegel einem Objekt, das mit Privatsphäre,Fürsorge und persönlichem Ritual verbunden wird.",
          BrandPackaging: "Da Palmi für emotionale Unterstützung konzipiert ist, sollte die Verpackung in erster Linie Kinder ansprechen.",
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
              description: "Palmi hört darauf, wie etwas gesagt wird, wie Tonfall und Rhythmus, anstatt was gesagt wird."
            },
            {
              title: "Emotionale Muster-Einblicke",
              description: "Gesichts- und Stimmsignale werden im Laufe der Zeit zu emotionalen Mustern kombiniert."
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
          beforeFinal: "/images/palmi/before-final.png",
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
          purposeOfData: "Die gesammelten Daten helfen Fachleuten, die Networking-Effektivität zu verfolgen.",
          metrics: [
            { value: '200%', label: 'Verbindungen' },
            { value: '92%', label: 'Bindungsrate' },
            { value: '3x', label: 'Schnelleres Teilen' }
          ],
          features: [
            {
              title: "Sofortiges QR-Teilen",
              description: "Teilen Sie Ihre digitale Karte sofort per QR-Code, NFC oder Link."
            },
            {
              title: "Echtzeit-Updates",
              description: "Aktualisieren Sie Ihre Informationen einmal und alle geteilten Karten spiegeln automatisch die Änderungen wider."
            },
            {
              title: "Analytics-Dashboard",
              description: "Verfolgen Sie, wer Ihre Karte angesehen hat und messen Sie Ihre Networking-Effektivität."
            }
          ]
        },
        images: {
          hero: "/images/synkro/hero2.png",
          process1: "/images/synkro/process1.2.png",
          process2: "/images/synkro/process2.png",
          process3: "/images/synkro/process3.png",
          process4: "/images/synkro/process4.2.png",
          processWide: "/images/synkro/process-wide2.png",
          detail1: "/images/synkro/detail1.png",
          detail2: "/images/synkro/detail2.png",
          portrait: "/images/synkro/portrait.png",
          beforeDesign1: "/images/synkro/before-design1.png",
          beforeDesign2: "/images/synkro/before-design2.png",
          solution: "/images/synkro/solution.png",
          finalMockup: "/images/synkro/final-mockup.png",
          demoVideo: "/images/synkro/demo-video.mp4",
          screen1: "/images/synkro/screen1.png",
          screen2: "/images/synkro/screen2.1.png",
          screen3: "/images/synkro/screen3.png",
          screen4Video: "/images/synkro/screen4-video2.mp4",
          final: "/images/synkro/finals1.png"
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
          solution: "Strategische visuelle Designs, die Ästhetik mit klarer Botschaft verbinden.",
          quote: "Großartiges Design ist unsichtbar – bis es dich dazu bringt, mit dem Scrollen aufzuhören..",
          designObjective: "Um die Social-Media-Wirkung zu maximieren.",
          purposeOfData: "Analysen helfen zu verstehen, welche Designelemente beim Publikum am besten ankommen.",
          metrics: [
            { value: '300%', label: 'Engagement-Boost' },
            { value: '95%', label: 'Markenerinnerung' },
            { value: '2.5x', label: 'Conversion-Rate' }
          ],
          features: [
            { title: "Plattform-Optimierung", description: "Designs optimiert für die spezifischen Anforderungen jeder Plattform." },
            { title: "Marken-Konsistenz", description: "Wahren Sie eine kohärente visuelle Identität über alle Kanäle hinweg." },
            { title: "Engagement-gesteuertes Design", description: "Jedes Element ist darauf ausgelegt, das Scrollen zu stoppen." }
          ]
        },
        images: {
          hero: "/images/social-media/hero1.1.png",
          process1: "/images/social-media/process1.2.png",
          process2: "/images/social-media/process2.png",
          process3: "/images/social-media/process3.png",
          process4: "/images/social-media/process4.1.png",
          processWide: "/images/social-media/process-wide.png",
          detail1: "/images/social-media/detail1.png",
          detail2: "/images/social-media/detail2.png",
          portrait: "/images/social-media/portrait.png",
          solution: "/images/social-media/solution.png",
          screen1: "/images/social-media/screen1.png",
          screen2: "/images/social-media/screen2.png",
          screen3: "/images/social-media/screen3.png",
          screen4: "/images/social-media/screen4.png",
          final: "/images/social-media/final.png"
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
          challenge: "Traditionellen Grußkarten fehlt die persönliche Note und das interaktive Erlebnis.",
          solution: "Magi erweckt Grußkarten durch AR-Technologie zum Leben.",
          quote: "Die Zukunft der Verbindung ist erweiterte Realität.",
          deviceObjective: "Um Grußkarten zu modernisieren: Physische Karten mit digitalen AR-Erlebnissen verbinden.",
          purposeOfData: "Benutzerinteraktionsdaten helfen, AR-Erlebnisse zu verbessern.",
          metrics: [
            { value: '500%', label: 'Engagement-Zeit' },
            { value: '88%', label: 'Teilungsrate' },
            { value: '4x', label: 'Wiederholte Nutzung' }
          ],
          features: [
            { title: "AR-Karten-Scannen", description: "Richten Sie Ihr Telefon auf jede Magi-Karte, um immersive 3D-Animationen freizuschalten." },
            { title: "Personalisierungs-Studio", description: "Erstellen Sie benutzerdefinierte AR-Erlebnisse mit Fotos, Videos und Nachrichten." },
            { title: "Erinnerungs-Bewahrung", description: "AR-Erlebnisse werden in der Cloud gespeichert." }
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
  const [isHovering, setIsHovering] = useState(false);
  const [mouseTrail, setMouseTrail] = useState([]);
  const mouseTrailRef = useRef([]);
  const [frequencyData, setFrequencyData] = useState(new Array(32).fill(0));

  const t = translations[language];

  // Nebula galaxy background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const resizeCanvas = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * width, y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5, baseSpeed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2, orbitRadius: Math.random() * 300,
        orbitSpeed: (Math.random() - 0.5) * 0.02, phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.4 + 0.2, hue: Math.random() * 60 + 200
      });
    }
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1, opacity: Math.random() * 0.2 + 0.05 });
    }
    const glowParticles = [];
    for (let i = 0; i < 15; i++) {
      glowParticles.push({
        x: Math.random() * width, y: Math.random() * height,
        size: Math.random() * 1.5 + 0.8, baseSize: Math.random() * 1.5 + 0.8,
        speed: Math.random() * 0.3 + 0.1, angle: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.008, pulsePhase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.3 + 0.2, hue: Math.random() * 20 + 45, glowIntensity: Math.random() * 0.4 + 0.4
      });
    }

    const render = () => {
      timeRef.current += 0.005;
      const time = timeRef.current;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      stars.forEach(s => { ctx.fillStyle = `rgba(255,255,255,${s.opacity})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); });
      glowParticles.forEach(g => {
        g.pulsePhase += g.pulseSpeed;
        const pulse = Math.sin(g.pulsePhase);
        g.size = g.baseSize + pulse * 0.8;
        g.x += Math.cos(g.angle) * g.speed; g.y += Math.sin(g.angle) * g.speed;
        if (g.x < -50) g.x = width + 50; if (g.x > width + 50) g.x = -50;
        if (g.y < -50) g.y = height + 50; if (g.y > height + 50) g.y = -50;
        const op = g.opacity * (0.7 + pulse * 0.3);
        const gg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.size * 12);
        gg.addColorStop(0, `hsla(${g.hue},85%,65%,${op * g.glowIntensity * 0.8})`);
        gg.addColorStop(0.2, `hsla(${g.hue},75%,55%,${op * g.glowIntensity * 0.5})`);
        gg.addColorStop(0.5, `hsla(${g.hue},65%,45%,${op * g.glowIntensity * 0.2})`);
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(g.x, g.y, g.size * 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `hsla(${g.hue},95%,75%,${op * g.glowIntensity})`; ctx.beginPath(); ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2); ctx.fill();
      });
      const shapeCenters = Array.from({ length: 3 }, (_, i) => ({
        x: width / 2 + Math.sin(time * 0.3 + i * 2) * width * 0.3,
        y: height / 2 + Math.cos(time * 0.25 + i * 2.5) * height * 0.25
      }));
      particles.forEach((p, idx) => {
        const c = shapeCenters[idx % 3];
        p.angle += p.orbitSpeed; p.phase += 0.01;
        const w = Math.sin(p.phase + idx * 0.1) * 50;
        p.x = c.x + Math.cos(p.angle) * (p.orbitRadius + w);
        p.y = c.y + Math.sin(p.angle) * (p.orbitRadius * 0.6 + w);
        p.x += Math.sin(time + idx) * p.baseSpeed; p.y += Math.cos(time + idx * 0.8) * p.baseSpeed;
        if (p.x < -50) p.x = width + 50; if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50; if (p.y > height + 50) p.y = -50;
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        pg.addColorStop(0, `hsla(${p.hue},70%,60%,${p.opacity * 0.6})`);
        pg.addColorStop(0.5, `hsla(${p.hue},60%,50%,${p.opacity * 0.3})`);
        pg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.opacity})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      particles.forEach((p1, i) => {
        particles.slice(i + 1, i + 20).forEach(p2 => {
          const dx = p1.x - p2.x, dy = p1.y - p2.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < 100) { ctx.strokeStyle = `hsla(${(p1.hue+p2.hue)/2},70%,60%,${(1-d/100)*0.1})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); }
        });
      });
      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('resize', resizeCanvas); if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  // Custom cursor tracking
  useEffect(() => {
    let animId;
    const targetPos = { x: 0, y: 0 };
    const currentPos = { x: 0, y: 0 };
    const handleMouseMove = e => { targetPos.x = e.clientX; targetPos.y = e.clientY; };
    const smoothUpdate = () => {
      currentPos.x += (targetPos.x - currentPos.x) * 0.1;
      currentPos.y += (targetPos.y - currentPos.y) * 0.1;
      setMousePosition({ x: currentPos.x, y: currentPos.y });
      const newPos = { x: currentPos.x, y: currentPos.y, id: Date.now() };
      mouseTrailRef.current = [...mouseTrailRef.current, newPos].slice(-15);
      setMouseTrail(mouseTrailRef.current);
      animId = requestAnimationFrame(smoothUpdate);
    };
    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(smoothUpdate);
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animId); };
  }, []);

  // Carousel auto-rotation
  useEffect(() => {
    if (activeSection === 'work' && !selectedProject && !isDragging) {
      let animId;
      const speed = 360 / 30000;
      let last = Date.now();
      const animate = () => {
        const now = Date.now(); const dt = now - last; last = now;
        setCarouselRotation(prev => prev + dt * speed);
        animId = requestAnimationFrame(animate);
      };
      animId = requestAnimationFrame(animate);
      return () => { if (animId) cancelAnimationFrame(animId); };
    }
  }, [activeSection, selectedProject, isDragging]);

  // Carousel drag
  useEffect(() => {
    if (activeSection === 'work' && !selectedProject && isDragging) {
      const handleMouseMove = e => {
        const delta = e.clientX - dragStartX;
        const r = (dragStartRotation + delta * 0.5) % 360;
        setCarouselRotation(r < 0 ? r + 360 : r);
      };
      const handleMouseUp = () => { setIsDragging(false); setDragStartRotation(carouselRotation); };
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }
  }, [isDragging, dragStartX, dragStartRotation, carouselRotation, activeSection, selectedProject]);

  // Section scroll
  useEffect(() => {
    const handleWheel = e => {
      if (selectedProject || isScrolling) return;
      e.preventDefault();
      const sections = ['home', 'work', 'about', 'contact'];
      const idx = sections.indexOf(activeSection);
      if (e.deltaY > 0 && idx < sections.length - 1) { setIsScrolling(true); setActiveSection(sections[idx + 1]); setSelectedProject(null); setTimeout(() => setIsScrolling(false), 800); }
      else if (e.deltaY < 0 && idx > 0) { setIsScrolling(true); setActiveSection(sections[idx - 1]); setSelectedProject(null); setTimeout(() => setIsScrolling(false), 800); }
    };
    const el = contentRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [activeSection, isScrolling, selectedProject]);

  // Audio visualizer loop
  useEffect(() => {
    if (!isPlaying || !analyzerRef.current) return;
    let animId;
    const visualize = () => {
      if (analyzerRef.current && dataArrayRef.current) { analyzerRef.current.getByteFrequencyData(dataArrayRef.current); setFrequencyData([...dataArrayRef.current]); }
      animId = requestAnimationFrame(visualize);
    };
    visualize();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [isPlaying]);

  const initializeAudioAnalyzer = () => {
    if (!audioContextRef.current && audioRef.current) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AC();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
        analyzerRef.current.smoothingTimeConstant = 0.7;
        analyzerRef.current.minDecibels = -90;
        analyzerRef.current.maxDecibels = -10;
        dataArrayRef.current = new Uint8Array(analyzerRef.current.frequencyBinCount);
        const src = audioContextRef.current.createMediaElementSource(audioRef.current);
        src.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContextRef.current.destination);
      } catch (e) { console.log('Audio init failed', e); }
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { initializeAudioAnalyzer(); audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e)); }
  };

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'work', label: t.nav.work },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact }
  ];

  // Helper: image container style without backgroundImage (ImageWithLoader handles the img)
  const imgContainerStyle = (aspectRatio, color, extraStyle = {}) => ({
    width: '100%',
    aspectRatio,
    background: `linear-gradient(135deg, ${color}40, ${color}15)`,
    borderRadius: '20px',
    border: `1px solid ${color}50`,
    ...extraStyle,
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', margin: 0, padding: 0, fontFamily: '"Space Mono", "Courier New", monospace' }}>

      {/* Cursor trail */}
      {mouseTrail.map((pos, index) => {
        const opacity = (index / mouseTrail.length) * 0.6;
        const size = ((index / mouseTrail.length) * 10) + 4;
        return (
          <div key={pos.id} style={{ position: 'fixed', left: pos.x, top: pos.y, width: `${size}px`, height: `${size}px`, background: `radial-gradient(circle, rgba(147,197,253,${opacity}), rgba(59,130,246,${opacity * 0.7}), transparent)`, borderRadius: '50%', pointerEvents: 'none', zIndex: 9998, transform: 'translate(-50%,-50%)', boxShadow: `0 0 ${size * 3}px rgba(59,130,246,${opacity * 0.8})`, filter: 'blur(0.5px)' }} />
        );
      })}

      <audio ref={audioRef} src="/background1.mp3" loop />

      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* Start prompt */}
      {showStartPrompt && (
        <div onClick={() => { if (audioRef.current) { audioRef.current.volume = 0.5; initializeAudioAnalyzer(); audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e)); } setShowStartPrompt(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '2px solid rgba(255,255,255,0.3)', maxWidth: '500px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
            <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', color: '#ffffff', marginBottom: '1rem', fontFamily: '"Archivo Black", sans-serif' }}>Click to Start</h2>
            <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.8)', fontFamily: '"Inter", sans-serif' }}>Enable background music for the full experience</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(1.5rem,3vw,2.5rem) clamp(2rem,5vw,4rem)', opacity: 0, animation: 'fadeIn 1s ease 0.2s forwards' }}>
        <div style={{ fontSize: 'clamp(1.2rem,2.5vw,1.5rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: '"Archivo Black", sans-serif' }}>DIANA×STUDIO</div>
        <div style={{ display: 'flex', gap: 'clamp(1.5rem,3vw,2.5rem)' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveSection(item.id); setSelectedProject(null); }} style={{ background: 'none', border: 'none', color: activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.5)', fontSize: 'clamp(0.85rem,1.5vw,1rem)', fontWeight: 500, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'color 0.3s', fontFamily: '"Space Mono", monospace', outline: 'none' }}
              onMouseEnter={e => e.target.style.color = '#ffffff'} onMouseLeave={e => e.target.style.color = activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.5)'}>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {['EN', 'DE'].map(lang => (
            <button key={lang} onClick={() => setLanguage(lang.toLowerCase())} style={{ background: language === lang.toLowerCase() ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${language === lang.toLowerCase() ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'}`, color: language === lang.toLowerCase() ? '#ffffff' : 'rgba(255,255,255,0.6)', padding: '0.5rem 0.9rem', borderRadius: '8px', fontSize: 'clamp(0.75rem,1.3vw,0.85rem)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', fontFamily: '"Space Mono", monospace', outline: 'none' }}>{lang}</button>
          ))}
          <button onClick={toggleAudio} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.5rem', outline: 'none', transition: 'all 0.3s' }}>
            {isPlaying ? (<div style={{ display: 'flex', gap: '3px' }}><div style={{ width: '3px', height: '14px', background: '#ffffff', borderRadius: '2px' }} /><div style={{ width: '3px', height: '14px', background: '#ffffff', borderRadius: '2px' }} /></div>) : (<div style={{ width: 0, height: 0, borderLeft: '10px solid #ffffff', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', marginLeft: '3px' }} />)}
          </button>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '40px', marginLeft: '1rem', padding: '0 0.5rem' }}>
            {frequencyData.slice(0, 20).map((val, i) => {
              const h = isPlaying ? Math.max((val / 255) * 35, 3) : 3;
              return <div key={i} style={{ width: '2.5px', height: `${h}px`, background: 'rgba(255,255,255,0.95)', borderRadius: '1.5px', opacity: isPlaying ? 1 : 0.25, boxShadow: isPlaying && val > 80 ? '0 0 8px rgba(255,255,255,0.9)' : 'none' }} />;
            })}
          </div>
        </div>
      </nav>

      {/* Side dots */}
      <div style={{ position: 'fixed', right: 'clamp(2rem,3vw,3rem)', top: '50%', transform: 'translateY(-50%)', zIndex: 100, display: selectedProject ? 'none' : 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0, animation: 'fadeIn 1s ease 0.5s forwards' }}>
        {navItems.map(item => (
          <div key={item.id} onClick={() => { setActiveSection(item.id); setSelectedProject(null); }} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', width: '12px', height: '12px' }}>
              {activeSection === item.id && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', animation: 'pulse 2s ease-in-out infinite' }} />}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: activeSection === item.id ? '12px' : '8px', height: activeSection === item.id ? '12px' : '8px', borderRadius: '50%', background: activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s', boxShadow: activeSection === item.id ? '0 0 20px rgba(255,255,255,0.5)' : 'none' }} />
            </div>
          </div>
        ))}
      </div>

      <div ref={contentRef} style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem,4vw,3rem)', paddingTop: 'clamp(5rem,10vh,7rem)' }}>

        {/* HOME */}
        {activeSection === 'home' && (
          <div style={{ textAlign: 'center', maxWidth: '900px', opacity: 0, animation: 'fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}>
            <h1 style={{ fontSize: 'clamp(2.5rem,10vw,6rem)', fontWeight: 900, margin: '0 0 1rem 0', color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.03em', fontFamily: '"Archivo Black", sans-serif', textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
              {t.home.headline.split('').map((char, i) => char === ' ' ? <span key={i}> </span> : (
                <span key={i} style={{ display: 'inline-block', transition: 'text-shadow 0.2s', cursor: 'pointer' }}
                  onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const x = e.clientX - r.left - r.width/2; const y = e.clientY - r.top - r.height/2; e.currentTarget.style.textShadow = `${x*.15}px ${y*.15}px 25px rgba(255,255,255,0.8)`; }}
                  onMouseLeave={e => e.currentTarget.style.textShadow = '0 4px 20px rgba(0,0,0,0.4)'}>{char}</span>
              ))}
            </h1>
            <p style={{ fontSize: 'clamp(1rem,2.5vw,1.4rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2.5rem', fontFamily: '"Inter", sans-serif' }}>{t.home.subheadline}</p>
            <button onClick={() => setActiveSection('work')} style={{ fontSize: 'clamp(0.9rem,1.8vw,1.05rem)', fontWeight: 600, padding: 'clamp(0.9rem,2vw,1.1rem) clamp(2rem,4vw,2.8rem)', border: '2px solid #ffffff', background: 'rgba(255,255,255,0.15)', color: '#ffffff', cursor: 'pointer', backdropFilter: 'blur(10px)', borderRadius: '50px', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', fontFamily: '"Space Mono", monospace' }}
              onMouseEnter={e => { e.target.style.background = '#ffffff'; e.target.style.color = '#1a1a1a'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.color = '#ffffff'; e.target.style.transform = 'translateY(0)'; }}>
              {t.home.cta}
            </button>
          </div>
        )}

        {/* WORK - Carousel */}
        {activeSection === 'work' && !selectedProject && (
          <div style={{ width: '100%', height: '80vh', maxWidth: '1200px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, animation: 'fadeIn 0.6s ease 0.1s forwards', perspective: '2000px', cursor: isDragging ? 'grabbing' : 'grab', paddingBottom: '3rem' }}
            onMouseDown={e => { if (e.target === e.currentTarget || e.target.closest('[data-carousel-container]')) { setIsDragging(true); setDragStartX(e.clientX); setDragStartRotation(carouselRotation); setShowDragGuide(false); } }}>
            <div ref={carouselAnimationRef} data-carousel-container="true" style={{ position: 'relative', width: '100%', height: '500px', transformStyle: 'preserve-3d', transform: `rotateY(${carouselRotation}deg)`, transition: isDragging ? 'none' : 'transform 0.1s ease-out', userSelect: 'none' }}>
              {t.projects.map((project, index) => {
                const angle = (360 / t.projects.length) * index;
                return (
                  <div key={project.id} style={{ position: 'absolute', left: '50%', top: '50%', width: '320px', transform: `translate(-50%,-50%) rotateY(${angle}deg) translateZ(450px)`, transformStyle: 'preserve-3d', opacity: 0, animation: `fadeIn 0.8s ease ${index * 0.15}s forwards` }}>
                    <div onClick={() => { if (!isDragging) setSelectedProject(project); }} onMouseDown={e => e.stopPropagation()} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '2rem', cursor: 'pointer', transition: 'all 0.3s', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 50px rgba(0,0,0,0.2)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.8)'; e.currentTarget.style.border = `2px solid ${project.color}`; e.currentTarget.style.boxShadow = `0 20px 80px rgba(0,0,0,0.5),0 0 60px ${project.color}80`; e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)'; e.currentTarget.style.boxShadow = '0 10px 50px rgba(0,0,0,0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: `linear-gradient(90deg,${project.color},transparent)`, borderRadius: '20px 20px 0 0' }} />
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '40px', height: '40px', borderRadius: '50%', background: `${project.color}20`, border: `2px solid ${project.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: project.color, fontFamily: '"Archivo Black", sans-serif' }}>{index + 1}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, fontFamily: '"Space Mono", monospace' }}>{project.category} · {project.year}</div>
                      <h3 style={{ fontSize: '1.8rem', color: '#ffffff', margin: '0 0 1rem 0', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', lineHeight: 1.2 }}>{project.title}</h3>
                      <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0, fontFamily: '"Inter", sans-serif' }}>{project.description}</p>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(to top,${project.color}15,transparent)`, pointerEvents: 'none', borderRadius: '0 0 20px 20px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontFamily: '"Space Mono", monospace', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></span>Auto-rotating carousel<span style={{ width: '30px', height: '1px', background: 'rgba(255,255,255,0.3)' }}></span>
              </div>
              {showDragGuide && (
                <div style={{ pointerEvents: 'none', opacity: 0, animation: 'fadeIn 1s ease 1.5s forwards' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', fontSize: 'clamp(0.85rem,1.6vw,1rem)', color: '#ffffff', fontFamily: '"Space Mono", monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    <div style={{ animation: 'slideLeft 2s ease-in-out infinite', fontSize: '1.2rem' }}>←</div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', padding: '0.6rem 1.5rem' }}>Click & Drag</div>
                    <div style={{ animation: 'slideRight 2s ease-in-out infinite', fontSize: '1.2rem' }}>→</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORK - Project Detail */}
        {activeSection === 'work' && selectedProject && (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: 'clamp(2rem,4vw,3rem)', paddingTop: 'clamp(5rem,10vh,7rem)', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="hide-scrollbar">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}>
                <button onClick={() => setSelectedProject(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', fontSize: 'clamp(0.9rem,1.5vw,1rem)', cursor: 'pointer', padding: '0.8rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s', fontFamily: '"Space Mono", monospace' }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.2)'; e.target.style.transform = 'translateX(-5px)'; }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.transform = 'translateX(0)'; }}>
                  {t.work.backButton}
                </button>
                <div style={{ fontSize: 'clamp(0.8rem,1.3vw,0.9rem)', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Space Mono", monospace' }}>{selectedProject.category} · {selectedProject.year}</div>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(3rem,8vw,6rem)', color: '#ffffff', margin: '0 0 1rem 0', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', lineHeight: 1.1, opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards' }}>{selectedProject.title}</h1>
              <p style={{ fontSize: 'clamp(1.1rem,2.2vw,1.4rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '800px', fontFamily: '"Inter", sans-serif', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s forwards' }}>{selectedProject.description}</p>

              {/* Hero Image */}
              <ImageWithLoader
                src={selectedProject.images?.hero}
                placeholderText="Hero Image"
                placeholderSubText="1920x1200px (16:10)"
                accentColor={selectedProject.color}
                style={{ ...imgContainerStyle('16/10', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.4s forwards' }) }}
              />

              {/* Skills & Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s forwards' }}>
                  <h3 style={{ fontSize: 'clamp(0.75rem,1.3vw,0.85rem)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontFamily: '"Space Mono", monospace' }}>Skills Used</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {t.work.skills.map(skill => <div key={skill} style={{ fontSize: 'clamp(0.85rem,1.5vw,0.95rem)', color: '#ffffff', fontFamily: '"Inter", sans-serif', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selectedProject.color }} />{skill}</div>)}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s forwards' }}>
                  <h3 style={{ fontSize: 'clamp(0.75rem,1.3vw,0.85rem)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem', fontFamily: '"Space Mono", monospace' }}>Project Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {[['Category', selectedProject.category], ['Year', selectedProject.year], ['Status', 'Completed']].map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontSize: 'clamp(0.7rem,1.2vw,0.8rem)', color: 'rgba(255,255,255,0.5)', marginBottom: '0.2rem', fontFamily: '"Space Mono", monospace' }}>{label}</div>
                        <div style={{ fontSize: 'clamp(0.85rem,1.5vw,0.95rem)', color: label === 'Status' ? selectedProject.color : '#ffffff', fontFamily: '"Inter", sans-serif', fontWeight: label === 'Status' ? 600 : 400 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Challenge */}
              <div style={{ marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.7s forwards' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#ffffff', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', marginBottom: '1.5rem', lineHeight: 1.2 }}>The Challenge</h2>
                <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', maxWidth: '900px' }}>{selectedProject.content?.challenge}</p>
                {selectedProject.id === 1 && (
                  <div style={{ marginTop: '2.5rem', maxWidth: '600px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <span style={{ fontSize: 'clamp(0.9rem,1.8vw,1rem)', color: 'rgba(255,255,255,0.9)', fontFamily: '"Inter", sans-serif', fontWeight: 600 }}>Children under 10 struggle to name complex emotions</span>
                      <span style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#ffffff', fontFamily: '"Archivo Black", sans-serif', fontWeight: 900 }}>70%</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ width: '70%', height: '100%', background: `linear-gradient(90deg,${selectedProject.color},${selectedProject.color}cc)`, borderRadius: '10px', animation: 'loadBar 1.5s ease-out 0.5s forwards', transformOrigin: 'left', boxShadow: `0 0 20px ${selectedProject.color}80` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Process 1 - Large */}
              <ImageWithLoader src={selectedProject.images?.process1} placeholderText="Process Image 1" placeholderSubText="1920x1200px (16:10)" accentColor={selectedProject.color}
                style={{ ...imgContainerStyle('16/10', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.8s forwards' }) }} />

              {/* Discovery - Synkro only */}
              {selectedProject.id === 2 && selectedProject.content?.discovery && (
                <div style={{ marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.82s forwards' }}>
                  <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#ffffff', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', marginBottom: '1.5rem', lineHeight: 1.2 }}>Discovery</h2>
                  <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', maxWidth: '900px' }}>{selectedProject.content.discovery}</p>
                </div>
              )}

              {/* Before Define - Synkro only */}
              {selectedProject.id === 2 && selectedProject.images?.beforeDefine && (
                <ImageWithLoader src={selectedProject.images.beforeDefine} accentColor={selectedProject.color}
                  style={{ ...imgContainerStyle('16/9', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.84s forwards' }) }} />
              )}

              {/* Design Approach / Device Objective */}
              {(selectedProject.content?.designApproach || selectedProject.content?.deviceObjective) && (
                <div style={{ marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.85s forwards' }}>
                  <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#ffffff', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', marginBottom: '1.2rem', lineHeight: 1.2 }}>
                    {selectedProject.content?.designApproach ? 'Design Approach' : selectedProject.id === 2 ? 'Define' : selectedProject.id === 3 ? 'Design Objective' : 'Device Objective'}
                  </h2>
                  <p style={{ fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontFamily: '"Inter", sans-serif', maxWidth: '900px' }}>{selectedProject.content?.designApproach || selectedProject.content?.deviceObjective}</p>
                </div>
              )}

              {/* Process 2, 3, 4 - Three in a row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                {[2, 3, 4].map(num => (
                  <ImageWithLoader key={num} src={selectedProject.images?.[`process${num}`]} placeholderText={`Process ${num}`} placeholderSubText="800x600px (4:3)" accentColor={selectedProject.color}
                    style={{ ...imgContainerStyle('4/3', selectedProject.color, { opacity: 0, animation: `fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${0.85 + num * 0.1}s forwards` }) }} />
                ))}
              </div>

              {/* Wide process */}
              <ImageWithLoader src={selectedProject.images?.processWide} placeholderText="Wide Process Image" placeholderSubText="21:9 Aspect Ratio" accentColor={selectedProject.color}
                style={{ ...imgContainerStyle('21/9', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.25s forwards' }) }} />

              {/* Detail 1 & 2 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {[1, 2].map(num => (
                  <ImageWithLoader key={num} src={selectedProject.images?.[`detail${num}`]} placeholderText={`Detail ${num}`} accentColor={selectedProject.color}
                    style={{ ...imgContainerStyle('4/3', selectedProject.color, { opacity: 0, animation: `fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${1.35 + num * 0.1}s forwards` }) }} />
                ))}
              </div>

              {/* Before Portrait - Synkro only */}
              {selectedProject.id === 2 && selectedProject.images?.beforePortrait && (
                <ImageWithLoader src={selectedProject.images.beforePortrait} accentColor={selectedProject.color}
                  style={{ ...imgContainerStyle('1366/812', selectedProject.color, { maxWidth: '1200px', margin: '0 auto 4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.5s forwards' }) }} />
              )}

              {/* Portrait */}
              <div style={{ maxWidth: '600px', margin: '0 auto 4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.55s forwards' }}>
                <ImageWithLoader src={selectedProject.images?.portrait} placeholderText="Portrait Image" placeholderSubText={selectedProject.id === 2 ? '1366x2116px' : '3:4 Aspect Ratio'} accentColor={selectedProject.color}
                  style={{ ...imgContainerStyle(selectedProject.id === 2 ? '1366/2116' : '3/4', selectedProject.color) }} />
              </div>

              {/* Two wide images - Synkro only */}
              {selectedProject.id === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                  {['beforeDesign1', 'beforeDesign2'].map((key, i) => (
                    <ImageWithLoader key={key} src={selectedProject.images?.[key]} placeholderText={`Wide Image ${i + 1}`} placeholderSubText="1366x812px" accentColor={selectedProject.color}
                      style={{ ...imgContainerStyle('1366/812', selectedProject.color, { opacity: 0, animation: `fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${1.6 + i * 0.05}s forwards` }) }} />
                  ))}
                </div>
              )}

              {/* Final Mockup - Synkro only */}
              {selectedProject.id === 2 && (
                <div style={{ maxWidth: '800px', margin: '0 auto 4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.7s forwards' }}>
                  <ImageWithLoader src={selectedProject.images?.finalMockup} placeholderText="Final Mockup" placeholderSubText="1366x2171px" accentColor={selectedProject.color}
                    style={{ ...imgContainerStyle('1366/2171', selectedProject.color) }} />
                </div>
              )}

              {/* Demo Video - Synkro only */}
              {selectedProject.id === 2 && (
                <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto 4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.75s forwards' }}>
                  <div style={{ ...imgContainerStyle('1366/768', selectedProject.color), position: 'relative' }}>
                    {selectedProject.images?.demoVideo ? (
                      <video style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} autoPlay loop muted playsInline>
                        <source src={selectedProject.images.demoVideo} type="video/mp4" />
                      </video>
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', textAlign: 'center' }}>Demo Video<br/><span style={{ fontSize: '1rem' }}>1366x768px MP4</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Solution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.2s forwards' }}>
                <ImageWithLoader src={selectedProject.images?.solution} placeholderText="Solution Image" accentColor={selectedProject.color}
                  style={{ ...imgContainerStyle('4/3', selectedProject.color, { order: 1 }) }} />
                <div style={{ order: 2 }}>
                  <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', color: '#ffffff', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', marginBottom: '1.2rem', lineHeight: 1.2 }}>{selectedProject.id === 2 ? 'Design' : 'The Solution'}</h2>
                  <p style={{ fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontFamily: '"Inter", sans-serif' }}>{selectedProject.content?.solution}</p>
                </div>
              </div>

              {/* Quote */}
              <div style={{ background: `linear-gradient(135deg,${selectedProject.color}15,${selectedProject.color}05)`, border: `2px solid ${selectedProject.color}40`, borderRadius: '20px', padding: 'clamp(2.5rem,5vw,4rem)', marginBottom: '4rem', textAlign: 'center', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.3s forwards' }}>
                <div style={{ fontSize: 'clamp(1.5rem,3.5vw,2.5rem)', color: selectedProject.color, fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', marginBottom: '1rem', lineHeight: 1.3 }}>"{selectedProject.content?.quote || selectedProject.description}"</div>
                <div style={{ fontSize: 'clamp(1rem,1.8vw,1.15rem)', color: 'rgba(255,255,255,0.6)', fontFamily: '"Inter", sans-serif', fontStyle: 'italic' }}>— {selectedProject.title}</div>
              </div>

              {/* Features */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {(selectedProject.content?.features || []).map((feature, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '2rem', opacity: 0, animation: `fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${1.5 + i * 0.1}s forwards` }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: `${selectedProject.color}30`, border: `2px solid ${selectedProject.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 900, color: selectedProject.color, fontFamily: '"Archivo Black", sans-serif' }}>{i + 1}</div>
                    <h3 style={{ fontSize: 'clamp(1.1rem,2vw,1.3rem)', color: '#ffffff', fontWeight: 700, fontFamily: '"Archivo Black", sans-serif', marginBottom: '0.8rem' }}>{feature.title}</h3>
                    <p style={{ fontSize: 'clamp(0.9rem,1.6vw,1rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontFamily: '"Inter", sans-serif' }}>{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Screens 1, 2, 3 */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {[1, 2, 3].map(num => (
                  <ImageWithLoader key={num} src={selectedProject.images?.[`screen${num}`]} placeholderText={`Screen ${num}`} accentColor={selectedProject.color}
                    style={{ ...imgContainerStyle('1/1', selectedProject.color, { opacity: 0, animation: `fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) ${1.7 + num * 0.08}s forwards` }) }} />
                ))}
              </div>

              {/* Screen 4 - Image or Video */}
              <div style={{ maxWidth: '600px', margin: '0 auto 4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 1.94s forwards' }}>
                {selectedProject.id === 2 ? (
                  <div style={{ ...imgContainerStyle('3/4', selectedProject.color), position: 'relative' }}>
                    {selectedProject.images?.screen4Video ? (
                      <video style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }} autoPlay loop muted playsInline>
                        <source src={selectedProject.images.screen4Video} type="video/mp4" />
                      </video>
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.15)', fontSize: '2rem', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', textAlign: 'center' }}>Screen 4 Video<br/><span style={{ fontSize: '1rem' }}>3:4 Portrait MP4</span></div>
                    )}
                  </div>
                ) : (
                  <ImageWithLoader src={selectedProject.images?.screen4} placeholderText="Screen 4" placeholderSubText="3:4 Portrait" accentColor={selectedProject.color}
                    style={{ ...imgContainerStyle('3/4', selectedProject.color) }} />
                )}
              </div>

              {/* Before Purpose - Palmi only */}
              {selectedProject.id === 1 && selectedProject.images?.beforePurpose && (
                <ImageWithLoader src={selectedProject.images.beforePurpose} accentColor={selectedProject.color}
                  style={{ ...imgContainerStyle('16/9', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 2.0s forwards' }) }} />
              )}

              {/* Before Final - Palmi only */}
              {selectedProject.id === 1 && selectedProject.images?.beforeFinal && (
                <ImageWithLoader src={selectedProject.images.beforeFinal} accentColor={selectedProject.color}
                  style={{ ...imgContainerStyle('16/9', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 2.15s forwards' }) }} />
              )}

              {/* Brand Packaging / Purpose of Data */}
              <div style={{ marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 2.1s forwards' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#ffffff', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', marginBottom: '1.5rem', lineHeight: 1.2 }}>{selectedProject.id === 1 ? 'Brand Packaging' : 'Purpose of the Data'}</h2>
                <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', maxWidth: '900px', marginBottom: '2rem' }}>
                  {selectedProject.content?.purposeOfData || selectedProject.content?.BrandPackaging || "The purpose of this data is to support awareness and conversation. It is not meant to diagnose or assess, but to help parents better understand their child and seek professional support when needed."}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '2rem', marginTop: '2rem' }}>
                  {(selectedProject.content?.metrics || []).map((m, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 900, color: selectedProject.color, fontFamily: '"Archivo Black", sans-serif', marginBottom: '0.5rem' }}>{m.value}</div>
                      <div style={{ fontSize: 'clamp(0.9rem,1.6vw,1rem)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"Space Mono", monospace' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final */}
              <ImageWithLoader src={selectedProject.images?.final} placeholderText="Final Mockup" placeholderSubText="21:9 Aspect Ratio" accentColor={selectedProject.color}
                style={{ ...imgContainerStyle('21/9', selectedProject.color, { marginBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 2.2s forwards' }) }} />

              {/* Back button bottom */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '4rem', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.9s forwards' }}>
                <button onClick={() => setSelectedProject(null)} style={{ fontSize: 'clamp(0.9rem,1.6vw,1rem)', fontWeight: 600, padding: 'clamp(1rem,2vw,1.2rem) clamp(2.5rem,5vw,3.5rem)', border: `2px solid ${selectedProject.color}`, background: `${selectedProject.color}20`, color: '#ffffff', cursor: 'pointer', backdropFilter: 'blur(10px)', borderRadius: '50px', letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'all 0.3s', fontFamily: '"Space Mono", monospace' }}
                  onMouseEnter={e => { e.target.style.background = selectedProject.color; e.target.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.target.style.background = `${selectedProject.color}20`; e.target.style.transform = 'translateY(0)'; }}>
                  Back to Projects
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {activeSection === 'about' && (
          <div style={{ maxWidth: '700px', textAlign: 'center', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem,7vw,4rem)', color: '#ffffff', margin: '0 0 1.5rem 0', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', lineHeight: 1.2 }}>
              {t.about.title.split('').map((char, i) => char === ' ' ? <span key={i}> </span> : (
                <span key={i} style={{ display: 'inline-block', transition: 'text-shadow 0.2s', cursor: 'pointer' }}
                  onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.textShadow = `${(e.clientX-r.left-r.width/2)*.15}px ${(e.clientY-r.top-r.height/2)*.15}px 25px rgba(255,255,255,0.8)`; }}
                  onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}>{char}</span>
              ))}
            </h2>
            <p style={{ fontSize: 'clamp(1rem,2.2vw,1.3rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: '2rem', fontFamily: '"Inter", sans-serif' }}>{t.about.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1.5rem', marginTop: '3rem' }}>
              {t.about.skills.map((skill, i) => <div key={skill} style={{ opacity: 0, animation: `fadeIn 0.5s ease ${0.3 + i * 0.1}s forwards` }}><div style={{ fontSize: 'clamp(1.2rem,2.5vw,1.5rem)', fontWeight: 900, color: '#ffffff', fontFamily: '"Archivo Black", sans-serif' }}>{skill}</div></div>)}
            </div>
            <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.7s forwards' }}>
              <h3 style={{ fontSize: 'clamp(0.85rem,1.5vw,1rem)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', fontFamily: '"Space Mono", monospace' }}>{t.about.toolsLabel}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                {t.about.tools.map((tool, i) => (
                  <div key={tool} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50px', fontSize: 'clamp(0.85rem,1.5vw,0.95rem)', color: '#ffffff', fontFamily: '"Inter", sans-serif', fontWeight: 500, transition: 'all 0.3s', cursor: 'default', opacity: 0, animation: `fadeIn 0.5s ease ${0.8 + i * 0.1}s forwards` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}>{tool}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeSection === 'contact' && (
          <div style={{ textAlign: 'center', maxWidth: '700px', opacity: 0, animation: 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s forwards' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem,7vw,4rem)', color: '#ffffff', margin: '0 0 1rem 0', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif' }}>
              {t.contact.title.split('').map((char, i) => char === ' ' ? <span key={i}> </span> : (
                <span key={i} style={{ display: 'inline-block', transition: 'text-shadow 0.2s', cursor: 'pointer' }}
                  onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.textShadow = `${(e.clientX-r.left-r.width/2)*.15}px ${(e.clientY-r.top-r.height/2)*.15}px 25px rgba(255,255,255,0.8)`; }}
                  onMouseLeave={e => e.currentTarget.style.textShadow = 'none'}>{char}</span>
              ))}
            </h2>
            <p style={{ fontSize: 'clamp(1rem,2.2vw,1.3rem)', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', lineHeight: 1.6, fontFamily: '"Inter", sans-serif' }}>{t.contact.subtitle}</p>

            {/* 3D Contact Card */}
            <div style={{ display: 'flex', justifyContent: 'center', opacity: 0, animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s forwards' }}>
              <div className="contact-parent">
                <div className="contact-card">
                  {/* Glass sheen */}
                  <div className="contact-glass" />

                  {/* Concentric circles logo */}
                  <div className="contact-logo">
                    <span className="contact-circle contact-circle1" />
                    <span className="contact-circle contact-circle2" />
                    <span className="contact-circle contact-circle3" />
                    <span className="contact-circle contact-circle4" />
                    <span className="contact-circle contact-circle5">
                      {/* D monogram */}
                      <svg className="contact-logo-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 4h6a8 8 0 0 1 0 16H5V4z"/>
                      </svg>
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="contact-content">
                    <span className="contact-title">Diana Studio</span>
                    <span className="contact-text">UX/UI Designer & AI Specialist<br/>Brandenburg, Germany</span>
                  </div>

                  {/* Bottom row */}
                  <div className="contact-bottom">
                    <div className="contact-social-buttons">
                      {/* Email */}
                      <button className="contact-social-btn" title="dianaxstudio@gmail.com" onClick={() => window.open('mailto:dianaxstudio@gmail.com')}>
                        <svg className="contact-social-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </button>
                      {/* LinkedIn */}
                      <button className="contact-social-btn" title="LinkedIn" onClick={() => window.open('https://linkedin.com/in/diana', '_blank')}>
                        <svg className="contact-social-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57A1.46 1.46 0 0 1 14.38 12.11A1.46 1.46 0 0 1 15.84 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/>
                        </svg>
                      </button>
                      {/* Dribbble */}
                      <button className="contact-social-btn" title="Dribbble" onClick={() => window.open('https://dribbble.com/diana', '_blank')}>
                        <svg className="contact-social-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 0 0-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.814 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.686 8.686 0 0 1 12 3.475zm-3.633.803a53.896 53.896 0 0 1 3.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 0 1 4.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 0 1-2.19-5.705zM12 20.547a8.482 8.482 0 0 1-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 0 1 1.823 6.475 8.4 8.4 0 0 1-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 0 1-3.655 5.715z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="contact-view-more">
                      <button className="contact-view-more-btn" onClick={() => window.open('mailto:dianaxstudio@gmail.com')}>Say Hello</button>
                      <svg className="contact-view-more-svg" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 5.5L23 12L17.5 18.5" stroke="#6a5acd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 12H2" stroke="#6a5acd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; overflow: hidden !important; position: fixed; }

        /* ─── Loader widget ─── */
        .img-loader {
          --main-size: 1.8em;
          --text-color: #ffffff;
          --shine-color: #ffffff40;
          --shadow-color: #aaaaaa;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          user-select: none;
          position: relative;
          font-size: var(--main-size);
          font-weight: 900;
          text-transform: uppercase;
          color: var(--text-color);
          width: 7.3em;
          height: 1em;
          filter: drop-shadow(0 0 0.05em var(--shine-color));
        }
        .img-loader__text {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          position: absolute;
        }
        .img-loader__text:nth-child(1) { clip-path: polygon(0% 0%,11.11% 0%,11.11% 100%,0% 100%); font-size: calc(var(--main-size)/20); margin-left: -2.1em; opacity: 0.6; }
        .img-loader__text:nth-child(2) { clip-path: polygon(11.11% 0%,22.22% 0%,22.22% 100%,11.11% 100%); font-size: calc(var(--main-size)/16); margin-left: -0.98em; opacity: 0.7; }
        .img-loader__text:nth-child(3) { clip-path: polygon(22.22% 0%,33.33% 0%,33.33% 100%,22.22% 100%); font-size: calc(var(--main-size)/13); margin-left: -0.33em; opacity: 0.8; }
        .img-loader__text:nth-child(4) { clip-path: polygon(33.33% 0%,44.44% 0%,44.44% 100%,33.33% 100%); font-size: calc(var(--main-size)/11); margin-left: -0.05em; opacity: 0.9; }
        .img-loader__text:nth-child(5) { clip-path: polygon(44.44% 0%,55.55% 0%,55.55% 100%,44.44% 100%); font-size: calc(var(--main-size)/10); margin-left: 0em; opacity: 1; }
        .img-loader__text:nth-child(6) { clip-path: polygon(55.55% 0%,66.66% 0%,66.66% 100%,55.55% 100%); font-size: calc(var(--main-size)/11); margin-left: 0.05em; opacity: 0.9; }
        .img-loader__text:nth-child(7) { clip-path: polygon(66.66% 0%,77.77% 0%,77.77% 100%,66.66% 100%); font-size: calc(var(--main-size)/13); margin-left: 0.33em; opacity: 0.8; }
        .img-loader__text:nth-child(8) { clip-path: polygon(77.77% 0%,88.88% 0%,88.88% 100%,77.77% 100%); font-size: calc(var(--main-size)/16); margin-left: 0.98em; opacity: 0.7; }
        .img-loader__text:nth-child(9) { clip-path: polygon(88.88% 0%,100% 0%,100% 100%,88.88% 100%); font-size: calc(var(--main-size)/20); margin-left: 2.1em; opacity: 0.6; }

        .img-loader__text span {
          animation: img-loader-scroll 2s cubic-bezier(0.1,0.6,0.9,0.4) infinite,
                     img-loader-shadow 2s cubic-bezier(0.1,0.6,0.9,0.4) infinite;
        }
        .img-loader__text:nth-child(1) span { background: linear-gradient(to right,var(--text-color) 4%,var(--shadow-color) 7%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(2) span { background: linear-gradient(to right,var(--text-color) 9%,var(--shadow-color) 13%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(3) span { background: linear-gradient(to right,var(--text-color) 15%,var(--shadow-color) 18%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(4) span { background: linear-gradient(to right,var(--text-color) 20%,var(--shadow-color) 23%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(6) span { background: linear-gradient(to right,var(--shadow-color) 29%,var(--text-color) 32%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(7) span { background: linear-gradient(to right,var(--shadow-color) 34%,var(--text-color) 37%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(8) span { background: linear-gradient(to right,var(--shadow-color) 39%,var(--text-color) 42%); background-size: 200% auto; background-clip: text; color: transparent; }
        .img-loader__text:nth-child(9) span { background: linear-gradient(to right,var(--shadow-color) 45%,var(--text-color) 48%); background-size: 200% auto; background-clip: text; color: transparent; }

        .img-loader__line {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          height: 0.05em;
          width: calc(var(--main-size) / 2);
          margin-top: 0.9em;
          border-radius: 0.05em;
        }
        .img-loader__line::before { content: ""; position: absolute; height: 100%; width: 100%; background-color: var(--text-color); opacity: 0.3; }
        .img-loader__line::after { content: ""; position: absolute; height: 100%; width: 100%; background-color: var(--text-color); border-radius: 0.05em; transform: translateX(-90%); animation: img-loader-wobble 2s cubic-bezier(0.5,0.8,0.5,0.2) infinite; }

        @keyframes img-loader-wobble {
          0% { transform: translateX(-90%); }
          50% { transform: translateX(90%); }
          100% { transform: translateX(-90%); }
        }
        @keyframes img-loader-scroll {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes img-loader-shadow {
          0% { background-position: -98% 0; }
          100% { background-position: 102% 0; }
        }

        /* ─── App animations ─── */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; transform: translate(-50%,-50%) scale(1); } 50% { opacity:0.5; transform: translate(-50%,-50%) scale(1.2); } }
        @keyframes loadBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes slideLeft { 0%,100% { transform: translateX(0); opacity: 1; } 50% { transform: translateX(-10px); opacity: 0.5; } }
        @keyframes slideRight { 0%,100% { transform: translateX(0); opacity: 1; } 50% { transform: translateX(10px); opacity: 0.5; } }

        button { font-family: inherit; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ─── 3D Contact Card ─── */
        .contact-parent {
          width: 300px;
          height: 320px;
          perspective: 1200px;
        }
        .contact-card {
          height: 100%;
          border-radius: 40px;
          background: linear-gradient(135deg, rgb(106,90,205) 0%, rgb(147,112,219) 100%);
          transition: all 0.6s ease-in-out;
          transform-style: preserve-3d;
          box-shadow: rgba(30,30,60,0) 40px 50px 25px -40px, rgba(30,30,60,0.2) 0px 25px 25px -5px;
          position: relative;
        }
        .contact-glass {
          transform-style: preserve-3d;
          position: absolute;
          inset: 10px;
          border-radius: 45px;
          border-top-left-radius: 100%;
          background: linear-gradient(0deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 100%);
          transform: translate3d(0px, 0px, 30px);
          border-right: 1px solid rgba(255,255,255,0.5);
          border-bottom: 1px solid rgba(255,255,255,0.5);
          transition: all 0.6s ease-in-out;
        }
        .contact-content {
          padding: 90px 50px 0px 25px;
          transform: translate3d(0, 0, 31px);
        }
        .contact-title {
          display: block;
          color: #3c2f80;
          font-weight: 900;
          font-size: 22px;
          font-family: "Archivo Black", sans-serif;
        }
        .contact-text {
          display: block;
          color: rgba(60,47,128,0.8);
          font-size: 13px;
          margin-top: 12px;
          line-height: 1.6;
          font-family: "Inter", sans-serif;
        }
        .contact-bottom {
          padding: 12px 15px;
          transform-style: preserve-3d;
          position: absolute;
          bottom: 25px;
          left: 25px;
          right: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform: translate3d(0, 0, 31px);
        }
        .contact-view-more {
          display: flex;
          align-items: center;
          width: 40%;
          justify-content: flex-end;
          transition: all 0.3s ease-in-out;
          gap: 4px;
        }
        .contact-view-more:hover { transform: translate3d(0, 0, 15px); }
        .contact-view-more-btn {
          background: none;
          border: none;
          color: #6a5acd;
          font-weight: bold;
          font-size: 13px;
          cursor: pointer;
          font-family: "Space Mono", monospace;
        }
        .contact-view-more-svg {
          fill: none;
          stroke: #6a5acd;
          stroke-width: 2.5px;
          max-height: 14px;
          width: 20px;
        }
        .contact-social-buttons {
          display: flex;
          gap: 12px;
          transform-style: preserve-3d;
        }
        .contact-social-btn {
          width: 32px;
          aspect-ratio: 1;
          padding: 6px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          border: none;
          display: grid;
          place-content: center;
          box-shadow: rgba(30,30,60,0.4) 0px 8px 6px -5px;
          cursor: pointer;
        }
        .contact-social-buttons .contact-social-btn:first-child { transition: transform 0.3s ease-in-out 0.3s, box-shadow 0.3s ease-in-out 0.3s; }
        .contact-social-buttons .contact-social-btn:nth-child(2) { transition: transform 0.3s ease-in-out 0.5s, box-shadow 0.3s ease-in-out 0.5s; }
        .contact-social-buttons .contact-social-btn:nth-child(3) { transition: transform 0.3s ease-in-out 0.7s, box-shadow 0.3s ease-in-out 0.7s; }
        .contact-social-svg { width: 16px; fill: #3c2f80; display: block; }
        .contact-social-btn:hover { background: #3c2f80; }
        .contact-social-btn:hover .contact-social-svg { fill: #ffffff; }
        .contact-social-btn:active { background: #ffd700; }
        .contact-social-btn:active .contact-social-svg { fill: #3c2f80; }

        .contact-logo {
          position: absolute;
          left: 0;
          top: 0;
          transform-style: preserve-3d;
        }
        .contact-circle {
          display: block;
          position: absolute;
          aspect-ratio: 1;
          border-radius: 50%;
          top: 0;
          left: 0;
          box-shadow: rgba(100,100,111,0.2) 10px 10px 20px 0px;
          background: rgba(147,112,219,0.3);
          transition: all 0.6s ease-in-out;
        }
        .contact-circle1 { width: 160px; transform: translate3d(0,0,25px); top: 10px; left: 10px; }
        .contact-circle2 { width: 130px; transform: translate3d(0,0,45px); top: 12px; left: 12px; transition-delay: 0.3s; }
        .contact-circle3 { width: 100px; transform: translate3d(0,0,65px); top: 15px; left: 15px; transition-delay: 0.6s; }
        .contact-circle4 { width: 70px; transform: translate3d(0,0,85px); top: 20px; left: 20px; transition-delay: 0.9s; }
        .contact-circle5 { width: 40px; transform: translate3d(0,0,105px); top: 25px; left: 25px; display: grid; place-content: center; transition-delay: 1.2s; }
        .contact-logo-svg { width: 18px; fill: #ffffff; }

        .contact-parent:hover .contact-card {
          transform: rotate3d(1, -1, 0, 25deg);
          box-shadow: rgba(30,30,60,0.3) 30px 50px 25px -40px, rgba(30,30,60,0.15) 0px 25px 30px 0px;
        }
        .contact-parent:hover .contact-card .contact-social-buttons .contact-social-btn {
          transform: translate3d(0, 0, 60px);
          box-shadow: rgba(30,30,60,0.25) 5px 20px 10px 0px;
        }
        .contact-parent:hover .contact-card .contact-circle2 { transform: translate3d(0,0,65px); }
        .contact-parent:hover .contact-card .contact-circle3 { transform: translate3d(0,0,85px); }
        .contact-parent:hover .contact-card .contact-circle4 { transform: translate3d(0,0,105px); }
        .contact-parent:hover .contact-card .contact-circle5 { transform: translate3d(0,0,125px); }
      `}</style>
    </div>
  );
}
