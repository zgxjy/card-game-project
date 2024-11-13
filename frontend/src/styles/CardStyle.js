export const CARD_THEMES = {
  Boundary: {
    background: "bg-[#c4432d]", // 砖红色
    texture: "after:bg-[#d4533d]",
    overlay: "bg-[#00000015]"
  },
  Scenario: {
    background: "bg-[#435c35]", // 军绿色
    texture: "after:bg-[#536c45]",
    overlay: "bg-[#00000015]"
  },
  Response: {
    background: "bg-[#2b4878]", // 海军蓝
    texture: "after:bg-[#3b5888]",
    overlay: "bg-[#00000015]"
  },
  Attack: {
    background: "bg-[#563b67]", // 深紫色
    texture: "after:bg-[#664b77]",
    overlay: "bg-[#00000015]"
  },
  Event: {
    background: "bg-[#d65d1e]", // 橙色
    texture: "after:bg-[#e66d2e]",
    overlay: "bg-[#00000015]"
  }
};

export const noiseTexture = `
  @keyframes noise {
    0% { transform: translate(0,0) }
    10% { transform: translate(-5%,-5%) }
    20% { transform: translate(-10%,5%) }
    30% { transform: translate(5%,-10%) }
    40% { transform: translate(-5%,15%) }
    50% { transform: translate(-10%,5%) }
    60% { transform: translate(15%,0) }
    70% { transform: translate(0,10%) }
    80% { transform: translate(-15%,0) }
    90% { transform: translate(10%,5%) }
    100% { transform: translate(5%,0) }
  }

  .noise-texture {
    position: relative;
    overflow: hidden;
  }

  .noise-texture::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.15;
    mix-blend-mode: overlay;
  }

  .noise-texture::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    opacity: 0.2;
    mix-blend-mode: multiply;
  }
`;

export const styles = {
  cardFrame: `
    relative w-[280px] h-[440px] rounded-lg 
    noise-texture
    shadow-lg 
    overflow-hidden
    transition-all duration-200
  `,
  cardBack: `
    relative w-[280px] h-[440px] rounded-lg 
    bg-gray-200 
    flex items-center justify-center 
    shadow-lg 
    transition-all duration-200
`,
  cardHeader: "p-3 flex items-center justify-between border-b border-white/10",
  cardIcon: "p-1.5 rounded-lg bg-white/10",
  cardTitle: "font-bold text-lg text-white truncate max-w-[180px]",
  cardType: "px-2 py-0.5 text-xs bg-white/10 rounded-full text-white/90",
  cardImage: "h-40 bg-black/30 p-2",
  imageContainer: "w-full h-full bg-black/20 rounded flex items-center justify-center overflow-hidden",
  cardDescription: "p-3 border-t border-white/10 h-56 overflow-hidden flex flex-col justify-between",
  descriptionText: "text-sm leading-relaxed text-white/80 mb-2",
  tagContainer: "flex flex-wrap gap-1",
  tag: "flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full",
  tagIcon: "w-3 h-3 text-white/60",
  tagText: "text-xs text-white",
  properties: "px-2 py-1 flex items-center justify-between bg-black/30 mt-auto",
  propertyItem: "flex items-center gap-1",
  propertyIcon: "text-base",
  propertyText: "text-xs text-white",
  imagePlaceholder: "w-full h-full flex items-center justify-center bg-white/10",
  placeholderIcon: "w-16 h-16 text-white/20"
};

export const CardIcon = ({ type }) => {
  const icons = {
    Boundary: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
        <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" strokeWidth="2" />
        <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    Scenario: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
        <rect x="6" y="6" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    ),
    Response: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
        <path d="M12 4 L22 20 L2 20 Z" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    ),
    Attack: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
        <path d="M18 6 L6 18 M6 6 L18 18" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    ),
    Event: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
        <path d="M12 4 L12 20 M4 12 L20 12" stroke="currentColor" fill="none" strokeWidth="2" />
      </svg>
    )
  };

  return icons[type] || null;
};