import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ArrowRight, Dumbbell, BarChart3, ExternalLink } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  techStack: string[];
  githubUrl: string;
  internalLink?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 'fitness',
    title: 'Fitness Tracker App',
    description:
      'Track your workouts, monitor calories burned, and visualize your fitness progress with interactive charts and progress rings.',
    icon: Dumbbell,
    techStack: ['React', 'TypeScript', 'Recharts', 'LocalStorage'],
    githubUrl: 'https://github.com',
    internalLink: '/fitness',
    featured: true,
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description:
      'A modern analytics dashboard with data visualization, real-time updates, and responsive design.',
    icon: BarChart3,
    techStack: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS'],
    githubUrl: 'https://github.com',
    internalLink: '/dashboard',
    featured: true,
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative"
    >
      {project.internalLink ? (
        <Link to={project.internalLink}>
          <ProjectCardContent project={project} />
        </Link>
      ) : (
        <ProjectCardContent project={project} />
      )}
    </motion.div>
  );
}

function ProjectCardContent({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`glass-card overflow-hidden h-full cursor-pointer ${
        project.featured ? 'border-cyan-500/30' : ''
      }`}
    >
      {/* Featured Badge */}
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-medium">
            Featured
          </span>
        </div>
      )}

      {/* Image/Icon Area */}
      <div className="h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center"
        >
          <project.icon 
            // @ts-ignore
            className="w-10 h-10 text-cyan-400" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded-md bg-white/5 text-gray-300 text-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {project.internalLink ? (
            <span className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
              View Project
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          ) : (
            <>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </motion.a>
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4" />
                Code
              </motion.a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background */}
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
              My Work
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Featured </span>
              <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A collection of projects showcasing my skills in frontend development,
              from interactive web applications to responsive designs.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <p className="text-gray-400 mb-6">
              Want to see more of my work?
            </p>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              View All Projects on GitHub
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
