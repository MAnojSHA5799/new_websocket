import React, { useState, useEffect, useRef } from "react";

const Animation = () => {
    const [socket, setSocket] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [waveHeight, setWaveHeight] = useState(30); 
    const waveRef = useRef(waveHeight);

    useEffect(() => { 
        const connectWebSocket = () => {
            const ws = new WebSocket("wss://new-websocket.onrender.com"); //  Updated WebSocket URL
    
            ws.onopen = () => console.log("Connected to WebSocket server");
    
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                waveRef.current = data.y;
            };
    
            ws.onclose = () => {
                console.log("WebSocket Disconnected. Reconnecting...");
                setTimeout(connectWebSocket, 3000);
            };
    
            setSocket(ws);
        };
    
        connectWebSocket();
    
        return () => socket?.close();
    }, []);
    

    useEffect(() => {
        let animationFrame;
        const animateWave = () => {
            setWaveHeight((prev) => prev + (waveRef.current - prev) * 0.1);
            animationFrame = requestAnimationFrame(animateWave);
        };

        if (isAnimating) {
            animationFrame = requestAnimationFrame(animateWave);
        }

        return () => cancelAnimationFrame(animationFrame);
    }, [isAnimating]);

    const startAnimation = () => {
        if (socket) {
            socket.send("Start");
            setIsAnimating(true);
            setShowAnimation(true);
        }
    };

    const stopAnimation = () => {
        if (socket) {
            socket.send("Stop");
            setIsAnimating(false);
            setTimeout(() => setShowAnimation(false), 500);
        }
    };

    return (
        <div style={styles.container}>
            {/*  Gradient Text "Apple Intelligence" */}
            <svg style={styles.textContainer} viewBox="0 0 600 100">
                <defs>
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="red">
                            <animate attributeName="stop-color" values="red; green; blue; red" dur="4s" repeatCount="indefinite"/>
                        </stop>
                        <stop offset="100%" stopColor="green">
                            <animate attributeName="stop-color" values="green; blue; red; green" dur="4s" repeatCount="indefinite"/>
                        </stop>
                    </linearGradient>
                </defs>
                <text x="50%" y="50%" textAnchor="middle" fontSize="50" fontWeight="bold" fill="url(#textGradient)">
                    Apple Intelligence
                </text>
            </svg>

            {/*  Wave Animation (Now Above) */}
            {showAnimation && (
                <div style={styles.waveContainer}>
                    <svg viewBox="0 0 1440 50" style={styles.wave}>
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="red">
                                    <animate attributeName="stop-color" values="red; blue; green; red" dur="4s" repeatCount="indefinite"/>
                                </stop>
                                <stop offset="100%" stopColor="blue">
                                    <animate attributeName="stop-color" values="blue; green; red; blue" dur="4s" repeatCount="indefinite"/>
                                </stop>
                            </linearGradient>
                        </defs>

                        {/* Layered Waves */}
                        <path 
                            fill="url(#waveGradient)" 
                            d={`M0,30 Q360,${waveHeight} 720,30 T1440,30 V50 H0 Z`} 
                            opacity="0.8"
                        />
                        <path 
                            fill="url(#waveGradient)" 
                            d={`M0,35 Q360,${waveHeight + 5} 720,35 T1440,35 V50 H0 Z`} 
                            opacity="0.5"
                        />
                        <path 
                            fill="url(#waveGradient)" 
                            d={`M0,40 Q360,${waveHeight + 10} 720,40 T1440,40 V50 H0 Z`} 
                            opacity="0.3"
                        />
                    </svg>
                </div>
            )}

            {/*  Buttons Below the Wave */}
            <div style={styles.buttonContainer}>
                <button onClick={startAnimation} style={styles.button}>Start</button>
                <button onClick={stopAnimation} style={styles.button}>Stop</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: "100vw",
        height: "100vh",
        padding: "0",
        margin: "0",
        backgroundColor: "#f8f9fa",
        position: "relative",
    },
    textContainer: {
        marginTop: "-10%",  
        width: "100%",
        height: "100px",
    },
    waveContainer: {
        position: "absolute",
        top: "-5%",
        left: "0",
        width: "100vw",
        height: "50px",
        overflow: "hidden",
        backgroundColor: "white",
    },
    wave: {
        width: "100%",
        height: "100%",
    },
    buttonContainer: {
        display: "flex",
        gap: "15px",
        position: "absolute",
        bottom: "10%",
    },
    button: {
        fontSize: "1rem",
        padding: "12px 24px",
        cursor: "pointer",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#007bff",
        color: "#fff",
        transition: "background 0.3s",
    },
};

export default Animation;
