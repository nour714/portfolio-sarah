/**
 * Portfolio Data Model & Store
 * Clean Architecture - Domain / Data Layer
 * 
 * Edit this file to update projects, skills, experience, or bio
 * without touching any HTML!
 */

import { projectsSection, projects } from "./projects.js";
import { certificatesSection, certificates } from "./certificates.js";

export const portfolioData = {
    hero: {
        name: "Sarah",
        fullName: "Sarah Nabil Abu Al-Magd Ahmad",
        roles: [
            "Machine Learning",
            "Computer Vision",
            "Artificial Intelligence"
        ],
        copy: "Third-year Artificial Intelligence student at Kafrelsheikh University with a strong passion for Machine Learning, Computer Vision with OpenCV, Artificial Neural Networks (ANN), and predictive modeling.",
        avatar: {
            src: "images/avatar-placeholder.svg",
            alt: "Sarah Nabil Avatar"
        },
        primary: {
            text: "View Resume",
            url: "cv.html"
        },
        secondary: {
            text: "View Projects",
            url: "#projects"
        }
    },

    social: {
        github: "https://github.com/sarahnabil",
        linkedin: "https://www.linkedin.com/in/sarahnabil",
        whatsapp: "https://wa.me/201099478701",
        email: "sarahhnabil71@gmail.com"
    },

    about: {
        status: "AI Student & ML Practitioner",
        location: "Egypt · Kafrelsheikh University",
        title: "",
        copy: "I’m Sarah Nabil, a third-year Artificial Intelligence student at Kafrelsheikh University, passionate about Machine Learning and Computer Vision. I enjoy building practical projects with Python and OpenCV and turning technical concepts into useful applications.",
        signature: "",
        metrics: [
            { label: "Cumulative GPA", value: "3.27 / 4.00" },
            { label: "NTI ML Score", value: "95%" },
            { label: "NTI Training", value: "120 hrs" },
            { label: "Graduation Year", value: "2028" }
        ],
        image: {
            srcWebp: "images/about-me-polished.webp",
            srcPng: "images/about-me-polished.png",
            alt: "Sarah Nabil with AI Assistant - Machine Learning & Computer Vision Specialist",
            badgeText: "AI & Computer Vision"
        }
    },

    skills: {
        title: "My Skills",
        copy: "Core technical capabilities across Artificial Intelligence, Computer Vision, Machine Learning, Programming, and Database Systems.",
        metrics: {
            domains: "AI & CV",
            tools: "OpenCV · Qt · SQL",
            core: "Python · C++",
            cloud: "NumPy · Matplotlib"
        },
        items: [
            { name: "Python", icon: "python", level: "GOOD", progress: 92, description: "Primary programming language for Machine Learning, data processing, algorithms, and Computer Vision workflows.", color: "#38bdf8", haloColor: "rgba(56, 189, 248, 0.45)", barColor: "#38bdf8", label: "PYTHON" },
            { name: "OpenCV", icon: "opencv", level: "ADVANCED", progress: 88, description: "Computer Vision development, image processing, filtering, contour detection, and visual feature extraction.", color: "#22c55e", haloColor: "rgba(34, 197, 94, 0.45)", barColor: "#4ade80", label: "OPENCV" },
            { name: "Machine Learning", icon: "machine learning", level: "EXPERT", progress: 95, description: "Supervised and unsupervised learning, model training, predictive pipelines, and algorithm benchmarking.", color: "#a855f7", haloColor: "rgba(168, 85, 247, 0.45)", barColor: "#c084fc", label: "ML" },
            { name: "Neural Networks (ANN)", icon: "ann", level: "ADVANCED", progress: 89, description: "Artificial Neural Networks (ANN), multi-layer perceptron architectures, and deep learning foundations.", color: "#ec4899", haloColor: "rgba(236, 72, 153, 0.45)", barColor: "#f472b6", label: "ANN" },
            { name: "C++", icon: "c++", level: "INTERMEDIATE", progress: 82, description: "Object-oriented software development, memory efficiency, data structures, and algorithmic logic.", color: "#0ea5e9", haloColor: "rgba(14, 165, 233, 0.45)", barColor: "#38bdf8", label: "C++" },
            { name: "Qt Framework", icon: "qt", level: "INTERMEDIATE", progress: 80, description: "Cross-platform desktop application development using C++ and object-oriented GUI architecture.", color: "#10b981", haloColor: "rgba(16, 185, 129, 0.45)", barColor: "#34d399", label: "QT GUI" },
            { name: "SQL & MySQL", icon: "sql & mysql", level: "ADVANCED", progress: 88, description: "Relational database schema design, data querying, joins, aggregations, and MySQL administration.", color: "#f59e0b", haloColor: "rgba(245, 158, 11, 0.45)", barColor: "#fbbf24", label: "SQL/MYSQL" },
            { name: "Classification", icon: "classification", level: "EXPERT", progress: 94, description: "Supervised classification modeling, decision boundaries, multi-class predictions, and error analysis.", color: "#38bdf8", haloColor: "rgba(56, 189, 248, 0.45)", barColor: "#38bdf8", label: "CLASSIFY" },
            { name: "Regression", icon: "regression", level: "ADVANCED", progress: 91, description: "Linear and polynomial regression models, continuous target forecasting, and residual evaluation.", color: "#818cf8", haloColor: "rgba(129, 140, 248, 0.45)", barColor: "#a5b4fc", label: "REGRESSION" },
            { name: "NumPy", icon: "numpy", level: "EXPERT", progress: 93, description: "High-performance vectorized numerical computation, multi-dimensional array operations, and linear algebra.", color: "#4f46e5", haloColor: "rgba(79, 70, 229, 0.45)", barColor: "#818cf8", label: "NUMPY" },
            { name: "Matplotlib", icon: "matplotlib", level: "ADVANCED", progress: 90, description: "Data visualization, statistical plotting, distribution charts, and model performance graphs.", color: "#06b6d4", haloColor: "rgba(6, 182, 212, 0.45)", barColor: "#22d3ee", label: "MATPLOTLIB" },
            { name: "Computer Vision", icon: "computer vision", level: "ADVANCED", progress: 87, description: "Computer vision fundamentals, spatial image manipulation, edge detection, and visual recognition.", color: "#14b8a6", haloColor: "rgba(20, 184, 166, 0.45)", barColor: "#2dd4bf", label: "VISION" },
            { name: "OOP Concepts", icon: "oop concepts", level: "INTERMEDIATE", progress: 85, description: "Object-Oriented Programming (encapsulation, inheritance, polymorphism, and abstraction) in Python & C++.", color: "#3b82f6", haloColor: "rgba(59, 130, 246, 0.45)", barColor: "#60a5fa", label: "OOP" },
            { name: "Scikit-Learn", icon: "scikit-learn", level: "EXPERT", progress: 94, description: "Building ML pipelines, estimators, hyperparameter tuning, cross-validation, and metrics computation.", color: "#f97316", haloColor: "rgba(249, 115, 22, 0.45)", barColor: "#fb923c", label: "SKLEARN" },
            { name: "Data Preprocessing", icon: "data preprocessing", level: "EXPERT", progress: 93, description: "Data cleaning, missing value handling, feature scaling, normalization, and categorical encoding.", color: "#0284c7", haloColor: "rgba(2, 132, 199, 0.45)", barColor: "#38bdf8", label: "DATA PREP" },
            { name: "Unsupervised Learning", icon: "unsupervised learning", level: "ADVANCED", progress: 86, description: "Clustering algorithms (K-Means, Hierarchical), pattern discovery, and dimensionality exploration.", color: "#a855f7", haloColor: "rgba(168, 85, 247, 0.45)", barColor: "#c084fc", label: "CLUSTERING" },
            { name: "Model Evaluation", icon: "model evaluation", level: "EXPERT", progress: 94, description: "ROC-AUC curves, confusion matrices, Precision, Recall, F1-Score, and cross-validation analysis.", color: "#fb7185", haloColor: "rgba(251, 113, 133, 0.45)", barColor: "#f43f5e", label: "EVALUATION" },
            { name: "Git & GitHub", icon: "git & github", level: "ADVANCED", progress: 88, description: "Version control, code collaboration, repository management, and reproducible experiments.", color: "#f05032", haloColor: "rgba(240, 80, 50, 0.45)", barColor: "#fb7185", label: "GIT" }
        ],
        groups: [
            {
                title: "Programming & Core",
                label: "Core",
                items: [
                    { name: "Python", icon: "python" },
                    { name: "C++", icon: "c++" },
                    { name: "OOP Concepts", icon: "oop concepts" },
                    { name: "Git", icon: "git & github" }
                ]
            },
            {
                title: "Machine Learning & Neural Networks",
                label: "AI & ML",
                items: [
                    { name: "Classification & Regression", icon: "classification" },
                    { name: "Supervised & Unsupervised", icon: "unsupervised learning" },
                    { name: "Neural Networks (ANN)", icon: "ann" },
                    { name: "Scikit-Learn", icon: "scikit-learn" }
                ]
            },
            {
                title: "Computer Vision",
                label: "Vision",
                items: [
                    { name: "OpenCV", icon: "opencv" },
                    { name: "Image Processing", icon: "opencv" },
                    { name: "Computer Vision Fundamentals", icon: "computer vision" }
                ]
            },
            {
                title: "Data Processing & Visualization",
                label: "Data",
                items: [
                    { name: "NumPy", icon: "numpy" },
                    { name: "Matplotlib", icon: "matplotlib" },
                    { name: "Data Preprocessing", icon: "data preprocessing" }
                ]
            },
            {
                title: "Databases & Desktop GUI",
                label: "Tools",
                items: [
                    { name: "SQL", icon: "sql" },
                    { name: "MySQL", icon: "sql & mysql" },
                    { name: "Qt Framework", icon: "qt" }
                ]
            }
        ],
        noteLabel: "Focus:",
        noteText: "Practical modeling, Computer Vision with OpenCV, Artificial Neural Networks (ANN), and robust real-world AI pipelines."
    },

    projectsSection,
    projects,

    certificatesSection,
    certificates,

    experience: {
        title: "Education, Certifications & Training",
        copy: "Academic journey at Kafrelsheikh University and specialized professional training programs in AI, Machine Learning, and Software Engineering.",
        metrics: [
            {
                label: "Academic Standing",
                value: "GPA 3.27",
                description: "Faculty of Artificial Intelligence, Kafrelsheikh University."
            },
            {
                label: "NTI Machine Learning",
                value: "Score 95%",
                description: "120 hours intensive training (26 July – 20 August 2026)."
            },
            {
                label: "Industry Training",
                value: "Microsoft & CIB",
                description: "Sprints × Microsoft AI Camp & CIB Programming Internship."
            }
        ],
        items: [
            {
                role: "Machine Learning Trainee (Score: 95%)",
                org: "National Telecommunication Institute (NTI)",
                period: "26 July – 20 August 2026 · 120 Hours",
                summary: "Completed intensive 120-hour Machine Learning training covering supervised and unsupervised learning, model training, and evaluation, graduating with an exceptional 95% score.",
                points: [
                    "Completed 120 instructional and practical hours covering end-to-end Machine Learning workflows.",
                    "Implemented classification and regression algorithms, data preprocessing, and model benchmarking.",
                    "Evaluated models using precision, recall, F1-Score, and ROC-AUC metrics.",
                    "Graduated with an outstanding academic score of 95%."
                ],
                tags: ["NTI", "Machine Learning", "Python", "120 Hours", "Score: 95%"]
            },
            {
                role: "AI & Machine Learning Summer Camp",
                org: "Sprints × Microsoft",
                period: "Completed",
                summary: "Participated in an intensive AI and Machine Learning summer camp organized by Sprints in collaboration with Microsoft.",
                points: [
                    "Studied artificial intelligence foundations, predictive machine learning algorithms, and real-world AI applications.",
                    "Engaged in hands-on practical exercises applying data modeling and algorithmic problem-solving.",
                    "Collaborated with peers on AI-driven solution architectures."
                ],
                tags: ["Microsoft", "Sprints", "AI & ML", "Summer Camp"]
            },
            {
                role: "Programming Intern",
                org: "Commercial International Bank (CIB)",
                period: "Completed",
                summary: "Completed professional programming internship at CIB focusing on software engineering principles, clean code, and algorithmic implementation.",
                points: [
                    "Gained hands-on experience in structured programming concepts and object-oriented development.",
                    "Applied algorithmic problem-solving to enterprise-level computational tasks.",
                    "Followed software development best practices and collaborative workflows."
                ],
                tags: ["CIB", "Programming", "OOP", "Software Engineering"]
            },
            {
                role: "Introduction to AI — Professional Certificate",
                org: "LinkedIn Learning",
                period: "Certificate Obtained",
                summary: "Earned foundational certification covering core artificial intelligence principles, machine learning concepts, and modern AI paradigms.",
                points: [
                    "Mastered fundamental principles of artificial intelligence and machine learning subfields.",
                    "Explored neural network architectures, data-driven reasoning, and ethical AI development."
                ],
                tags: ["LinkedIn Learning", "Artificial Intelligence", "Certificate"]
            }
        ]
    },

    contact: {
        title: "Contact Me",
        copy: "Seeking a Machine Learning or Computer Vision internship to gain industry experience and contribute to real-world AI projects. Let's connect!",
        primary: {
            text: "sarahhnabil71@gmail.com",
            url: "mailto:sarahhnabil71@gmail.com"
        },
        secondary: {
            text: "+20 1099478701",
            url: "https://wa.me/201099478701"
        },
        location: "Egypt · Kafrelsheikh University",
        linkedinLabel: "linkedin.com/in/sarahnabil",
        githubLabel: "github.com/sarahnabil",
        panelTitle: "Direct Channels",
        panelCopy: "Reach me directly via Email, WhatsApp, or LinkedIn for internship opportunities and project collaborations.",
        availabilityTitle: "Current Availability",
        availabilityCopy: "Open to Machine Learning and Computer Vision internships, AI research opportunities, and collaborative technical projects.",
        formTitle: "Send a Message",
        formCopy: "Fill out the form below to reach out regarding internships, projects, or collaborations.",
        formNote: "Your message will be sent directly to sarahhnabil71@gmail.com.",
        formSubmit: "Send Message"
    }
};
