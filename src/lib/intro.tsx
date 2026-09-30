import { createContext, useContext, useState, type ReactNode } from 'react';

// "Intro ready" — false while the preloader is on screen. The hero and header hold their
// entrance animations until it flips, so they play as the preloader lifts, not behind it.
const IntroContext = createContext<{ ready: boolean; setReady: (v: boolean) => void }>({ ready: true, setReady: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  return <IntroContext.Provider value={{ ready, setReady }}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
