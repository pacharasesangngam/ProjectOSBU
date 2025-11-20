import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} style={{ paddingTop: '200px', paddingBottom: '120px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="container">
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
                        margin: '0 auto 3rem',
                        y: yText
                    }}
                >
                    Visualize Operating System resource allocation in real-time.
                    Detect safe states and prevent system deadlocks efficiently.
                </motion.p>
            </div>
        </section>
    );
};

export default Hero;
