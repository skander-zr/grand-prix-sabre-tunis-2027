import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface TdahContextType {
  isTdahMode: boolean;
  toggleTdahMode: () => void;
  readingRuler: boolean;
  toggleReadingRuler: () => void;
  stepFocus: boolean;
  toggleStepFocus: () => void;
}

const TdahContext = createContext<TdahContextType | undefined>(undefined);

export const TdahProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTdahMode, setIsTdahMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gps2027_tdah_mode');
    return saved === 'true';
  });

  const [readingRuler, setReadingRuler] = useState<boolean>(() => {
    const saved = localStorage.getItem('gps2027_reading_ruler');
    return saved === 'true';
  });

  const [stepFocus, setStepFocus] = useState<boolean>(() => {
    const saved = localStorage.getItem('gps2027_step_focus');
    return saved !== 'false'; // default true
  });

  // Track mouse Y for reading ruler
  const [cursorY, setCursorY] = useState(0);

  useEffect(() => {
    if (readingRuler) {
      const handleMouseMove = (e: MouseEvent) => {
        setCursorY(e.clientY);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [readingRuler]);

  useEffect(() => {
    localStorage.setItem('gps2027_tdah_mode', String(isTdahMode));
    if (isTdahMode) {
      document.documentElement.classList.add('tdah-mode');
    } else {
      document.documentElement.classList.remove('tdah-mode');
    }
  }, [isTdahMode]);

  useEffect(() => {
    localStorage.setItem('gps2027_reading_ruler', String(readingRuler));
  }, [readingRuler]);

  useEffect(() => {
    localStorage.setItem('gps2027_step_focus', String(stepFocus));
  }, [stepFocus]);

  const toggleTdahMode = () => {
    setIsTdahMode(prev => {
      const next = !prev;
      if (next) {
        toast.success('Mode Focus TDAH Activé', {
          description: 'Animations désactivées, contrastes renforcés, étapes guidées et réduction de la charge mentale.'
        });
      } else {
        toast.info('Mode Focus TDAH Désactivé');
      }
      return next;
    });
  };

  const toggleReadingRuler = () => {
    setReadingRuler(prev => !prev);
  };

  const toggleStepFocus = () => {
    setStepFocus(prev => !prev);
  };

  return (
    <TdahContext.Provider
      value={{
        isTdahMode,
        toggleTdahMode,
        readingRuler,
        toggleReadingRuler,
        stepFocus,
        toggleStepFocus
      }}
    >
      {children}
      
      {/* Optional Reading Ruler Line for Focus */}
      {readingRuler && (
        <div
          className="fixed left-0 right-0 pointer-events-none z-[9999] transition-transform duration-75"
          style={{
            top: `${cursorY}px`,
            height: '4px',
            backgroundColor: 'rgba(0, 240, 255, 0.65)',
            boxShadow: '0 0 16px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4)'
          }}
        />
      )}
    </TdahContext.Provider>
  );
};

export const useTdah = () => {
  const context = useContext(TdahContext);
  if (!context) {
    throw new Error('useTdah must be used within a TdahProvider');
  }
  return context;
};
