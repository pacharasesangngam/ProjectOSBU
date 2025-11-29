import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const dataStructures = [
    { name: 'Allocation', description: 'ทรัพยากรที่ได้รับแล้ว', color: '#3b82f6' },
    { name: 'Maximum', description: 'ทรัพยากรสูงสุดที่ต้องการ', color: '#8b5cf6' },
    { name: 'Available', description: 'ทรัพยากรที่เหลืออยู่', color: '#ec4899' },
    { name: 'Need', description: 'ทรัพยากรที่ต้องการเพิ่ม', color: '#a855f7' }
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? ref : null,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 1rem',
      }}
    >
      <motion.h1
        style={{
          fontSize: '4rem',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          y: yText,
          opacity: opacityText
        }}
      >
        Avoid Deadlocks <br />
        <span className="gradient-text">with Banker's Algorithm.</span>
      </motion.h1>
      <motion.p
        style={{
          fontSize: '1.25rem',
          color: 'var(--text-color)',
          opacity: 0.6,
          maxWidth: '600px',
          margin: 0,
          y: yText
        }}
      >
        Visualize Operating System resource allocation in real-time.
        Detect safe states and prevent system deadlocks efficiently.
      </motion.p>

       <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '1000px',
          width: '100%',
          y: yText,
          marginTop: '3rem',
        }}
      >
        {dataStructures.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            whileHover={{ 
              y: -5,
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            style={{
              border: '1px solid var(--glass-border)',
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              minWidth: '200px',
              flex: '1',
              maxWidth: '220px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {/* Gradient Accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${item.color}, transparent)`,
              }}
            />

            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: item.color,
                fontFamily: 'Inter, system-ui'
              }}
            >
              {item.name}
            </h3>
            
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-color)',
                opacity: 0.7,
                margin: 0,
                lineHeight: 1.5,
                fontFamily: 'Prompt, Inter, system-ui'
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Hero;
