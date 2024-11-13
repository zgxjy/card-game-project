import React from 'react';

const CardIcon = ({ type }) => {
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

// 1. 首先定义新的颜色主题，包含基础色和纹理色
const CARD_THEMES = {
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

// 2. 添加纹理样式
const noiseTexture = `
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

// 3. 修改 CardFrame 组件
const CardFrame = ({ children, type }) => {
  return (
    <div className={`
      relative w-[280px] h-[440px] rounded-lg 
      ${CARD_THEMES[type].background}
      noise-texture
      shadow-lg 
      overflow-hidden
      transition-all duration-200
    `}>
      <div className="relative z-10 h-full">
        {children}
      </div>
      <style jsx>{noiseTexture}</style>
    </div>
  );
};

const CardHeader = ({ title, type }) => (
  <div className="p-3 flex items-center justify-between border-b border-white/10">
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-white/10">
        <CardIcon type={type} />
      </div>
      <h3 className={`font-bold text-lg text-white`}>{title}</h3>
    </div>
    <span className="px-2 py-0.5 text-xs  bg-white/10 rounded-full text-white/90">
      {type}
    </span>
  </div>
);

const ImagePlaceholder = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white/5">
      <svg 
        viewBox="0 0 100 100" 
        className="w-16 h-16 text-white/20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="10" width="80" height="80" rx="4" stroke="currentColor" strokeWidth="4"/>
        <path d="M10 70L30 50L45 65L70 35L90 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="35" cy="35" r="8" stroke="currentColor" strokeWidth="4"/>
      </svg>
    </div>
  );
};

const CardImage = ({ image }) => (
  <div className="h-40 bg-black/30 p-2">
    <div className="w-full h-full bg-black/20 rounded flex items-center justify-center overflow-hidden"> 
      {image && image.trim() ? (
        <img src={image} alt="" className="w-full h-full object-cover rounded" /> 
      ) : (
        <ImagePlaceholder />
      )}
    </div>
  </div>
);

const CardDescription = ({ description, tags }) => (
  <div className="p-3 border-t border-white/10 h-56 overflow-hidden flex flex-col justify-between ">
    <p className="text-sm leading-relaxed text-white/80 mb-2">{description}</p>
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <div key={index} className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full">
          <svg viewBox="0 0 24 24" className="w-3 h-3 text-white/60">
            <path d="M5 12l7-7 7 7-7 7-7-7z" fill="currentColor" />
          </svg>
          <span className="text-xs text-white">{tag}</span>
        </div>
      ))}
    </div>
  </div>
);

const CardProperties = ({ properties }) => (
  <div className="px-2 py-1 flex items-center justify-between bg-black/30 mt-auto"> {/* 减小 padding */}
    {properties.attack && (
      <div className="flex items-center gap-1">
        <span className="text-red-400 text-base">⚔️</span> {/* 修改为 text-base */}
        <span className="text-xs text-white">{properties.attack}</span>
      </div>
    )}
    {properties.defense && (
      <div className="flex items-center gap-1">
        <span className="text-blue-400 text-base">🛡️</span> {/* 修改为 text-base */}
        <span className="text-xs text-white">{properties.defense}</span>
      </div>
    )}
    {properties.cooldown && (
      <div className="flex items-center gap-1">
        <span className="text-amber-400 text-base">⏳</span> {/* 修改为 text-base */}
        <span className="text-xs text-white">{properties.cooldown}</span>
      </div>
    )}
    {properties.difficulty && (
      <div className="flex items-center gap-1">
        <span className="text-red-400 text-base">🔥</span> {/* 修改为 text-base */}
        <span className="text-xs text-white">{properties.difficulty}</span>
      </div>
    )}
  </div>
);

const GameCard = ({ cardtype, title, description, tags = [], properties = {}, image }) => {
  return (
    <CardFrame type={cardtype}>
      <div className="h-full flex flex-col">
        <CardHeader title={title} type={cardtype} />
        <CardImage image={image} />
        <CardProperties properties={properties} />
        <CardDescription description={description} tags={tags} />
      </div>
    </CardFrame>
  );
};

export default GameCard;
