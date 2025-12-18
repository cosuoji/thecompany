import React from "react";

const AnalogClock = ({ timezoneOffset = 0, size = 50 }) => {
    const [time, setTime] = React.useState(new Date());
  
    // Update clock every second
    React.useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);

    
  
    const localTime = new Date(time.getTime() + timezoneOffset * 3600 * 1000);
    const hours = localTime.getHours() % 12;
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();
    const hourDeg = hours * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;
  
    return (
      <div
        className="relative border-2 border-black opacity-60 rounded-full"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* Hour Hand */}
        <div
          className="absolute w-[2px] bg-black left-1/2 bottom-1/2 origin-bottom z-10"
          style={{
            height: size * 0.3,
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
          }}
        />
        {/* Minute Hand */}
        <div
          className="absolute w-[2px] bg-black left-1/2 bottom-1/2 origin-bottom z-10"
          style={{
            height: size * 0.4,
            transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
          }}
        />
        {/* Second Hand */}
        <div
          className="absolute w-[2px] bg-black left-1/2 bottom-1/2 origin-bottom z-10"
          style={{
            height: size * 0.3,
            transform: `translateX(-50%) rotate(${secondDeg}deg)`,
          }}
        />
        {/* Center Dot */}
        <div
          className="absolute bg-[#4B371C] rounded-full left-1/2 bottom-1/2 z-20"
          style={{
            width: size * 0.05,
            height: size * 0.05,
            transform: 'translate(-50%, 50%)',
          }}
        />
      </div>
    );
  };
  

  export default AnalogClock