import { useEffect, useState } from "react";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export const useCountdown = (targetDate: Date): Countdown => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate.getTime() - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isEnded: false };
  };

  const [timeLeft, setTimeLeft] = useState<Countdown>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
