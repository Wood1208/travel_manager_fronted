import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState("up");
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setDirection("down");
        setIsTop(false);
      } else {
        setDirection("up");
        setIsTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { direction, isTop };
}