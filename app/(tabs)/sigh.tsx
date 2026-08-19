import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import useStore from '@/store/zustand-store';

const Sigh = () => {
    const states = [
        { title: 'Breathe', duration: 5 },
        { title: '1 small breath in', duration: 2 },
        { title: 'Breathe Out', duration: 5 }
    ];


    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentCycle, setCurrentCycle] = useState(1);
    const [currentStateCount, setCurrentStateCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const { sighBreathingState, setSighBreathingState } = useStore();

    const runStep = (index: number, cycle: number) => {
        // Check if all cycles complete
        if (cycle > sighBreathingState) {
            setIsRunning(false);
            setCurrentIndex(0);
            setCurrentCycle(1);
            setCurrentStateCount(0);
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return;
        }

        // Check if current cycle complete
        if (index >= states.length) {
            // Move to next cycle
            setCurrentCycle(cycle + 1);
            // Start next cycle after 1 second pause
            clearInterval(intervalRef.current!);
            intervalRef.current = setTimeout(() => {
                runStep(0, cycle + 1);
            }, 1000) as any;
            return;
        }

        // Run current step
        setCurrentIndex(index);
        const duration = states[index].duration;
        setCurrentStateCount(duration);

        // Countdown timer
        let countdown = duration;
        const countdownInterval = setInterval(() => {
            countdown--;
            setCurrentStateCount(countdown);
        }, 1000);

        // Set timeout for this step
        intervalRef.current = setTimeout(() => {
            clearInterval(countdownInterval);
            runStep(index + 1, cycle);
        }, duration * 1000) as any;
    };

    const onClick = () => {
        if (isRunning) return;
        
        setIsRunning(true);
        setCurrentCycle(1);
        setCurrentIndex(0);
        
        // Run the first step
        runStep(0, 1);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, []);

    const currentState = states[currentIndex] || states[0];

    return (
        <View style={styles.container}>
            <Text style={styles.cycleText}>
                Cycle {currentCycle}/{sighBreathingState}
            </Text>
            
            <Text style={styles.titleText}>
                {currentState.title}
            </Text>
            
            <View style={styles.timerContainer}>
                {currentStateCount > 0 && (
                    <Text style={styles.timerText}>
                        {currentStateCount}s
                    </Text>
                )}
            </View>

            <Pressable 
                style={[styles.button, isRunning && styles.buttonDisabled]} 
                onPress={onClick}
                disabled={isRunning}
            >
                <Text style={styles.buttonText}>
                    {isRunning ? 'Running...' : 'Start'}
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    cycleText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16,
        marginBottom: 20,
    },
    titleText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    timerContainer: {
        marginBottom: 40,
    },
    timerText: {
        color: '#4A90D9',
        fontSize: 48,
        fontWeight: '200',
    },
    button: {
        paddingHorizontal: 40,
        paddingVertical: 15,
        backgroundColor: '#4A90D9',
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Sigh;