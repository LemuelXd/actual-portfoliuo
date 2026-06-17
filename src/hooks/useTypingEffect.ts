import { useState, useEffect, useCallback } from 'react';

interface UseTypingEffectProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function useTypingEffect({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: UseTypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const typeNextChar = useCallback(() => {
    const currentText = texts[currentIndex];
    if (displayText.length < currentText.length) {
      setDisplayText(currentText.slice(0, displayText.length + 1));
    } else {
      setIsPaused(true);
      setTimeout(() => {
        setIsPaused(false);
        setIsTyping(false);
      }, pauseDuration);
    }
  }, [displayText, currentIndex, texts, pauseDuration]);

  const deleteLastChar = useCallback(() => {
    if (displayText.length > 0) {
      setDisplayText(displayText.slice(0, -1));
    } else {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setIsTyping(true);
    }
  }, [displayText]);

  useEffect(() => {
    if (isPaused) return;

    const timeout = setTimeout(
      () => {
        if (isTyping) {
          typeNextChar();
        } else {
          deleteLastChar();
        }
      },
      isTyping ? typingSpeed : deletingSpeed
    );

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, isPaused, typeNextChar, deleteLastChar, typingSpeed, deletingSpeed]);

  return { displayText, isTyping };
}
