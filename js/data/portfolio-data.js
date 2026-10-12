/**
 * Portfolio Data Model & Store
 * Clean Architecture - Domain / Data Layer
 * 
 * Edit this file to update projects, skills, experience, or bio
 * without touching any HTML!
 */

export const portfolioData = {
    hero: {
        name: "Allaa",
        roles: [
            "AI Engineer",
            "Computer Vision Engineer",
            "Deep Learning Specialist",
            "Data Science Engineer"
        ],
        copy: "Dynamic AI and Data Science Engineer with 3 years of hands-on experience in computer vision, deep learning, and advanced analytics. I build intelligent systems that turn complex data into actionable outcomes for healthcare, surveillance, and automation use cases.",
        avatar: {
            src: "images/avatar-placeholder.svg",
            alt: "Allaa Saboukh Avatar"
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
        github: "https://github.com/Alaa-Saboukh02",
        linkedin: "https://www.linkedin.com/in/allaa-saboukh?utm_source=share_via&utm_content=profile&utm_medium=member_android",
        whatsapp: "https://wa.me/201019741580",
        email: "allaa54sabboukh@gmail.com"
    },

    about: {
        status: "Open For Impactful AI Work",
        location: "Egypt · Saudi Arabia · Remote",
        title: "I transform visual and medical data into high-stakes AI solutions.",
        copy: "I am Allaa Saboukh, a Bio AI Engineer and Data Specialist with 3+ years of experience delivering intelligent systems across the MENA region. My expertise, fortified by specialized training at the National Telecommunication Institute (NTI) through the DEYP initiative, spans Computer Vision, Medical AI, and Robotics. I build production-ready pipelines—from healthcare analytics to real-time industrial automation—bridging the gap between deep learning research and reliable deployments.",
        signature: "Stack Signature: PyTorch, TensorFlow, YOLO, OpenVINO, FastAPI, Arduino, Docker.",
        metrics: [
            { value: "3+", label: "Years Experience" },
            { value: "20+", label: "Production AI Builds" },
            { value: "Bio AI + Edge", label: "Core Specialization" }
        ],
        image: {
            srcWebp: "images/about-me-polished.webp",
            srcPng: "images/about-me-polished.png",
            alt: "Allaa Saboukh - Bio AI Engineer & Data Specialist",
            badgeText: "Bio AI & Robotics"
        }
    },

    skills: {
        title: "Technical Skill Architecture",
        copy: "A structured view of my production stack across AI engineering, computer vision, deployment, and cloud-ready delivery.",
        metrics: {
            domains: "8",
            tools: "34+",
            core: "AI + CV",
            cloud: "AWS / GCP"
        },
        groups: [
            {
                title: "Programming Languages",
                label: "Core",
                items: [
                    { name: "Python", icon: "devicon-python-plain colored" },
                    { name: "C/C++", icon: "devicon-cplusplus-plain colored" },
                    { name: "JavaScript", icon: "devicon-javascript-plain colored" }
                ]
            },
            {
                title: "Deep Learning Frameworks",
                label: "Advanced",
                items: [
                    { name: "PyTorch", icon: "devicon-pytorch-original colored" },
                    { name: "TensorFlow", icon: "devicon-tensorflow-original colored" },
                    { name: "Keras", icon: "devicon-keras-original colored" },
                    { name: "FastAI", icon: "fallback", tag: "FA" }
                ]
            },
            {
                title: "Computer Vision",
                label: "Advanced",
                items: [
                    { name: "OpenCV", icon: "devicon-opencv-plain colored" },
                    { name: "YOLOv5/v8", icon: "fallback", tag: "YO" },
                    { name: "MediaPipe", icon: "fallback", tag: "MP" },
                    { name: "Detectron2", icon: "fallback", tag: "D2" }
                ]
            },
            {
                title: "Data Science & ML",
                label: "Strong",
                items: [
                    { name: "Scikit-learn", icon: "devicon-scikitlearn-plain colored" },
                    { name: "XGBoost", icon: "fallback", tag: "XG" },
                    { name: "Pandas", icon: "devicon-pandas-original colored" },
                    { name: "NumPy", icon: "devicon-numpy-original colored" },
                    { name: "Matplotlib", icon: "fallback", tag: "MP" },
                    { name: "Seaborn", icon: "fallback", tag: "SB" }
                ]
            },
            {
                title: "Deployment & APIs",
                label: "Production",
                items: [
                    { name: "Flask", icon: "devicon-flask-original colored" },
                    { name: "FastAPI", icon: "devicon-fastapi-plain colored" },
                    { name: "Streamlit", icon: "devicon-streamlit-plain colored" },
                    { name: "Docker", icon: "devicon-docker-plain colored" }
                ]
            },
            {
                title: "Databases",
                label: "Data Layer",
                items: [
                    { name: "SQL", icon: "fallback", tag: "SQL" },
                    { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
                    { name: "Microsoft SQL Server", icon: "devicon-microsoftsqlserver-plain colored" }
                ]
            },
            {
                title: "Tools & Platforms",
                label: "Workflow",
                items: [
                    { name: "Google Colab", icon: "devicon-googlecolab-plain colored" },
                    { name: "Jupyter", icon: "devicon-jupyter-plain colored" },
                    { name: "Git", icon: "devicon-git-plain colored" },
                    { name: "Linux", icon: "devicon-linux-plain colored" },
                    { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark colored" },
                    { name: "Google Cloud", icon: "devicon-googlecloud-plain colored" }
                ]
            },
            {
                title: "Others",
                label: "Optimization",
                items: [
                    { name: "Model Optimization", icon: "fallback", tag: "MO" },
                    { name: "Edge Deployment", icon: "fallback", tag: "ED" },
                    { name: "Data Preprocessing", icon: "fallback", tag: "DP" },
                    { name: "Feature Engineering", icon: "fallback", tag: "FE" }
                ]
            }
        ],
        noteLabel: "Focus:",
        noteText: "building efficient end-to-end AI pipelines with strong model quality, deployment readiness, and real-world reliability."
    },

    projectsSection: {
        title: "Featured Projects",
        copy: "Production-focused projects spanning computer vision, intelligent automation, and analytics delivery.",
        categories: [
            { filter: "all", label: "All", active: true },
            { filter: "ai", label: "AI" },
            { filter: "web", label: "Web" },
            { filter: "automation", label: "Automation" }
        ]
    },

    projects: [
        {
            id: "project-1",
            title: "Sugary AI: Diabetes Analysis",
            categories: ["ai"],
            meta: ["HealthTech", "Analytics", "Prediction"],
            description: "An end-to-end AI system for analyzing glucose levels and providing personalized health insights. Built to improve diabetic patient care.",
            highlights: [
                "Developed accurate prediction models using clinical datasets.",
                "Integrated intuitive visualization for health trends and monitoring."
            ],
            tech: ["Python", "TensorFlow", "Scikit-Learn"],
            image: {
                src: "images/sugary_project.png",
                alt: "Sugary AI: Diabetes Analysis"
            },
            githubUrl: "https://github.com/Alaa-Saboukh02/Sugary_project",
            shareUrl: "https://github.com/Alaa-Saboukh02/Sugary_project",
            shareTitle: "Sugary AI: Diabetes Analysis"
        },
        {
            id: "project-2",
            title: "AutoVision: Car Wash Detection",
            categories: ["ai", "automation"],
            meta: ["Computer Vision", "Object Detection", "Tracking"],
            description: "Real-time computer vision model for identifying cars entering/ exiting car wash stations and tracking their status.",
            highlights: [
                "Implemented YOLO-based detection with 95% accuracy.",
                "Optimized for real-time inference on edge devices for surveillance."
            ],
            tech: ["YOLOv8", "OpenCV", "PyTorch"],
            image: {
                src: "images/car_wash.png",
                alt: "AutoVision: Car Wash Detection"
            },
            githubUrl: "https://github.com/Alaa-Saboukh02/car_waching-models",
            shareUrl: "https://github.com/Alaa-Saboukh02/car_waching-models",
            shareTitle: "AutoVision: Car Wash Detection"
        },
        {
            id: "project-3",
            title: "BikeStore Data Intelligence",
            categories: ["web", "automation"],
            meta: ["Data Analysis", "SQL", "Market Trends"],
            description: "Analysis pipeline for bike retail, uncovering sales patterns and customer behavior through SQL and Python.",
            highlights: [
                "Transformed raw SQL data into actionable business intelligence.",
                "Created high-impact visualizations for store performance tracking."
            ],
            tech: ["SQL", "Pandas", "Matplotlib"],
            image: {
                src: "images/bike_store.png",
                alt: "BikeStore Data Intelligence"
            },
            githubUrl: "https://github.com/Alaa-Saboukh02/Bike_store.python",
            shareUrl: "https://github.com/Alaa-Saboukh02/Bike_store.python",
            shareTitle: "BikeStore Data Intelligence"
        },
        {
            id: "project-4",
            title: "InvoiceSense AI: NLP Classifier",
            categories: ["ai"],
            meta: ["NLP", "Transformers", "FinTech"],
            description: "Deep learning tool designed to automatically categorize restaurant and store invoices using advanced NLP.",
            highlights: [
                "Leveraged Transformer models for high-precision text classification.",
                "Automated document sorting workflows for efficient finance management."
            ],
            tech: ["HuggingFace", "Python", "Deep Learning"],
            image: {
                src: "images/invoice_classifier.png",
                alt: "InvoiceSense AI: NLP Classifier"
            },
            githubUrl: "https://github.com/Alaa-Saboukh02/AutoModelForSequenceClassification",
            shareUrl: "https://github.com/Alaa-Saboukh02/AutoModelForSequenceClassification",
            shareTitle: "InvoiceSense AI: NLP Classifier"
        }
    ],

    certificatesSection: {
        kicker: "Certifications",
        title: "Verified Certifications & Credentials",
        copy: "Accredited training programs and professional certifications spanning technical disciplines, business ideation, and leadership skills."
    },

    certificates: [
        {
            id: "cert-1",
            title: "Meta UX Design",
            issuer: "Meta · Professional Certification",
            category: "technical",
            date: "2026",
            image: "images/certificates/cert-meta.png",
            badge: "Meta Certified",
            description: "Principles of UX/UI Design, interactive prototyping, user research methodologies, and design systems certified by Meta & Coursera."
        },
        {
            id: "cert-2",
            title: "Digital Marketing",
            issuer: "Creativa Training Certificate",
            category: "technical",
            date: "2026",
            image: "images/certificates/cert-creativa.png",
            badge: "Creativa Hub",
            description: "Bootcamp certificate in Digital Marketing, client acquisition strategies, data-driven campaigns, and marketing analytics at Creativa Hub Damanhour."
        },
        {
            id: "cert-3",
            title: "Entrepreneurship & Soft Skills",
            issuer: "Microsoft & Ministry of Youth Training",
            category: "technical",
            date: "2025 - 2026",
            image: "images/certificates/cert-microsoft.png",
            badge: "Microsoft Certified",
            description: "Entrepreneurship ideation, business modeling, design thinking, and collaborative workforce skills certified by Microsoft and the Ministry of Youth & Sports."
        },
        {
            id: "cert-4",
            title: "Effective Communication Skills",
            issuer: "Damanhour University · مهارات التواصل الفعال",
            category: "soft-skills",
            date: "2025",
            image: "images/certificates/cert-communication.png",
            badge: "Official Certificate",
            description: "Specialized training workshop on effective communication, active listening, negotiation techniques, and public speaking at Damanhour University."
        },
        {
            id: "cert-5",
            title: "Time Management",
            issuer: "Damanhour University · فن إدارة الوقت",
            category: "soft-skills",
            date: "2025",
            image: "images/certificates/cert-time-mgmt.png",
            badge: "Official Certificate",
            description: "Practical strategies for productivity, priority matrix management, task delegation, and efficient workflow execution."
        },
        {
            id: "cert-6",
            title: "Teamwork Skills",
            issuer: "Damanhour University · مهارات العمل ضمن فريق",
            category: "soft-skills",
            date: "2025",
            image: "images/certificates/cert-teamwork.png",
            badge: "Official Certificate",
            description: "Interactive training on high-performance team dynamics, collaborative problem solving, leadership, and emotional intelligence."
        }
    ],

    experience: {
        title: "Professional Experience",
        copy: "3+ years delivering AI systems from data to deployment across computer vision, automation, and analytics.",
        metrics: [
            {
                label: "Delivery",
                value: "20+ Builds",
                description: "Production-ready AI pipelines shipped."
            },
            {
                label: "Focus",
                value: "CV + AI",
                description: "Detection, classification, tracking, OCR."
            },
            {
                label: "Deployment",
                value: "Edge + Cloud",
                description: "FastAPI, Docker, and optimized inference."
            }
        ],
        items: [
            {
                role: "Bio AI & Machine Learning Engineer",
                org: "Healthcare · BioTech Solutions",
                period: "Core Specialty",
                summary: "Lead developer of intelligent systems for medical analysis, including the specialized \"Sugary App\" for diabetes data intelligence.",
                points: [
                    "Architected deep learning pipelines for high-precision medical imaging and biostatistics.",
                    "Engineered predictive models for healthcare monitoring with a focus on real-world reliability.",
                    "Collaborated on regional AI initiatives across Egypt and Saudi Arabia."
                ],
                tags: ["Deep Learning", "BioTech", "Medical AI"]
            },
            {
                role: "Data Intelligence Specialist",
                org: "NTI · Digital Egypt Pioneers",
                period: "Professional Track",
                summary: "Certified Specialist through the National Telecommunication Institute, focusing on advanced analytics and data-driven strategy.",
                points: [
                    "Built automated data mining and visualization layers for complex industrial datasets.",
                    "Delivered KPI dashboards that translate model signals into strategic business outcomes.",
                    "Optimized data pipelines for large-scale analytics and intelligence reporting."
                ],
                tags: ["Data Analysis", "NTI Certified", "Business Intelligence"]
            },
            {
                role: "Robotics & IoT Developer",
                org: "Edge AI · Hardware Integration",
                period: "Innovation Track",
                summary: "Integrating AI models with embedded systems to build physical automation and smart robotic platforms.",
                points: [
                    "Designed Arduino-based control systems integrated with real-time vision algorithms.",
                    "Developed Edge AI deployments for surveillance and automated industrial workflows.",
                    "Spearheaded R&D projects bridging the gap between ML software and physical hardware."
                ],
                tags: ["Robotics", "Arduino", "Edge Computing"]
            }
        ]
    },

    contact: {
        title: "Contact & Collaboration",
        copy: "Have a project or opportunity? Send a direct message below.",
        primary: {
            text: "allaa54sabboukh@gmail.com",
            url: "mailto:allaa54sabboukh@gmail.com"
        },
        secondary: {
            text: "WhatsApp Message",
            url: "https://wa.me/201019741580"
        },
        location: "Egypt · KSA · Remote",
        linkedinLabel: "linkedin.com/in/allaa-saboukh",
        githubLabel: "github.com/Alaa-Saboukh02",
        panelTitle: "Direct Channels",
        panelCopy: "Prefer email or phone? Reach me anytime through these verified channels.",
        availabilityTitle: "Current Availability",
        availabilityCopy: "Open to full-time AI roles, contract engagements, and consultancy on deep learning and vision pipelines.",
        formTitle: "Send a Message",
        formCopy: "Fill out the form below to discuss project scope, timelines, or advisory work.",
        formNote: "Your message will be sent securely to my inbox.",
        formSubmit: "Send Message"
    }
};
