export function padZero(num: number, digits: number = 2): string {
  return num.toString().padStart(digits, '0');
}

export function formatClock(date: Date, is24h: boolean) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let ampm = '';

  if (!is24h) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
  }

  const hoursStr = padZero(hours);
  const minutesStr = padZero(minutes);
  const secondsStr = padZero(seconds);

  return {
    hoursStr,
    minutesStr,
    secondsStr,
    ampm,
    fullText: is24h ? `${hoursStr}:${minutesStr}:${secondsStr}` : `${hoursStr}:${minutesStr}:${secondsStr} ${ampm}`,
  };
}

export function formatStopwatchTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  const hours = Math.floor(minutes / 60);

  const displayMinutes = minutes % 60;

  if (hours > 0) {
    return {
      hoursStr: padZero(hours),
      minutesStr: padZero(displayMinutes),
      secondsStr: padZero(seconds),
      centiStr: padZero(centiseconds),
      formatted: `${padZero(hours)}:${padZero(displayMinutes)}:${padZero(seconds)}.${padZero(centiseconds)}`,
    };
  }

  return {
    hoursStr: null,
    minutesStr: padZero(displayMinutes),
    secondsStr: padZero(seconds),
    centiStr: padZero(centiseconds),
    formatted: `${padZero(displayMinutes)}:${padZero(seconds)}.${padZero(centiseconds)}`,
  };
}

export function formatTimerSeconds(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    hoursStr: padZero(hours),
    minutesStr: padZero(minutes),
    secondsStr: padZero(seconds),
    formatted: hours > 0 ? `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}` : `${padZero(minutes)}:${padZero(seconds)}`,
  };
}
