import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Upload, Sliders, RotateCcw, ZoomIn, MoveHorizontal, MoveVertical } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { StaggerContainer, StaggerItem, smoothEase } from './AnimationPrimitives';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  image: string;
  isLeader?: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'maruthi',
    name: 'G. Maruthi',
    role: 'Team Leader • Research & Integration',
    contribution: 'Research, system integration, project coordination, and connecting the optimization components with the RouteQ application.',
    image: '/team/maruthi.jpg',
    isLeader: true,
  },
  {
    id: 'manohar',
    name: 'Manohar',
    role: 'Frontend & UI',
    contribution: 'Web interface, UI design, user interactions, animations, and route visualization.',
    image: '/team/manohar.jpg',
  },
  {
    id: 'ganesh',
    name: 'Y. Ganesh',
    role: 'Backend & API',
    contribution: 'Backend services, API development, optimizer integration, data processing, and communication between the frontend and optimization engine.',
    image: '/team/ganesh.jpg',
  },
  {
    id: 'gunavarsha',
    name: 'M. Gunavarsha',
    role: 'Quantum Optimization',
    contribution: 'Qiskit integration, QAOA implementation, quantum optimization workflow, and quantum-inspired routing logic.',
    image: '/team/gunavarsha.jpg',
  },
  {
    id: 'charan',
    name: 'M. Charan Prasad',
    role: 'Bug Testing & Quality Assurance',
    contribution: 'Application testing, bug identification, functionality validation, optimization testing, and reliability checks.',
    image: '/team/charan.jpg',
  },
  {
    id: 'ajay',
    name: 'L. Ajay Kumar',
    role: 'Bug Testing & Quality Assurance',
    contribution: 'Application testing, bug identification, UI and functionality verification, edge-case testing, and final quality checks.',
    image: '/team/ajay.jpg',
  },
];

interface TeamCardProps {
  member: TeamMember;
  isEditMode: boolean;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, isEditMode }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Per-member photo URL state (supports direct upload DataURL or disk path)
  const [currentImage, setCurrentImage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`routeq_photo_${member.id}`);
      return saved || member.image;
    } catch {
      return member.image;
    }
  });

  // Per-member photo fine-tuning states (Zoom: 0.5x -> 2.0x, default 1.0x)
  const [zoom, setZoom] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`routeq_zoom_${member.id}`);
      return saved ? Number(saved) : 1.0;
    } catch {
      return 1.0;
    }
  });

  const [offsetX, setOffsetX] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`routeq_shift_x_${member.id}`);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [offsetY, setOffsetY] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`routeq_shift_y_${member.id}`);
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rY = (mouseX / (rect.width / 2)) * 3;
    const rX = -(mouseY / (rect.height / 2)) * 3;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Handle Direct Computer File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCurrentImage(result);
        // Reset zoom & shift when a new photo is uploaded so the FULL photo is visible
        setZoom(1.0);
        setOffsetX(0);
        setOffsetY(0);
        try {
          localStorage.setItem(`routeq_photo_${member.id}`, result);
          localStorage.setItem(`routeq_zoom_${member.id}`, '1.0');
          localStorage.setItem(`routeq_shift_x_${member.id}`, '0');
          localStorage.setItem(`routeq_shift_y_${member.id}`, '0');
        } catch (err) {
          console.warn('[RouteQ Team] Could not persist uploaded image to localStorage:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset photo zoom and position to default (Full Original Photo Visible)
  const handleResetControls = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(1.0);
    setOffsetX(0);
    setOffsetY(0);
    try {
      localStorage.removeItem(`routeq_zoom_${member.id}`);
      localStorage.removeItem(`routeq_shift_x_${member.id}`);
      localStorage.removeItem(`routeq_shift_y_${member.id}`);
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      {/* Hidden File Picker Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileUpload}
      />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          y: isHovered ? -12 : 0,
          scale: isHovered ? 1.02 : 1,
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        transition={{
          duration: 0.35,
          ease: smoothEase,
        }}
        className={`group relative bg-white border rounded-2xl p-4 sm:p-4.5 transition-shadow duration-300 flex flex-col justify-between h-full cursor-pointer ${
          isHovered
            ? 'shadow-[0_20px_40px_rgba(0,0,0,0.11)] border-[#FF5B37]/50'
            : member.isLeader
            ? 'border-[#FF5B37]/40 ring-1 ring-[#FF5B37]/20 shadow-sm'
            : 'border-[#E8E6DF] shadow-soft-sm'
        }`}
      >
        {/* Team Leader Badge */}
        {member.isLeader && (
          <div className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D] text-white text-[9.5px] font-mono font-bold tracking-wider uppercase shadow-sm">
            <Crown className="w-2.5 h-2.5 text-white" />
            <span>TEAM LEADER</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Photo Frame Container (Fixed Compact Viewport & Clipped Overflow) */}
          <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center">
            <img
              src={currentImage}
              alt={member.name}
              style={{
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${isHovered ? zoom * 1.03 : zoom})`,
              }}
              className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out"
            />

            {/* In Edit Mode: Overlay Upload / Change Photo Button inside photo container */}
            {isEditMode && (
              <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-3 opacity-90 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white text-[#111322] text-[11px] font-mono font-bold hover:bg-[#FF5B37] hover:text-white transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>{currentImage !== member.image ? 'Change Photo' : 'Upload Photo'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Member Information */}
          <motion.div
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="space-y-0.5"
          >
            <h3 className="font-semibold text-sm sm:text-base text-[#111322] group-hover:text-[#FF5B37] transition-colors duration-200">
              {member.name}
            </h3>
            <div className="text-[11px] font-mono font-semibold text-[#FF5B37]">
              {member.role}
            </div>
          </motion.div>

          {/* Contribution Description */}
          <motion.div
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="pt-2.5 border-t border-[#E8E6DF]/60"
          >
            <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
              {member.contribution}
            </p>
          </motion.div>
        </div>

        {/* Photo Edit Controls (Visible ONLY in Edit Mode to keep normal cards clean & compact) */}
        {isEditMode && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="pt-3 mt-3 border-t border-[#E8E6DF] space-y-2 text-[10px] font-mono text-[#8E909A] select-none animate-in fade-in duration-200"
          >
            {/* Zoom Slider Control (0.5x -> 2.0x, Default 1.0x) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#6B6D76]">
                <ZoomIn className="w-3 h-3 text-[#FF5B37]" />
                <span>Zoom</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setZoom(val);
                    try { localStorage.setItem(`routeq_zoom_${member.id}`, String(val)); } catch {}
                  }}
                  className="w-16 h-1 bg-[#E8E6DF] accent-[#FF5B37] rounded-lg cursor-pointer"
                />
                <span className="w-8 text-right font-semibold text-[#FF5B37]">{zoom.toFixed(2)}x</span>
              </div>
            </div>

            {/* Shift X Control (-100px -> +100px) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#6B6D76]">
                <MoveHorizontal className="w-3 h-3 text-[#FF5B37]" />
                <span>Shift X</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={offsetX}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOffsetX(val);
                    try { localStorage.setItem(`routeq_shift_x_${member.id}`, String(val)); } catch {}
                  }}
                  className="w-16 h-1 bg-[#E8E6DF] accent-[#FF5B37] rounded-lg cursor-pointer"
                />
                <span className="w-8 text-right font-semibold text-[#FF5B37]">{offsetX}px</span>
              </div>
            </div>

            {/* Shift Y Control (-100px -> +100px) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[#6B6D76]">
                <MoveVertical className="w-3 h-3 text-[#FF5B37]" />
                <span>Shift Y</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="1"
                  value={offsetY}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setOffsetY(val);
                    try { localStorage.setItem(`routeq_shift_y_${member.id}`, String(val)); } catch {}
                  }}
                  className="w-16 h-1 bg-[#E8E6DF] accent-[#FF5B37] rounded-lg cursor-pointer"
                />
                <span className="w-8 text-right font-semibold text-[#FF5B37]">{offsetY}px</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-1 flex justify-end">
              <button
                onClick={handleResetControls}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F7F6F2] hover:bg-[#E8E6DF] text-[#6B6D76] hover:text-[#111322] text-[9.5px] font-mono transition-colors cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface TeamSectionProps {
  members?: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members = TEAM_MEMBERS }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  return (
    <section id="team" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E8E6DF]/30">
      <div className="space-y-12">
        
        {/* ─── 1. SECTION HEADER (SCROLL REVEAL BLUR-TO-CLEAR & EDIT TOGGLE) ──── */}
        <ScrollReveal className="text-center space-y-4 max-w-2xl mx-auto" distance={40} duration={0.7}>
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6DF] text-[11px] font-mono text-[#FF5B37] shadow-soft-sm">
              <Sparkles className="w-3 h-3" />
              <span className="font-semibold uppercase tracking-wider">PROJECT CREDITS</span>
            </div>

            {/* Edit Photos Mode Toggle Button */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all duration-200 cursor-pointer shadow-soft-sm ${
                isEditMode
                  ? 'bg-[#111322] text-white border border-[#111322]'
                  : 'bg-white text-[#FF5B37] border border-[#E8E6DF] hover:border-[#FF5B37]/40'
              }`}
              title="Toggle Photo Upload & Position Fine-Tuning Controls"
            >
              <Sliders className="w-3 h-3" />
              <span>{isEditMode ? 'Done Editing' : 'Edit Photos'}</span>
            </button>
          </div>

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111322] leading-tight font-sans">
            MADE BY<br />
            <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
              60FRAMES
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-[#6B6D76] font-light leading-relaxed max-w-lg mx-auto">
            Intelligent last-mile delivery and vehicle routing, powered by classical and quantum-inspired optimization.
          </p>
        </ScrollReveal>

        {/* ─── 2. 3 × 2 COMPACT RESPONSIVE TEAM CARDS GRID ─────────────────────── */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          staggerDelay={0.1}
          viewportOnce={false}
          viewportAmount={0.12}
        >
          {members.map((member) => (
            <StaggerItem key={member.id} distance={40} duration={0.7}>
              <TeamCard member={member} isEditMode={isEditMode} />
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
