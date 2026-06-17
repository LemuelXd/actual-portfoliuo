import { motion } from 'framer-motion';
import { Code2, Lightbulb, Rocket, Users, GraduationCap, MapPin, Calendar, Mail } from 'lucide-react';

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

const highlights = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable, and well-documented code following best practices.',
  },
  {
    icon: Lightbulb,
    title: 'Problem Solver',
    description: 'Analytical thinker who enjoys breaking down complex problems into simple solutions.',
  },
  {
    icon: Rocket,
    title: 'Fast Learner',
    description: 'Quickly adapting to new technologies and frameworks to stay ahead.',
  },
  {
    icon: Users,
    title: 'Team Player',
    description: 'Collaborating effectively with cross-functional teams to deliver results.',
  },
];

const personalInfo = [
  { icon: GraduationCap, label: 'Education', value: 'Software Engineering Student' },
  { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya' },
  { icon: Calendar, label: 'Experience', value: '2+ Years' },
  { icon: Mail, label: 'Email', value: 'njorogelem@gmail.com' },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4">
              About Me
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Get to Know </span>
              <span className="gradient-text">Lemuel</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A passionate software engineering student from Kenya, dedicated to crafting
              exceptional digital experiences.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - About Text */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  My Story
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    I'm a Kenyan software engineering student with a deep passion for building
                    interactive web applications that make a difference. My journey into tech
                    started with curiosity about how websites work, and that curiosity has evolved
                    into a dedicated pursuit of excellence in frontend development.
                  </p>
                  <p>
                    With a strong foundation in modern web technologies like React, TypeScript,
                    and Tailwind CSS, I specialize in creating responsive, user-friendly interfaces
                    that deliver exceptional user experiences. I'm particularly interested in
                    AI-powered storytelling platforms and exploring how technology can be used
                    to create more engaging narratives.
                  </p>
                  <p>
                    Currently, I'm expanding my skills towards full-stack development while
                    maintaining my focus on creating polished, performant frontend experiences.
                    I'm always eager to learn new technologies and take on challenging projects
                    that push my boundaries.
                  </p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                {personalInfo.map((info) => (
                  <motion.div
                    key={info.label}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {info.label}
                      </div>
                      <div className="text-sm text-white font-medium">{info.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Highlights */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">What I Bring</h2>
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="glass-card p-6 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <highlight.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {highlight.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Fun Fact */}
              <motion.div
                variants={itemVariants}
                className="glass-card p-6 border-cyan-500/30"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-cyan-400 font-medium">Fun Fact</span>
                </div>
                <p className="text-gray-300 text-sm">
                  When I'm not coding, you'll find me exploring new tech trends, contributing to
                  open-source projects, or mentoring aspiring developers in my community.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
