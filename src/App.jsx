import React, { useEffect, useRef, useState } from 'react';

// ── SplashCursor ─────────────────────────────────────────────────────────────
function SplashCursor(){
  useEffect(()=>{
    const canvas=document.createElement('canvas');
    canvas.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;';
    document.body.appendChild(canvas);
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    let active=true,rafId=null;

    const cfg={SIM_RESOLUTION:128,DYE_RESOLUTION:1440,DENSITY_DISSIPATION:3.5,VELOCITY_DISSIPATION:2,PRESSURE:0.1,PRESSURE_ITERATIONS:20,CURL:3,SPLAT_RADIUS:0.2,SPLAT_FORCE:6000,SHADING:true,COLOR_UPDATE_SPEED:10};
    let ptr={texcoordX:0,texcoordY:0,deltaX:0,deltaY:0,moved:false,color:{r:0,g:0,b:0}};

    const p={alpha:true,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false};
    let gl=canvas.getContext('webgl2',p);
    const isWebGL2=!!gl;
    if(!isWebGL2)gl=canvas.getContext('webgl',p)||canvas.getContext('experimental-webgl',p);
    let hf,lin;
    if(isWebGL2){gl.getExtension('EXT_color_buffer_float');lin=gl.getExtension('OES_texture_float_linear');}
    else{hf=gl.getExtension('OES_texture_half_float');lin=gl.getExtension('OES_texture_half_float_linear');}
    const hfType=isWebGL2?gl.HALF_FLOAT:(hf&&hf.HALF_FLOAT_OES);
    if(!lin){cfg.DYE_RESOLUTION=256;cfg.SHADING=false;}

    function supFmt(iF,f,t){const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,iF,4,4,0,f,t,null);const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);return gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;}
    function gF(iF,f,t){if(!supFmt(iF,f,t)){if(iF===gl.R16F)return gF(gl.RG16F,gl.RG,t);if(iF===gl.RG16F)return gF(gl.RGBA16F,gl.RGBA,t);return null;}return{internalFormat:iF,format:f};}
    let fRGBA,fRG,fR;
    if(isWebGL2){fRGBA=gF(gl.RGBA16F,gl.RGBA,hfType);fRG=gF(gl.RG16F,gl.RG,hfType);fR=gF(gl.R16F,gl.RED,hfType);}
    else{fRGBA=gF(gl.RGBA,gl.RGBA,hfType);fRG=gF(gl.RGBA,gl.RGBA,hfType);fR=gF(gl.RGBA,gl.RGBA,hfType);}

    function cSh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
    function mkP(vs,fs){const p=gl.createProgram();gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);return p;}
    function gU(p){const u={},n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const nm=gl.getActiveUniform(p,i).name;u[nm]=gl.getUniformLocation(p,nm);}return u;}

    const bVS=cSh(gl.VERTEX_SHADER,`precision highp float;attribute vec2 aPosition;varying vec2 vUv,vL,vR,vT,vB;uniform vec2 texelSize;void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);
    function prog(fs){const p2=mkP(bVS,cSh(gl.FRAGMENT_SHADER,fs));return{p:p2,u:gU(p2),bind(){gl.useProgram(p2);}};}

    const cpP=prog(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
    const clP=prog(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
    const spP=prog(`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.);}`);
    const adP=prog(`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize;uniform float dt,dissipation;void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;gl_FragColor=texture2D(uSource,coord)/(1.+dissipation*dt);}`);
    const dvP=prog(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`);
    const cuP=prog(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){gl_FragColor=vec4(.5*(texture2D(uVelocity,vR).y-texture2D(uVelocity,vL).y-texture2D(uVelocity,vT).x+texture2D(uVelocity,vB).x),0.,0.,1.);}`);
    const voP=prog(`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture2D(uVelocity,vUv).xy+f*dt;gl_FragColor=vec4(clamp(v,-1000.,1000.),0.,1.);}`);
    const prP=prog(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){gl_FragColor=vec4(.25*(texture2D(uPressure,vL).x+texture2D(uPressure,vR).x+texture2D(uPressure,vB).x+texture2D(uPressure,vT).x-texture2D(uDivergence,vUv).x),0.,0.,1.);}`);
    const gsP=prog(`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){vec2 v=texture2D(uVelocity,vUv).xy-vec2(texture2D(uPressure,vR).x-texture2D(uPressure,vL).x,texture2D(uPressure,vT).x-texture2D(uPressure,vB).x);gl_FragColor=vec4(v,0.,1.);}`);
    const dsSrc=cfg.SHADING?`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;void main(){vec3 c=texture2D(uTexture,vUv).rgb;vec3 lc=texture2D(uTexture,vL).rgb,rc=texture2D(uTexture,vR).rgb,tc=texture2D(uTexture,vT).rgb,bc=texture2D(uTexture,vB).rgb;float dx=length(rc)-length(lc),dy=length(tc)-length(bc);c*=clamp(dot(normalize(vec3(dx,dy,length(texelSize))),vec3(0.,0.,1.))+.7,.7,1.);float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`:
    `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;void main(){vec3 c=texture2D(uTexture,vUv).rgb;float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`;
    const dsP=prog(dsSrc);

    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.enableVertexAttribArray(0);

    function blit(t){if(!t){gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);gl.bindFramebuffer(gl.FRAMEBUFFER,null);}else{gl.viewport(0,0,t.width,t.height);gl.bindFramebuffer(gl.FRAMEBUFFER,t.fbo);}gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);}
    function mkFBO(w,h,iF,f,t,filter){gl.activeTexture(gl.TEXTURE0);const tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,iF,w,h,0,f,t,null);const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tx,0);gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);return{texture:tx,fbo:fb,width:w,height:h,texelSizeX:1/w,texelSizeY:1/h,attach(id){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,tx);return id;}};}
    function mkDFBO(w,h,iF,f,t,filter){let a=mkFBO(w,h,iF,f,t,filter),b=mkFBO(w,h,iF,f,t,filter);return{width:w,height:h,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a;},set read(v){a=v;},get write(){return b;},set write(v){b=v;},swap(){const tmp=a;a=b;b=tmp;}};}
    function getRes(r){const ar=Math.max(gl.drawingBufferWidth/gl.drawingBufferHeight,1);const mn=Math.round(r),mx=Math.round(r*ar);return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:mx,height:mn}:{width:mn,height:mx};}

    let dye,vel,div,cur,pres;
    function initFBOs(){const sr=getRes(cfg.SIM_RESOLUTION),dr=getRes(cfg.DYE_RESOLUTION),fil=lin?gl.LINEAR:gl.NEAREST;gl.disable(gl.BLEND);dye=mkDFBO(dr.width,dr.height,fRGBA.internalFormat,fRGBA.format,hfType,fil);vel=mkDFBO(sr.width,sr.height,fRG.internalFormat,fRG.format,hfType,fil);div=mkFBO(sr.width,sr.height,fR.internalFormat,fR.format,hfType,gl.NEAREST);cur=mkFBO(sr.width,sr.height,fR.internalFormat,fR.format,hfType,gl.NEAREST);pres=mkDFBO(sr.width,sr.height,fR.internalFormat,fR.format,hfType,gl.NEAREST);}
    initFBOs();

    function HSV(h){const i=Math.floor(h*6),f=h*6-i;switch(i%6){case 0:return{r:1,g:f,b:0};case 1:return{r:1-f,g:1,b:0};case 2:return{r:0,g:1,b:f};case 3:return{r:0,g:1-f,b:1};case 4:return{r:f,g:0,b:1};default:return{r:1,g:0,b:1-f};}}
    function genCol(){const c=HSV(Math.random());return{r:c.r*.15,g:c.g*.15,b:c.b*.15};}
    function cR(r){const ar=canvas.width/canvas.height;return ar>1?r*ar:r;}
    function cDX(d){const ar=canvas.width/canvas.height;return ar<1?d*ar:d;}
    function cDY(d){const ar=canvas.width/canvas.height;return ar>1?d/ar:d;}

    function splat(x,y,dx,dy,col){spP.bind();gl.uniform1i(spP.u.uTarget,vel.read.attach(0));gl.uniform1f(spP.u.aspectRatio,canvas.width/canvas.height);gl.uniform2f(spP.u.point,x,y);gl.uniform3f(spP.u.color,dx,dy,0);gl.uniform1f(spP.u.radius,cR(cfg.SPLAT_RADIUS/100));blit(vel.write);vel.swap();gl.uniform1i(spP.u.uTarget,dye.read.attach(0));gl.uniform3f(spP.u.color,col.r,col.g,col.b);blit(dye.write);dye.swap();}

    let lastT=Date.now(),colTimer=0;
    function frame(){
      if(!active)return;
      const now=Date.now(),dt=Math.min((now-lastT)/1000,.016666);lastT=now;
      if(canvas.width!==window.innerWidth||canvas.height!==window.innerHeight){canvas.width=window.innerWidth;canvas.height=window.innerHeight;initFBOs();}
      colTimer+=dt*cfg.COLOR_UPDATE_SPEED;if(colTimer>=1){colTimer=0;ptr.color=genCol();}
      if(ptr.moved){ptr.moved=false;splat(ptr.texcoordX,ptr.texcoordY,ptr.deltaX*cfg.SPLAT_FORCE,ptr.deltaY*cfg.SPLAT_FORCE,ptr.color);}
      gl.disable(gl.BLEND);
      cuP.bind();gl.uniform2f(cuP.u.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(cuP.u.uVelocity,vel.read.attach(0));blit(cur);
      voP.bind();gl.uniform2f(voP.u.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(voP.u.uVelocity,vel.read.attach(0));gl.uniform1i(voP.u.uCurl,cur.attach(1));gl.uniform1f(voP.u.curl,cfg.CURL);gl.uniform1f(voP.u.dt,dt);blit(vel.write);vel.swap();
      dvP.bind();gl.uniform2f(dvP.u.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(dvP.u.uVelocity,vel.read.attach(0));blit(div);
      clP.bind();gl.uniform1i(clP.u.uTexture,pres.read.attach(0));gl.uniform1f(clP.u.value,cfg.PRESSURE);blit(pres.write);pres.swap();
      prP.bind();gl.uniform2f(prP.u.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(prP.u.uDivergence,div.attach(0));for(let i=0;i<cfg.PRESSURE_ITERATIONS;i++){gl.uniform1i(prP.u.uPressure,pres.read.attach(1));blit(pres.write);pres.swap();}
      gsP.bind();gl.uniform2f(gsP.u.texelSize,vel.texelSizeX,vel.texelSizeY);gl.uniform1i(gsP.u.uPressure,pres.read.attach(0));gl.uniform1i(gsP.u.uVelocity,vel.read.attach(1));blit(vel.write);vel.swap();
      adP.bind();gl.uniform2f(adP.u.texelSize,vel.texelSizeX,vel.texelSizeY);const vi=vel.read.attach(0);gl.uniform1i(adP.u.uVelocity,vi);gl.uniform1i(adP.u.uSource,vi);gl.uniform1f(adP.u.dt,dt);gl.uniform1f(adP.u.dissipation,cfg.VELOCITY_DISSIPATION);blit(vel.write);vel.swap();
      gl.uniform1i(adP.u.uVelocity,vel.read.attach(0));gl.uniform1i(adP.u.uSource,dye.read.attach(1));gl.uniform1f(adP.u.dissipation,cfg.DENSITY_DISSIPATION);blit(dye.write);dye.swap();
      gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.enable(gl.BLEND);
      dsP.bind();if(cfg.SHADING)gl.uniform2f(dsP.u.texelSize,1/gl.drawingBufferWidth,1/gl.drawingBufferHeight);gl.uniform1i(dsP.u.uTexture,dye.read.attach(0));blit(null);
      rafId=requestAnimationFrame(frame);
    }

    function onMove(e){const ox=ptr.texcoordX,oy=ptr.texcoordY;ptr.texcoordX=e.clientX/window.innerWidth;ptr.texcoordY=1-e.clientY/window.innerHeight;ptr.deltaX=cDX(ptr.texcoordX-ox);ptr.deltaY=cDY(ptr.texcoordY-oy);ptr.moved=true;if(!ptr.color||!ptr.color.r)ptr.color=genCol();}
    function onDown(e){ptr.texcoordX=e.clientX/window.innerWidth;ptr.texcoordY=1-e.clientY/window.innerHeight;ptr.color=genCol();const c=genCol();c.r*=10;c.g*=10;c.b*=10;splat(ptr.texcoordX,ptr.texcoordY,10*(Math.random()-.5),30*(Math.random()-.5),c);}
    function onTMove(e){e.preventDefault();const t=e.targetTouches[0];const ox=ptr.texcoordX,oy=ptr.texcoordY;ptr.texcoordX=t.clientX/window.innerWidth;ptr.texcoordY=1-t.clientY/window.innerHeight;ptr.deltaX=cDX(ptr.texcoordX-ox);ptr.deltaY=cDY(ptr.texcoordY-oy);ptr.moved=true;}

    window.addEventListener('mousemove',onMove);
    window.addEventListener('mousedown',onDown);
    window.addEventListener('touchmove',onTMove,{passive:false});
    ptr.color=genCol();
    frame();

    return()=>{active=false;if(rafId)cancelAnimationFrame(rafId);window.removeEventListener('mousemove',onMove);window.removeEventListener('mousedown',onDown);window.removeEventListener('touchmove',onTMove);if(canvas.parentNode)canvas.parentNode.removeChild(canvas);};
  },[]);
  return null;
}
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// Translation content
const translations = {
  en: {
    nav: {
      home: 'Home',
      work: 'Work',
      gallery: 'Gallery',
      about: 'About',
      contact: 'Contact'
    },
    gallery: {
      title: 'Generative Visuals',
      subtitle: 'AI-Prompted Image Explorations',
      description: 'A space where AI becomes a creative tool, not a shortcut. Each visual is intentionally prompted, curated, and crafted to push the boundaries of what design can look like. This is where fashion, technology, and imagination collide.',
      images: [
         { src: '/images/gallery/image1.1.jpg', label: 'Image 01' },
        { src: '/images/gallery/image2.1.jpg', label: 'Image 02' },
        { src: '/images/gallery/image3.jpg', label: 'Image 03' },
        { src: '/images/gallery/image4.1.jpg', label: 'Image 04' },
        { src: '/images/gallery/image1.6.jpg', label: 'Image 05' },
        { src: '/images/gallery/image5.1.jpg', label: 'Image 06' },
      ]
    },
    home: {
      headline: "AI Is Only As Good As Who's Behind It",
      subheadline: "I'm a UX/UI & Generative AI Designer rooted in fashion and UX. Strong design direction is what separates AI-generated from AI-elevated. I live in that gap.",
      cta: 'View Projects'
    },
    work: {
      backButton: '← Back to Projects',
      skills: ['Figma', 'Prototyping', 'User Research']
    },
    about: {
      title: 'Design Philosophy',
      description: "My design philosophy blends aesthetics with functionality, and artificial intelligence with human intuition. I create digital products that don't just look good—they feel natural to use. Every pixel I place is intentional, because the future of design belongs to those who dare to think beyond the screen.",
      skills: ['Strategy', 'Interaction', 'Visual', 'Research'],
      skillLabel: 'Core Focus',
      tools: ['Figma', 'HTML', 'CSS', 'JavaScript', 'React', 'Adobe XD', 'Claude', 'GitHub', 'Canva', 'Webflow', 'Midjourney'],
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
          BrandPackaging: "Because Palmi is designed for emotional support, the packaging should speak to children first. It's calm, friendly, and non-technical, helping the child feel safe even before opening the product.",
          purposeOfData: "Because Palmi is designed for emotional support, the packaging should speak to children first. It's calm, friendly, and non-technical, helping the child feel safe even before opening the product.",
          metrics: [
            { value: '70mm', label: 'Compact Form Factor' },
            { value: '2', label: 'Interaction States' },
            { value: '3', label: 'AI Sensing Layers' }
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
          screen1: "/images/palmi/screen1.png",
          screen2: "/images/palmi/screen2.png",
          screen3: "/images/palmi/screen3.png",
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
          process1: "/images/synkro/process1.6.png",
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
          hero: "/images/social-media/hero1.2.png",
          process1: "/images/social-media/process1.2.png",
          process2: "/images/social-media/process2.png",
          process3: "/images/social-media/process3.png",
          process4: "/images/social-media/process4.1.png",
          processWide: "/images/social-media/process-wide1.png",
          detail1: "/images/social-media/detail1.3.png",
          detail2: "/images/social-media/detail2.4.png",
          portrait: "/images/social-media/portrait1.mp4",
          solution: "/images/social-media/solution.png",
          screen1: "/images/social-media/screen1.png",
          screen2: "/images/social-media/screen2.png",
          screen3: "/images/social-media/screen3.png",
          screen4: "/images/social-media/screen41.mp4",
          final: "/images/social-media/final.png"
        }
      },
      {
        id: 4,
        title: "Particle Self",
        category: "Creative Coding",
        year: "2025",
        description: "Interactive Particle Installation",
        color: "#10B981",
        content: {
          challenge: "Artificial Impression is a motion-based particle system that transforms human presence into dynamic visual behavior. Instead of reflecting the body as a static image, the system reconstructs it as movement. Using live camera input in TouchDesigner, shadow and gesture act as forces that disturb and reshape a particle field in real time. The body becomes wind. Presence becomes data. Movement becomes transformation.",
          solution: "The project explores how identity shifts when translated into a computational system. Rather than representation, the work focuses on transformation. The viewer does not see themselves — they activate a responsive environment. The artwork behaves as a living system: it reacts, it evolves, it dissolves, it reforms. Presence becomes co-authorship.",
          quote: "The body becomes wind. Presence becomes data. Movement becomes transformation.",
          deviceObjective: "The system integrates real-time camera input, motion and silhouette detection, GPU-driven particle simulation, force modulation through gesture and distance, and feedback loops generating temporal memory. Through shadow-based interaction, the body becomes an interface. Subtle variations in speed and proximity produce turbulence, drift, or density shifts within the particle field.",
          purposeOfData: "Originally developed as a wall projection, the work creates an immersive environment where physical movement directly shapes digital matter. The installation operates between two spaces: Physical (body, projection, shadow) and Digital (system, computation, particle logic).",
          metrics: [
            { value: 'Real-time', label: 'Camera Input' },
            { value: 'GPU', label: 'Particle Simulation' },
            { value: 'Live', label: 'Force Modulation' }
          ],
          features: [
            {
              title: "Motion & Silhouette Detection",
              description: "Live camera input captures shadow and gesture, translating physical presence into computational forces that disturb and reshape the particle field in real time."
            },
            {
              title: "GPU-Driven Particle Simulation",
              description: "Thousands of particles respond to body movement through force modulation — speed and proximity produce turbulence, drift, or density shifts across the field."
            },
            {
              title: "Temporal Memory Feedback",
              description: "Feedback loops generate temporal memory within the system, allowing traces of past movement to linger and evolve long after the body has moved on."
            }
          ]
        },
        images: {
          hero: "/images/particle/hero.png",
          process1: "/images/particle/process1.2.png",
          process2: "/images/particle/process3.png",
          process3: "/images/particle/process4.png",
          process4: "/images/particle/process5.png",
          processWide: "/images/particle/process-wide.png",
          detail1: "/images/particle/detail1.1.png",
          detail2: "/images/particle/detail2.1.png",
          portrait: "/images/particle/portrait3.mp4",
          solution: "/images/particle/solution.png",
          screen1: "/images/particle/screen1.png",
          screen2: "/images/particle/screen2.png",
          screen3: "/images/particle/screen3.png",
          screen4: "/images/particle/screen4.png",
          final: "/images/particle/final1.mp4"
        }
      }
    ]
  },
  de: {
    nav: {
      home: 'Start',
      work: 'Arbeit',
      gallery: 'Galerie',
      about: 'Über',
      contact: 'Kontakt'
    },
    gallery: {
      title: 'Generative Visuals',
      subtitle: 'KI-gestützte Bildexperimente',
      description: 'Ein Raum, in dem KI zum kreativen Werkzeug wird, nicht zur Abkürzung. Jedes Visual ist bewusst geprompted, kuratiert und gestaltet, um die Grenzen des Designs zu erweitern. Hier treffen Mode, Technologie und Vorstellungskraft aufeinander.',
      images: [
        { src: '/images/gallery/image1.png', label: 'Bild 01' },
        { src: '/images/gallery/image2.png', label: 'Bild 02' },
        { src: '/images/gallery/image3.png', label: 'Bild 03' },
        { src: '/images/gallery/image4.png', label: 'Bild 04' },
        { src: '/images/gallery/image5.png', label: 'Bild 05' },
        { src: '/images/gallery/image6.png', label: 'Bild 06' },
      ]
    },
    home: {
      headline: "KI ist nur so gut wie die Person dahinter",
      subheadline: "Ich bin UX/UI & Generative-AI-Designerin mit Wurzeln in Mode und UX. Starke Designdirektion ist das, was KI-generiert von KI-eleviert trennt. Genau in dieser Lücke arbeite ich.",
      cta: 'Projekte Ansehen'
    },
    work: {
      backButton: '← Zurück zu Projekten',
      skills: ['Figma', 'Prototyping', 'Nutzerforschung']
    },
    about: {
      title: 'Design-Philosophie',
      description: 'Meine Designphilosophie verbindet Ästhetik mit Funktionalität sowie künstliche Intelligenz mit menschlicher Intuition. Ich gestalte digitale Produkte, die nicht nur gut aussehen, sondern sich auch natürlich anfühlen. Jedes Pixel, das ich setze, ist bewusst gewählt, denn die Zukunft des Designs gehört denen, die den Mut haben, über den Bildschirm hinaus zu denken.',
      skills: ['Strategie', 'Interaktion', 'Visuell', 'Forschung'],
      skillLabel: 'Kernfokus',
      tools: ['Figma', 'HTML', 'CSS', 'JavaScript', 'React', 'Adobe XD', 'Claude', 'GitHub', 'Canva', 'Webflow', 'Midjourney'],
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
          BrandPackaging: "Da Palmi für emotionale Unterstützung konzipiert ist, sollte die Verpackung in erster Linie Kinder ansprechen. Sie wirkt ruhig, freundlich und nicht technisch, sodass das Kind sich bereits vor dem Öffnen des Produkts sicher und geborgen fühlt.",
          purposeOfData: "Because Palmi is designed for emotional support, the packaging should speak to children first. It's calm, friendly, and non-technical, helping the child feel safe even before opening the product.",
          metrics: [
            { value: '70mm', label: 'Kompakte Größe' },
            { value: '2', label: 'Interaktionszustände' },
            { value: '3', label: 'KI-Erkennungsebenen' }
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
          screen1: "/images/palmi/screen1.png",
          screen2: "/images/palmi/screen2.png",
          screen3: "/images/palmi/screen3.png",
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
          process1: "/images/synkro/process1.6.png",
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
        title: "Soziale Medien",
        category: "Grafikdesign",
        year: "2024",
        description: "Produkt-Post-Design",
        color: "#F59E0B",
        content: {
          challenge: "Sich in überfüllten Social-Media-Feeds abzuheben erfordert auffällige Designs, die den Produktwert sofort kommunizieren.",
          solution: "Strategische visuelle Designs, die Ästhetik mit klarer Botschaft verbinden, um Engagement und Conversions zu steigern.",
          quote: "Großartiges Design ist unsichtbar – bis es dich dazu bringt, mit dem Scrollen aufzuhören..",
          designObjective: "Um die Social-Media-Wirkung zu maximieren: Scroll-stoppende Visuals erstellen, Wert sofort kommunizieren und messbares Engagement fördern.",
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
          hero: "/images/social-media/hero1.2.png",
          process1: "/images/social-media/process1.2.png",
          process2: "/images/social-media/process2.png",
          process3: "/images/social-media/process3.png",
          process4: "/images/social-media/process4.1.png",
          processWide: "/images/social-media/process-wide1.png",
          detail1: "/images/social-media/detail1.3.png",
          detail2: "/images/social-media/detail2.4.png",
          portrait: "/images/social-media/portrait1.mp4",
          solution: "/images/social-media/solution.png",
          screen1: "/images/social-media/screen1.png",
          screen2: "/images/social-media/screen2.png",
          screen3: "/images/social-media/screen3.png",
          screen4: "/images/social-media/screen41.mp4",
          final: "/images/social-media/final.png"
        }
      },
      {
        id: 4,
        title: "Particle Self",
        category: "Creative Coding",
        year: "2025",
        description: "Interaktive Partikelinstallation",
        color: "#10B981",
        content: {
          challenge: "Artificial Impression ist ein bewegungsbasiertes Partikelsystem, das menschliche Präsenz in dynamisches visuelles Verhalten verwandelt. Anstatt den Körper als statisches Bild zu spiegeln, rekonstruiert das System ihn als Bewegung. Mit Live-Kameraeingabe in TouchDesigner wirken Schatten und Gesten als Kräfte, die ein Partikelfeld in Echtzeit stören und umformen. Der Körper wird zum Wind. Präsenz wird zu Daten. Bewegung wird zur Transformation.",
          solution: "Das Projekt untersucht, wie sich Identität verändert, wenn sie in ein computergestütztes System übersetzt wird. Statt Repräsentation steht Transformation im Mittelpunkt. Der Betrachter sieht sich nicht selbst — er aktiviert eine reaktive Umgebung. Das Kunstwerk verhält sich wie ein lebendiges System: Es reagiert, es entwickelt sich, es löst sich auf, es reformiert sich. Präsenz wird zur Mitautorschaft.",
          quote: "Der Körper wird zum Wind. Präsenz wird zu Daten. Bewegung wird zur Transformation.",
          deviceObjective: "Das System integriert Echtzeit-Kameraeingabe, Bewegungs- und Silhouettenerkennung, GPU-gesteuerte Partikelsimulation, Kraftmodulation durch Geste und Distanz sowie Rückkopplungsschleifen, die temporäres Gedächtnis erzeugen. Durch schattenbasierte Interaktion wird der Körper zur Schnittstelle. Feine Variationen in Geschwindigkeit und Nähe erzeugen Turbulenzen, Drift oder Dichteveränderungen im Partikelfeld.",
          purposeOfData: "Ursprünglich als Wandprojektion entwickelt, schafft die Arbeit eine immersive Umgebung, in der physische Bewegung digitale Materie direkt formt. Die Installation operiert zwischen zwei Räumen: Physisch (Körper, Projektion, Schatten) und Digital (System, Berechnung, Partikellogik).",
          metrics: [
            { value: 'Echtzeit', label: 'Kameraeingabe' },
            { value: 'GPU', label: 'Partikelsimulation' },
            { value: 'Live', label: 'Kraftmodulation' }
          ],
          features: [
            {
              title: "Bewegungs- & Silhouettenerkennung",
              description: "Live-Kameraeingabe erfasst Schatten und Gesten und übersetzt körperliche Präsenz in computergestützte Kräfte, die das Partikelfeld in Echtzeit stören und umformen."
            },
            {
              title: "GPU-gesteuerte Partikelsimulation",
              description: "Tausende von Partikeln reagieren auf Körperbewegungen durch Kraftmodulation — Geschwindigkeit und Nähe erzeugen Turbulenzen, Drift oder Dichteveränderungen im Feld."
            },
            {
              title: "Temporäres Gedächtnis",
              description: "Rückkopplungsschleifen erzeugen temporäres Gedächtnis im System, sodass Spuren vergangener Bewegungen noch lange nach dem Weiterziehen des Körpers nachklingen und sich weiterentwickeln."
            }
          ]
        },
        images: {
          hero: "/images/particle/hero.png",
          process1: "/images/particle/process1.2.png",
          process2: "/images/particle/process3.png",
          process3: "/images/particle/process4.png",
          process4: "/images/particle/process5.png",
          processWide: "/images/particle/process-wide.png",
          detail1: "/images/particle/detail1.1.png",
          detail2: "/images/particle/detail2.1.png",
          portrait: "/images/particle/portrait3.mp4",
          solution: "/images/particle/solution.png",
          screen1: "/images/particle/screen1.png",
          screen2: "/images/particle/screen2.png",
          screen3: "/images/particle/screen3.png",
          screen4: "/images/particle/screen4.png",
          final: "/images/particle/final1.mp4"
        }
      }
    ]
  }
};

function GalleryFlipRow({ images }) {
  // images[0..2] = front, images[3..5] = back
  const [flipped, setFlipped] = useState([false, false, false]);
  const cycleRef = useRef(null);

  const runCycle = () => {
    const delays = [0, 600, 1200];
    const unflipDelays = [2800, 3400, 4000];
    delays.forEach((d, i) => {
      cycleRef.current = setTimeout(() => {
        setFlipped(prev => { const n = [...prev]; n[i] = true; return n; });
      }, d);
    });
    unflipDelays.forEach((d, i) => {
      cycleRef.current = setTimeout(() => {
        setFlipped(prev => { const n = [...prev]; n[i] = false; return n; });
      }, d);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => { runCycle(); }, 5500);
    runCycle();
    return () => { clearInterval(interval); };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <FlipCard key={i} front={images[i]} back={images[i + 3]} flipped={flipped[i]} />
        ))}
      </div>
    </div>
  );
}

function FlipCard({ front, back, flipped }) {
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);
  const [frontError, setFrontError] = useState(false);
  const [backError, setBackError] = useState(false);

  const cardStyle = {
    width: "340px",
    height: "220px",
    borderRadius: "16px",
    overflow: "hidden",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    position: "absolute",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(255,255,255,0.04)",
  };

  const placeholder = (img) => (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1.5px dashed rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", fontFamily: '"Space Mono", monospace', letterSpacing: "0.1em", textTransform: "uppercase" }}>{img.label}</span>
    </div>
  );

  return (
    <div style={{
      width: "340px", height: "220px",
      perspective: "1000px",
      WebkitPerspective: "1000px",
      isolation: "isolate",
      flexShrink: 0,
    }}>
      <div style={{
        position: "relative",
        width: "100%", height: "100%",
        transformStyle: "preserve-3d",
        transition: "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
        transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)",
      }}>
        {/* Front */}
        <div style={{
          ...cardStyle,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 30px -8px rgba(0,0,0,0.7)",
        }}>
          {!frontError ? (
            <img src={front.src} alt={front.label}
              onLoad={() => setFrontLoaded(true)} onError={() => setFrontError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: frontLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
          ) : placeholder(front)}
        </div>

        {/* Back */}
        <div style={{
          ...cardStyle,
          transform: "rotateX(180deg)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 30px -8px rgba(0,0,0,0.7)",
        }}>
          {!backError ? (
            <img src={back.src} alt={back.label}
              onLoad={() => setBackLoaded(true)} onError={() => setBackError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: backLoaded ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
          ) : placeholder(back)}
        </div>
      </div>
    </div>
  );
}

function IDCard({ emailLabel, linkedinLabel, active, onFlipDone }) {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-flip to back then return to front when contact section opens
  useEffect(() => {
    if (!active) return;
    const t1 = setTimeout(() => setFlipped(true), 800);
    const t2 = setTimeout(() => setFlipped(false), 2400);
    const t3 = setTimeout(() => { if (onFlipDone) onFlipDone(); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active]);
  const copyEmail = (e) => { e.stopPropagation(); navigator.clipboard.writeText('dianaxstudio@gmail.com'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const W = 500, H = 300;

  const face = (extra = {}) => ({
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    MozBackfaceVisibility: 'hidden',
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(255,255,255,0)',
    borderRadius: '20px',
    boxShadow: 'none',
    overflow: 'hidden',
    display: 'flex',
    willChange: 'transform',
    WebkitTransform: 'translateZ(0)',
    transform: 'translateZ(0)',
    ...extra,
    // Always override any blur passed via extra — backdropFilter inside
    // preserve-3d breaks on Safari iOS, use solid backgrounds instead
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  });

  return (
    <div
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      style={{
        width: W, height: H, margin: '0 auto',
        perspective: '1200px',
        WebkitPerspective: '1200px',
        cursor: 'default',
      }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d',
        transition: 'transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1)',
        WebkitTransition: '-webkit-transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        WebkitTransform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>

        {/* FRONT */}
        <div style={face({ border: '1px solid rgba(255,255,255,0.15)', flexDirection: 'column' })}>

          {/* Accent bar at very top — z-index above photo */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, rgba(255,255,255,0.65), transparent)', zIndex: 10 }} />

          {/* Landscape photo top ~55% */}
          <div style={{ height: '165px', flexShrink: 0, position: 'relative', overflow: 'hidden', background: '#0a0a14' }}>
            <img
              src="/images/profile.jpg"
              alt="Diana"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.cssText += ';background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center';
                e.currentTarget.parentElement.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:6px"><div style="font-size:3rem">&#128105;&#8205;&#128187;</div><div style="font-size:0.5rem;color:rgba(255,255,255,0.3);font-family:monospace;letter-spacing:0.1em">PHOTO</div></div>';
              }}
            />
            {/* Fade bottom of photo into card */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(10,10,20,0.9), transparent)', pointerEvents: 'none' }} />
            {/* Portfolio label — pushed below 4px accent bar */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace' }}>Portfolio · ID</div>
          </div>

          {/* Info strip bottom */}
          <div style={{ flex: 1, padding: '0.55rem 1.2rem 0.6rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', background: 'rgba(15,15,28,0.82)' }}>
            {/* Name + occupation */}
            <div style={{ flexShrink: 0 }}>
              <h3 style={{ fontSize: '1.35rem', color: '#ffffff', margin: '0 0 0.12rem 0', fontWeight: 900, fontFamily: '"Archivo Black", sans-serif', lineHeight: 1 }}>Diana</h3>
              <p style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.6)', margin: 0, fontFamily: '"Inter", sans-serif' }}>UX/UI & Generative AI Designer</p>
            </div>
            {/* Vertical divider */}
            <div style={{ width: '1px', alignSelf: 'stretch', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
            {/* 7 skill tags wrapping into 2 rows */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.22rem', flex: 1, alignContent: 'center' }}>
              {['Design', 'AI', 'Coding', 'Interaction', 'Creative Tech', 'UX Research', 'Prototyping', 'Prompt Engineering'].map(h => (
                <span key={h} style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', fontFamily: '"Space Mono", monospace', whiteSpace: 'nowrap' }}>{h}</span>
              ))}
            </div>
          </div>
        </div>

        {/* BACK */}
        <div style={face({
          border: '1px solid rgba(255,255,255,0.15)',
          transform: 'rotateY(180deg) translateZ(0)',
          WebkitTransform: 'rotateY(180deg) translateZ(0)',
          flexDirection: 'column',
          padding: '1.2rem 1.6rem',
          justifyContent: 'space-between',
          background: 'rgba(15,15,28,0.82)',
        })}>
          {/* Accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, rgba(255,255,255,0.65), transparent)', zIndex: 10 }} />

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.2rem' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace' }}>Contact Info</div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.3rem 0' }} />

          {/* Resume-style rows: icon left, text right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', flex: 1, justifyContent: 'center' }}>
            {[
              { icon: '✉', label: emailLabel,    value: 'dianaxstudio@gmail.com', href: 'mailto:dianaxstudio@gmail.com', copy: true },
              { icon: 'in', label: linkedinLabel, value: 'linkedin.com/in/dianaxstudio',  href: 'https://linkedin.com/in/dianaxstudio' },
              { icon: 'pin', label: 'Location', value: 'Brandenburg, Germany', href: null, labelOffset: '1.7rem' },
            ].map((item) => (
              <div key={item.label}
                onClick={(e) => { e.stopPropagation(); if (item.href) window.open(item.href, '_blank'); }}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', padding: '0.55rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: item.href ? 'pointer' : 'default', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (item.href) { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.transform = 'translateX(4px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Icon */}
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontFamily: '"Space Mono", monospace', fontWeight: 700 }}>
                  {item.icon === 'pin'
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 0 1 14 0c0 5-7 12.5-7 12.5z"/><circle cx="12" cy="8.5" r="2.5"/></svg>
                    : item.icon}
                </div>
                {/* Label + value */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.08rem' }}>
                  <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginLeft: item.labelOffset || '0' }}>{item.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#ffffff', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>{item.value}</div>
                </div>
                {/* Copy button for email, arrow for others */}
                {item.copy
                  ? <button onClick={copyEmail} style={{ marginLeft: 'auto', flexShrink: 0, background: copied ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '0.2rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', transition: 'all 0.2s' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)', fontFamily: '"Space Mono", monospace' }}>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  : item.href && <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>→</div>
                }
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


export default function DesignerPortfolio() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const finalVideoRef = useRef(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const contentRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);
  const dragMovedRef = useRef(false);
  const [activeSection, setActiveSection] = useState('home');
  const [legalPage, setLegalPage] = useState(null); // 'impressum' | 'datenschutz' | null
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
  const [activeToolCategory, setActiveToolCategory] = useState(0);
  const [toolsTransitioning, setToolsTransitioning] = useState(false);
  const [toolPage, setToolPage] = useState(0);
  const [toolPageVisible, setToolPageVisible] = useState(true);
  const targetMousePosition = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [frequencyData, setFrequencyData] = useState(new Array(32).fill(0));
  const [visibleSections, setVisibleSections] = useState({});
  const [orionOpen, setOrionOpen] = useState(false);
  const [orionBubble, setOrionBubble] = useState(false);
  const orionGreeting = {
    en: "Hi! I'm Orion, Diana's assistant. How can I help you today?",
    de: "Hallo! Ich bin Orion, Dianas Assistent. Wie kann ich dir heute helfen?"
  };
  const [orionMessages, setOrionMessages] = useState([
    { role: 'assistant', text: orionGreeting['en'] }
  ]);
  const [orionInput, setOrionInput] = useState('');
  const [orionUsedQuestions, setOrionUsedQuestions] = useState([]);
  const [orionLoading, setOrionLoading] = useState(false);
  const orionBottomRef = useRef(null);

  // ─── Viewport scale normalisation ───────────────────────────────────────────
  // Your design reference width (the laptop you designed on).
  // Change this number to match YOUR laptop's screen width in pixels.
  const DESIGN_WIDTH = 1440;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Ensure correct viewport meta
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'viewport'; document.head.appendChild(meta); }
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

    // Lock root font-size so rem units are always 16px
    document.documentElement.style.fontSize = '16px';
    document.documentElement.style.webkitTextSizeAdjust = '100%';
    document.documentElement.style.textSizeAdjust = '100%';

    const updateScale = () => {
      const s = window.innerWidth / DESIGN_WIDTH;
      setScale(s);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);
  // ────────────────────────────────────────────────────────────────────────────

  // Get current translations
  const t = translations[language];

  // Orion: scroll to bottom on new messages
  useEffect(() => {
    if (orionBottomRef.current) orionBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [orionMessages, orionLoading]);

  // Orion: reset chat when language changes
  useEffect(() => {
    setOrionMessages([{ role: 'assistant', text: orionGreeting[language] }]);
    setOrionInput('');
    setOrionUsedQuestions([]);
  }, [language]);

  // Orion: close panel when leaving contact section
  useEffect(() => {
    if (activeSection !== 'contact') { setOrionOpen(false); setOrionBubble(false); }
  }, [activeSection]);

  // Orion: pre-written responses (no API/hosting needed)
  const orionResponses = {
    en: [
      {
        keys: ['collaborat', 'project', 'work together', 'partner', 'team up', 'freelance'],
        reply: "Diana is always open to meaningful collaborations! Whether it's a brand, startup, or creative project, she brings her full energy and expertise to the table.\n\nThe best way to start is by reaching out at dianaxstudio@gmail.com — share a bit about your project and she'll get back to you."
      },
      {
        keys: ['contact', 'details', 'email', 'reach', 'get in touch', 'linkedin', 'how to contact'],
        reply: "Here's how to reach Diana:\n\n📧 dianaxstudio@gmail.com\n🔗 linkedin.com/in/dianaxstudio\n\nShe typically responds within 1–2 business days. Don't hesitate to reach out!"
      },
      {
        keys: ['work', 'process', 'design', 'question', 'how does she', 'approach', 'method'],
        reply: "Diana's process blends research, intuition, and generative AI tools to create purposeful design. She typically starts with understanding the brief deeply, then moves into exploration, prototyping, and refinement.\n\nIf you have a specific question about her work or process, feel free to email her at dianaxstudio@gmail.com!"
      },
      {
        keys: ['job', 'opportunit', 'hire', 'recruit', 'position', 'role', 'full-time', 'part-time'],
        reply: "Diana is open to exciting job opportunities — especially roles at the intersection of UX/UI design and Generative AI.\n\nFeel free to reach out with details about the role at dianaxstudio@gmail.com or connect on LinkedIn at linkedin.com/in/dianaxstudio."
      },
      {
        keys: ['hello', 'hi ', 'hey', 'hola', 'good morning', 'good evening'],
        reply: "Hey there! Great to connect. Is there something specific I can help you with today?"
      },
      {
        keys: ['thank', 'thanks', 'great', 'awesome', 'perfect', 'cool'],
        reply: "You're welcome! Feel free to reach out to Diana directly at dianaxstudio@gmail.com — she'd love to hear from you. 😊"
      },
    ],
    de: [
      {
        keys: ['zusammenarbeit', 'projekt', 'zusammenarbeiten', 'partner', 'freelance'],
        reply: "Diana ist immer offen für bedeutungsvolle Kooperationen! Egal ob Marke, Startup oder Kreativprojekt — sie bringt ihre volle Energie und Expertise ein.\n\nAm besten meldest du dich unter dianaxstudio@gmail.com — erzähl ihr etwas über dein Projekt und sie meldet sich bei dir."
      },
      {
        keys: ['kontakt', 'details', 'email', 'erreichen', 'linkedin', 'wie kontaktiere'],
        reply: "So erreichst du Diana:\n\n📧 dianaxstudio@gmail.com\n🔗 linkedin.com/in/dianaxstudio\n\nSie antwortet in der Regel innerhalb von 1–2 Werktagen. Zögere nicht, dich zu melden!"
      },
      {
        keys: ['arbeit', 'prozess', 'design', 'frage', 'wie macht sie', 'ansatz', 'methode'],
        reply: "Dianas Prozess verbindet Recherche, Intuition und generative KI-Tools, um zweckmäßiges Design zu schaffen. Sie beginnt damit, den Auftrag tiefgehend zu verstehen, und geht dann in Exploration, Prototyping und Verfeinerung über.\n\nBei spezifischen Fragen zu ihrer Arbeit schreib ihr gerne unter dianaxstudio@gmail.com!"
      },
      {
        keys: ['job', 'stelle', 'einstellen', 'rekrutieren', 'position', 'vollzeit', 'teilzeit'],
        reply: "Diana ist offen für spannende Jobangebote — besonders für Rollen an der Schnittstelle von UX/UI-Design und Generativer KI.\n\nMelde dich gerne mit Details zur Stelle unter dianaxstudio@gmail.com oder vernetze dich auf LinkedIn: linkedin.com/in/dianaxstudio."
      },
      {
        keys: ['hallo', 'hi ', 'hey', 'guten morgen', 'guten abend', 'servus'],
        reply: "Hallo! Schön, dass du hier bist. Womit kann ich dir heute helfen?"
      },
      {
        keys: ['danke', 'super', 'toll', 'perfekt', 'cool', 'klasse'],
        reply: "Gern geschehen! Du kannst Diana direkt unter dianaxstudio@gmail.com erreichen — sie freut sich auf deine Nachricht. 😊"
      },
    ]
  };

  const getOrionReply = (input, lang) => {
    const lower = input.toLowerCase();
    const responses = orionResponses[lang] || orionResponses['en'];
    for (const item of responses) {
      if (item.keys.some(k => lower.includes(k))) return item.reply;
    }
    return lang === 'de'
      ? "Ich bin mir nicht sicher, ob ich das beantworten kann — aber du kannst Diana direkt unter dianaxstudio@gmail.com kontaktieren. Sie hilft dir gerne weiter!"
      : "I'm not sure about that, but you can reach Diana directly at dianaxstudio@gmail.com — she'll be happy to help!";
  };

  const sendOrionMessage = () => {
    const text = orionInput.trim();
    if (!text || orionLoading) return;
    setOrionInput('');
    setOrionMessages(prev => [...prev, { role: 'user', text }]);
    setOrionLoading(true);
    setTimeout(() => {
      const reply = getOrionReply(text, language);
      setOrionMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setOrionLoading(false);
    }, 600 + Math.random() * 400);
  };

  // Stable gallery images — same paths in both languages, defined once to avoid remounting
  const galleryImages = useRef(translations.en.gallery.images).current;

  // IntersectionObserver for scroll-triggered section animations
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-scroll-id');
            if (id) {
              setVisibleSections(prev => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-scroll-id]').forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [selectedProject, activeSection]);

  // Reset visible sections when project or section changes
  useEffect(() => {
    setVisibleSections({});
    if (!selectedProject) {
      setIsHovering(false);
      setHoveredProjectId(null);
    }
  }, [selectedProject, activeSection]);

  // Auto-rotate tools every 3 seconds on about page
  useEffect(() => {
    if (activeSection !== 'about') return;
    const interval = setInterval(() => {
      setToolPageVisible(false);
      setTimeout(() => {
        setToolPage(prev => prev + 1);
        setToolPageVisible(true);
      }, 420);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSection]);

  // Returns inline style for scroll-triggered entrance based on project id
  const scrollReveal = (id, projectId, extraStyle = {}) => {
    const visible = visibleSections[id];

    // No project context (about / contact pages) — just fade in
    if (!projectId) {
      return {
        transition: `opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(30px)',
        ...extraStyle
      };
    }

    // Stagger delay based on section number within the page
    const sNum = parseInt(id.replace('s', ''), 10) || 0;
    const stagger = `${(sNum % 4) * 0.07}s`;

    const transitions = {
      1: `opacity 0.75s ease ${stagger}, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${stagger}`,       // Palmi: smooth slide up
      2: `opacity 0.75s ease ${stagger}, transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) ${stagger}`,   // Synkro: springy from right
      3: `opacity 0.6s ease ${stagger}, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${stagger}`,         // Social: scale pop
      4: `opacity 0.9s ease ${stagger}, transform 0.9s ease ${stagger}, filter 0.9s ease ${stagger}`,      // Particle Self: slow blur drift
    };

    const base = {
      transition: transitions[projectId] || transitions[1],
      ...extraStyle
    };

    if (visible) {
      return { ...base, opacity: 1, transform: 'none', filter: 'none' };
    }

    if (projectId === 1) {
      // Palmi: slides up cleanly
      return { ...base, opacity: 0, transform: 'translateY(55px)' };
    } else if (projectId === 2) {
      // Synkro: springs in from the right with slight overshoot
      return { ...base, opacity: 0, transform: 'translateX(70px)' };
    } else if (projectId === 3) {
      // Social Media: scales up from center with fade
      return { ...base, opacity: 0, transform: 'scale(0.85) translateY(20px)' };
    } else {
      // Particle Self: drifts up through a blur — cinematic
      return { ...base, opacity: 0, filter: 'blur(14px)', transform: 'translateY(30px)' };
    }
  };

  // Nebula galaxy background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = DESIGN_WIDTH;
    let height = Math.round(DESIGN_WIDTH / (window.innerWidth / window.innerHeight));

    const resizeCanvas = () => {
      width = DESIGN_WIDTH;
      height = Math.round(DESIGN_WIDTH / (window.innerWidth / window.innerHeight));
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

  // Carousel rotation stored in a ref — avoids React re-renders on every frame
  const carouselRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotationRef = useRef(0);

  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  // Apply rotation directly to DOM — no setState, no re-render, no flicker
  const applyCarouselRotation = (deg) => {
    carouselRotationRef.current = deg;
    if (carouselAnimationRef.current) {
      const t = `rotateY(${deg}deg) translateZ(0)`;
      carouselAnimationRef.current.style.transform = t;
      carouselAnimationRef.current.style.webkitTransform = t;
    }
  };

  // Carousel auto-rotation — bypasses React state entirely
  useEffect(() => {
    if (activeSection === 'work' && !selectedProject && !isDragging && !isHovering) {
      let animationId;
      const rotationSpeed = 360 / 30000;
      let lastTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        const next = (carouselRotationRef.current + deltaTime * rotationSpeed) % 360;
        applyCarouselRotation(next);
        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
      return () => { if (animationId) cancelAnimationFrame(animationId); };
    }
  }, [activeSection, selectedProject, isDragging, isHovering]);

  // Carousel drag — also bypasses React state for smooth dragging
  useEffect(() => {
    if (activeSection === 'work' && !selectedProject) {
      const handleMouseMove = (e) => {
        if (isDraggingRef.current) {
          const deltaX = e.clientX - dragStartXRef.current;
          if (Math.abs(deltaX) > 4) dragMovedRef.current = true;
          let newRotation = (dragStartRotationRef.current + deltaX * 0.5) % 360;
          if (newRotation < 0) newRotation += 360;
          applyCarouselRotation(newRotation);
        }
      };

      const handleMouseUp = () => {
        if (isDraggingRef.current) {
          setIsDragging(false);
          setDragStartRotation(carouselRotationRef.current);
          dragStartRotationRef.current = carouselRotationRef.current;
        }
      };

      if (isDragging) {
        dragStartXRef.current = dragStartX;
        dragStartRotationRef.current = dragStartRotation;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStartX, dragStartRotation, activeSection, selectedProject]);

  // Handle wheel scroll for section navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (selectedProject) return;
      if (isScrolling) return;

      // Ignore tiny inertia/momentum scroll events from Safari macOS trackpad
      if (Math.abs(e.deltaY) < 10) return;

      e.preventDefault();
      
      const sections = ['home', 'work', 'gallery', 'about', 'contact'];
      const currentIndex = sections.indexOf(activeSection);
      
      if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        setIsScrolling(true);
        setActiveSection(sections[currentIndex + 1]);
        setSelectedProject(null);
        setTimeout(() => setIsScrolling(false), 1200);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setIsScrolling(true);
        setActiveSection(sections[currentIndex - 1]);
        setSelectedProject(null);
        setTimeout(() => setIsScrolling(false), 1200);
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


  // Orion bubble chime — soft minimal two-tone using Web Audio API
  const playOrionChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = audioContextRef.current || new AudioContext();

      const now = ctx.currentTime;

      // Two soft sine tones: a gentle rising interval (C5 → E5)
      const notes = [523.25, 659.25];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        // Soft attack, quick fade — barely noticeable
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.55);
      });
    } catch (e) {
      // Fail silently — audio is non-essential
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
    { id: 'gallery', label: t.nav.gallery },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      // Scale the entire app from the top-left corner so it always looks
      // identical to your reference laptop regardless of screen size.
      width: `${DESIGN_WIDTH}px`,
      height: `${DESIGN_WIDTH / (window.innerWidth / window.innerHeight)}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      fontFamily: '"Space Mono", "Courier New", monospace'
    }}>
      {/* Splash Fluid Cursor */}
      <SplashCursor />

      <audio
        ref={audioRef}
        src="/background2.mp3"
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
            position: 'relative',
            textAlign: 'center',
            padding: '3rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            border: '2px solid rgba(255,255,255,0.3)',
            width: '420px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Music icon — top left corner */}
            <div style={{
              position: 'absolute',
              top: '1.6rem',
              left: '1.8rem',
              fontSize: '2.5rem',
              animation: 'pulse 2s ease-in-out infinite',
              opacity: 0.7,
            }}>🎵</div>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              color: '#ffffff',
              marginBottom: '0.8rem',
              fontFamily: '"Archivo Black", sans-serif',
              margin: '0 0 0.8rem 0',
            }}>
              Click to Start
            </h2>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: '"Inter", sans-serif',
              margin: 0,
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
        className="hide-scrollbar"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 'clamp(2rem, 4vw, 3rem)',
          paddingTop: 'clamp(5rem, 10vh, 7rem)',
          paddingBottom: 'clamp(3rem, 6vh, 5rem)',
          paddingRight: 'clamp(5rem, 8vw, 7rem)',
          paddingLeft: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        {activeSection === 'home' && (
          <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '900px',
            opacity: 0,
            animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 4.2rem)',
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
                if (char === ' ' && index === t.home.headline.indexOf("Who") - 1) {
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
              maxWidth: '780px',
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
            WebkitPerspective: '2000px',
            isolation: 'isolate',
            cursor: isDragging ? 'grabbing' : 'grab',
            paddingBottom: '3rem'
          }}
          onMouseDown={(e) => {
            dragMovedRef.current = false;
            setIsDragging(true);
            setDragStartX(e.clientX);
            setDragStartRotation(carouselRotation);
            setShowDragGuide(false);
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
                WebkitTransformStyle: 'preserve-3d',
                transform: `rotateY(0deg) translateZ(0)`,
                WebkitTransform: `rotateY(0deg) translateZ(0)`,
                transition: isDragging ? 'none' : 'none',
                willChange: 'transform',
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
                        if (!dragMovedRef.current) {
                          setSelectedProject(project);
                        }
                      }}
                      onMouseDown={(e) => {
                        dragMovedRef.current = false;
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border = `2px solid ${project.color}`;
                        e.currentTarget.style.boxShadow = `0 20px 80px rgba(0,0,0,0.5), 0 0 60px ${project.color}80, 0 0 100px ${project.color}40`;
                        e.currentTarget.style.transform = 'scale(1.05)';
                        setIsHovering(true);
                        setHoveredProjectId(project.id);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.15)';
                        e.currentTarget.style.boxShadow = '0 10px 50px rgba(0,0,0,0.2)';
                        e.currentTarget.style.transform = 'scale(1)';
                        setIsHovering(false);
                        setHoveredProjectId(null);
                      }}
                      style={{
                        background: 'rgba(15,15,28,0.78)',
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
                      {/* Hero image overlay — fades in on hover */}
                      {project.images?.hero && (
                        <div style={{
                          position: 'absolute',
                          top: 0, left: 0, right: 0, bottom: 0,
                          backgroundImage: `url(${project.images.hero})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          borderRadius: '20px',
                          opacity: hoveredProjectId === project.id ? 1 : 0,
                          transition: 'opacity 0.4s ease',
                          zIndex: 0,
                        }} />
                      )}
                      {/* Dark gradient overlay so text stays readable */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: hoveredProjectId === project.id
                          ? 'linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3) 100%)'
                          : 'none',
                        borderRadius: '20px',
                        opacity: hoveredProjectId === project.id ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                        zIndex: 1,
                        pointerEvents: 'none',
                      }} />
                      {/* Card content — sits above hero image overlay */}
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: `linear-gradient(90deg, ${project.color}, transparent)`, borderRadius: '20px 20px 0 0', zIndex: 2 }} />

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
                        fontFamily: '"Archivo Black", sans-serif',
                        zIndex: 2
                      }}>
                        {index + 1}
                      </div>

                      <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        fontFamily: '"Space Mono", monospace',
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
                        fontFamily: '"Inter", sans-serif',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {project.description}
                      </p>
                      </div>

                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '100px',
                        background: `linear-gradient(to top, ${project.color}15, transparent)`,
                        pointerEvents: 'none',
                        borderRadius: '0 0 20px 20px',
                        zIndex: 2,
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
                    {(selectedProject.id === 1
                      ? ['Figma', 'Prototyping', 'User Research', 'Artificial Intelligence']
                      : selectedProject.id === 2
                        ? ['Figma', 'Prototyping', 'User Research', 'Adobe']
                        : selectedProject.id === 3
                          ? ['Figma', 'Prototyping', 'User Research', 'Adobe', 'Canva']
                          : ['Coding', 'Research', 'TouchDesigner', 'Artificial Intelligence']
                    ).map((skill) => (
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

              {/* Section 1: Full-width text */}
              <div
                data-scroll-id="s1"
                style={{ marginBottom: '4rem', ...scrollReveal('s1', selectedProject.id) }}
              >
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontFamily: '"Archivo Black", sans-serif',
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>
                  {selectedProject.id === 4 ? 'Concept' : 'The Challenge'}
                </h2>
                {selectedProject.id === 4 ? (
                  <div style={{ maxWidth: '900px' }}>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', marginBottom: '1.2rem' }}>
                      The project explores how identity shifts when translated into a computational system. Rather than representation, the work focuses on transformation. The viewer does not see themselves — they activate a responsive environment.
                    </p>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', marginBottom: '0.8rem' }}>
                      The artwork behaves as a living system:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem', paddingLeft: '0.5rem' }}>
                      {['It reacts', 'It evolves', 'It dissolves', 'It reforms'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', fontFamily: '"Inter", sans-serif' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selectedProject.color, flexShrink: 0 }} />
                          {item}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', fontStyle: 'italic' }}>
                      Presence becomes co-authorship.
                    </p>
                  </div>
                ) : (
                  <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.8,
                    fontFamily: '"Inter", sans-serif',
                    maxWidth: '900px'
                  }}>
                    {selectedProject.content?.challenge || "Many children experience emotions they cannot yet put into words, while parents often rely on behavior alone to understand how their child feels. Research from the World Health Organization and the Centers for Disease Control and Prevention shows that 70% of children under 10 struggle to name complex emotions, creating a widespread emotional gap."}
                  </p>
                )}
                
                {/* Loading bar statistic - Only for Palmi */}
                {selectedProject.id === 1 && (
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
                )}
              </div>

              {/* Section 2: Process 1 - Large full-width image (16:10) */}
              <div
                data-scroll-id="s2"
                style={{
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

                ...scrollReveal('s2', selectedProject.id),
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

              {/* Discovery Section - Only for Synkro, after Process 1 */}
              {selectedProject.id === 2 && selectedProject.content?.discovery && (
                <div
                  data-scroll-id="s3"
                  style={{
                  marginBottom: '4rem',

                  ...scrollReveal('s3', selectedProject.id),
                }}>
                  <h2 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    marginBottom: '1.5rem',
                    lineHeight: 1.2
                  }}>
                    Discovery
                  </h2>
                  <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                    color: 'rgba(255,255,255,0.75)',
                    lineHeight: 1.8,
                    fontFamily: '"Inter", sans-serif',
                    maxWidth: '900px'
                  }}>
                    {selectedProject.content.discovery}
                  </p>
                </div>
              )}

              {/* Before Define Image - Only for Synkro (1920x1080) */}
              {selectedProject.id === 2 && selectedProject.images?.beforeDefine && (
                <div
                  data-scroll-id="s4"
                  style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}10, ${selectedProject.color}30)`,
                  borderRadius: '20px',
                  border: `1px solid ${selectedProject.color}50`,
                  marginBottom: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',

                  ...scrollReveal('s4', selectedProject.id),
                  backgroundImage: `url(${selectedProject.images.beforeDefine})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                </div>
              )}
              
              {/* Section 3: Device Objective / Design Approach / Define Text */}
              {(selectedProject.content?.designApproach || selectedProject.content?.deviceObjective) && (
                <div
                  data-scroll-id="s5"
                  style={{
                  marginBottom: '4rem',

                  ...scrollReveal('s5', selectedProject.id),
                }}>
                  <h2 style={{
                    fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontFamily: '"Archivo Black", sans-serif',
                    marginBottom: '1.2rem',
                    lineHeight: 1.2
                  }}>
                    {selectedProject.content?.designApproach
                      ? 'Design Approach'
                      : selectedProject.id === 2
                        ? 'Define'
                        : selectedProject.id === 3
                          ? 'Design Objective'
                          : selectedProject.id === 4
                            ? 'Process'
                            : 'Device Objective'}
                  </h2>
                  {selectedProject.id === 4 ? (
                    <div style={{ maxWidth: '900px' }}>
                      <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontFamily: '"Inter", sans-serif', marginBottom: '0.8rem' }}>
                        The system integrates:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem', paddingLeft: '0.5rem' }}>
                        {[
                          'Real-time camera input',
                          'Motion and silhouette detection',
                          'GPU-driven particle simulation',
                          'Force modulation through gesture and distance',
                          'Feedback loops generating temporal memory'
                        ].map(item => (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: 'rgba(255,255,255,0.75)', fontFamily: '"Inter", sans-serif' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selectedProject.color, flexShrink: 0 }} />
                            {item}
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontFamily: '"Inter", sans-serif' }}>
                        Through shadow-based interaction, the body becomes an interface. Subtle variations in speed and proximity produce turbulence, drift, or density shifts within the particle field.
                      </p>
                    </div>
                  ) : (
                    <p style={{
                      fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.7,
                      fontFamily: '"Inter", sans-serif',
                      maxWidth: '900px'
                    }}>
                      {selectedProject.content?.designApproach || selectedProject.content?.deviceObjective || "To bridge this emotional gap: any solution must allow children to express feelings, offer guidance in the moment, and track emotion patterns."}
                    </p>
                  )}
                </div>
              )}

              {/* Section 2b: Process 2, 3, 4 - Three images in a row (4:3) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '4rem'
              }}>
                {[2, 3, 4].map((num) => (
                  <div key={num}
                    data-scroll-id="s6"
                    style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    background: `linear-gradient(${45 + num * 60}deg, ${selectedProject.color}35, ${selectedProject.color}10)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    ...scrollReveal('s6', selectedProject.id),
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

              {/* Section 3b: Full width process image */}
              <div
                data-scroll-id="s7"
                style={{
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

                ...scrollReveal('s7', selectedProject.id),
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
                  <div key={num}
                    data-scroll-id="s8"
                    style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    background: `linear-gradient(${num === 1 ? '45deg' : '225deg'}, ${selectedProject.color}40, ${selectedProject.color}15)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    ...scrollReveal('s8', selectedProject.id),
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

              {/* Section 4a: Before Portrait Image - Only for Synkro (1366x812) */}
              {selectedProject.id === 2 && selectedProject.images?.beforePortrait && (
                <div
                  data-scroll-id="s9"
                  style={{
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '0 auto 4rem',

                  ...scrollReveal('s9', selectedProject.id),
                }}>
                  <div style={{
                    width: '100%',
                    aspectRatio: '1366/812',
                    background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}10, ${selectedProject.color}30)`,
                    borderRadius: '20px',
                    border: `1px solid ${selectedProject.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundImage: `url(${selectedProject.images.beforePortrait})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
                  </div>
                </div>
              )}

              {/* Section 4b: Single portrait image / video */}
              <div
                data-scroll-id="s10"
                style={{
                maxWidth: '600px',
                margin: '0 auto 4rem',

                ...scrollReveal('s10', selectedProject.id),
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: selectedProject.id === 2 ? '1366/2116' : '3/4',
                  background: `linear-gradient(180deg, ${selectedProject.color}40, ${selectedProject.color}15)`,
                  borderRadius: '20px',
                  border: `1px solid ${selectedProject.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  // ─── For social media (id=3) and Particle Self (id=4), use video not backgroundImage ───
                  backgroundImage: (selectedProject.id !== 3 && selectedProject.id !== 4) && selectedProject.images?.portrait ? `url(${selectedProject.images.portrait})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative'
                }}>
                  {/* Social media (id=3) and Particle Self (id=4) use <video> for portrait */}
                  {(selectedProject.id === 3 || selectedProject.id === 4) && selectedProject.images?.portrait ? (
                    <video
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={selectedProject.images.portrait} type="video/mp4" />
                    </video>
                  ) : !selectedProject.images?.portrait && (
                    <div style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: 'rgba(255,255,255,0.15)',
                      fontWeight: 900,
                      fontFamily: '"Archivo Black", sans-serif',
                      textAlign: 'center',
                      padding: '2rem'
                    }}>
                      Portrait Image<br/>
                      <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
                        {selectedProject.id === 2 ? '1366x2116px' : '3:4 Aspect Ratio'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Two wide images before Design section - Only for Synkro */}
              {selectedProject.id === 2 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                  marginBottom: '4rem'
                }}>
                  <div
                    data-scroll-id="s11"
                    style={{
                    width: '100%',
                    aspectRatio: '1366/812',
                    background: `linear-gradient(90deg, ${selectedProject.color}25, ${selectedProject.color}10)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',

                    ...scrollReveal('s11', selectedProject.id),
                    backgroundImage: selectedProject.images?.beforeDesign1 ? `url(${selectedProject.images.beforeDesign1})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
                    {!selectedProject.images?.beforeDesign1 && (
                      <div style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center'
                      }}>
                        Wide Image 1<br/>
                        <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>1366x812px</span>
                      </div>
                    )}
                  </div> 

                  <div
                    data-scroll-id="s12"
                    style={{
                    width: '100%',
                    aspectRatio: '1366/812',
                    background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}15)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',

                    ...scrollReveal('s12', selectedProject.id),
                    backgroundImage: selectedProject.images?.beforeDesign2 ? `url(${selectedProject.images.beforeDesign2})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
                    {!selectedProject.images?.beforeDesign2 && (
                      <div style={{
                        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center'
                      }}>
                        Wide Image 2<br/>
                        <span style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1rem)' }}>1366x812px</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Final Mockup - Only for Synkro (1366x2171) */}
              {selectedProject.id === 2 && (
                <div
                  data-scroll-id="s13"
                  style={{
                  maxWidth: '800px',
                  margin: '0 auto 4rem',

                  ...scrollReveal('s13', selectedProject.id),
                }}>
                  <div style={{
                    width: '100%',
                    aspectRatio: '1366/2171',
                    background: `linear-gradient(180deg, ${selectedProject.color}35, ${selectedProject.color}10)`,
                    borderRadius: '20px',
                    border: `1px solid ${selectedProject.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    backgroundImage: selectedProject.images?.finalMockup ? `url(${selectedProject.images.finalMockup})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}>
                    {!selectedProject.images?.finalMockup && (
                      <div style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center',
                        padding: '2rem'
                      }}>
                        Final Mockup<br/>
                        <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>1366x2171px</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Section - Only for Synkro (1366x768) */}
              {selectedProject.id === 2 && (
                <div
                  data-scroll-id="s14"
                  style={{
                  width: '100%',
                  maxWidth: '1200px',
                  margin: '0 auto 4rem',

                  ...scrollReveal('s14', selectedProject.id),
                }}>
                  <div style={{
                    width: '100%',
                    aspectRatio: '1366/768',
                    background: `linear-gradient(135deg, ${selectedProject.color}30, ${selectedProject.color}10)`,
                    borderRadius: '20px',
                    border: `1px solid ${selectedProject.color}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {selectedProject.images?.demoVideo ? (
                      <video
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={selectedProject.images.demoVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center',
                        padding: '2rem'
                      }}>
                        Demo Video<br/>
                        <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>1366x768px MP4</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 5: Image + Text (reversed layout) */}
              <div
                data-scroll-id="s15"
                style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'center',
                marginBottom: '4rem',

                ...scrollReveal('s15', selectedProject.id),
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
                    {selectedProject.id === 2 ? 'Design' : selectedProject.id === 4 ? 'The System' : 'The Solution'}
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
              <div
                data-scroll-id="s16"
                style={{
                background: `linear-gradient(135deg, ${selectedProject.color}15, ${selectedProject.color}05)`,
                border: `2px solid ${selectedProject.color}40`,
                borderRadius: '20px',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                marginBottom: '4rem',
                textAlign: 'center',

                ...scrollReveal('s16', selectedProject.id),
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
                  <div key={index}
                    data-scroll-id="s17"
                    style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '2rem',

                    ...scrollReveal('s17', selectedProject.id),
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
                  <div key={num}
                    data-scroll-id="s18"
                    style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    background: `linear-gradient(${num * 90}deg, ${selectedProject.color}35, ${selectedProject.color}10)`,
                    borderRadius: '16px',
                    border: `1px solid ${selectedProject.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',

                    ...scrollReveal('s18', selectedProject.id),
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

              {/* Section 8b: Screen 4 - Portrait style
                  For non-Synkro projects: image, EXCEPT social media (id=3) which uses video */}
              {selectedProject.id !== 2 && (
                <div
                  data-scroll-id="s19"
                  style={{
                  maxWidth: '600px',
                  margin: '0 auto 4rem',

                  ...scrollReveal('s19', selectedProject.id),
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
                    // ─── CHANGE 2: For social media project (id=3), don't use backgroundImage ───
                    backgroundImage: selectedProject.id !== 3 && selectedProject.images?.screen4 ? `url(${selectedProject.images.screen4})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative'
                  }}>
                    {/* Social media project uses <video> for screen4 */}
                    {selectedProject.id === 3 && selectedProject.images?.screen4 ? (
                      <video
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={selectedProject.images.screen4} type="video/mp4" />
                      </video>
                    ) : !selectedProject.images?.screen4 && (
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
              )}

              {/* Screen 4 Video - Only for Synkro (3:4 Portrait) */}
              {selectedProject.id === 2 && (
                <div
                  data-scroll-id="s20"
                  style={{
                  maxWidth: '600px',
                  margin: '0 auto 4rem',

                  ...scrollReveal('s20', selectedProject.id),
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
                    position: 'relative'
                  }}>
                    {selectedProject.images?.screen4Video ? (
                      <video
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={selectedProject.images.screen4Video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        color: 'rgba(255,255,255,0.15)',
                        fontWeight: 900,
                        fontFamily: '"Archivo Black", sans-serif',
                        textAlign: 'center',
                        padding: '2rem'
                      }}>
                        Screen 4 Video<br/>
                        <span style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>3:4 Portrait MP4</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 8c: Before Purpose Image - Only for Palmi (1920x1080) */}
              {selectedProject.id === 1 && selectedProject.images?.beforePurpose && (
                <div
                  data-scroll-id="s21"
                  style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}10, ${selectedProject.color}30)`,
                  borderRadius: '20px',
                  border: `1px solid ${selectedProject.color}50`,
                  marginBottom: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',

                  ...scrollReveal('s21', selectedProject.id),
                  backgroundImage: `url(${selectedProject.images.beforePurpose})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                </div>
              )}

              {/* Before Final Image - Only for Palmi (1920x1080) */}
              {selectedProject.id === 1 && selectedProject.images?.beforeFinal && (
                <div
                  data-scroll-id="s22"
                  style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: `linear-gradient(90deg, ${selectedProject.color}30, ${selectedProject.color}10, ${selectedProject.color}30)`,
                  borderRadius: '20px',
                  border: `1px solid ${selectedProject.color}50`,
                  marginBottom: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',

                  ...scrollReveal('s22', selectedProject.id),
                  backgroundImage: `url(${selectedProject.images.beforeFinal})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}>
                </div>
              )}

              {/* Section 10: Results/Outcomes */}
              <div
                data-scroll-id="s23"
                style={{
                marginBottom: '4rem',

                ...scrollReveal('s23', selectedProject.id),
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontFamily: '"Archivo Black", sans-serif',
                  marginBottom: '1.5rem',
                  lineHeight: 1.2
                }}>
                  {selectedProject.id === 1 ? 'Brand Packaging' : selectedProject.id === 4 ? 'Installation' : 'Purpose of the Data'}
                </h2>
                {selectedProject.id === 4 ? (
                  <div style={{ maxWidth: '900px', marginBottom: '2rem' }}>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', marginBottom: '1.2rem' }}>
                      Originally developed as a wall projection, the work creates an immersive environment where physical movement directly shapes digital matter.
                    </p>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: '"Inter", sans-serif', marginBottom: '0.8rem' }}>
                      The installation operates between two spaces:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                      {['Physical (body, projection, shadow)', 'Digital (system, computation, particle logic)'].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.75)', fontFamily: '"Inter", sans-serif' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: selectedProject.color, flexShrink: 0 }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )}
                
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
              <div
                data-scroll-id="s24"
                style={{
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

                ...scrollReveal('s24', selectedProject.id),
                backgroundImage: selectedProject.id !== 4 && selectedProject.images?.final ? `url(${selectedProject.images.final})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
              }}>
                {selectedProject.id === 4 && selectedProject.images?.final ? (
                  <video
                    ref={finalVideoRef}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    controls
                    playsInline
                    onPlay={() => {
                      if (audioRef.current && !audioRef.current.paused) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      }
                    }}
                    onPause={() => {
                      if (audioRef.current && !isPlaying) {
                        initializeAudioAnalyzer();
                        audioRef.current.play().then(() => {
                          setIsPlaying(true);
                        }).catch(() => {});
                      }
                    }}
                    onEnded={() => {
                      if (audioRef.current && !isPlaying) {
                        initializeAudioAnalyzer();
                        audioRef.current.play().then(() => {
                          setIsPlaying(true);
                        }).catch(() => {});
                      }
                    }}
                  >
                    <source src={selectedProject.images.final} type="video/mp4" />
                  </video>
                ) : !selectedProject.images?.final && (
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
              <div
                data-scroll-id="s25"
                style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '2rem',
                paddingBottom: '4rem',

                ...scrollReveal('s25', selectedProject.id),
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
          <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: '1rem', paddingBottom: '2rem', marginTop: '0rem' }}>
          <div
            data-scroll-id="s26"
            style={{
            maxWidth: '700px',
            width: '100%',
            textAlign: 'center',
            ...scrollReveal('s26', selectedProject?.id),
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 7vw, 4rem)',
              color: '#ffffff',
              margin: '0 0 1rem 0',
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
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              fontFamily: '"Inter", sans-serif'
            }}>
              {t.about.description}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '0.8rem',
              marginTop: '1.2rem'
            }}>
              {t.about.skills.map((skill, i) => (
                <div key={skill}
                  data-scroll-id="s27"
                  style={{
                  ...scrollReveal('s27', selectedProject?.id),
                }}>
                  <div style={{
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    fontFamily: '"Archivo Black", sans-serif'
                  }}>
                    {skill}
                  </div>
                </div>
              ))}
            </div>

            {/* Software Tools Section — single row, auto-rotates every 3s */}
            <div
              data-scroll-id="s28"
              style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              ...scrollReveal('s28', selectedProject?.id),
            }}>
              <h3 style={{
                fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '1rem',
                fontFamily: '"Space Mono", monospace'
              }}>
                {t.about.toolsLabel}
              </h3>
              {(() => {
                const allTools = t.about.tools;
                const pageSize = 5;
                const totalPages = Math.ceil(allTools.length / pageSize);
                const pageIdx = toolPage % totalPages;
                const currentTools = allTools.slice(pageIdx * pageSize, pageIdx * pageSize + pageSize);
                return (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '0.9rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '50px',
                    overflow: 'hidden',
                    opacity: toolPageVisible ? 1 : 0,
                    transform: toolPageVisible ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  }}>
                    {currentTools.map((tool, i) => (
                      <div
                        key={`${pageIdx}-${tool}`}
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
                          cursor: 'default',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                          transition: 'background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
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
                );
              })()}
            </div>
          </div>
          </div>
        )}

        {activeSection === 'gallery' && (
          <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: '3rem', paddingBottom: '2rem' }}>
            <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', padding: '0 1rem' }}>
              {/* Header */}
              <div
                data-scroll-id="s40"
                style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '0', ...scrollReveal('s40', null) }}
              >
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 7vw, 4rem)',
                  color: '#ffffff',
                  margin: '0 0 0.5rem 0',
                  fontWeight: 900,
                  fontFamily: '"Archivo Black", sans-serif',
                  lineHeight: 1.1
                }}>
                  {t.gallery.title.split('').map((char, index) => (
                    char === ' ' ? <span key={index}> </span> : (
                      <span
                        key={index}
                        style={{ display: 'inline-block', transition: 'text-shadow 0.2s ease', cursor: 'pointer' }}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left - rect.width / 2;
                          const y = e.clientY - rect.top - rect.height / 2;
                          e.currentTarget.style.textShadow = `${x * 0.15}px ${y * 0.15}px 25px rgba(255,255,255,0.8)`;
                        }}
                        onMouseLeave={(e) => { e.currentTarget.style.textShadow = 'none'; }}
                      >
                        {char}
                      </span>
                    )
                  ))}
                </h2>
                <p style={{
                  fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.7,
                  maxWidth: '600px',
                  margin: '0.40rem auto 2rem auto',
                  fontFamily: '"Inter", sans-serif',
                }}>
                  {t.gallery.description}
                </p>
              </div>

              {/* Flip Row + Subtitle */}
              <div data-scroll-id="s41" style={{ ...scrollReveal('s41', null) }}>
                <p style={{
                  fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 400,
                  textAlign: 'center',
                  marginBottom: '1.2rem',
                  marginTop: '0',
                }}>
                  {t.gallery.subtitle}
                </p>
                <GalleryFlipRow images={galleryImages} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', paddingTop: '1rem', paddingBottom: '2rem', paddingRight: '1rem' }}>
          <div
            data-scroll-id="s30"
            style={{
            textAlign: 'center',
            maxWidth: '600px',
            width: '100%',
            ...scrollReveal('s30', selectedProject?.id),
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 7vw, 4rem)',
              color: '#ffffff',
              margin: '0 0 1.5rem 0',
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

            {/* ID Card Flip */}
            <IDCard emailLabel={t.contact.email} linkedinLabel={t.contact.linkedin} active={activeSection === 'contact'} onFlipDone={() => { setOrionBubble(true); playOrionChime(); setTimeout(() => setOrionBubble(false), 5000); }} />
          </div>
          </div>
        )}
      </div>

      {/* ── ORION AI ASSISTANT (contact section only) ── */}
      {activeSection === 'contact' && (
        <>
        {/* Orion speech bubble */}
        {orionBubble && !orionOpen && (
          <div onClick={() => { setOrionBubble(false); setOrionOpen(true); }} style={{
            position: 'fixed', bottom: '2.25rem', right: '5.5rem',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '14px 14px 4px 14px',
            padding: '0.75rem 1rem',
            maxWidth: '220px',
            cursor: 'pointer',
            animation: 'fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)', fontFamily: '"Inter", sans-serif', lineHeight: 1.5 }}>
              {language === 'de'
                ? "Interesse an einer Zusammenarbeit mit Diana? Ich bin hier, um zu helfen 😊"
                : "Interested in collaborating with Diana? I'm here to help 😊"}
            </p>
          </div>
        )}

        <button
        onClick={() => setOrionOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          zIndex: 9999,
          width: '48px', height: '48px', borderRadius: '50%',
          background: orionOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
          border: `1px solid ${orionOpen ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)'}`,
          backdropFilter: 'blur(20px)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: orionOpen ? 'none' : '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(255,255,255,0.05)',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          outline: 'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = orionOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
        title="Ask Orion"
      >
        {orionOpen
          ? <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontFamily: '"Space Mono",monospace' }}>✕</span>
          : <span style={{ fontSize: '1.1rem', color: '#ffffff' }}>✦</span>}
      </button>

      {/* Chat panel */}
      {orionOpen && (
        <div style={{
          position: 'fixed', bottom: '5.5rem', right: '2rem',
          zIndex: 9998,
          width: '340px',
          height: 'min(540px, calc(100vh - 8rem))',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.2rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            flexShrink: 0,
          }}>
            {/* Orion avatar */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', flexShrink: 0,
              backdropFilter: 'blur(20px)',
            }}>✦</div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', fontFamily: '"Archivo Black", sans-serif', lineHeight: 1 }}>ORION</div>
              <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', fontFamily: '"Space Mono", monospace', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.15rem' }}>{language === 'de' ? "Dianas KI-Assistent" : "Diana's AI Assistant"}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)', boxShadow: '0 0 6px rgba(255,255,255,0.4)' }} />
              <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.35)', fontFamily: '"Space Mono",monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{language === 'de' ? 'aktiv' : 'online'}</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
            scrollbarWidth: 'none',
            minHeight: 0,
          }}>
            {orionMessages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: '0.5rem',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', flexShrink: 0, color: '#fff' }}>✦</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: msg.role === 'user'
                    ? 'rgba(255,255,255,0.15)'
                    : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: '0.78rem',
                  color: msg.role === 'user' ? '#ffffff' : 'rgba(255,255,255,0.82)',
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.55,
                  backdropFilter: 'blur(10px)',
                }}>
                  {msg.text.split('\n\n').map((para, pi) => (
                    <p key={pi} style={{ margin: pi > 0 ? '0.6rem 0 0' : 0 }}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
            {orionLoading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', flexShrink: 0, color: '#fff' }}>✦</div>
                <div style={{ padding: '0.6rem 0.85rem', borderRadius: '14px 14px 14px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.6)', animation: `orionDot 1.2s ease-in-out ${d * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={orionBottomRef} />
          </div>

          {/* Suggested questions */}
          {orionMessages.length > 0 && orionMessages[orionMessages.length - 1].role === 'assistant' && !orionLoading && (
            <div style={{ padding: '0 1rem 0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', flexShrink: 0 }}>
              {(language === 'de'
                ? ["Ich möchte mit Diana zusammenarbeiten.", "Ich hätte gerne ihre Kontaktdaten.", "Ich habe eine Frage zu ihrer Arbeit.", "Ich melde mich wegen einer Stelle."]
                : ["I'm interested in collaborating with Diana.", "I'd like her contact details.", "I have a question about her work or process.", "I'm reaching out about a job opportunity."]
              ).filter(q => !orionUsedQuestions.includes(q)).map(q => (
                <button key={q} onClick={() => { setOrionUsedQuestions(prev => [...prev, q]); setOrionInput(q); setTimeout(() => { const text = q.trim(); if (!text) return; setOrionInput(''); setOrionMessages(prev => [...prev, { role: 'user', text }]); setOrionLoading(true); setTimeout(() => { const reply = getOrionReply(text, language); setOrionMessages(prev => [...prev, { role: 'assistant', text: reply }]); setOrionLoading(false); }, 600 + Math.random() * 400); }, 0); }} style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '50px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.05em',
                  cursor: 'pointer', outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                >{q}</button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '0.5rem', alignItems: 'center',
            flexShrink: 0,
            minHeight: '60px',
            boxSizing: 'border-box',
            width: '100%',
          }}>
            <input
              value={orionInput}
              onChange={e => setOrionInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendOrionMessage(); }}
              placeholder={language === 'de' ? "Frag über Diana…" : "Ask about Diana…"}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px',
                padding: '0.55rem 1rem',
                fontSize: '0.78rem', color: '#ffffff',
                fontFamily: '"Inter", sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />
            <button
              onClick={sendOrionMessage}
              disabled={orionLoading || !orionInput.trim()}
              style={{
                width: '34px',
                height: '34px',
                minWidth: '34px',
                borderRadius: '50%',
                flexShrink: 0,
                background: orionInput.trim() ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: orionInput.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                outline: 'none',
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'sans-serif',
              }}
            >➤</button>
          </div>
        </div>
      )}
      </>
      )}

      {/* ── Footer ── */}
      {!legalPage && (
        <div style={{
          position: 'fixed',
          bottom: '1.2rem',
          left: '1.5rem',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          opacity: 0.2,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.2'}
        >
          <button
            onClick={() => setLegalPage('impressum')}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.55rem', fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.06em',
              cursor: 'pointer', pointerEvents: 'all',
              transition: 'color 0.2s',
              padding: 0,
            }}
          >Impressum</button>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.5rem' }}>·</span>
          <button
            onClick={() => setLegalPage('datenschutz')}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.55rem', fontFamily: '"Inter", sans-serif',
              letterSpacing: '0.06em',
              cursor: 'pointer', pointerEvents: 'all',
              transition: 'color 0.2s',
              padding: 0,
            }}
          >Datenschutz</button>
        </div>
      )}

      {/* ── Legal Pages Overlay ── */}
      {legalPage && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(5,5,15,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          overflowY: 'auto',
          animation: 'fadeIn 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4rem 2rem 6rem',
        }}>
          {/* Back button */}
          <button
            onClick={() => setLegalPage(null)}
            style={{
              alignSelf: 'flex-start',
              maxWidth: '680px',
              width: '100%',
              margin: '0 auto 2rem',
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.75rem', fontFamily: '"Space Mono", monospace',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >← Zurück</button>

          <div style={{
            maxWidth: '680px', width: '100%',
            color: 'rgba(255,255,255,0.8)',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.8,
          }}>
            {legalPage === 'impressum' && (
              <>
                <h1 style={{ fontSize: '2rem', fontFamily: '"Archivo Black", sans-serif', color: '#fff', marginBottom: '2rem' }}>Impressum</h1>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '2rem' }}>Angaben gemäß § 5 TMG</p>

                <section style={{ marginBottom: '2rem' }}>
                  <p>Diana Melody Garcia<br />
                  Französische Straße 20<br />
                  14467 Potsdam<br />
                  Deutschland</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Kontakt</h2>
                  <p>E-Mail: <a href="mailto:dianaxstudio@gmail.com" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>dianaxstudio@gmail.com</a></p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                  <p>Diana Melody Garcia<br />
                  Französische Straße 20<br />
                  14467 Potsdam</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Haftung für Inhalte</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird keine Gewähr übernommen.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Urheberrecht</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
                </section>
              </>
            )}

            {legalPage === 'datenschutz' && (
              <>
                <h1 style={{ fontSize: '2rem', fontFamily: '"Archivo Black", sans-serif', color: '#fff', marginBottom: '2rem' }}>Datenschutzerklärung</h1>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '2rem' }}>Datenschutz auf einen Blick</p>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Verantwortlicher</h2>
                  <p>Diana Melody Garcia<br />
                  Französische Straße 20<br />
                  14467 Potsdam<br />
                  E-Mail: <a href="mailto:dianaxstudio@gmail.com" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>dianaxstudio@gmail.com</a></p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Erhebung und Verarbeitung personenbezogener Daten</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Diese Website erhebt und verarbeitet personenbezogene Daten nur im technisch notwendigen Umfang.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Kontaktaufnahme per E-Mail</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben zur Bearbeitung der Anfrage gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Google Fonts</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Diese Seite nutzt Google Fonts. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Beim Aufruf dieser Seite lädt Ihr Browser Schriftarten direkt von Google-Servern. Dabei wird Ihre IP-Adresse übermittelt. Grundlage ist Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)' }}>policies.google.com/privacy</a></p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Space Mono", monospace', marginBottom: '0.75rem' }}>Ihre Rechte</h2>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer gespeicherten Daten sowie das Recht auf Datenübertragbarkeit. Anfragen richten Sie bitte an: <a href="mailto:dianaxstudio@gmail.com" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>dianaxstudio@gmail.com</a></p>
                </section>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          font-size: 16px !important;
          -webkit-text-size-adjust: 100% !important;
          text-size-adjust: 100% !important;
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

        @keyframes orionDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        body {
          overflow: hidden !important;
          position: fixed;
          width: 100%;
          height: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
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
