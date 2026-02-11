</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Section 3: Device Objective Text */}
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
                  Device Objective
                </h2>
                <p style={{
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.7,
                  fontFamily: '"Inter", sans-serif',
                  maxWidth: '900px'
                }}>
                  {selectedProject.content?.deviceObjective || "To bridge this emotional gap: any solution must allow children to express feelings, offer guidance in the moment, and track emotion patterns."}
                </p>
              </div>

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

              {/* Section 9: Purpose of the Data */}
              <div style={{
                marginBottom: '4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.02s forwards'
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
                  maxWidth: '900px'
                }}>
                  {selectedProject.content?.purposeOfData || "The purpose of this data is to support awareness and conversation. It is not meant to diagnose or assess, but to help parents better understand their child and seek professional support when needed."}
                </p>
              </div>

              {/* Section 10: Final full-width image */}
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
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.1s forwards',
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

              {/* Section 11: Metrics at the bottom */}
              <div style={{
                marginBottom: '4rem',
                opacity: 0,
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 2.18s forwards'
              }}>
                {/* Metrics grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '2rem'
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
          cursor: none !important;
        }

        html, body, #root {
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          position: fixed;
          margin: 0;
          padding: 0;
          cursor: none !important;
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
