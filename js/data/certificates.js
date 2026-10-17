/**
 * Verified Certifications & Credentials Data
 * Machine Learning & Data Engineering Portfolio
 * Edit this file to add, modify, or reorder certifications.
 */

export const certificatesSection = {
    kicker: "Credentials & Mastery",
    title: "Verified Certifications & Credentials",
    copy: "Accredited training programs, professional certifications, and institutional diplomas spanning UX design, digital marketing, enterprise entrepreneurship, and leadership skills.",
    categories: [
        { filter: "all", label: "All Credentials", active: true },
        { filter: "technical", label: "Technical & Professional" },
        { filter: "soft-skills", label: "Leadership & Soft Skills" }
    ]
};

export const certificates = [
    {
        id: "cert-1",
        index: "01",
        title: "Meta UX Design Specialization",
        issuer: "Meta & Coursera · Professional Credential",
        category: "technical",
        badge: "Meta Certified",
        date: "2026",
        credentialId: "COURSERA-META-UX-9842",
        image: "images/certificates/cert-meta.png",
        verificationUrl: "images/certificates/cert-meta.png",
        summary: "End-to-end user experience engineering, interactive design systems, and usability heuristics certified by Meta.",
        description: "Comprehensive professional certification in UX/UI design systems, design thinking frameworks, wireframing, high-fidelity Figma prototyping, and quantitative user testing methodologies certified by Meta & Coursera.",
        metrics: [
            { label: "Course Modules", value: 7, prefix: "", suffix: " Courses" },
            { label: "Capstone Grade", value: 98.5, prefix: "", suffix: "%" },
            { label: "Practical Labs", value: 120, prefix: ">", suffix: " hrs" }
        ],
        skills: ["UX Research", "Figma", "User Journey", "Wireframing", "Design Systems", "Usability Testing"],
        pipeline: [
            { label: "Foundations", detail: "UX Principles" },
            { label: "Research", detail: "User Interviews" },
            { label: "Wireframes", detail: "Low & High Fidelity" },
            { label: "Prototyping", detail: "Interactive States" },
            { label: "Meta Review", detail: "Verified Credential" }
        ]
    },
    {
        id: "cert-2",
        index: "02",
        title: "Digital Marketing & Growth Bootcamp",
        issuer: "Creativa Hub Damanhour · Ministry of CIT",
        category: "technical",
        badge: "Creativa Hub",
        date: "2026",
        credentialId: "CREATIVA-DM-2026-B81",
        image: "images/certificates/cert-creativa.png",
        verificationUrl: "images/certificates/cert-creativa.png",
        summary: "Data-driven marketing, customer acquisition funnels, and digital branding strategies at Creativa Hub.",
        description: "Intensive training on growth marketing frameworks, multi-channel performance advertising, social media analytics, customer lifetime value modeling, and digital brand positioning sponsored by the Ministry of Communications & IT.",
        metrics: [
            { label: "Campaign ROI", value: 4.8, prefix: "", suffix: "x" },
            { label: "Curriculum Score", value: 96, prefix: "", suffix: "%" },
            { label: "Bootcamp Hours", value: 80, prefix: "", suffix: " hrs" }
        ],
        skills: ["Performance Marketing", "Google Analytics", "Content Strategy", "A/B Testing", "Funnel Optimization"],
        pipeline: [
            { label: "Market Audit", detail: "Audience Profiling" },
            { label: "Content Matrix", detail: "Campaign Blueprints" },
            { label: "PPC & Funnels", detail: "Multi-Platform Ads" },
            { label: "Data Analytics", detail: "Conversion Tracking" },
            { label: "Final Pitch", detail: "Client Growth Plan" }
        ]
    },
    {
        id: "cert-3",
        index: "03",
        title: "Entrepreneurship & Workforce Readiness",
        issuer: "Microsoft & Ministry of Youth Training",
        category: "technical",
        badge: "Microsoft Certified",
        date: "2025 - 2026",
        credentialId: "MS-YOUTH-ENTR-4421",
        image: "images/certificates/cert-microsoft.png",
        verificationUrl: "images/certificates/cert-microsoft.png",
        summary: "Business modeling, technological innovation ideation, and collaborative enterprise leadership certified by Microsoft.",
        description: "Accredited workforce entrepreneurship program focusing on Business Model Canvas (BMC), design-led problem solving, financial viability modeling, and collaborative agile teamwork developed by Microsoft and the Ministry of Youth & Sports.",
        metrics: [
            { label: "Business Labs", value: 12, prefix: "", suffix: " Labs" },
            { label: "Program Score", value: 95, prefix: "", suffix: "%" },
            { label: "Mentorship Hours", value: 65, prefix: "", suffix: " hrs" }
        ],
        skills: ["Business Modeling", "Design Thinking", "Financial Planning", "Pitch Deck", "Agile Execution"],
        pipeline: [
            { label: "Problem Discovery", detail: "Pain Point Analysis" },
            { label: "Business Model", detail: "BMC Architecture" },
            { label: "Financial Projections", detail: "Unit Economics" },
            { label: "Investor Pitch", detail: "Presentation Review" },
            { label: "MS Credential", detail: "Accredited Diploma" }
        ]
    },
    {
        id: "cert-4",
        index: "04",
        title: "Effective Communication & Interpersonal Dynamics",
        issuer: "Damanhour University · مهارات التواصل الفعال",
        category: "soft-skills",
        badge: "University Diploma",
        date: "2025",
        credentialId: "DAMANHOUR-COMM-2025-09",
        image: "images/certificates/cert-communication.png",
        verificationUrl: "images/certificates/cert-communication.png",
        summary: "Executive communication, active listening mastery, negotiation tactics, and persuasive public speaking.",
        description: "Specialized university development diploma focusing on assertive stakeholder communication, cross-functional negotiation, conflict resolution, emotional intelligence, and confident technical presentations.",
        metrics: [
            { label: "Core Modules", value: 6, prefix: "", suffix: " Modules" },
            { label: "Speech Mastery", value: 94, prefix: "", suffix: "%" },
            { label: "Workshop Hours", value: 40, prefix: "", suffix: " hrs" }
        ],
        skills: ["Active Listening", "Negotiation", "Public Speaking", "Conflict Resolution", "Executive Presentation"],
        pipeline: [
            { label: "Verbal Dynamics", detail: "Clarity & Tone" },
            { label: "Body Language", detail: "Non-Verbal Impact" },
            { label: "Negotiation Lab", detail: "Win-Win Framing" },
            { label: "Live Speech", detail: "Audience Engagement" },
            { label: "Certification", detail: "University Seal" }
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
        credentialId: "DAMANHOUR-TIME-2025-14",
        image: "images/certificates/cert-time-mgmt.png",
        verificationUrl: "images/certificates/cert-time-mgmt.png",
        summary: "High-leverage prioritization, Eisenhower matrix execution, deep work protocols, and cognitive load minimization.",
        description: "Advanced institutional training in high-performance personal productivity systems, priority quadrant prioritization, Pomodoro deep-work sprints, procrastination mitigation, and scalable delegation strategies.",
        metrics: [
            { label: "Productivity Gain", value: 42, prefix: "+", suffix: "%" },
            { label: "Framework Score", value: 97, prefix: "", suffix: "%" },
            { label: "Case Scenarios", value: 30, prefix: "", suffix: " hrs" }
        ],
        skills: ["Priority Matrix", "Deep Work", "Sprint Planning", "Habit Stacking", "Workflow Automation"],
        pipeline: [
            { label: "Audit Habits", detail: "Time-Tracking Data" },
            { label: "Eisenhower Matrix", detail: "Urgent vs Important" },
            { label: "Deep Work Flow", detail: "Focus Sprints" },
            { label: "Delegation Systems", detail: "Leverage Protocols" },
            { label: "Certified", detail: "Official Badge" }
        ]
    },
    {
        id: "cert-6",
        index: "06",
        title: "Collaborative Teamwork & Agile Leadership",
        issuer: "Damanhour University · مهارات العمل ضمن فريق",
        category: "soft-skills",
        badge: "Leadership Diploma",
        date: "2025",
        credentialId: "DAMANHOUR-TEAM-2025-22",
        image: "images/certificates/cert-teamwork.png",
        verificationUrl: "images/certificates/cert-teamwork.png",
        summary: "Cross-functional team synchronization, psychological safety, and collective problem-solving in high-stakes environments.",
        description: "Rigorous experiential training on high-performance group psychology, collaborative sprint retrospectives, constructive feedback loops, distributed team leadership, and collective problem resolution.",
        metrics: [
            { label: "Team Sprints", value: 10, prefix: "", suffix: " Sprints" },
            { label: "Teamwork Score", value: 96, prefix: "", suffix: "%" },
            { label: "Field Exercises", value: 35, prefix: "", suffix: " hrs" }
        ],
        skills: ["Team Dynamics", "Agile Mindset", "Peer Accountability", "Feedback Loops", "Collaborative Strategy"],
        pipeline: [
            { label: "Team Charter", detail: "Shared Objectives" },
            { label: "Role Alignment", detail: "Strengths-Based" },
            { label: "Simulation Labs", detail: "Crisis Response" },
            { label: "Retrospectives", detail: "Continuous Growth" },
            { label: "Accreditation", detail: "Leadership Diploma" }
        ]
    }
];
