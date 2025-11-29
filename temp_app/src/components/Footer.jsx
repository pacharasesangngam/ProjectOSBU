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

    // Special characters lift up more as you scroll down
    const yOffset = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-17%", "0%"]);

    const text = "Banker's Algorithm";
    const specialChars = ['B', 'k', 'r', 'A', 't','h','l', 'm'];

    const members = [
        { id: '1660703347', name: 'กฤติกานจ์ บุญมี', number: '23' },
        { id: '1660703545', name: 'อรรยมน พลันสังเกตุ', number: '25' },
        { id: '1660705870', name: 'พัชรวัฒน์ อินทรผล', number: '33' },
        { id: '1660706126', name: 'พชร เสสังงาม', number: '34' },
        { id: '1660706159', name: 'ทวีชัย จันทะภา', number: '35' }
    ];

    return (
        <footer ref={ref} style={{
            padding: '4rem 0 6rem',
            marginTop: '4rem',
            borderTop: '1px solid var(--glass-border)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div className="container">
                {/* Members Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '4rem',
                    marginBottom: '6rem',
                    margin: '0 auto 7rem',
                    padding: '0 2rem'
                }}>
                    {/* Left: Members Title */}
                    <div>
                        <h3 style={{
                            alignItems: 'flex-start',
                            fontSize: 'clamp(2rem, 3vw, 3rem)',
                            fontWeight: 600,
                            margin: 0,
                            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
                        }}>
                            Members
                        </h3>
                    </div>

                    {/* Right: Member List */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        flexDirection: 'column',
                        gap: '1rem',
                        textAlign: 'right',
                    }}>
                        {members.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    fontSize: 'clamp(0.9rem, 1vw, 1.1rem)',
                                    fontFamily: "Prompt",
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <span style={{ fontWeight: 500, minWidth: '110px' }}>{member.id}</span>
                                <span style={{ flex: 1 }}>{member.name}</span>
                                <span style={{ fontWeight: 600, minWidth: '30px', textAlign: 'right' }}>{member.number}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Animated Title */}
                <div style={{ textAlign: 'center' }}>
                    <motion.h2
                        style={{
                            fontSize: 'clamp(3.5rem, 10vw, 10rem)',
                            fontWeight: 600,
                            letterSpacing: '-0.05em',
                            margin: 0,
                            lineHeight: 1.2,
                            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                            display: 'inline-block',
                        }}
                    >
                        {text.split('').map((char, index) => (
                            <motion.span
                                key={index}
                                className="gradient-text"
                                style={{
                                    display: 'inline-block',
                                    y: specialChars.includes(char) ? yOffset : y
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.h2>
                </div>
            </div>
        </footer>
    );
};

export default Footer;