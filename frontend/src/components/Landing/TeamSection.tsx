import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Crown } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { StaggerContainer, StaggerItem, smoothEase } from './AnimationPrimitives';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  image?: string | null;
  isLeader?: boolean;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'maruthi',
    name: 'G. Maruthi',
    role: 'Team Leader • Research & Integration',
    contribution: 'Research, system integration, project coordination, and connecting the optimization components with the overall RouteQ application.',
    image: null,
    isLeader: true,
  },
  {
    id: 'manohar',
    name: 'Manohar',
    role: 'Frontend & UI',
    contribution: 'Web interface, UI design, user interactions, animations, and route visualization.',
    image: null,
  },
  {
    id: 'ganesh',
    name: 'Y. Ganesh',
    role: 'Backend & API',
    contribution: 'Backend services, API development, optimizer integration, data processing, and communication between the frontend and optimization engine.',
    image: null,
  },
  {
    id: 'gunavarsha',
    name: 'M. Gunavarsha',
    role: 'Quantum Optimization',
    contribution: 'Qiskit integration, QAOA implementation, quantum optimization workflow, and quantum-inspired routing logic.',
    image: null,
  },
  {
    id: 'charan',
    name: 'M. Charan Prasad',
    role: 'Bug Testing & Quality Assurance',
    contribution: 'Testing the application, identifying bugs, validating functionality, checking optimization behavior, and helping ensure the application works reliably.',
    image: null,
  },
  {
    id: 'ajay',
    name: 'L. Ajay Kumar',
    role: 'Bug Testing & Quality Assurance',
    contribution: 'Application testing, bug identification, UI/functionality verification, edge-case testing, and final quality checks.',
    image: null,
  },
];

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

        {/* ─── 2. 3 × 2 RESPONSIVE TEAM CARDS GRID (STAGGERED ANIMATION) ───────── */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          staggerDelay={0.1}
          viewportOnce={false}
          viewportAmount={0.12}
        >
          {members.map((member) => (
            <StaggerItem key={member.id} distance={40} duration={0.7}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.25, ease: smoothEase } }}
                className={`group relative bg-white border rounded-3xl p-5 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full ${
                  member.isLeader
                    ? 'border-[#FF5B37]/40 ring-1 ring-[#FF5B37]/20 shadow-md'
                    : 'border-[#E8E6DF] hover:border-[#FF5B37]/30'
                }`}
              >
                {/* Team Leader Badge */}
                {member.isLeader && (
                  <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF5B37] to-[#FF4D8D] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-sm">
                    <Crown className="w-3 h-3 text-white" />
                    <span>TEAM LEADER</span>
                  </div>
                )}

                {/* Photo Container / Placeholder */}
                <div className="space-y-4">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F7F6F2] via-[#E8E6DF]/40 to-[#FF5B37]/5 border border-[#E8E6DF] flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center select-none">
                        <div className={`w-12 h-12 rounded-2xl bg-white border shadow-soft-sm flex items-center justify-center transition-colors duration-300 ${
                          member.isLeader
                            ? 'text-[#FF5B37] border-[#FF5B37]/30'
                            : 'text-[#8E909A] border-[#E8E6DF] group-hover:text-[#FF5B37] group-hover:border-[#FF5B37]/30'
                        }`}>
                          <User className="w-6 h-6" />
                        </div>
                        <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#8E909A] group-hover:text-[#6B6D76] transition-colors duration-300">
                          PHOTO PLACEHOLDER
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Member Information */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base sm:text-lg text-[#111322] group-hover:text-[#FF5B37] transition-colors duration-200">
                      {member.name}
                    </h3>
                    <div className="text-xs font-mono font-semibold text-[#FF5B37]">
                      {member.role}
                    </div>
                  </div>
                </div>

                {/* Contribution Description */}
                <div className="pt-4 mt-4 border-t border-[#E8E6DF]/60">
                  <p className="text-xs text-[#6B6D76] font-light leading-relaxed">
                    {member.contribution}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};
