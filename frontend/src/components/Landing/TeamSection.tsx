import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { StaggerContainer, StaggerItem, smoothEase } from './AnimationPrimitives';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contribution: string;
  image?: string | null;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Member Name',
    role: 'Frontend & UI',
    contribution: 'Designed interactive route visualizer, responsive controls, and animation system.',
    image: null,
  },
  {
    id: 'member-2',
    name: 'Member Name',
    role: 'Backend & API',
    contribution: 'Architected FastAPI dispatch engine, Mappls traffic integration, and route endpoints.',
    image: null,
  },
  {
    id: 'member-3',
    name: 'Member Name',
    role: 'Quantum Optimization',
    contribution: 'Formulated CVRPTW QUBO/Ising cost Hamiltonians & Qiskit QAOA circuits.',
    image: null,
  },
  {
    id: 'member-4',
    name: 'Member Name',
    role: 'Research & Integration',
    contribution: 'Empirical benchmark analysis, objective weight tuning, and constraint validation.',
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
            <span className="font-semibold uppercase tracking-wider">PROJECT CREATORS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#111322] leading-tight font-sans">
            MADE BY <span className="bg-gradient-to-r from-[#FF5B37] via-[#FF7A3D] to-[#FF4D8D] bg-clip-text text-transparent">TEAM 60</span>
          </h2>

          <p className="text-sm sm:text-base text-[#6B6D76] font-light leading-relaxed">
            Built for intelligent last-mile delivery and vehicle routing.
          </p>
        </ScrollReveal>

        {/* ─── 2. RESPONSIVE TEAM CARDS GRID (STAGGERED ANIMATION) ─────────────── */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          staggerDelay={0.11}
          viewportOnce={false}
          viewportAmount={0.15}
        >
          {members.map((member) => (
            <StaggerItem key={member.id} distance={40} duration={0.7}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.25, ease: smoothEase } }}
                className="group relative bg-white border border-[#E8E6DF] rounded-3xl p-5 shadow-soft hover:shadow-xl hover:border-[#FF5B37]/30 transition-all duration-300 flex flex-col justify-between h-full"
              >
                {/* Photo Container / Placeholder */}
                <div className="space-y-4">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F7F6F2] via-[#E8E6DF]/40 to-[#FF5B37]/5 border border-[#E8E6DF] flex items-center justify-center">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center select-none">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E6DF] shadow-soft-sm flex items-center justify-center text-[#8E909A] group-hover:text-[#FF5B37] group-hover:border-[#FF5B37]/30 transition-colors duration-300">
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
                    <h3 className="font-semibold text-base text-[#111322] group-hover:text-[#FF5B37] transition-colors duration-200">
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
