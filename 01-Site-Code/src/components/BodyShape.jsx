const womenFigures = {
  Straight: {
    head: [60, 17, 8], neck: 'M60 25 V36',
    torso: 'M44 38 Q45 54 48 65 L42 108 H78 L72 65 Q75 54 76 38 Q68 34 60 34 Q52 34 44 38 Z',
    arms: 'M44 40 Q34 62 35 91 M76 40 Q86 62 85 91', legs: 'M51 108 Q50 127 49 149 M69 108 Q70 127 71 149',
    details: 'M48 65 H72 M52 38 Q60 44 68 38', dress: true,
  },
  Curvy: {
    head: [60, 17, 8], neck: 'M60 25 V36',
    torso: 'M42 38 Q45 54 51 64 Q48 72 42 80 L34 108 H86 L78 80 Q72 72 69 64 Q75 54 78 38 Q69 34 60 34 Q51 34 42 38 Z',
    arms: 'M42 40 Q30 63 33 92 M78 40 Q90 63 87 92', legs: 'M50 108 Q48 128 47 149 M70 108 Q72 128 73 149',
    details: 'M51 64 Q60 69 69 64 M51 38 Q60 45 69 38', dress: true,
  },
  Athletic: {
    head: [60, 17, 8], neck: 'M60 25 V35',
    torso: 'M36 38 Q41 53 47 63 L49 68 L43 108 H77 L71 68 L73 63 Q79 53 84 38 Q72 33 60 33 Q48 33 36 38 Z',
    arms: 'M37 40 Q25 61 30 91 M83 40 Q95 61 90 91', legs: 'M51 108 Q48 128 47 149 M69 108 Q72 128 73 149',
    details: 'M49 68 H71 M51 38 Q60 44 69 38', dress: true, abs: true,
  },
  Petite: {
    head: [60, 29, 7], neck: 'M60 36 V45',
    torso: 'M47 47 Q47 61 50 70 L44 105 H76 L70 70 Q73 61 73 47 Q66 43 60 43 Q54 43 47 47 Z',
    arms: 'M47 49 Q39 69 40 92 M73 49 Q81 69 80 92', legs: 'M52 105 Q51 119 50 136 M68 105 Q69 119 70 136',
    details: 'M50 70 H70 M53 47 Q60 52 67 47', dress: true,
  },
  Tall: {
    head: [60, 11, 7], neck: 'M60 18 V31',
    torso: 'M45 33 Q45 54 48 68 L40 113 H80 L72 68 Q75 54 75 33 Q68 29 60 29 Q52 29 45 33 Z',
    arms: 'M45 35 Q34 64 35 100 M75 35 Q86 64 85 100', legs: 'M50 113 Q48 134 47 155 M70 113 Q72 134 73 155',
    details: 'M48 68 H72 M52 33 Q60 39 68 33', dress: true,
  },
  Plus: {
    head: [60, 16, 9], neck: 'M60 25 V36',
    torso: 'M39 39 Q34 56 42 69 Q39 80 30 110 H90 Q81 80 78 69 Q86 56 81 39 Q70 34 60 34 Q50 34 39 39 Z',
    arms: 'M39 42 Q25 65 30 96 M81 42 Q95 65 90 96', legs: 'M49 110 Q46 130 45 149 M71 110 Q74 130 75 149',
    details: 'M42 69 Q60 75 78 69 M50 39 Q60 46 70 39', dress: true,
  },
}

const figures = {
  Straight: {
    head: [60, 17, 8], neck: 'M60 25 V36',
    torso: 'M43 38 Q42 60 44 88 L47 96 H73 L76 88 Q78 60 77 38 Q69 34 60 34 Q51 34 43 38 Z',
    arms: 'M43 40 Q35 61 34 89 M77 40 Q85 61 86 89', legs: 'M49 96 Q48 119 47 148 M71 96 Q72 119 73 148',
  },
  Curvy: {
    head: [60, 17, 8], neck: 'M60 25 V36',
    torso: 'M42 38 Q44 55 50 66 Q45 78 38 91 Q47 98 60 98 Q73 98 82 91 Q75 78 70 66 Q76 55 78 38 Q69 34 60 34 Q51 34 42 38 Z',
    arms: 'M42 40 Q31 62 33 91 M78 40 Q89 62 87 91', legs: 'M49 98 Q47 120 46 148 M71 98 Q73 120 74 148',
  },
  Athletic: {
    head: [60, 17, 8], neck: 'M60 25 V35',
    torso: 'M36 38 Q40 54 46 64 L48 92 Q54 96 60 96 Q66 96 72 92 L74 64 Q80 54 84 38 Q72 33 60 33 Q48 33 36 38 Z',
    arms: 'M37 40 Q25 61 30 91 M83 40 Q95 61 90 91', legs: 'M49 96 Q46 120 45 148 M71 96 Q74 120 75 148', abs: true,
  },
  Petite: {
    head: [60, 29, 7], neck: 'M60 36 V45',
    torso: 'M47 47 Q45 64 47 85 L49 94 H71 L73 85 Q75 64 73 47 Q66 43 60 43 Q54 43 47 47 Z',
    arms: 'M47 49 Q40 67 40 91 M73 49 Q80 67 80 91', legs: 'M51 94 Q50 112 49 135 M69 94 Q70 112 71 135',
  },
  Tall: {
    head: [60, 11, 7], neck: 'M60 18 V31',
    torso: 'M45 33 Q42 57 46 89 L48 98 H72 L74 89 Q78 57 75 33 Q68 29 60 29 Q52 29 45 33 Z',
    arms: 'M45 35 Q35 62 35 98 M75 35 Q85 62 85 98', legs: 'M49 98 Q47 124 46 154 M71 98 Q73 124 74 154',
  },
  Plus: {
    head: [60, 16, 9], neck: 'M60 25 V36',
    torso: 'M39 39 Q31 60 36 79 Q33 92 42 99 Q50 104 60 104 Q70 104 78 99 Q87 92 84 79 Q89 60 81 39 Q70 34 60 34 Q50 34 39 39 Z',
    arms: 'M39 42 Q25 64 30 96 M81 42 Q95 64 90 96', legs: 'M47 103 Q44 124 44 148 M73 103 Q76 124 76 148',
  },
  Slim: {
    head: [60, 17, 8], neck: 'M60 25 V36',
    torso: 'M47 38 Q45 61 48 88 L50 96 H70 L72 88 Q75 61 73 38 Q67 35 60 35 Q53 35 47 38 Z',
    arms: 'M47 40 Q40 64 40 92 M73 40 Q80 64 80 92', legs: 'M51 96 Q50 121 49 149 M69 96 Q70 121 71 149',
  },
  Balanced: {
    head: [60, 17, 8], neck: 'M60 25 V36',
    torso: 'M42 38 Q41 61 44 88 L47 96 H73 L76 88 Q79 61 78 38 Q69 34 60 34 Q51 34 42 38 Z',
    arms: 'M42 40 Q33 64 35 92 M78 40 Q87 64 85 92', legs: 'M49 96 Q48 121 47 149 M71 96 Q72 121 73 149',
  },
  Broad: {
    head: [60, 17, 8], neck: 'M60 25 V35',
    torso: 'M33 38 Q38 55 43 66 L46 94 Q53 97 60 97 Q67 97 74 94 L77 66 Q82 55 87 38 Q74 33 60 33 Q46 33 33 38 Z',
    arms: 'M34 40 Q21 63 28 93 M86 40 Q99 63 92 93', legs: 'M48 97 Q46 121 45 149 M72 97 Q74 121 75 149',
  },
  'Big & Tall': {
    head: [60, 10, 9], neck: 'M60 19 V31',
    torso: 'M37 33 Q29 56 34 78 Q32 94 41 103 Q49 108 60 108 Q71 108 79 103 Q88 94 86 78 Q91 56 83 33 Q72 28 60 28 Q48 28 37 33 Z',
    arms: 'M37 36 Q22 65 28 105 M83 36 Q98 65 92 105', legs: 'M46 107 Q42 130 42 155 M74 107 Q78 130 78 155',
  },
  Short: {
    head: [60, 31, 8], neck: 'M60 39 V48',
    torso: 'M42 50 Q40 67 44 87 L47 96 H73 L76 87 Q80 67 78 50 Q69 46 60 46 Q51 46 42 50 Z',
    arms: 'M42 52 Q34 70 36 94 M78 52 Q86 70 84 94', legs: 'M49 96 Q48 112 47 133 M71 96 Q72 112 73 133',
  },
}

export default function BodyShape({ type, gender }) {
  const isWomen = gender === 'Women'
  const figure = (isWomen ? womenFigures[type] : figures[type]) ?? figures.Balanced
  const [cx, cy, radius] = figure.head

  return (
    <svg viewBox="0 0 120 160" className="h-32 w-24" role="img" aria-label={`${type} ${isWomen ? 'dress and body proportion' : 'body proportion'} illustration`}>
      <g fill="none" stroke="currentColor" strokeWidth="3.25" strokeLinecap="round" strokeLinejoin="round">
        <circle cx={cx} cy={cy} r={radius} />
        <path d={figure.neck} />
        <path d={figure.torso} fill="currentColor" fillOpacity="0.06" />
        {figure.details && <path d={figure.details} strokeWidth="2" />}
        <path d={figure.arms} />
        <path d={figure.legs} />
        {figure.abs && <g strokeWidth="2"><path d="M60 53 V82" /><path d="M52 59 H68 M51 68 H69 M51 77 H69" /></g>}
      </g>
    </svg>
  )
}
