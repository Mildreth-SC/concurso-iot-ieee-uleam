/** Manta raya IoT dibujada completamente con SVG y animada por CSS. */
export function TechMantaRay({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 650"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Mascota del concurso: manta raya tecnológica"
    >
      <defs>
        <linearGradient id="manta-body" x1="8%" y1="2%" x2="82%" y2="96%">
          <stop offset="0%" stopColor="#143f85" />
          <stop offset="38%" stopColor="#082e72" />
          <stop offset="72%" stopColor="#061c50" />
          <stop offset="100%" stopColor="#020a26" />
        </linearGradient>
        <linearGradient id="manta-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3ff" />
          <stop offset="34%" stopColor="#00d4ff" />
          <stop offset="70%" stopColor="#2374ff" />
          <stop offset="100%" stopColor="#7c3cff" />
        </linearGradient>
        <linearGradient id="manta-circuit" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#1b6dff" />
          <stop offset="48%" stopColor="#a5f3ff" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
        <linearGradient id="ocean-glow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#52f1ff" stopOpacity=".7" />
          <stop offset="48%" stopColor="#086ada" stopOpacity=".36" />
          <stop offset="100%" stopColor="#02091d" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="manta-aura">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity=".3" />
          <stop offset="65%" stopColor="#0066ff" stopOpacity=".08" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <filter id="manta-neon" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Fondo de red y aura */}
      <ellipse className="manta-shadow" cx="450" cy="330" rx="380" ry="260" fill="url(#manta-aura)" />
      <g className="manta-network" stroke="#36cfff" strokeWidth="1.2" opacity=".32">
        <path d="M20 430 L95 370 L150 455 L230 390 L300 470" />
        <path d="M20 430 L110 505 L150 455 L230 520 L300 470" />
        <path d="M95 370 L230 390 L150 455 L110 505" />
        <path d="M600 470 L675 390 L750 455 L810 370 L880 430" />
        <path d="M600 470 L680 520 L750 455 L805 505 L880 430" />
        <path d="M675 390 L810 370 L750 455 L805 505" />
      </g>

      {/* Base oceánica energética */}
      <g className="manta-ocean">
        <path
          d="M228 494 C315 450 366 480 450 470 C535 460 592 450 680 500 C610 530 543 541 450 536 C358 542 292 531 228 494Z"
          fill="url(#ocean-glow)"
          opacity=".72"
        />
        <path d="M245 500 C330 468 372 506 450 488 C530 469 578 472 660 507" stroke="#64f5ff" strokeWidth="2" opacity=".55" />
        <path d="M280 519 C346 492 394 523 455 507 C520 490 560 498 623 519" stroke="#087cff" strokeWidth="2" opacity=".62" />
      </g>

      <g className="manta-wing manta-wing-left">
        <path
          d="M451 155 C365 104 236 82 72 198 C185 170 250 232 286 344 C314 430 365 480 451 510Z"
          fill="url(#manta-body)"
          stroke="url(#manta-edge)"
          strokeWidth="4"
          filter="url(#manta-neon)"
        />
        <path className="manta-circuit" d="M105 190 L200 189 L238 224 L335 224 L368 255 L430 255" />
        <path className="manta-circuit" d="M145 211 L205 220 L245 266 L322 266 L359 296 L425 296" />
        <path className="manta-circuit" d="M190 246 L232 286 L292 286 L331 328 L415 328" />
        <path className="manta-circuit" d="M224 292 L260 329 L306 329 L350 371 L410 371" />
        <path className="manta-circuit" d="M252 347 L300 382 L326 425 L390 425" />
        <path className="manta-circuit" d="M285 405 L330 443 L369 467" />
        {[
          [105, 190], [200, 189], [238, 224], [145, 211], [245, 266],
          [190, 246], [292, 286], [224, 292], [306, 329], [252, 347],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="manta-node" cx={cx} cy={cy} r="6" />
        ))}
      </g>

      <g className="manta-wing manta-wing-right">
        <path
          d="M449 155 C535 104 664 82 828 198 C715 170 650 232 614 344 C586 430 535 480 449 510Z"
          fill="url(#manta-body)"
          stroke="url(#manta-edge)"
          strokeWidth="4"
          filter="url(#manta-neon)"
        />
        <path className="manta-circuit" d="M795 190 L700 189 L662 224 L565 224 L532 255 L470 255" />
        <path className="manta-circuit" d="M755 211 L695 220 L655 266 L578 266 L541 296 L475 296" />
        <path className="manta-circuit" d="M710 246 L668 286 L608 286 L569 328 L485 328" />
        <path className="manta-circuit" d="M676 292 L640 329 L594 329 L550 371 L490 371" />
        <path className="manta-circuit" d="M648 347 L600 382 L574 425 L510 425" />
        <path className="manta-circuit" d="M615 405 L570 443 L531 467" />
        {[
          [795, 190], [700, 189], [662, 224], [755, 211], [655, 266],
          [710, 246], [608, 286], [676, 292], [594, 329], [648, 347],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} className="manta-node" cx={cx} cy={cy} r="6" />
        ))}
      </g>

      {/* Núcleo y rostro */}
      <path
        className="manta-core"
        d="M450 138 C492 183 503 248 487 321 C477 370 463 427 450 510 C437 427 423 370 413 321 C397 248 408 183 450 138Z"
        fill="url(#manta-body)"
        stroke="url(#manta-edge)"
        strokeWidth="3.5"
        filter="url(#manta-neon)"
      />
      <path
        className="manta-energy-line"
        d="M450 185 L450 458"
        stroke="#00d4ff"
        strokeWidth="2"
        strokeDasharray="8 12"
      />

      <circle className="manta-core-pulse" cx="450" cy="205" r="13" fill="#00d4ff" filter="url(#manta-neon)" />
      <circle cx="430" cy="236" r="8" fill="#020817" stroke="#59efff" strokeWidth="2.5" />
      <circle cx="432" cy="234" r="3" fill="#e8ffff" filter="url(#manta-neon)" />
      <circle cx="470" cy="236" r="8" fill="#020817" stroke="#59efff" strokeWidth="2.5" />
      <circle cx="468" cy="234" r="3" fill="#e8ffff" filter="url(#manta-neon)" />

      {/* Microchips */}
      <g className="manta-chip" transform="translate(397 276)">
        <rect width="54" height="54" rx="7" fill="#061834" stroke="#6ef4ff" strokeWidth="3" />
        <rect x="12" y="12" width="30" height="30" rx="3" fill="#0a4c91" stroke="#00d4ff" />
        {[8, 20, 32, 44].map((n) => (
          <g key={n}>
            <path d={`M${n} -7 V0 M${n} 54 V61`} stroke="#59efff" strokeWidth="3" />
            <path d={`M-7 ${n} H0 M54 ${n} H61`} stroke="#59efff" strokeWidth="3" />
          </g>
        ))}
      </g>
      <g className="manta-chip manta-chip-secondary" transform="translate(550 294) scale(.68)">
        <rect width="54" height="54" rx="7" fill="#061834" stroke="#6ef4ff" strokeWidth="3" />
        <rect x="12" y="12" width="30" height="30" rx="3" fill="#0a4c91" stroke="#00d4ff" />
      </g>

      <g className="manta-tail">
        <path d="M450 495 C453 548 478 577 518 612" stroke="url(#manta-edge)" strokeWidth="5" fill="none" filter="url(#manta-neon)" />
        <circle cx="518" cy="612" r="7" fill="#00d4ff" />
        <circle className="manta-tail-signal" cx="518" cy="612" r="17" stroke="#00d4ff" strokeWidth="2" fill="none" />
      </g>

      {/* Paquetes de datos */}
      <g className="manta-data-packets" fill="#58efff" filter="url(#manta-neon)">
        <rect x="182" y="306" width="10" height="10" transform="rotate(35 187 311)" />
        <rect x="207" y="327" width="7" height="7" transform="rotate(25 210 330)" />
        <rect x="700" y="302" width="9" height="9" transform="rotate(-32 704 306)" />
        <circle cx="725" cy="327" r="5" />
      </g>
    </svg>
  );
}
