import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

export function Logo({ animate = false, sx, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Dynamic theme colors for the text parts
  const textColor = isDark ? theme.palette.common.white : '#172B3A';
  const taglineColor = isDark ? theme.palette.text.secondary : '#526274';

  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1040 360"
      fill="none"
      role="img"
      aria-labelledby="ozcraft-title ozcraft-desc"
      sx={{ 
        height: 52, // Default large height
        width: 'auto',
        ...(animate && {
          '@keyframes assembleBase': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          '@keyframes assemblePaper': {
            '0%': { opacity: 0, transform: 'translateY(-20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
          },
          '@keyframes assembleArrow': {
            '0%': { opacity: 0, transform: 'translateX(-20px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          '@keyframes assembleSparkles': {
            '0%': { opacity: 0, transform: 'scale(0)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
          '@keyframes assembleText': {
            '0%': { opacity: 0, transform: 'translateX(20px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' },
          },
          '& g': {
            transformBox: 'fill-box',
            transformOrigin: 'center',
          },
          '& #icon-background': { animation: 'assembleBase 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both' },
          '& #resume-document': { animation: 'assemblePaper 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both' },
          '& #growth-arrow': { animation: 'assembleArrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both' },
          '& #ai-sparkles': { animation: 'assembleSparkles 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s both' },
          '& #ozcraft-wordmark': { animation: 'assembleText 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both' },
        }),
        ...sx 
      }}
      {...props}
    >
      <title id="ozcraft-title">OzCraft Logo</title>
      <desc id="ozcraft-desc">
        AI destekli CV oluşturma platformu OzCraft için modern teknoloji logosu.
      </desc>

      <defs>
        <linearGradient id="brandGradient" x1="70" y1="55" x2="330" y2="305" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1EA7FD"/>
          <stop offset="0.48" stopColor="#2563EB"/>
          <stop offset="1" stopColor="#6D28D9"/>
        </linearGradient>

        <linearGradient id="textGradient" x1="600" y1="110" x2="1050" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1597F4"/>
          <stop offset="0.5" stopColor="#2563EB"/>
          <stop offset="1" stopColor="#7C3AED"/>
        </linearGradient>

        <linearGradient id="paperGradient" x1="115" y1="85" x2="260" y2="255" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF"/>
          <stop offset="1" stopColor="#EEF4FF"/>
        </linearGradient>

        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#172554" floodOpacity="0.14"/>
        </filter>
      </defs>

      <g id="ozcraft-icon" transform="translate(40 28)" filter="url(#softShadow)">
        <g id="icon-background">
          <rect x="38" y="34" width="250" height="250" rx="58" fill="url(#brandGradient)"/>
          <path d="M72 250 C116 291 215 305 295 232" stroke="#5B5CF6" strokeWidth="20" strokeLinecap="round" opacity="0.45"/>
        </g>
        <g id="resume-document">
          <path d="M91 91 C91 77 102 66 116 66 H212 L257 111 V226 C257 241 245 253 230 253 H116 C102 253 91 242 91 228 Z" fill="url(#paperGradient)"/>
          <path d="M212 66 V103 C212 113 220 121 230 121 H257 Z" fill="#DCE6FF"/>
          <circle cx="146" cy="128" r="20" fill="#2563EB"/>
          <path d="M114 180 C116 155 129 145 146 145 C165 145 177 155 180 180 Z" fill="#2563EB"/>
          <rect x="111" y="197" width="108" height="13" rx="6.5" fill="#2563EB"/>
          <rect x="111" y="219" width="83" height="13" rx="6.5" fill="#4478EE"/>
        </g>
        <g id="growth-arrow">
          <path d="M77 258 C127 287 205 284 249 235 C266 217 277 195 282 171" stroke="url(#brandGradient)" strokeWidth="17" strokeLinecap="round"/>
          <path d="M263 177 L287 151 L299 184" stroke="#5B3FF2" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <g id="ai-sparkles">
          <path d="M276 47 C279 63 287 71 304 75 C287 78 279 87 276 103 C273 87 265 78 248 75 C265 71 273 63 276 47Z" fill="#7C3AED"/>
          <path d="M323 84 C325 94 331 100 341 102 C331 105 325 111 323 121 C320 111 315 105 304 102 C315 100 320 94 323 84Z" fill="#25B7F7"/>
        </g>
      </g>

      <g id="ozcraft-wordmark">
        <text x="395" y="218" fontFamily="Inter, Avenir, Helvetica Neue, Arial, sans-serif" fontSize="142" fontWeight="800" letterSpacing="-8" fill={textColor}>
          Oz
        </text>
        <text x="565" y="218" fontFamily="Inter, Avenir, Helvetica Neue, Arial, sans-serif" fontSize="142" fontWeight="800" letterSpacing="-8" fill="url(#textGradient)">
          Craft
        </text>
        <text x="407" y="278" fontFamily="Inter, Avenir, Helvetica Neue, Arial, sans-serif" fontSize="22" fontWeight="600" letterSpacing="8" fill={taglineColor}>
          BUILD A BRIGHTER CAREER
        </text>
      </g>
    </Box>
  );
}
