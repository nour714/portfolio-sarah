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
        fullName: "Sarah Nabil",
        roles: [
            "Machine Learning",
            "AI Engineer"
        ],
        copy: "Machine Learning & AI specialist with hands-on expertise in data exploration, preprocessing, classification modeling, and predictive analytics.",
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
        whatsapp: "https://wa.me/",
        email: "sarahnabil.ai@gmail.com"
    },

    about: {
        status: "Open For ML & Data Roles",
        location: "Egypt · Remote",
        title: "I turn data into meaningful insights and practical machine learning solutions.",
        copy: "I am Sarah Nabil, building my expertise in Artificial Intelligence and Machine Learning with hands-on experience in data exploration, data preprocessing, classification models, and model evaluation. Through my Machine Learning Summer Training at the National Telecommunication Institute (NTI) in collaboration with ITIDA, I worked on an end-to-end e-commerce purchase intent prediction project. My work involved preparing data, handling class imbalance, comparing machine learning models, evaluating performance, and analyzing feature importance. I am passionate about turning data into meaningful insights and developing practical machine learning solutions to real-world problems.",
        signature: "",
        metrics: [],
        image: {
            srcWebp: "images/about-me-polished.webp",
            srcPng: "images/about-me-polished.png",
            alt: "Sarah Nabil - Machine Learning & AI Specialist",
            badgeText: "ML & Data Analysis"
        }
    },

    skills: {
        title: "My Skills",
        copy: "",
        metrics: {
            domains: "",
            tools: "",
            core: "",
            cloud: ""
        },
        items: [
            { name: "Python", icon: "python", level: "EXPERT", progress: 96, description: "Core language for ML development, algorithms, data processing pipelines, and model evaluation.", color: "#38bdf8", haloColor: "rgba(56, 189, 248, 0.45)", barColor: "#38bdf8", label: "PYTHON" },
            { name: "Machine Learning", icon: "machine learning", level: "EXPERT", progress: 95, description: "End-to-end predictive modeling, supervised and unsupervised learning, and classification pipelines.", color: "#a855f7", haloColor: "rgba(168, 85, 247, 0.45)", barColor: "#c084fc", label: "ML" },
            { name: "Scikit-Learn", icon: "scikit-learn", level: "EXPERT", progress: 94, description: "Robust model architectures, transformers, hyperparameter tuning via GridSearchCV, and pipelines.", color: "#f97316", haloColor: "rgba(249, 115, 22, 0.45)", barColor: "#fb923c", label: "SKLEARN" },
            { name: "XGBoost", icon: "xgboost", level: "EXPERT", progress: 94, description: "High-performance gradient boosting on tabular data with custom objective and regularization tuning.", color: "#22c55e", haloColor: "rgba(34, 197, 94, 0.45)", barColor: "#4ade80", label: "XGBOOST" },
            { name: "Random Forest", icon: "random forest", level: "ADVANCED", progress: 92, description: "Ensemble learning with bagging, decision tree ensembles, and feature importance diagnostics.", color: "#10b981", haloColor: "rgba(16, 185, 129, 0.45)", barColor: "#34d399", label: "FOREST" },
            { name: "Pandas", icon: "pandas", level: "EXPERT", progress: 95, description: "High-speed tabular manipulation, aggregations, data reshaping, and missing-value handling.", color: "#e11d48", haloColor: "rgba(225, 29, 72, 0.45)", barColor: "#f43f5e", label: "PANDAS" },
            { name: "NumPy", icon: "numpy", level: "EXPERT", progress: 93, description: "Vectorized numerical computing, matrix linear algebra, and high-performance array transformations.", color: "#4f46e5", haloColor: "rgba(79, 70, 229, 0.45)", barColor: "#818cf8", label: "NUMPY" },
            { name: "SQL", icon: "sql", level: "ADVANCED", progress: 91, description: "Writing relational queries, aggregations, window functions, and structured database extraction.", color: "#0ea5e9", haloColor: "rgba(14, 165, 233, 0.45)", barColor: "#38bdf8", label: "SQL" },
            { name: "Data Preprocessing", icon: "data preprocessing", level: "EXPERT", progress: 96, description: "Automated data cleaning, outlier treatment, feature scaling, and categorical encoding.", color: "#06b6d4", haloColor: "rgba(6, 182, 212, 0.45)", barColor: "#22d3ee", label: "DATA PREP" },
            { name: "Feature Engineering", icon: "feature engineering", level: "EXPERT", progress: 94, description: "Creating high-impact domain features, interaction terms, and dimensionality reduction strategies.", color: "#ec4899", haloColor: "rgba(236, 72, 153, 0.45)", barColor: "#f472b6", label: "FEATURE ENG" },
            { name: "SMOTE", icon: "smote", level: "SPECIALIZED", progress: 90, description: "Tackling severe class imbalance using synthetic minority over-sampling and hybrid techniques.", color: "#14b8a6", haloColor: "rgba(20, 184, 166, 0.45)", barColor: "#2dd4bf", label: "SMOTE" },
            { name: "Model Evaluation", icon: "model evaluation", level: "EXPERT", progress: 95, description: "Comprehensive metrics analysis with ROC-AUC curves, Precision-Recall, and confusion matrices.", color: "#fb7185", haloColor: "rgba(251, 113, 133, 0.45)", barColor: "#f43f5e", label: "EVALUATION" },
            { name: "Cross-Validation", icon: "cross-validation", level: "EXPERT", progress: 93, description: "Preventing data leakage and overfitting using Stratified K-Fold and validation schemes.", color: "#818cf8", haloColor: "rgba(129, 140, 248, 0.45)", barColor: "#a5b4fc", label: "CV" },
            { name: "Matplotlib", icon: "devicon-matplotlib-plain colored", level: "ADVANCED", progress: 91, description: "Crafting publication-quality statistical charts, diagnostic plots, and distribution graphs.", color: "#38bdf8", haloColor: "rgba(56, 189, 248, 0.45)", barColor: "#38bdf8", label: "MATPLOTLIB" },
            { name: "Seaborn", icon: "seaborn", level: "ADVANCED", progress: 91, description: "Multi-variate statistical visualization, correlation matrices, pairplots, and distribution curves.", color: "#0284c7", haloColor: "rgba(2, 132, 199, 0.45)", barColor: "#38bdf8", label: "SEABORN" },
            { name: "EDA", icon: "exploratory eda", level: "EXPERT", progress: 95, description: "Uncovering statistical patterns, anomalies, business insights, and hypothesis validations.", color: "#f59e0b", haloColor: "rgba(245, 158, 11, 0.45)", barColor: "#fbbf24", label: "EDA" },
            { name: "Algorithms", icon: "oop & algorithms", level: "ADVANCED", progress: 90, description: "Clean object-oriented architecture, modular code design, and efficient data structures.", color: "#3b82f6", haloColor: "rgba(59, 130, 246, 0.45)", barColor: "#60a5fa", label: "ALGORITHMS" },
            { name: "Git", icon: "git", level: "ADVANCED", progress: 88, description: "Collaborative Git workflows, reproducible experiments, and clean repository management.", color: "#f05032", haloColor: "rgba(240, 80, 50, 0.45)", barColor: "#fb7185", label: "GIT" }
        ],
        groups: [
            {
                title: "Programming & Core",
                label: "Core",
                items: [
                    { name: "Python", icon: "devicon-python-plain colored" },
                    { name: "SQL", icon: "fallback", tag: "SQL" },
                    { name: "OOP & Algorithms", icon: "fallback", tag: "OOP" }
                ]
            },
            {
                title: "Data Manipulation & EDA",
                label: "Advanced",
                items: [
                    { name: "Pandas", icon: "devicon-pandas-original colored" },
                    { name: "NumPy", icon: "devicon-numpy-original colored" },
                    { name: "Data Preprocessing", icon: "fallback", tag: "DP" },
                    { name: "Feature Engineering", icon: "fallback", tag: "FE" }
                ]
            },
            {
                title: "Machine Learning & Modeling",
                label: "Advanced",
                items: [
                    { name: "Scikit-learn", icon: "devicon-scikitlearn-plain colored" },
                    { name: "Classification Models", icon: "fallback", tag: "CL" },
                    { name: "Regression Models", icon: "fallback", tag: "RG" },
                    { name: "XGBoost", icon: "fallback", tag: "XG" },
                    { name: "Random Forest", icon: "fallback", tag: "RF" }
                ]
            },
            {
                title: "Imbalanced Data & Evaluation",
                label: "Specialized",
                items: [
                    { name: "SMOTE & Resampling", icon: "fallback", tag: "SM" },
                    { name: "ROC-AUC & F1-Score", icon: "fallback", tag: "EV" },
                    { name: "Feature Importance", icon: "fallback", tag: "FI" },
                    { name: "Cross-Validation", icon: "fallback", tag: "CV" }
                ]
            },
            {
                title: "Data Visualization & Reporting",
                label: "Insights",
                items: [
                    { name: "Matplotlib", icon: "fallback", tag: "MP" },
                    { name: "Seaborn", icon: "fallback", tag: "SB" },
                    { name: "Exploratory Dashboards", icon: "fallback", tag: "ED" }
                ]
            },
            {
                title: "Tools & Environments",
                label: "Workflow",
                items: [
                    { name: "Jupyter", icon: "devicon-jupyter-plain colored" },
                    { name: "Google Colab", icon: "devicon-googlecolab-plain colored" },
                    { name: "Git", icon: "devicon-git-plain colored" },
                    { name: "VS Code", icon: "devicon-vscode-plain colored" }
                ]
            }
        ],
        noteLabel: "Focus:",
        noteText: "Building robust data-driven ML pipelines with high predictive power and rigorous model evaluation."
    },

    projectsSection,
    projects,

    certificatesSection,
    certificates,

    experience: {
        title: "Professional Experience & Training",
        copy: "Applied machine learning training and practical data engineering projects focused on real-world business impact.",
        metrics: [
            {
                label: "Track",
                value: "NTI × ITIDA",
                description: "Machine Learning Summer Training graduate."
            },
            {
                label: "Focus",
                value: "ML & Analytics",
                description: "Data exploration, preprocessing, and classification."
            },
            {
                label: "Delivery",
                value: "End-to-End",
                description: "Imbalance mitigation, modeling, and feature importance."
            }
        ],
        items: [
            {
                role: "Machine Learning Trainee",
                org: "National Telecommunication Institute (NTI) × ITIDA",
                period: "Summer Training",
                summary: "Completed intensive Machine Learning Summer Training, developing an end-to-end e-commerce purchase intent prediction project.",
                points: [
                    "Engineered an end-to-end predictive pipeline analyzing user session behavior to forecast online purchase intent.",
                    "Addressed severe class imbalance using advanced resampling and class weighting techniques.",
                    "Benchmarked multiple machine learning classification algorithms, evaluating metrics including ROC-AUC, F1-Score, and precision-recall trade-offs.",
                    "Extracted business insights through feature importance analysis to pinpoint decisive drivers of consumer purchase behavior."
                ],
                tags: ["Machine Learning", "NTI × ITIDA", "Classification Models", "Class Imbalance"]
            },
            {
                role: "Data Analyst & ML Practitioner",
                org: "Applied Machine Learning Projects",
                period: "Specialized Practice",
                summary: "Designing predictive models and data exploration workflows for structured tabular datasets.",
                points: [
                    "Conducted thorough Exploratory Data Analysis (EDA) uncovering actionable trends and correlations.",
                    "Standardized robust preprocessing pipelines for scaling, categorical encoding, and outlier mitigation.",
                    "Implemented automated evaluation reporting with clear visualization of performance metrics and confusion matrices."
                ],
                tags: ["Python", "Pandas", "Scikit-Learn", "EDA", "Data Preprocessing"]
            }
        ]
    },

    contact: {
        title: "Contact Me",
        copy: "Have an opportunity or project in Machine Learning or Data Analysis? Send a direct message below.",
        primary: {
            text: "sarahnabil.ai@gmail.com",
            url: "mailto:sarahnabil.ai@gmail.com"
        },
        secondary: {
            text: "WhatsApp Message",
            url: "https://wa.me/"
        },
        location: "Egypt · Remote",
        linkedinLabel: "linkedin.com/in/sarahnabil",
        githubLabel: "github.com/sarahnabil",
        panelTitle: "Direct Channels",
        panelCopy: "Reach me anytime via Email or LinkedIn for collaborations and inquiries.",
        availabilityTitle: "Current Availability",
        availabilityCopy: "Open to Machine Learning, Artificial Intelligence, and Data Analysis roles, internships, and research projects.",
        formTitle: "Send a Message",
        formCopy: "Fill out the form below to connect regarding project scope or opportunities.",
        formNote: "Your message will be sent securely to my inbox.",
        formSubmit: "Send Message"
    }
};
