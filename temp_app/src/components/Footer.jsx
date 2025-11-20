import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Footer = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Normal letters stay in place
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "0%"]);

    // T, H, M lift up as you scroll down, return to normal as you scroll up
    const yOffset = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-15%", "0%"]);

    const text = "ALGORITHM";
    const specialChars = ['T', 'H', 'M'];

    return (
        <footer ref={ref} style={{
            padding: '8rem 0',
            textAlign: 'center',
            marginTop: '6rem',
            borderTop: '1px solid var(--glass-border)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div className="container">
                <motion.h2
                    style={{
                        fontSize: 'clamp(8rem, 20vw, 16rem)',
                        fontWeight: 600,
                        color: '#000000',
                        letterSpacing: '-0.05em',
                        margin: 0,
                        textTransform: 'uppercase',
                        lineHeight: 0.9,
                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                        display: 'inline-block'
                    }}
                >
                    {text.split('').map((char, index) => (
                        <motion.span
                            key={index}
                            style={{
                                display: 'inline-block',
                                y: specialChars.includes(char) ? yOffset : y
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.h2>
            </div>
        </footer>
    );
};

export default Footer;
