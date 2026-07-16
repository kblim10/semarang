"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { MousePointer2, Coffee, Camera, Compass } from 'lucide-react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

const AnimatedSection = ({ children, className, delay = 0, style }: AnimatedSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
      transition={{ 
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const timelineRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 75%"]
  });
  
  const smoothTimelineProgress = useSpring(timelineProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  const { scrollYProgress: globalScroll } = useScroll();
  const opacityHero = useTransform(globalScroll, [0, 0.1], [1, 0]);
  const yHero = useTransform(globalScroll, [0, 0.2], [0, 50]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ position: 'relative' }}>
      {/* Abstract Backgrounds */}
      <div 
        style={{
          position: 'fixed',
          top: '-20%', left: '-10%',
          width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(255,94,98,0.08) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          zIndex: -1,
          borderRadius: '50%'
        }}
      />
      <div 
        style={{
          position: 'fixed',
          bottom: '-20%', right: '-10%',
          width: '70vw', height: '70vw',
          background: 'radial-gradient(circle, rgba(255,153,102,0.05) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(80px)',
          zIndex: -1,
          borderRadius: '50%'
        }}
      />

      {/* Hero Section */}
      <motion.section 
        className="section-padding hero-section"
        style={{ 
          height: '100dvh',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          opacity: opacityHero,
          y: yHero,
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7rem', marginBottom: '2rem', padding: '0.7rem 1.5rem', borderRadius: '50px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
            <Compass size={18} color="var(--brand-secondary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Chapter Semarang</span>
          </div>
          <h1 className="gradient-text hero-title">
            Untuk Teman<br />Perjalanan.
          </h1>
          <p className="hero-desc" style={{ color: 'var(--text-light)' }}>
            Waktu berlalu lebih cepat kalau kita bersenang-senang. Ini adalah ruang kecil untuk merayakan pertemuan tak terduga, tawa lepas, dan cerita yang akan kita bawa pergi.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ position: 'absolute', bottom: '8vh', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', zIndex: 10 }}
        >
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7 }}>Scroll untuk mengenang</span>
          <MousePointer2 size={24} />
        </motion.div>
      </motion.section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="timeline-container">
        
        {/* Animated Line */}
        <div className="timeline-line-wrapper">
          <motion.div 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(to bottom, var(--brand-primary), var(--brand-secondary), var(--brand-accent))',
              scaleY: smoothTimelineProgress,
              transformOrigin: 'top',
              height: '100%',
              boxShadow: '0 0 15px rgba(255,153,102,0.5)'
            }} 
          />
        </div>

        <div className="timeline-items-wrapper">
          
          <AnimatedSection className="timeline-item">
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="timeline-dot"
              style={{ background: 'var(--brand-primary)', boxShadow: '0 0 0 6px var(--bg-color), 0 0 20px rgba(255,94,98,0.5)' }} 
            />
            <span style={{ display: 'inline-block', color: 'var(--brand-primary)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Awal Mula</span>
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Datang Berempat</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', lineHeight: 1.9, opacity: 0.9 }}>
              Semuanya bermula ketika kita berempat memutuskan menginjakkan kaki di Semarang. Modal cuma nekat dan minim pengalaman, tapi ekspektasi selangit. Kita sama sekali nggak punya bayangan kalau di kota ini kita bakal nemuin orang-orang se-frekuensi yang bikin betah.
            </p>
          </AnimatedSection>

          <AnimatedSection className="timeline-item">
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="timeline-dot"
              style={{ background: 'var(--brand-secondary)', boxShadow: '0 0 0 6px var(--bg-color), 0 0 20px rgba(255,153,102,0.5)' }} 
            />
            <span style={{ display: 'inline-block', color: 'var(--brand-secondary)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Titik Temu</span>
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Bertemu Satu Kawan</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', lineHeight: 1.9, opacity: 0.9 }}>
              Lalu, kebetulan (atau takdir?) mempertemukan kita dengan satu orang. Awalnya kelihatan kalem dan biasa saja, tapi ternyata dialah kunci pembuka gerbang kehebohan yang nggak pernah kita duga sebelumnya.
            </p>
          </AnimatedSection>

          <AnimatedSection className="timeline-item">
            <motion.div 
              whileHover={{ scale: 1.2 }}
              className="timeline-dot"
              style={{ background: 'var(--brand-accent)', boxShadow: '0 0 0 6px var(--bg-color), 0 0 20px rgba(255,184,140,0.5)' }} 
            />
            <span style={{ display: 'inline-block', color: 'var(--brand-accent)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.2em', marginBottom: '1rem', textTransform: 'uppercase' }}>Eskalasi</span>
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', color: 'var(--text-color)' }}>Dari Satu, Jadi Rombongan</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', lineHeight: 1.9, opacity: 0.9 }}>
              Dari satu orang itu, tiba-tiba muncul teman yang lain. Terus bawa teman lagi. Kita yang tadinya cuma grup kecil berempat, mendadak jadi satu rombongan sirkus yang hobi nongkrong sampai lupa waktu. Semarang jadi jauh lebih hangat gara-gara kehadiran kalian.
            </p>
          </AnimatedSection>

        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(255,255,255,0.02), rgba(0,0,0,0))' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Visualisasi Cerita</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Sisa-sisa memori yang sempat terekam lensa.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
            {[1, 2, 3, 4].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.03, rotate: i % 2 === 0 ? 2 : -2 }}
                className="glass"
                style={{ padding: '1.5rem', cursor: 'pointer', transition: 'box-shadow 0.3s' }}
              >
                <div style={{ width: '100%', height: '350px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <Camera size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                  <span style={{ fontSize: '1.1rem', letterSpacing: '0.1em' }}>Foto {item}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Message Card Section */}
      <section className="section-padding" style={{ display: 'flex', justifyContent: 'center' }}>
        <AnimatedSection>
          <motion.div 
            whileHover={{ boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
            className="glass message-card"
          >
            <div style={{ position: 'absolute', top: '-60px', left: '-40px', fontSize: '25rem', color: 'rgba(255,255,255,0.02)', fontFamily: 'var(--font-heading)', lineHeight: 1, zIndex: 0 }}>"</div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="gradient-text message-title">Terima Kasih & Maaf</h2>
              
              <div style={{ color: 'var(--text-light)', fontSize: '1.3rem', display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.9 }}>
                <p>Buat semua teman-teman di Semarang, <strong style={{ color: 'var(--text-color)' }}>Terima Kasih sebesar-besarnya!</strong></p>
                
                <p>Terima kasih udah mau nerima kita yang berempat ini masuk ke <i>circle</i> kalian. Terima kasih buat semua obrolan absurd tengah malam, tawa lepas yang bikin lupa beban, dan semua waktu luang yang kalian korbankan buat nemenin kita main.</p>
                
                <p>Dan yang nggak kalah penting, <strong style={{ color: 'var(--text-color)' }}>Maaf</strong>. Maaf banget kalau selama kita main bareng, ada salah omong, candaan yang kelewatan batas, wacana nongkrong yang nggak pernah kejadian, atau ngerepotin kalian dalam banyak hal.</p>
                
                <p>Hari ini kita berempat pamit dari Semarang. Jarak memang bakal menjauh, tapi pertemanan gila kita ini nggak akan berhenti cuma di sini.</p>
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer style={{ padding: '8rem 2rem 6rem 2rem', textAlign: 'center', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to top, rgba(255,94,98,0.03), rgba(0,0,0,0))' }}>
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ display: 'inline-block', marginBottom: '2.5rem' }}
        >
          <Coffee size={40} color="var(--brand-secondary)" />
        </motion.div>
        
        <h3 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-color)' }}>Bukan Selamat Tinggal...</h3>
        
        <p style={{ color: 'var(--text-light)', fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 4rem auto', lineHeight: 1.8 }}>
          ...tapi sampai jumpa lagi di lain waktu, di kedai kopi yang mungkin berbeda, tapi dengan obrolan yang sama serunya.
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ height: '1px', width: '40px', background: 'var(--brand-secondary)' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.8rem', color: 'var(--brand-accent)' }}>
            Dari kami berempat.
          </span>
          <div style={{ height: '1px', width: '40px', background: 'var(--brand-secondary)' }} />
        </div>
      </footer>
    </main>
  );
}
