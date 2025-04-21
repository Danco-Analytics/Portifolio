import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Mail, Linkedin, Github, Phone, ArrowRight, ChevronDown, X, Menu, Sun, Moon, BrainCircuit, User, Briefcase, GraduationCap, PenTool, Code, MessageSquare } from 'lucide-react';

// Mock Data (Replace with your actual data)
const projects = [
  {
    id: 1,
    title: "GDP Growth Prediction Model",
    description: "Developed a machine learning model to predict annual GDP growth using economic indicators.",
    tags: ["Finance", "AI", "Python"],
    imageUrl: "https://placehold.co/600x400/0B0C10/F7F7F7?text=GDP+Model",
    altImageUrl: "https://placehold.co/600x400/66FCF1/0B0C10?text=GDP+Viz",
    problem: "Needed a reliable way to forecast national economic growth based on key indicators.",
    dataUsed: "Exchange rates, inflation rates, historical GDP data.",
    results: "Provided insights for policymakers to guide economic strategies.",
    techStack: ["Python", "Scikit-learn", "Pandas"],
    githubUrl: "https://github.com/MadScie254/Phase-3-Project-Modelling", // From resume
    liveDemoUrl: null,
    accentColor: "blue-500",
  },
  {
    id: 2,
    title: "AI-Driven Plant Disease Detection",
    description: "Collaboratively developed an advanced plant disease detection system using image processing.",
    tags: ["Health", "AI", "CV"],
    imageUrl: "https://placehold.co/600x400/0B0C10/F7F7F7?text=Plant+AI",
    altImageUrl: "https://placehold.co/600x400/66FCF1/0B0C10?text=Plant+Viz",
    problem: "Early and accurate detection of plant diseases is crucial for agriculture.",
    dataUsed: "Image datasets of healthy and diseased plants.",
    results: "Enhanced early detection, contributing to improved crop yields.",
    techStack: ["Python", "TensorFlow", "OpenCV"],
    githubUrl: "https://github.com/MadScie254/Capstone-Lazarus", // From resume
    liveDemoUrl: null,
    accentColor: "green-500",
  },
  {
    id: 3,
    title: "Kenya's GDP Forecasting Tool",
    description: "Developed a forecasting tool to analyze and predict Kenya's GDP trends.",
    tags: ["Finance", "TimeSeries", "Python"],
    imageUrl: "https://placehold.co/600x400/0B0C10/F7F7F7?text=Kenya+GDP",
    altImageUrl: "https://placehold.co/600x400/66FCF1/0B0C10?text=Kenya+Viz",
    problem: "Stakeholders needed fact-based analysis of economic trends for planning.",
    dataUsed: "Time-series data, economic indicators specific to Kenya.",
    results: "Aided in strategic planning and policy formulation.",
    techStack: ["Python", "Statsmodels", "Pandas"],
    githubUrl: "https://github.com/MadScie254/GDP-Forecast-Sample", // From resume
    liveDemoUrl: null,
    accentColor: "red-500",
  },
   {
    id: 4,
    title: "InvestWise Predictor",
    description: "Intelligent online tool using neural networks to predict investment opportunities in Kenya.",
    tags: ["Finance", "AI", "Web"],
    imageUrl: "https://placehold.co/600x400/0B0C10/F7F7F7?text=InvestWise",
    altImageUrl: "https://placehold.co/600x400/66FCF1/0B0C10?text=Invest+Viz",
    problem: "Investors needed data-driven guidance on suitable business ventures.",
    dataUsed: "Economic indicators, trade data, financial metrics.",
    results: "Assisted investors in making informed decisions, promoting regional economic growth.",
    techStack: ["Python", "TensorFlow", "Flask (implied)"],
    githubUrl: "https://github.com/MadScie254/InvestWise-Predictor-Project", // From resume
    liveDemoUrl: null,
    accentColor: "purple-500",
  },
  {
    id: 5,
    title: "Netflix Stock Profit Analysis",
    description: "Analyzed Netflix's stock performance to identify profit trends and patterns.",
    tags: ["Finance", "Analysis", "Python"],
    imageUrl: "https://placehold.co/600x400/0B0C10/F7F7F7?text=Netflix+Stock",
    altImageUrl: "https://placehold.co/600x400/66FCF1/0B0C10?text=Netflix+Viz",
    problem: "Understanding historical stock performance to inform investment decisions.",
    dataUsed: "Historical Netflix stock data.",
    results: "Provided insights into the profitability and patterns of investing in Netflix.",
    techStack: ["Python", "Pandas", "Matplotlib"],
    githubUrl: "https://github.com/MadScie254/Netflix-Analysis", // From resume
    liveDemoUrl: null,
    accentColor: "yellow-500",
  },
  // Add more projects as needed
];

const essays = [
  { id: 1, title: "The Ethics of Algorithmic Decision Making", category: "Ethics", description: "Exploring the biases and societal impacts...", readTime: "7 min", insight: "Bias in, bias out." },
  { id: 2, title: "Scaling Machine Learning Infrastructure", category: "Infrastructure", description: "Challenges and solutions for deploying ML models...", readTime: "10 min", insight: "MLOps is key." },
  { id: 3, title: "RNNs vs Transformers for Time Series", category: "ML", description: "A comparative analysis of deep learning models...", readTime: "12 min", insight: "Context matters." },
  { id: 4, title: "Data Privacy in Healthcare AI", category: "Health", description: "Navigating HIPAA and ethical considerations...", readTime: "8 min", insight: "Anonymization is crucial." },
  // Add more essays
];

const demos = [
    { id: 1, title: "Plant Disease Detector", description: "Upload an image to detect common plant diseases.", iframeUrl: null /* Replace with actual Streamlit/JS Playground URL */ },
    { id: 2, title: "GDP Forecast Interactive", description: "Adjust parameters to see GDP forecast variations.", iframeUrl: null },
    // Add more demos
];

// Helper Components
const Section = ({ id, children, className = '' }) => (
  <motion.section
    id={id}
    className={`min-h-screen w-full py-20 px-4 md:px-8 lg:px-16 ${className}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.section>
);

const SectionTitle = ({ children }) => (
  <motion.h2
    className="text-4xl md:text-5xl font-bold mb-12 text-center text-[#66FCF1] font-grotesk tracking-tight"
    initial={{ opacity: 0, y: -20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {children}
  </motion.h2>
);

const Badge = ({ icon: Icon, text, tooltipText, delay = 0 }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <motion.div
      className="relative flex items-center bg-[#1F2833]/70 backdrop-blur-sm text-[#F7F7F7] px-4 py-2 rounded-lg shadow-md border border-[#45A29E]/50"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Icon className="w-5 h-5 mr-2 text-[#66FCF1]" />
      <span>{text}</span>
      <AnimatePresence>
        {showTooltip && tooltipText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-[#66FCF1] text-[#0B0C10] text-xs rounded-md shadow-lg whitespace-nowrap z-10"
          >
            {tooltipText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      layoutId={`card-container-${project.id}`}
      className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer bg-[#1F2833]/50 backdrop-blur-md border border-[#45A29E]/30 group break-inside-avoid mb-6`}
      onClick={() => onClick(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Define hover animation state
      whileHover={{ scale: 1.03, zIndex: 10 }}
      // Define initial animation state
      initial={{ opacity: 0, y: 50 }}
      // Define state when in view
      whileInView={{ opacity: 1, y: 0 }}
      // Define viewport settings for whileInView
      viewport={{ once: true, amount: 0.1 }}
      // Define ONE transition prop for initial/whileInView and hover
      // Removed the duplicate transition prop that caused the error.
      transition={{ duration: 0.5 }}
    >
      {/* Accent color ribbon */}
      <div className={`absolute top-0 left-0 h-1 w-full bg-${project.accentColor} z-10`}></div>
      {/* Image container with crossfade */}
      <div className="relative h-48 w-full">
        <AnimatePresence>
          <motion.img
            key={isHovered ? project.altImageUrl : project.imageUrl} // Change key to trigger animation
            src={isHovered ? project.altImageUrl : project.imageUrl}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // Transition for the image crossfade
            onError={(e) => e.target.src = 'https://placehold.co/600x400/0B0C10/F7F7F7?text=Image+Error'}
          />
        </AnimatePresence>
      </div>
      {/* Card content */}
      <div className="p-4 text-[#F7F7F7]">
        <h3 className="text-xl font-semibold mb-2 font-satoshi text-[#66FCF1]">{project.title}</h3>
        <p className="text-sm mb-3 text-[#C5C6C7] font-satoshi">{project.description}</p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs bg-[#45A29E]/50 text-[#66FCF1] px-2 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      {/* Hover overlay gradient */}
       <motion.div
         className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
       />
       {/* Hover text indicator */}
       <motion.div className="absolute bottom-4 left-4 text-[#66FCF1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
         View Project <ArrowRight className="ml-1 h-4 w-4" />
       </motion.div>
    </motion.div>
  );
};


// Project Modal Component
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  // Basic tech stack icon mapping (replace with actual icons/components if available)
  const TechIcon = ({ tech }) => {
      // In a real app, you'd map tech names to actual icon components
      // For now, just display the name
      return <span className="text-xs bg-[#45A29E]/60 text-[#F7F7F7] px-2 py-1 rounded-md">{tech}</span>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0B0C10]/90 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close modal on backdrop click
    >
      {/* Modal content container */}
      <motion.div
        layoutId={`card-container-${project.id}`} // Links animation to the card
        className="bg-[#1F2833] text-[#F7F7F7] rounded-xl shadow-2xl overflow-hidden max-w-3xl w-full border border-[#45A29E]/50"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Modal header with image and close button */}
        <div className="relative">
           <img src={project.altImageUrl || project.imageUrl} alt={project.title} className="w-full h-64 object-cover" onError={(e) => e.target.src = 'https://placehold.co/800x400/0B0C10/F7F7F7?text=Image+Error'} />
           <button onClick={onClose} className="absolute top-4 right-4 text-[#F7F7F7] bg-[#0B0C10]/50 rounded-full p-2 hover:bg-[#66FCF1] hover:text-[#0B0C10] transition-colors duration-200 z-10" aria-label="Close project details">
             <X size={20} />
           </button>
           {/* Accent color line */}
           <div className={`absolute bottom-0 left-0 h-1.5 w-full bg-${project.accentColor}`}></div>
        </div>

        {/* Modal body with scrollable content */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {/* Project Title */}
          <motion.h2
             className="text-3xl font-bold mb-4 text-[#66FCF1] font-grotesk"
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
             {project.title}
          </motion.h2>

          {/* Project Details */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold text-lg mb-1 text-[#66FCF1]">Problem Statement</h4>
            <p className="mb-4 text-[#C5C6C7] font-satoshi">{project.problem}</p>

            <h4 className="font-semibold text-lg mb-1 text-[#66FCF1]">Data Used</h4>
            <p className="mb-4 text-[#C5C6C7] font-satoshi">{project.dataUsed}</p>

            <h4 className="font-semibold text-lg mb-1 text-[#66FCF1]">Results</h4>
            <p className="mb-4 text-[#C5C6C7] font-satoshi">{project.results}</p>

            <h4 className="font-semibold text-lg mb-2 text-[#66FCF1]">Tech Stack</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.techStack.map(tech => <TechIcon key={tech} tech={tech} />)}
            </div>
          </motion.div>

          {/* Links */}
          <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-[#45A29E] text-[#0B0C10] rounded-lg hover:bg-[#66FCF1] transition-colors duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Github size={18} className="mr-2" /> GitHub
              </a>
            )}
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-[#66FCF1] text-[#0B0C10] rounded-lg hover:bg-[#45A29E] transition-colors duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                <Code size={18} className="mr-2" /> Live Demo
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};


// Essay Card Component
const EssayCard = ({ essay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Scroll progress bar on hover (simplified)
  const hoverProgressStyle = {
      width: isHovered ? '100%' : '0%',
      transition: 'width 0.5s ease-in-out'
  };

  return (
    <motion.div
      ref={cardRef}
      className="bg-[#1F2833]/60 backdrop-blur-sm border border-[#45A29E]/40 rounded-xl p-6 mb-6 shadow-lg relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: essay.id % 2 === 0 ? 50 : -50 }} // Alternate slide-in
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      {/* Category Tag */}
      <span className="absolute top-4 right-4 text-xs bg-[#45A29E]/70 text-[#66FCF1] px-2 py-1 rounded-full">{essay.category}</span>
      {/* Title */}
      <h3 className="text-xl font-semibold mb-2 text-[#66FCF1] font-satoshi">{essay.title}</h3>
      {/* Description */}
      <p className="text-[#C5C6C7] text-sm mb-3 font-satoshi">{essay.description}</p>
      {/* Meta Info (Read Time & Hover Insight) */}
      <div className="flex justify-between items-center text-xs text-[#45A29E]">
        <span>{essay.readTime}</span>
        <AnimatePresence>
         {isHovered && (
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-[#66FCF1] italic"
            >
               "{essay.insight}"
            </motion.p>
         )}
        </AnimatePresence>
      </div>
      {/* Hover progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-[#66FCF1]" style={hoverProgressStyle}></div>
    </motion.div>
  );
};


// Demo Card Component
const DemoCard = ({ demo }) => {
    // In a real app, clicking this might open a modal with the iframe or navigate
    const handleClick = () => {
        if (demo.iframeUrl) {
            // Logic to open modal or navigate
            alert(`Opening demo: ${demo.title}`); // Placeholder action
        } else {
            alert(`Demo for ${demo.title} is not available yet.`);
        }
    };

    return (
        <motion.div
            className="bg-[#1F2833]/60 backdrop-blur-sm border border-[#45A29E]/40 rounded-xl p-6 shadow-lg cursor-pointer hover:border-[#66FCF1]/60 transition-colors duration-300 group" // Added group class
            onClick={handleClick}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            {/* Icon */}
            <Code size={24} className="mb-3 text-[#66FCF1]" />
            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 text-[#F7F7F7] font-satoshi">{demo.title}</h3>
            {/* Description */}
            <p className="text-[#C5C6C7] text-sm font-satoshi">{demo.description}</p>
            {/* Click hint */}
             <div className="mt-4 text-right text-xs text-[#66FCF1] opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                Try Demo &rarr;
            </div>
        </motion.div>
    );
};


// Contact Form Component
const ContactForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(''); // '', 'sending', 'sent', 'error'
    const [errors, setErrors] = useState({}); // For field validation errors

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error for the field being edited
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // Validate form fields
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.message.trim()) newErrors.message = "Message is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setStatus('error'); // Indicate validation error state
            setTimeout(() => setStatus(''), 2000); // Reset status after a bit
            return;
        }

        setStatus('sending');
        setErrors({}); // Clear errors on successful validation start

        // Simulate form submission (replace with actual API call)
        console.log("Form data:", formData);
        // Example: Replace with fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) })
        setTimeout(() => {
            // Simulate success
            setStatus('sent');
            setFormData({ name: '', email: '', message: '' }); // Clear form
            setTimeout(() => setStatus(''), 3000); // Reset status after success message

            // Simulate error (uncomment to test error state)
            // setStatus('error');
            // setTimeout(() => setStatus(''), 3000);

        }, 1500);
    };

    // Helper to get border color based on validation status
    const getBorderColor = (fieldName) => {
        if (errors[fieldName]) return 'border-red-500 ring-red-500'; // Error state
        if (formData[fieldName] && !errors[fieldName]) return 'border-green-500'; // Valid state (optional)
        return 'border-[#45A29E]/50 focus:border-[#66FCF1] focus:ring-[#66FCF1]'; // Default/Focus state
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            noValidate // Disable browser default validation
        >
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#C5C6C7] mb-1">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg bg-[#0B0C10] border text-[#F7F7F7] transition duration-200 outline-none ring-1 ring-transparent ${getBorderColor('name')}`}
                    placeholder="Your Name"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <p id="name-error" className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#C5C6C7] mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg bg-[#0B0C10] border text-[#F7F7F7] transition duration-200 outline-none ring-1 ring-transparent ${getBorderColor('email')}`}
                    placeholder="your.email@example.com"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                />
                 {errors.email && <p id="email-error" className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
            {/* Message Field */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#C5C6C7] mb-1">Message</label>
                <textarea
                    name="message"
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg bg-[#0B0C10] border text-[#F7F7F7] transition duration-200 outline-none resize-none ring-1 ring-transparent ${getBorderColor('message')}`}
                    placeholder="How can I help?"
                     aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                ></textarea>
                 {errors.message && <p id="message-error" className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>
            {/* Submit Button */}
            <div>
                <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ease-out flex items-center justify-center shadow-md hover:shadow-lg ${
                        status === 'sending' ? 'bg-[#45A29E] text-[#C5C6C7] cursor-not-allowed' :
                        status === 'sent' ? 'bg-green-500 text-white' :
                        status === 'error' ? 'bg-red-500 text-white animate-shake' : // Added shake animation on error
                        'bg-[#66FCF1] text-[#0B0C10] hover:bg-[#45A29E] hover:text-[#F7F7F7] transform hover:-translate-y-1'
                    }`}
                     whileHover={{ scale: status !== 'sending' && status !== 'sent' && status !== 'error' ? 1.05 : 1 }} // Only scale if not in a status state
                     whileTap={{ scale: status !== 'sending' && status !== 'sent' && status !== 'error' ? 0.95 : 1 }} // Only tap if not in a status state
                >
                    {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : status === 'error' ? 'Please Check Errors' : 'Send Message'}
                    {status !== 'sending' && status !== 'sent' && status !== 'error' && <ArrowRight className="ml-2 h-5 w-5" />}
                </motion.button>
            </div>
        </motion.form>
    );
};


// Social Card Component
const SocialCard = ({ icon: Icon, text, url, delay = 0 }) => (
    <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center p-4 bg-[#1F2833]/60 backdrop-blur-sm border border-[#45A29E]/40 rounded-lg text-[#F7F7F7] hover:bg-[#45A29E]/80 hover:border-[#66FCF1]/60 transition-all duration-300 group"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ y: -3, boxShadow: "0 4px 15px rgba(102, 252, 241, 0.1)" }}
    >
        <Icon className="w-6 h-6 mr-4 text-[#66FCF1] group-hover:scale-110 transition-transform" />
        <span className="font-medium">{text}</span>
        {/* Arrow icon shifts on hover */}
        <ArrowRight className="ml-auto h-5 w-5 text-[#45A29E] group-hover:text-[#66FCF1] group-hover:translate-x-1 transition-transform" />
    </motion.a>
);


// Main App Component
function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  // Refs for sections to enable scrolling and active state detection
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const essaysRef = useRef(null);
  const demosRef = useRef(null);
  const contactRef = useRef(null);

  // State for animated headline words
  const headlineWords = ["forecast", "heal", "accelerate"];
  const [headlineWordIndex, setHeadlineWordIndex] = useState(0);

  // Effect to cycle through headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineWordIndex((prevIndex) => (prevIndex + 1) % headlineWords.length);
    }, 4000); // Change word every 4 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [headlineWords.length]);


  // Function to handle smooth scrolling on navigation click
  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu on navigation
  };

  // Effect to observe sections and update active navigation link
   useEffect(() => {
    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'about', ref: aboutRef },
      { id: 'projects', ref: projectsRef },
      { id: 'essays', ref: essaysRef },
      { id: 'demos', ref: demosRef },
      { id: 'contact', ref: contactRef },
    ];

    const observerOptions = {
      root: null, // relative to document viewport
      rootMargin: '-50% 0px -50% 0px', // trigger when section is in the middle 50% of the viewport
      threshold: 0, // trigger as soon as it enters the margin
    };

    // Callback function for Intersection Observer
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Update active section state
        }
      });
    };

    // Create and configure the observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe each section
    sections.forEach(section => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    // Cleanup function to unobserve sections when component unmounts
    return () => {
      sections.forEach(section => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, []); // Empty dependency array ensures this runs only once on mount


  // Function to toggle dark mode (basic state toggle)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you'd also toggle a class on the <html> or <body> element
    // document.documentElement.classList.toggle('dark', !darkMode);
  };

  // Framer Motion hook to track scroll progress for the page scroll bar
  const { scrollYProgress } = useScroll();
  // Apply spring physics to the scroll progress for a smoother effect
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Extract data from resume (or define directly)
  const name = "Daniel Wanjala";
  const roles = ["Senior IT Manager", "Data Scientist", "MSc. Student"];
  const locationOrg = {
      "Senior IT Manager": "Kingdom Hospital, Webuye",
      "Data Scientist": "Volunteer @ Kingdom Hospital",
      "MSc. Student": "Cooperative University Kenya"
  };
  const contactInfo = {
      email: "dmwanjala254@gmail.com",
      phone: "+254 742 007 277",
      linkedin: "https://linkedin.com/in/daniel-wanjala-91",
      github: "https://github.com/dmwanjala", // Using the one from resume projects
      whatsapp: "https://wa.me/254742007277" // Construct WhatsApp link
  };
  // Use the image URL provided in the fetched content
  const portraitUrl = "https://image-proxy.labnol.org/?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FACg8ocKz999-B81M89M5n0l6rW7-X9s7yV9z5H9f3Y1g6n8H%3Ds96-c";

  return (
    // Main container div applying base styles and dark mode class
    <div className={`font-satoshi bg-[#0B0C10] text-[#F7F7F7] min-h-screen relative overflow-x-hidden ${darkMode ? 'dark' : ''}`}>
       {/* Scroll Progress Bar at the top */}
       <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#66FCF1] origin-left z-50" style={{ scaleX }} />

      {/* Sticky Header */}
      <motion.header
         className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md bg-[#0B0C10]/80"
         initial={{ y: -100 }} // Initial state off-screen
         animate={{ y: 0 }}     // Animate to position 0 (visible)
         transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Name */}
            <div className="flex-shrink-0">
              <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }} className="text-xl font-bold text-[#66FCF1] font-grotesk hover:text-[#F7F7F7] transition-colors">
                {name}.
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {['About', 'Projects', 'Essays', 'Demos', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.toLowerCase()); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative ${
                    activeSection === item.toLowerCase()
                      ? 'text-[#66FCF1]' // Active link style
                      : 'text-[#C5C6C7] hover:text-[#F7F7F7]' // Inactive link style
                  }`}
                  aria-current={activeSection === item.toLowerCase() ? 'page' : undefined}
                >
                  {item}
                  {/* Animated underline for active link */}
                   {activeSection === item.toLowerCase() && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#66FCF1]"
                      layoutId="underline" // Shared layout ID for the animation
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

             {/* Right side container: Dark Mode Toggle & Mobile Menu Button */}
            <div className="flex items-center">
                {/* Dark Mode Toggle Button (Optional - currently commented out) */}
                {/* <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full text-[#C5C6C7] hover:text-[#66FCF1] hover:bg-[#1F2833] transition-colors mr-2"
                    aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button> */}

                {/* Mobile Menu Button (visible on smaller screens) */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-[#C5C6C7] hover:text-[#66FCF1] hover:bg-[#1F2833] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#66FCF1]"
                        aria-controls="mobile-menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        {/* Toggle between Menu and X icons */}
                        {isMenuOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden absolute top-16 left-0 right-0 bg-[#1F2833]/95 backdrop-blur-sm shadow-lg pb-3"
              id="mobile-menu"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {/* Mobile navigation links */}
                {['Hero', 'About', 'Projects', 'Essays', 'Demos', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.toLowerCase()); }}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      activeSection === item.toLowerCase()
                        ? 'bg-[#45A29E] text-[#66FCF1]' // Active mobile link style
                        : 'text-[#C5C6C7] hover:bg-[#45A29E]/50 hover:text-[#F7F7F7]' // Inactive mobile link style
                    }`}
                     aria-current={activeSection === item.toLowerCase() ? 'page' : undefined}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main content area */}
      <main>
        {/* Hero Section */}
        <section ref={heroRef} id="hero" className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4">
           {/* Background Gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#111a24] to-[#0B0C10] opacity-80 z-0"></div>
           {/* Decorative SVG Wave */}
           <svg className="absolute bottom-0 left-0 w-full h-32 text-[#1F2833]/30 z-0 opacity-50" preserveAspectRatio="none" viewBox="0 0 1440 320">
              <path fill="currentColor" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,133.3C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>

           {/* Hero Content */}
           <div className="relative z-10">
             {/* Animated Headline */}
             <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-[#F7F7F7] font-grotesk leading-tight"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
             >
                I build data systems that <br className="hidden md:block" />
                {/* Container for rotating words */}
                <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
                    <AnimatePresence mode="wait">
                        {/* The rotating word itself */}
                        <motion.span
                            key={headlineWordIndex} // Key change triggers animation
                            className="text-[#66FCF1] inline-block"
                             initial={{ y: "100%" }} // Start below
                             animate={{ y: "0%" }}   // Animate to view
                             exit={{ y: "-100%" }}    // Exit upwards
                             transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Custom cubic bezier for smooth swap
                        >
                            {headlineWords[headlineWordIndex]}
                        </motion.span>
                    </AnimatePresence>
                </span>.
             </motion.h1>
             {/* Sub-headline */}
             <motion.p
                className="text-lg md:text-xl text-[#C5C6C7] mb-8 max-w-2xl mx-auto font-satoshi"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
             >
                Machine learning meets real-world outcomes. From predictive insights to automated solutions.
             </motion.p>
             {/* Call to Action Buttons */}
             <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
             >
                {/* Primary CTA */}
                <motion.button
                   onClick={() => handleNavClick('projects')}
                   className="group relative inline-flex items-center justify-center px-8 py-3 bg-[#66FCF1] text-[#0B0C10] font-semibold rounded-lg shadow-lg hover:shadow-[#66FCF1]/30 transition-all duration-300 ease-out overflow-hidden transform hover:-translate-y-1"
                   whileHover={{ scale: 1.05 }} // Scale up on hover
                   whileTap={{ scale: 0.95 }}   // Scale down on click
                >
                   View My Work
                   <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" /> {/* Icon shifts right on hover */}
                </motion.button>
                {/* Secondary CTA */}
                 <motion.button
                   onClick={() => handleNavClick('contact')}
                   className="group relative inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-[#45A29E] text-[#C5C6C7] font-semibold rounded-lg shadow-md hover:shadow-[#45A29E]/20 hover:bg-[#45A29E]/20 hover:text-[#F7F7F7] transition-all duration-300 ease-out overflow-hidden transform hover:-translate-y-1"
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                >
                   Get In Touch
                   <Mail className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:rotate-12" /> {/* Icon rotates on hover */}
                </motion.button>
             </motion.div>
           </div>

           {/* Animated Scroll Down Hint */}
            <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }} // Simple bobbing animation
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-6 h-6 text-[#45A29E]" />
                </motion.div>
            </motion.div>
        </section>

        {/* About Section */}
        <Section ref={aboutRef} id="about" className="bg-[#1F2833]/30">
          <SectionTitle>About Me: Data With A Pulse</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
            {/* Portrait Column */}
            <motion.div
              className="md:col-span-2 flex justify-center relative group" // Added group class
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
               {/* Image container with hover effects */}
               <motion.div
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#45A29E] shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(102, 252, 241, 0.3)" }} // Scale and add glow on hover
                  transition={{ duration: 0.3 }}
               >
                 <img
                    src={portraitUrl || 'https://placehold.co/320x320/0B0C10/F7F7F7?text=Daniel+W.'}
                    alt="Portrait of Daniel Wanjala"
                    className="w-full h-full object-cover"
                    // Basic error handling for the image
                    onError={(e) => e.target.src = 'https://placehold.co/320x320/0B0C10/F7F7F7?text=Image+Error'}
                 />
                 {/* Subtle pulsing border effect on hover */}
                 <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#66FCF1] opacity-0 group-hover:opacity-50" // Controlled by parent group hover
                    animate={{ scale: [1, 1.03, 1], opacity: [0, 0.5, 0] }} // Pulse animation
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 />
               </motion.div>
            </motion.div>

            {/* Bio Text & Badges Column */}
            <motion.div
                className="md:col-span-3"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.3 }}
            >
              {/* Bio paragraphs */}
              <p className="text-lg md:text-xl text-[#C5C6C7] mb-6 leading-relaxed font-satoshi">
                Hi, I'm Daniel Wanjala, a passionate <strong className="text-[#66FCF1]">Data Scientist and ML Engineer</strong> based near Nairobi, Kenya. My journey spans IT management and deep dives into data, driven by a belief in technology's power to solve real-world problems.
              </p>
              <p className="text-lg md:text-xl text-[#C5C6C7] mb-8 leading-relaxed font-satoshi">
                Whether optimizing hospital operations with predictive analytics or building forecasting models, I focus on creating <strong className="text-[#66FCF1]">data systems that deliver tangible outcomes</strong>. I thrive on transforming complex data into actionable insights and robust applications. Currently pursuing an MSc in Data Science to further sharpen my expertise.
              </p>
              {/* Role Badges */}
              <div className="flex flex-wrap gap-4">
                 <Badge icon={Briefcase} text="Senior IT Manager" tooltipText={locationOrg["Senior IT Manager"]} delay={0.5} />
                 <Badge icon={BrainCircuit} text="Data Scientist" tooltipText={locationOrg["Data Scientist"]} delay={0.65} />
                 <Badge icon={GraduationCap} text="MSc. Student" tooltipText={locationOrg["MSc. Student"]} delay={0.8} />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Projects Section */}
        <Section ref={projectsRef} id="projects">
          <SectionTitle>Projects: Work That Talks Back</SectionTitle>
          {/* Filtering controls could be added here */}
          {/* Masonry Grid using CSS columns */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
            ))}
          </div>
        </Section>

         {/* Essays Section */}
        <Section ref={essaysRef} id="essays" className="bg-[#1F2833]/30">
            <SectionTitle>Essays: Thinking in Algorithms</SectionTitle>
            {/* Sticky category navigation could be implemented here */}
            <div className="max-w-3xl mx-auto">
                {/* Map through essay data */}
                {essays.map(essay => (
                    <EssayCard key={essay.id} essay={essay} />
                ))}
            </div>
        </Section>

         {/* Live Demos Section */}
        <Section ref={demosRef} id="demos">
            <SectionTitle>Live Demos: Try My Logic</SectionTitle>
            {/* Grid layout for demo cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Map through demo data */}
                {demos.map(demo => (
                    <DemoCard key={demo.id} demo={demo} />
                ))}
            </div>
            {/* Disclaimer note */}
             <p className="text-center text-[#C5C6C7] mt-12 text-sm">
                Note: Live demos may link to external platforms like Streamlit Cloud or JS playgrounds.
            </p>
        </Section>


        {/* Contact Section */}
        <Section ref={contactRef} id="contact" className="bg-[#1F2833]/30">
          <SectionTitle>Contact: Let's Collaborate</SectionTitle>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Social Links */}
            <motion.div
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, amount: 0.3 }}
                 transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-semibold mb-6 text-[#F7F7F7]">Connect with me</h3>
              {/* Container for social cards */}
              <div className="space-y-4">
                 <SocialCard icon={Linkedin} text="LinkedIn" url={contactInfo.linkedin} delay={0.1} />
                 <SocialCard icon={Github} text="GitHub" url={contactInfo.github} delay={0.2} />
                 <SocialCard icon={Mail} text="Email" url={`mailto:${contactInfo.email}`} delay={0.3} />
                 <SocialCard icon={Phone} text="WhatsApp" url={contactInfo.whatsapp} delay={0.4} />
                 {/* Direct WhatsApp link */}
                 <motion.a
                    href={contactInfo.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block text-sm text-[#66FCF1] hover:underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }} // Fade in slightly later
                 >
                    👋🏽 Message me directly on WhatsApp
                 </motion.a>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
             <motion.div
                 initial={{ opacity: 0, x: 50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true, amount: 0.3 }}
                 transition={{ duration: 0.7, delay: 0.2 }} // Slight delay after the left column
             >
               <h3 className="text-2xl font-semibold mb-6 text-[#F7F7F7]">Send a Message</h3>
               <ContactForm />
            </motion.div>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-[#1F2833] text-[#C5C6C7] py-6 px-4 md:px-8 text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }} // Delay ensures it fades in after main content
      >
        © {new Date().getFullYear()} {name}. All rights reserved. | Built with React & Tailwind CSS.
        {/* Optional: Add last model update or other dynamic info */}
        {/* <span className="mx-2">|</span> Last model: GDP v2.3 */}
      </motion.footer>


      {/* Project Modal - Rendered conditionally */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

       {/* Optional: Custom Cursor Elements (Requires additional JS for positioning) */}
       {/* <div id="custom-cursor" className="fixed hidden lg:block w-6 h-6 border-2 border-[#66FCF1] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"></div> */}
       {/* <div id="cursor-dot" className="fixed hidden lg:block w-1 h-1 bg-[#66FCF1] rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"></div> */}

    </div>
  );
}

// Global Styles Component (includes font imports and base styles)
const GlobalStyles = () => (
  <style jsx global>{`
    /* Import Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Satoshi:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap');

    /* Base body styles */
    body {
      font-family: 'Satoshi', sans-serif; /* Default font */
      background-color: #0B0C10; /* Base background */
      color: #F7F7F7; /* Base text color */
      overflow-x: hidden; /* Prevent horizontal scrollbars */
      -webkit-font-smoothing: antialiased; /* Smoother fonts on WebKit */
      -moz-osx-font-smoothing: grayscale; /* Smoother fonts on Firefox */
    }

    /* Font utility classes */
    .font-grotesk {
      font-family: 'Space Grotesk', sans-serif;
    }
    .font-satoshi {
      font-family: 'Satoshi', sans-serif;
    }
     .font-mono {
       font-family: 'JetBrains Mono', monospace;
     }

     /* Enable smooth scrolling for anchor links */
     html {
        scroll-behavior: smooth;
     }

     /* Custom Scrollbar Styling (Optional) */
    ::-webkit-scrollbar {
      width: 8px; /* Width of the scrollbar */
    }
    ::-webkit-scrollbar-track {
      background: #1F2833; /* Background of the scrollbar track */
    }
    ::-webkit-scrollbar-thumb {
      background: #45A29E; /* Color of the scrollbar thumb */
      border-radius: 4px; /* Rounded corners for the thumb */
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #66FCF1; /* Color of the thumb on hover */
    }

    /* Basic shake animation for form errors */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake {
      animation: shake 0.5s ease-in-out;
    }


    /* Fallback for CSS Masonry using Flexbox (Apply .projects-grid class to container if needed) */
    @supports not (grid-template-rows: masonry) {
      .projects-grid {
        display: flex;
        flex-wrap: wrap;
        margin: -0.5rem; /* Counteract margin on items */
      }
       .projects-grid > * { /* Target ProjectCard */
         width: calc(33.333% - 1rem); /* 3 columns with gap */
         margin: 0.5rem;
       }
       @media (max-width: 1024px) { /* Tablet: 2 columns */
         .projects-grid > * { width: calc(50% - 1rem); }
       }
       @media (max-width: 768px) { /* Mobile: 1 column */
         .projects-grid > * { width: calc(100% - 1rem); }
       }
    }

  `}</style>
);


// Render the App (Conceptual - this part usually lives in index.js or main.jsx)
// import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <GlobalStyles /> {/* Inject global styles */}
//     <App />
//   </React.StrictMode>
// );

// Export the main App component for use in build processes or environments like CodeSandbox
export default App;
