import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, ZoomIn } from 'lucide-react';
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
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [photoScale, setPhotoScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`routeq_scale_${member.id}`);
      return saved ? Number(saved) : 110;
    } catch {
      return 110;
    }
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable 3D tilt on touch/mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Subtle 3D tilt max ±3deg
    const rY = (mouseX / (rect.width / 2)) * 3;
    const rX = -(mouseY / (rect.height / 2)) * 3;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = Number(e.target.value);
    setPhotoScale(val);
    try {
      localStorage.setItem(`routeq_scale_${member.id}`, String(val));
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
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
          {/* Photo Frame Container (Fixed Compact Aspect & Clipped Overflow) */}
          <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center">
            <img
              src={member.image}
              alt={member.name}
              style={{
                transform: `scale(${isHovered ? (photoScale / 100) * 1.04 : photoScale / 100})`,
              }}
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out"
            />
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

        {/* Photo Scale Slider Control (Changes ONLY image zoom inside fixed frame) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="pt-3 mt-3 border-t border-[#E8E6DF]/50 flex items-center justify-between text-[10px] font-mono text-[#8E909A] select-none"
        >
          <div className="flex items-center gap-1 text-[#6B6D76]">
            <ZoomIn className="w-3 h-3 text-[#FF5B37]" />
            <span>Photo Scale</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="range"
              min="100"
              max="150"
              step="1"
              value={photoScale}
              onChange={handleScaleChange}
              className="w-16 h-1 bg-[#E8E6DF] accent-[#FF5B37] rounded-lg cursor-pointer"
              title="Adjust photo crop zoom"
            />
            <span className="w-7 text-right font-semibold text-[#FF5B37]">{photoScale}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface TeamSectionProps {
  members?: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members = TEAM_MEMBERS }) => {
  return (
    <section id="team" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-[#E8E6DF]/30">
      <div className="space-y-12">
        
        {/* ─── 1. SECTION HEADER (SCROLL REVEAL BLUR-TO-CLEAR) ────────────────── */}
        <ScrollReveal className="text-center space-y-3 max-w-2xl mx-auto" distance={40} duration={0.7}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E6DF] text-[11px] font-mono text-[#FF5B37] shadow-soft-sm">
            <Sparkles className="w-3 h-3" />
            <span className="font-semibold uppercase tracking-wider">PROJECT CREDITS</span>
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
              <TeamCard member={member} />
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
