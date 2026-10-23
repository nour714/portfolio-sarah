/**
 * Verified Certifications & Credentials Data
 * Clean Architecture - Presentation / UI Layer
 *
 * All certificate images are rendered directly from uploaded original PDFs.
 * Sarah Nabil Aboelmajd Ahmad – AI Student, Kafrelsheikh University
 */

export const certificatesSection = {
    kicker: "Credentials & Training",
    title: "Verified Certifications & Training",
    copy: "Accredited training programs, professional certifications, and institutional diplomas across Machine Learning, AI, Software Engineering, and Leadership.",
    categories: [
        { filter: "all",         label: "All Credentials",       active: true },
        { filter: "technical",   label: "Technical & AI Training" },
        { filter: "soft-skills", label: "Leadership & Soft Skills" }
    ]
};

export const certificates = [
    // ─── TECHNICAL ──────────────────────────────────────────────────────────────
    {
        id: "cert-1",
        index: "01",
        title: "Machine Learning Training (120 Hours)",
        issuer: "National Telecommunication Institute (NTI) & ITIDA",
        category: "technical",
        badge: "Score: 95%",
        date: "26 July – 20 August 2026",
        credentialId: "NTI-316260",
        image: "images/certificates/cert-nti-ml.png",
        imageFallback: "images/certificates/cert-nti-ml.webp",
        verificationUrl: "images/certificates/nti-itida-machine-learning-training.pdf",
        summary: "Intensive 120-hour summer training in Machine Learning completed with an outstanding 95% score — certified by NTI & ITIDA.",
        description: "Accredited 120-hour intensive Machine Learning program (90 Technical hrs + 30 Freelancing hrs) covering supervised and unsupervised learning, feature engineering, data preprocessing, model evaluation (ROC-AUC, Precision, Recall, F1), and predictive modeling with Python and Scikit-Learn. Issued by NTI under ITIDA, signed by ITIDA CEO Eng. Ahmed El Zaher and NTI Director Prof. Ahmed Khattab.",
        metrics: [
            { label: "Graduation Score", value: 95,  prefix: "",    suffix: "%" },
            { label: "Training Duration",value: 120, prefix: "",    suffix: " hrs" },
            { label: "Student ID",       value: 316260, prefix: "#", suffix: "" }
        ],
        skills: ["Machine Learning", "Python", "Data Preprocessing", "Supervised Learning", "Model Evaluation", "Scikit-Learn"],
        pipeline: [
            { label: "Data Exploration",  detail: "EDA & Feature Analysis" },
            { label: "Preprocessing",     detail: "Scaling & Encoding" },
            { label: "Model Training",    detail: "Classification & Regression" },
            { label: "Evaluation",        detail: "ROC-AUC & F1-Score" },
            { label: "NTI Credential",    detail: "Graduated with 95%" }
        ]
    },
    {
        id: "cert-2",
        index: "02",
        title: "Sprints × Microsoft Summer Camp – AI and Machine Learning",
        issuer: "Sprints × Microsoft",
        category: "technical",
        badge: "40 hrs",
        date: "2026",
        credentialId: "ID-SPR-S967AU",
        image: "images/certificates/cert-sprints-microsoft.png",
        imageFallback: "images/certificates/cert-sprints-microsoft.webp",
        verificationUrl: "images/certificates/sprints-microsoft-ai-summer-camp.pdf",
        summary: "Comprehensive AI and applied machine learning summer camp (40 hrs) delivered jointly by Sprints and Microsoft — certified by Sprints CEO Ayman Bazaraa.",
        description: "Intensive training camp organized by Sprints in collaboration with Microsoft, covering artificial intelligence fundamentals, modern machine learning architectures, predictive data workflows, and applied problem-solving. 40-hour learning workload. Certificate ID: SPR-S967AU.",
        metrics: [
            { label: "Learning Workload", value: 40,  prefix: "",  suffix: " hrs" },
            { label: "Program Status",    value: 100, prefix: "",  suffix: "% Complete" },
            { label: "Certificate ID",    value: "S967AU", prefix: "SPR-", suffix: "" }
        ],
        skills: ["Artificial Intelligence", "Machine Learning", "Data Modeling", "Microsoft AI", "Problem Solving"],
        pipeline: [
            { label: "AI Foundations",   detail: "Core Principles" },
            { label: "ML Modeling",      detail: "Supervised Algorithms" },
            { label: "Practical Labs",   detail: "Python & Data Workflows" },
            { label: "Final Assessment", detail: "Capstone Project" },
            { label: "Accreditation",    detail: "Sprints × Microsoft" }
        ]
    },
    {
        id: "cert-3",
        index: "03",
        title: "CIB Summer Program – "The Green Leap"",
        issuer: "Commercial International Bank (CIB)",
        category: "technical",
        badge: "July 2025",
        date: "July 2025",
        credentialId: "CIB-INTERN-2025",
        image: "images/certificates/cert-cib-internship.png",
        imageFallback: "images/certificates/cert-cib-internship.webp",
        verificationUrl: "images/certificates/cib-summer-internship-green-leap.pdf",
        summary: "Certificate of Attendance for the CIB Summer Internship Program "The Green Leap" – signed by Mohamed El-Senary, CIB Chief Human Resources Officer.",
        description: "Certificate of Attendance awarded by Commercial International Bank (CIB) for participation, completion, and understanding of the principles, approaches, and best practices of the CIB Summer Program "The Green Leap" as an integral part of the CIB Summer Internship Program, July 2025. Partnered with IFC, Euromoney Learning, SAS, Frankfurt School, LinkedIn Learning, Udemy Business, and more.",
        metrics: [
            { label: "Internship Status", value: 100, prefix: "",  suffix: "% Complete" },
            { label: "Partner Orgs",      value: 12,  prefix: "",  suffix: " Institutions" },
            { label: "Year",              value: 2025, prefix: "",  suffix: "" }
        ],
        skills: ["Banking Technology", "Sustainability", "ESG Principles", "Professional Development", "Financial Systems"],
        pipeline: [
            { label: "Orientation",     detail: "Enterprise Practices" },
            { label: "Green Finance",   detail: "Sustainability & ESG" },
            { label: "Industry Labs",   detail: "Partner Organizations" },
            { label: "Project Work",    detail: "Hands-on Implementation" },
            { label: "CIB Certificate", detail: "Successful Completion" }
        ]
    },

    // ─── SOFT SKILLS ────────────────────────────────────────────────────────────
    {
        id: "cert-4",
        index: "04",
        title: "Effective Communication & Interpersonal Dynamics",
        issuer: "Damanhour University · مهارات التواصل الفعال",
        category: "soft-skills",
        badge: "University Diploma",
        date: "2025",
        credentialId: "DAMANHOUR-COMM-2025",
        image: "images/certificates/cert-sprints-microsoft.png",   // placeholder – replace when image uploaded
        imageFallback: "images/certificates/cert-sprints-microsoft.webp",
        verificationUrl: "#",
        summary: "Executive communication, active listening, negotiation tactics, and confident technical presentations.",
        description: "Specialized university development diploma focusing on assertive stakeholder communication, cross-functional collaboration, conflict resolution, emotional intelligence, and confident technical presentation delivery.",
        metrics: [
            { label: "Core Modules",   value: 6,  prefix: "", suffix: " Modules" },
            { label: "Speech Mastery", value: 94, prefix: "", suffix: "%" },
            { label: "Workshop Hours", value: 40, prefix: "", suffix: " hrs" }
        ],
        skills: ["Active Listening", "Negotiation", "Public Speaking", "Conflict Resolution", "Executive Presentation"],
        pipeline: [
            { label: "Verbal Dynamics",  detail: "Clarity & Tone" },
            { label: "Body Language",    detail: "Non-Verbal Impact" },
            { label: "Negotiation Lab",  detail: "Win-Win Framing" },
            { label: "Live Speech",      detail: "Audience Engagement" },
            { label: "Certification",    detail: "University Seal" }
        ]
    },
    {
        id: "cert-5",
        index: "05",
        title: "Time Management & Executive Productivity",
        issuer: "Damanhour University · فن إدارة الوقت",
        category: "soft-skills",
        badge: "Productivity Certified",
        date: "2025",
        credentialId: "DAMANHOUR-TIME-2025",
        image: "images/certificates/cert-nti-ml.png",   // placeholder – replace when image uploaded
        imageFallback: "images/certificates/cert-nti-ml.webp",
        verificationUrl: "#",
        summary: "High-leverage prioritization, Eisenhower matrix execution, deep work protocols, and productivity optimization.",
        description: "Advanced institutional training in personal productivity systems, priority quadrant prioritization, deep-work sprints, procrastination mitigation, and structured task scheduling.",
        metrics: [
            { label: "Productivity Gain", value: 42, prefix: "+", suffix: "%" },
            { label: "Framework Score",   value: 97, prefix: "",  suffix: "%" },
            { label: "Case Scenarios",    value: 30, prefix: "",  suffix: " hrs" }
        ],
        skills: ["Priority Matrix", "Deep Work", "Sprint Planning", "Habit Stacking", "Workflow Optimization"],
        pipeline: [
            { label: "Audit Habits",       detail: "Time-Tracking Data" },
            { label: "Eisenhower Matrix",  detail: "Urgent vs Important" },
            { label: "Deep Work Flow",     detail: "Focus Sprints" },
            { label: "Delegation Systems", detail: "Leverage Protocols" },
            { label: "Certified",          detail: "Official Badge" }
        ]
    },
    {
        id: "cert-6",
        index: "06",
        title: "Collaborative Teamwork & Agile Dynamics",
        issuer: "Damanhour University · مهارات العمل ضمن فريق",
        category: "soft-skills",
        badge: "Leadership Diploma",
        date: "2025",
        credentialId: "DAMANHOUR-TEAM-2025",
        image: "images/certificates/cert-cib-internship.png",   // placeholder – replace when image uploaded
        imageFallback: "images/certificates/cert-cib-internship.webp",
        verificationUrl: "#",
        summary: "Cross-functional team synchronization, psychological safety, and collective problem-solving.",
        description: "Rigorous experiential training on high-performance group psychology, collaborative sprint retrospectives, constructive feedback loops, distributed teamwork, and collective problem resolution.",
        metrics: [
            { label: "Team Sprints",   value: 10, prefix: "", suffix: " Sprints" },
            { label: "Teamwork Score", value: 96, prefix: "", suffix: "%" },
            { label: "Field Exercises",value: 35, prefix: "", suffix: " hrs" }
        ],
        skills: ["Team Dynamics", "Agile Mindset", "Peer Accountability", "Feedback Loops", "Collaborative Strategy"],
        pipeline: [
            { label: "Team Charter",    detail: "Shared Objectives" },
            { label: "Role Alignment",  detail: "Strengths-Based" },
            { label: "Simulation Labs", detail: "Crisis Response" },
            { label: "Retrospectives",  detail: "Continuous Growth" },
            { label: "Accreditation",   detail: "Leadership Diploma" }
        ]
    }
];
