import React from "react";

interface LotusLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  showSubtitle?: boolean;
  textColor?: string;
}

export const LotusLogo: React.FC<LotusLogoProps> = ({
  className = "",
  size = 48,
  showText = false,
  showSubtitle = false,
  textColor = "text-amber-900",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 110 512 285"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        {/* Center Petal (Main #d97706) */}
        <path
          fill="#d97706"
          d="M259.374,361.86c0,0-149.494-80.783,0-235.746C408.856,281.076,259.374,361.86,259.374,361.86z"
        />

        {/* Inner Left Petal */}
        <path
          fill="#f59e0b"
          d="M259.369,361.862c0,0-35.181-147.679-151.317-162.383C108.052,199.479,61.89,361.862,259.369,361.862z"
        />

        {/* Outer Left Petal */}
        <path
          fill="#b45309"
          d="M259.369,361.862c0,0-102.847-85.591-221.798-74.914C37.57,286.948,83.807,378.055,259.369,361.862z"
        />

        {/* Inner Right Petal */}
        <path
          fill="#f59e0b"
          d="M259.369,361.862c0,0,35.181-147.679,151.317-162.383C410.686,199.479,456.848,361.862,259.369,361.862z"
        />

        {/* Outer Right Petal */}
        <path
          fill="#fbbf24"
          d="M259.369,361.862c0,0,102.847-85.591,221.798-74.914C481.167,286.948,434.93,378.055,259.369,361.862z"
        />

        {/* Center Petal Fold */}
        <path
          fill="#d97706"
          d="M246.92,335.386c-32.088-34.069-64.431-100.719,22.734-198.208c-3.259-3.646-6.681-7.333-10.281-11.064c-122.865,127.359-43.776,204.608-11.701,228.088C247.387,347.933,247.177,341.659,246.92,335.386z"
        />

        {/* Left Contour */}
        <path
          fill="#b45309"
          d="M126.115,202.992c-5.795-1.521-11.804-2.721-18.063-3.513c0,0-46.161,162.383,151.317,162.383c0,0-0.047-0.196-0.135-0.542C99.745,352.06,120.966,225.775,126.115,202.992z"
        />

        {/* Bottom Left Petal Accent */}
        <path
          fill="#92400e"
          d="M66.919,286.948c2.049-0.184,4.092-0.333,6.13-0.461c-11.604-0.7-23.457-0.619-35.478,0.461c0,0,41.708,82.14,196.238,76.559C103.268,358.526,66.919,286.948,66.919,286.948z"
        />

        {/* Right Petal Accent */}
        <path
          fill="#d97706"
          d="M262.247,361.653c8.228-2.33,16.547-4.385,24.771-6.741c-0.516,0.002-1.016,0.016-1.536,0.016c0,0,28.748-120.64,120.034-154.695c-112.013,18.35-146.149,161.629-146.149,161.629c0.735,0,1.447-0.014,2.174-0.019C261.778,361.778,262.014,361.719,262.247,361.653z"
        />

        {/* Bottom Right Petal Accent */}
        <path
          fill="#f59e0b"
          d="M301.653,361.862c0,0,79.473-66.125,179.495-74.874c0.008-0.017,0.021-0.041,0.021-0.041C362.217,276.27,259.37,361.861,259.37,361.861c22.477,2.073,42.82,2.378,61.231,1.35C314.452,362.897,308.151,362.461,301.653,361.862z"
        />

        {/* Base Lotus Line */}
        <path
          fill="#b45309"
          d="M496.52,385.887H15.48c-8.549,0-15.48-6.93-15.48-15.479l0,0c0-8.549,6.931-15.48,15.48-15.48h481.041c8.549,0,15.48,6.931,15.48,15.48l0,0C512,378.957,505.069,385.887,496.52,385.887z"
        />

        {/* Base Highlights */}
        <path
          fill="#92400e"
          d="M19.402,370.407c0-8.549,6.931-15.479,15.48-15.479H15.48c-8.549,0-15.48,6.931-15.48,15.479c0,8.549,6.931,15.48,15.48,15.48h19.402C26.332,385.887,19.402,378.957,19.402,370.407z"
        />
      </svg>

      {showText && (
        <h2
          className={`mt-2 font-serif text-2xl font-bold tracking-wide ${textColor}`}
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Pháp môn tâm linh
        </h2>
      )}

      {showSubtitle && (
        <p className="mt-1 text-xs font-medium tracking-wider text-amber-900/80">
          Nghe - Đọc - Tu Tập
        </p>
      )}
    </div>
  );
};
