import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
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
];

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
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

  return (
    <div style={{ perspective: 1000 }}>
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
        className={`group relative bg-white border rounded-3xl p-5 transition-shadow duration-300 flex flex-col justify-between h-full cursor-pointer ${
          isHovered
            ? 'shadow-[0_20px_45px_rgba(0,0,0,0.12)] border-[#FF5B37]/50'
            : member.isLeader
            ? 'border-[#FF5B37]/40 ring-1 ring-[#FF5B37]/20 shadow-md'
            : 'border-[#E8E6DF] shadow-soft'
        }`}
      >
        {/* Team Leader Badge */}
        {member.isLeader && (
          <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-md">
            <Crown className="w-3 h-3 text-white" />
            <span>TEAM LEADER</span>
          </div>
        )}

        {/* Photo Container */}
        <div className="space-y-4">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          </div>

          {/* Member Information */}
          <motion.div
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3, ease: smoothEase }}
            className="space-y-1"
          >
            <h3 className="font-semibold text-base sm:text-lg text-[#111322] group-hover:text-[#FF5B37] transition-colors duration-200">
              {member.name}
            </h3>
            <div className="text-xs font-mono font-semibold text-[#FF5B37]">
              {member.role}
            </div>
          </motion.div>
        </div>

        {/* Contribution Description */}
        <motion.div
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3, ease: smoothEase }}
          className="pt-4 mt-4 border-t border-[#E8E6DF]/60"
        >
          <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
            {member.contribution}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

interface TeamSectionProps {
  members?: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members = TEAM_MEMBERS }) => {
  return (
    <section id="team" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E8E6DF]/30">
      <div className="space-y-16">
        
        {/* ─── 1. SECTION HEADER (SCROLL REVEAL BLUR-TO-CLEAR) ────────────────── */}
        <ScrollReveal className="text-center space-y-4 max-w-2xl mx-auto" distance={40} duration={0.7}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E6DF] text-xs font-mono text-[#FF5B37] shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">PROJECT CREDITS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111322] leading-tight font-sans">
            MADE BY<br />
            <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">
              60FRAMES
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#6B6D76] font-light leading-relaxed max-w-xl mx-auto">
            Intelligent last-mile delivery and vehicle routing, powered by classical and quantum-inspired optimization.
          </p>
        </ScrollReveal>

        {/* ─── 2. RESPONSIVE TEAM CARDS GRID (STAGGERED ANIMATION) ───────── */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-6"
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
