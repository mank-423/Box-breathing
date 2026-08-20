import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import useStore from '@/store/zustand-store';
import { Colors, Fonts, Spacing } from '@/constants/theme';

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
    const timeoutRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);
    const { sighBreathingState, setSighBreathingState } = useStore();

    // ✅ Clean up everything
    const cleanup = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
    };

    // ✅ Reset everything
    const resetAll = () => {
        cleanup();
        setIsRunning(false);
        setCurrentIndex(0);
        setCurrentCycle(1);
        setCurrentStateCount(0);
    };

    const runStep = (index: number, cycle: number) => {
        // Check if component is unmounted or should stop
        if (!isRunning) {
            resetAll();
            return;
        }

        if (cycle > sighBreathingState) {
            resetAll();
            return;
        }

        if (index >= states.length) {
            setCurrentCycle(cycle + 1);
            cleanup();
            timeoutRef.current = setTimeout(() => {
                if (isRunning) {
                    runStep(0, cycle + 1);
                }
            }, 1000) as any;
            return;
        }

        setCurrentIndex(index);
        const duration = states[index].duration;
        setCurrentStateCount(duration);

        let countdown = duration;
        countdownRef.current = setInterval(() => {
            countdown--;
            setCurrentStateCount(countdown);
        }, 1000);

        cleanup();
        timeoutRef.current = setTimeout(() => {
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
            }
            if (isRunning) {
                runStep(index + 1, cycle);
            }
        }, duration * 1000) as any;
    };

    const onClick = () => {
        if (isRunning) return;
        resetAll();
        setIsRunning(true);
        setCurrentCycle(1);
        setCurrentIndex(0);
        runStep(0, 1);
    };

    // ✅ Clean up on unmount
    useEffect(() => {
        return () => {
            resetAll();
        };
    }, []);

    const currentState = states[currentIndex] || states[0];

    return (
        <View style={styles.container}>
            <Text style={Fonts.timer}>
                {isRunning ? `${currentStateCount}s` : ' '}
            </Text>

            <View style={styles.centerContent}>
                <Text style={styles.titleText}>
                    {currentState.title}
                </Text>

                <Text style={styles.cycleText}>
                    Cycle {currentCycle}/{sighBreathingState}
                </Text>
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
        backgroundColor: 'transparent',
        padding: Spacing.lg,
    },
    centerContent: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },
    titleText: {
        ...Fonts.title,
        fontSize: 28,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    cycleText: {
        ...Fonts.cycle,
        marginTop: Spacing.sm,
    },
    button: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Sigh;