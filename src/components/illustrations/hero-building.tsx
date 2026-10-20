/**
 * رسم توضيحي للصفحة الرئيسية — واجهة عمارة سكنية مصرية ببوّاب يستقبل.
 * SVG مضمّن (inline) لضمان دعم الخط العربي واللون دون طلبات إضافية.
 */
export default function HeroBuilding({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 560"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="رسم توضيحي لواجهة عمارة سكنية وبوّاب يستقبل الزوار عند المدخل"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8F2E6" />
          <stop offset="100%" stopColor="#EFE6D3" />
        </linearGradient>
        <linearGradient id="hero-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#EFE3CD" />
          <stop offset="100%" stopColor="#E5D6BB" />
        </linearGradient>
        <clipPath id="hero-panel">
          <rect width="640" height="560" rx="24" />
        </clipPath>
      </defs>

      <g clipPath="url(#hero-panel)">
        {/* السماء */}
        <rect width="640" height="560" fill="url(#hero-sky)" />
        <circle cx="545" cy="135" r="78" fill="#F1E6CF" />
        <circle cx="545" cy="135" r="78" fill="none" stroke="#E6D8BB" strokeWidth="2" />

        {/* طيور */}
        <path
          d="M118 58c6-6 12-6 18 0M140 74c5-5 10-5 15 0"
          stroke="#0B2E4F"
          strokeOpacity="0.25"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* الأرض */}
        <rect x="0" y="470" width="640" height="90" fill="#EAE2D3" />
        <rect x="0" y="514" width="640" height="46" fill="#DFD7C6" />
        <rect x="0" y="514" width="640" height="4" fill="#CFC5B0" />

        {/* ظل العمارة */}
        <ellipse cx="270" cy="474" rx="230" ry="12" fill="#0B2E4F" opacity="0.07" />

        {/* جسم العمارة */}
        <rect x="60" y="110" width="410" height="360" fill="url(#hero-body)" />
        <rect x="60" y="222" width="410" height="4" fill="#DCCDB0" />
        <rect x="60" y="337" width="410" height="4" fill="#DCCDB0" />

        {/* عتبة علوية */}
        <rect x="48" y="94" width="434" height="18" rx="5" fill="#D9C8A6" />
        <rect x="66" y="80" width="398" height="14" rx="4" fill="#E2D3B7" />

        {/* نوافذ الطابق الأول (مظلات) */}
        {[130, 265, 400].map((cx) => (
          <g key={`r1-${cx}`}>
            <path
              d={`M${cx - 44} 140 L${cx + 44} 140 L${cx + 33} 122 L${cx - 33} 122 Z`}
              fill="#0E9F6E"
            />
            <rect x={cx - 34} y="140" width="68" height="62" rx="6" fill="#0B2E4F" />
            <rect x={cx - 30} y="144" width="60" height="54" rx="4" fill="#17456F" />
            <path
              d={`M${cx} 144 V198 M${cx - 30} 171 H${cx + 30}`}
              stroke="#F6F1E6"
              strokeWidth="3"
            />
          </g>
        ))}

        {/* شرفات الطابق الثاني */}
        {[130, 265, 400].map((cx) => (
          <g key={`r2-${cx}`}>
            <rect x={cx - 34} y="245" width="68" height="60" rx="6" fill="#0B2E4F" />
            <rect x={cx - 30} y="249" width="60" height="52" rx="4" fill="#17456F" />
            <path
              d={`M${cx} 249 V301 M${cx - 30} 275 H${cx + 30}`}
              stroke="#F6F1E6"
              strokeWidth="3"
            />
            <rect x={cx - 48} y="305" width="96" height="10" rx="3" fill="#D5C4A4" />
            <path
              d={`M${cx - 44} 305 V287 M${cx - 22} 305 V287 M${cx} 305 V287 M${cx + 22} 305 V287 M${cx + 44} 305 V287`}
              stroke="#0B2E4F"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={`M${cx - 46} 287 H${cx + 46}`}
              stroke="#0B2E4F"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* نوافذ الطابق الأرضي */}
        {[130, 400].map((cx) => (
          <g key={`r3-${cx}`}>
            <rect x={cx - 34} y="385" width="68" height="68" rx="6" fill="#0B2E4F" />
            <rect x={cx - 30} y="389" width="60" height="60" rx="4" fill="#17456F" />
            <path
              d={`M${cx} 389 V449 M${cx - 30} 419 H${cx + 30}`}
              stroke="#F6F1E6"
              strokeWidth="3"
            />
          </g>
        ))}

        {/* المدخل المقوّس */}
        <path
          d="M213 466 V396 a52 52 0 0 1 104 0 v70 z"
          fill="#F6F1E6"
        />
        <path
          d="M221 466 V400 a44 44 0 0 1 88 0 v66 z"
          fill="#0B2E4F"
        />
        <path
          d="M233 466 V404 a32 32 0 0 1 64 0 v62 z"
          fill="#0E9F6E"
        />
        <path
          d="M265 404 V466"
          stroke="#0A7D56"
          strokeWidth="3"
        />
        <circle cx="288" cy="436" r="4.5" fill="#F6F1E6" />

        {/* درجات المدخل */}
        <rect x="205" y="464" width="120" height="10" rx="3" fill="#D9C8A6" />
        <rect x="196" y="474" width="138" height="10" rx="3" fill="#CFBD9B" />
        <rect x="223" y="466" width="84" height="7" rx="3" fill="#0A7D56" opacity="0.55" />

        {/* نباتات جانبية */}
        <path d="M176 436 h40 l-6 30 h-28 z" fill="#C2703F" />
        <rect x="172" y="430" width="48" height="10" rx="4" fill="#B4653A" />
        <circle cx="196" cy="418" r="17" fill="#0E9F6E" />
        <circle cx="183" cy="427" r="11" fill="#0A7D56" />
        <circle cx="209" cy="427" r="11" fill="#0A7D56" />

        <path d="M316 436 h40 l-6 30 h-28 z" fill="#C2703F" />
        <rect x="312" y="430" width="48" height="10" rx="4" fill="#B4653A" />
        <circle cx="336" cy="418" r="17" fill="#0E9F6E" />
        <circle cx="323" cy="427" r="11" fill="#0A7D56" />
        <circle cx="349" cy="427" r="11" fill="#0A7D56" />

        {/* نخلة في الزاوية */}
        <path d="M556 468 l6 -92 h10 l6 92 z" fill="#8A6A45" />
        <ellipse cx="567" cy="370" rx="46" ry="14" fill="#0A7D56" transform="rotate(-18 567 370)" />
        <ellipse cx="567" cy="372" rx="46" ry="14" fill="#0E9F6E" transform="rotate(16 567 372)" />
        <ellipse cx="567" cy="366" rx="16" ry="40" fill="#0A7D56" transform="rotate(-2 567 366)" />
        <ellipse cx="546" cy="378" rx="34" ry="11" fill="#0E9F6E" transform="rotate(-42 546 378)" />
        <ellipse cx="590" cy="378" rx="34" ry="11" fill="#0A7D56" transform="rotate(42 590 378)" />
        <path d="M534 468 h64 l-8 40 h-48 z" fill="#C2703F" />
        <rect x="528" y="462" width="76" height="14" rx="5" fill="#B4653A" />

        {/* البوّاب */}
        <g>
          <ellipse cx="424" cy="497" rx="36" ry="8" fill="#0B2E4F" opacity="0.1" />

          {/* الرجلان */}
          <rect x="410" y="450" width="15" height="40" rx="5" fill="#061D33" />
          <rect x="427" y="450" width="15" height="40" rx="5" fill="#061D33" />
          <rect x="405" y="484" width="22" height="12" rx="5" fill="#04121F" />
          <rect x="425" y="484" width="22" height="12" rx="5" fill="#04121F" />

          {/* الجذع */}
          <rect x="403" y="404" width="48" height="54" rx="12" fill="#0B2E4F" />
          <rect x="403" y="446" width="48" height="7" fill="#0E9F6E" />
          <rect x="430" y="416" width="15" height="10" rx="2" fill="#F6F1E6" />

          {/* الذراعان */}
          <rect x="392" y="408" width="13" height="42" rx="6.5" fill="#0B2E4F" />
          <circle cx="398.5" cy="452" r="7" fill="#C98D5B" />
          <rect
            x="449"
            y="406"
            width="13"
            height="44"
            rx="6.5"
            fill="#0B2E4F"
            transform="rotate(-38 455.5 412)"
          />
          <circle cx="477" cy="428" r="7.5" fill="#C98D5B" />

          {/* الرقبة والرأس */}
          <rect x="419" y="396" width="14" height="12" rx="4" fill="#B87D4C" />
          <circle cx="426" cy="382" r="18" fill="#C98D5B" />

          {/* القبعة */}
          <path d="M408 376 a18 18 0 0 1 36 0 z" fill="#061D33" />
          <rect x="404" y="373" width="46" height="7" rx="3.5" fill="#04121F" />
          <circle cx="426" cy="367" r="4.5" fill="#0E9F6E" />

          {/* الوجه */}
          <circle cx="420.5" cy="384" r="2" fill="#3B2A1E" />
          <circle cx="432" cy="384" r="2" fill="#3B2A1E" />
          <path
            d="M420 391 q6 5 12 0"
            stroke="#3B2A1E"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* لافتة صغيرة بجانب الباب */}
        <rect x="324" y="352" width="30" height="20" rx="4" fill="#0B2E4F" />
        <rect x="330" y="358" width="18" height="3" rx="1.5" fill="#F6F1E6" opacity="0.9" />
        <rect x="330" y="365" width="12" height="3" rx="1.5" fill="#F6F1E6" opacity="0.6" />
      </g>

      <rect
        width="640"
        height="560"
        rx="24"
        fill="none"
        stroke="#0B2E4F"
        strokeOpacity="0.08"
        strokeWidth="2"
      />
    </svg>
  );
}
