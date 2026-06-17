import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiGit,
  SiGithub,
  SiFigma,
  SiNodedotjs,
  SiPython,
  SiNextdotjs,
} from 'react-icons/si';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

interface Skill {
  name: string;
  icon: React.ComponentType<any>;
  level: number;
  color: string;
  twColor: string;
}

const skills: Skill[] = [
  { name: 'React', icon: SiReact, level: 85, color: '#61DAFB', twColor: 'text-[#61DAFB]' },
  { name: 'TypeScript', icon: SiTypescript, level: 80, color: '#3178C6', twColor: 'text-[#3178C6]' },
  { name: 'JavaScript', icon: SiJavascript, level: 90, color: '#F7DF1E', twColor: 'text-[#F7DF1E]' },
  { name: 'HTML5', icon: SiHtml5, level: 95, color: '#E34F26', twColor: 'text-[#E34F26]' },
  { name: 'CSS3', icon: SiCss, level: 90, color: '#1572B6', twColor: 'text-[#1572B6]' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, level: 88, color: '#06B6D4', twColor: 'text-[#06B6D4]' },
];

const additionalSkills = [
  { name: 'Git', icon: SiGit, level: 75, color: '#F05032', twColor: 'text-[#F05032]' },
  { name: 'GitHub', icon: SiGithub, level: 80, color: '#FFFFFF', twColor: 'text-white' },
  { name: 'Figma', icon: SiFigma, level: 70, color: '#F24E1E', twColor: 'text-[#F24E1E]' },
  { name: 'Node.js', icon: SiNodedotjs, level: 65, color: '#339933', twColor: 'text-[#339933]' },
  { name: 'Python', icon: SiPython, level: 60, color: '#3776AB', twColor: 'text-[#3776AB]' },
  { name: 'Next.js', icon: SiNextdotjs, level: 70, color: '#FFFFFF', twColor: 'text-white' },
];

function CircularProgress({ skill, delay }: { skill: Skill; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isHovered, setIsHovered] = useState(false);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (skill.level / 100) * circumference;

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
      style={{
        transform: isHovered ? 'perspective(1000px) rotateY(10deg) rotateX(-5deg)' : 'none',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay, duration: 0.5 }}
        className="relative w-28 h-28"
      >
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="56"
            cy="56"
            r={radius}
            fill="none"
            stroke={skill.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset } : {}}
            transition={{ delay: delay + 0.3, duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${skill.color}40)`,
            }}
          />
        </svg>
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {(() => {
            const Icon = skill.icon;
            const className = `w-10 h-10 transition-transform duration-300 ${skill.twColor} ${isHovered ? 'scale-125' : 'scale-100'}`;
            return <Icon className={className} />;
          })()}
        </div>
      </motion.div>
      {/* Label */}
      <div className="mt-4 text-center">
        <h3 className="text-white font-semibold mb-1">{skill.name}</h3>
        <span className="text-cyan-400 font-mono text-sm">{skill.level}%</span>
      </div>
    </div>
  );
}

function LinearProgress({ skill, delay }: { skill: Skill; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {(() => {
            const Icon = skill.icon;
            return <Icon className={`w-5 h-5 ${skill.twColor}`} />;
          })()}
          <span className="text-white font-medium">{skill.name}</span>
        </div>
        <span className="text-cyan-400 font-mono text-sm">{skill.level}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: delay + 0.3, duration: 1.2, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
              My Skills
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Technical </span>
              <span className="gradient-text">Expertise</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A comprehensive overview of my technical skills and proficiency levels
              in various web technologies.
            </p>
          </motion.div>

          {/* Main Skills - Circular Progress */}
          <motion.div variants={itemVariants} className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Core Technologies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
              {skills.map((skill, index) => (
                <CircularProgress key={skill.name} skill={skill} delay={index * 0.1} />
              ))}
            </div>
          </motion.div>

          {/* Additional Skills - Linear Progress */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Additional Skills
            </h2>
            <div className="glass-card p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {additionalSkills.map((skill, index) => (
                  <LinearProgress key={skill.name} skill={skill} delay={index * 0.1} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skill Categories */}
          <motion.div variants={itemVariants} className="mt-16 grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'Frontend',
                skills: ['React', 'TypeScript', 'Tailwind CSS', 'Responsive Design'],
              },
              {
                title: 'Tools',
                skills: ['Git', 'VS Code', 'Figma', 'Chrome DevTools'],
              },
              {
                title: 'Learning',
                skills: ['Node.js', 'Next.js', 'PostgreSQL', 'Docker'],
              },
            ].map((category) => (
              <motion.div
                key={category.title}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{category.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
