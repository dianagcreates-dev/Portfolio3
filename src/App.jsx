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
      headline: 'Design that speaks volumes',
      subheadline: 'UX/UI Designer crafting digital experiences at the intersection of beauty and function',
      cta: 'View Projects'
    },
    work: {
      backButton: '← Back to Projects',
      skills: ['Figma', 'Prototyping', 'User Research']
    },
    about: {
      title: 'Design Philosophy',
      description: "I believe great design is invisible—it doesn't shout for attention, it earns it. Every pixel serves a purpose. Every interaction tells a story. My work bridges the gap between user needs and business goals, creating experiences that feel effortless yet deliberate.",
      skills: ['Strategy', 'Interaction', 'Visual', 'Research'],
      skillLabel: 'Core Focus'
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
        title: "Nebula",
        category: "Product Design",
        year: "2024",
        description: "AI-powered creative suite reimagining digital artistry",
        color: "#6366F1"
      },
      {
        id: 2,
        title: "Cascade",
        category: "Brand Identity",
        year: "2024",
        description: "Visual system for sustainable fashion platform",
        color: "#EC4899"
      },
      {
        id: 3,
        title: "Terminus",
        category: "Mobile Experience",
        year: "2023",
        description: "Transit app designed for urban explorers",
        color: "#F59E0B"
      },
      {
        id: 4,
        title: "Meridian",
        category: "Web Platform",
        year: "2023",
        description: "B2B analytics dashboard with real-time insights",
        color: "#10B981"
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
      headline: 'Design das Bände spricht',
      subheadline: 'UX/UI Designer entwickelt digitale Erlebnisse an der Schnittstelle von Schönheit und Funktion',
      cta: 'Projekte Ansehen'
    },
    work: {
      backButton: '← Zurück zu Projekten',
      skills: ['Figma', 'Prototyping', 'Nutzerforschung']
    },
    about: {
      title: 'Design-Philosophie',
      description: 'Ich glaube, dass großartiges Design unsichtbar ist – es schreit nicht nach Aufmerksamkeit, es verdient sie. Jedes Pixel dient einem Zweck. Jede Interaktion erzählt eine Geschichte. Meine Arbeit überbrückt die Lücke zwischen Nutzerbedürfnissen und Geschäftszielen und schafft Erlebnisse, die mühelos und dennoch bewusst wirken.',
      skills: ['Strategie', 'Interaktion', 'Visuell', 'Forschung'],
      skillLabel: 'Kernfokus'
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
        title: "Nebula",
        category: "Produktdesign",
        year: "2024",
        description: "KI-gestütztes kreatives Suite, das digitale Kunstfertigkeit neu definiert",
        color: "#6366F1"
      },
      {
        id: 2,
        title: "Cascade",
        category: "Markenidentität",
        year: "2024",
        description: "Visuelles System für nachhaltige Modeplattform",
        color: "#EC4899"
      },
      {
        id: 3,
        title: "Terminus",
        category: "Mobile Erfahrung",
        year: "2023",
        description: "Transit-App für urbane Entdecker",
        color: "#F59E0B"
      },
      {
        id: 4,
        title: "Meridian",
        category: "Web-Plattform",
        year: "2023",
        description: "B2B-Analyse-Dashboard mit Echtzeit-Einblicken",
        color: "#10B981"
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
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [language, setLanguage] = useState('en');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
 

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
    const numParticles = 400;
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

  // Handle wheel scroll for section navigation
  useEffect(() => {
    const handleWheel = (e) => {
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
  }, [activeSection, isScrolling]);

  // Toggle audio play/pause
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
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
      <audio
        ref={audioRef}
        src="/background.mp3"
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
          DIANA G.
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
                fontFamily: '"Space Mono", monospace'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = activeSection === item.id ? '#ffffff' : 'rgba(255,255,255,0.5)';
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: '#ffffff',
                  animation: 'expandWidth 0.3s ease'
                }} />
              )}
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
                letterSpacing: '0.05em'
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
              marginLeft: '0.5rem'
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
        </div>
      </nav>

      <div style={{
        position: 'fixed',
        right: 'clamp(2rem, 3vw, 3rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
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
            <div
              className="nav-label"
              style={{
                fontSize: '0.75rem',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                opacity: activeSection === item.id ? '1' : '0',
                transform: activeSection === item.id ? 'translateX(0)' : 'translateX(10px)',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                fontFamily: '"Space Mono", monospace'
              }}
            >
              {item.label}
            </div>
            
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
              {t.home.headline.split(' ').slice(0, 2).join(' ')}<br />
              {t.home.headline.split(' ').slice(2).join(' ')}
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
              onMouseEnter={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.color = '#1a1a1a';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(0)';
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
            perspective: '2000px'
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '500px',
              transformStyle: 'preserve-3d',
              animation: 'carousel3DRotate 30s linear infinite'
            }}>
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
                      onClick={() => setSelectedProject(project)}
                      onMouseEnter={(e) => {
                        const corners = e.currentTarget.querySelectorAll('.corner-glow');
                        corners.forEach(corner => {
                          corner.style.opacity = '1';
                        });
                        e.currentTarget.style.border = `1px solid ${project.color}60`;
                      }}
                      onMouseLeave={(e) => {
                        const corners = e.currentTarget.querySelectorAll('.corner-glow');
                        corners.forEach(corner => {
                          corner.style.opacity = '0';
                        });
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)';
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        padding: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative',
                        overflow: 'visible',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 10px 50px rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Top-right corner glow */}
                      <div 
                        className="corner-glow"
                        style={{
                          position: 'absolute',
                          top: '-30px',
                          right: '-30px',
                          width: '80px',
                          height: '80px',
                          background: `radial-gradient(circle, ${project.color}80, ${project.color}40, transparent 70%)`,
                          borderRadius: '50%',
                          opacity: '0',
                          transition: 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          pointerEvents: 'none',
                          filter: 'blur(15px)'
                        }}
                      />
                      {/* Top-left corner glow */}
                      <div 
                        className="corner-glow"
                        style={{
                          position: 'absolute',
                          top: '-30px',
                          left: '-30px',
                          width: '80px',
                          height: '80px',
                          background: `radial-gradient(circle, ${project.color}80, ${project.color}40, transparent 70%)`,
                          borderRadius: '50%',
                          opacity: '0',
                          transition: 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s',
                          pointerEvents: 'none',
                          filter: 'blur(15px)'
                        }}
                      />
                      {/* Bottom-right corner glow */}
                      <div 
                        className="corner-glow"
                        style={{
                          position: 'absolute',
                          bottom: '-30px',
                          right: '-30px',
                          width: '80px',
                          height: '80px',
                          background: `radial-gradient(circle, ${project.color}80, ${project.color}40, transparent 70%)`,
                          borderRadius: '50%',
                          opacity: '0',
                          transition: 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
                          pointerEvents: 'none',
                          filter: 'blur(15px)'
                        }}
                      />
                      {/* Bottom-left corner glow */}
                      <div 
                        className="corner-glow"
                        style={{
                          position: 'absolute',
                          bottom: '-30px',
                          left: '-30px',
                          width: '80px',
                          height: '80px',
                          background: `radial-gradient(circle, ${project.color}80, ${project.color}40, transparent 70%)`,
                          borderRadius: '50%',
                          opacity: '0',
                          transition: 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s',
                          pointerEvents: 'none',
                          filter: 'blur(15px)'
                        }}
                      />

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
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: '"Space Mono", monospace',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
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
          </div>
        )}

        {selectedProject && (
          <div style={{
            width: '100%',
            maxWidth: '800px',
            textAlign: 'center',
            opacity: 0,
            animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                cursor: 'pointer',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'color 0.3s ease',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.05em'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
            >
              {t.work.backButton}
            </button>

            <div style={{
              width: '100%',
              aspectRatio: '16/10',
              background: `linear-gradient(135deg, ${selectedProject.color}40, ${selectedProject.color}20)`,
              borderRadius: '20px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${selectedProject.color}60`,
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                color: 'rgba(255,255,255,0.3)',
                fontWeight: 900,
                fontFamily: '"Archivo Black", sans-serif'
              }}>
                {selectedProject.title}
              </div>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#ffffff',
              margin: '0 0 1.5rem 0',
              fontWeight: 900,
              fontFamily: '"Archivo Black", sans-serif'
            }}>
              {selectedProject.title}
            </h2>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              fontFamily: '"Inter", sans-serif'
            }}>
              {selectedProject.description}
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {t.work.skills.map((skill) => (
                <span key={skill} style={{
                  padding: '0.6rem 1.2rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '30px',
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                  color: 'rgba(255,255,255,0.8)',
                  fontFamily: '"Space Mono", monospace'
                }}>
                  {skill}
                </span>
              ))}
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
              {t.about.title}
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
                    marginBottom: '0.3rem',
                    fontFamily: '"Archivo Black", sans-serif'
                  }}>
                    {skill}
                  </div>
                  <div style={{
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontFamily: '"Space Mono", monospace'
                  }}>
                    {t.about.skillLabel}
                  </div>
                </div>
              ))}
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
              {t.contact.title}
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
                { label: t.contact.email, value: 'dianagcreates@gmail.com' },
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

        @keyframes expandWidth {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
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

        body {
          overflow: hidden !important;
          position: fixed;
          width: 100%;
          height: 100%;
        }

        button {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
