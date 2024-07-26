import React from "react";

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = "2rem",
  count = 4,
}) => {
  const blinkAnimation = {
    animation: "blink 1.5s infinite ease-in-out",
  };

  const keyframes = `
    @keyframes blink {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `;

  return (
    <div className="space-y-4 mt-5">
      <style>{keyframes}</style>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-full mb-5"
          style={{ ...blinkAnimation, width, height }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
