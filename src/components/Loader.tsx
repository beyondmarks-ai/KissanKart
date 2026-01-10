import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const welcomeMessages = [
    { lang: 'English', text: 'Welcome', color: 'from-kisan-leaf to-emerald-600' },
    { lang: 'Hindi', text: 'स्वागत है', color: 'from-kisan-orange to-amber-600' },
    { lang: 'Spanish', text: 'Bienvenido', color: 'from-kisan-leaf to-green-600' },
    { lang: 'French', text: 'Bienvenue', color: 'from-orange-500 to-kisan-orange' },
    { lang: 'German', text: 'Willkommen', color: 'from-emerald-600 to-kisan-leaf' },
    { lang: 'Japanese', text: 'ようこそ', color: 'from-amber-600 to-kisan-orange' },
];

interface LoaderProps {
    onLoadingComplete: () => void;
}

export function Loader({ onLoadingComplete }: LoaderProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [videoKey] = useState(Date.now()); // Unique key to force video reload

    useEffect(() => {
        // Cycle through welcome messages
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % welcomeMessages.length);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const handleVideoEnd = () => {
        setTimeout(() => {
            onLoadingComplete();
        }, 500);
    };

    const currentMessage = welcomeMessages[currentMessageIndex];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Logo Animation Video */}
                <motion.div
                    className="relative w-full max-w-lg mb-12"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <video
                        key={videoKey}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        className="w-full h-auto"
                    >
                        <source src="/Logo_Animation_Handshake_and_Emblem_Formation.mp4" type="video/mp4" />
                    </video>
                </motion.div>

                {/* Animated Welcome Text */}
                <div className="relative h-20 flex items-center justify-center overflow-hidden mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentMessageIndex}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="absolute"
                        >
                            <h2
                                className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${currentMessage.color} bg-clip-text text-transparent`}
                            >
                                {currentMessage.text}
                            </h2>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Animated Line Loader */}
                <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-kisan-leaf via-kisan-orange to-kisan-leaf"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
