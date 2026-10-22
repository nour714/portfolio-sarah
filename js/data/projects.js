/**
 * Machine Learning & Data Science Portfolio - Projects Data
 * Edit this file to add, modify, or reorder featured projects.
 */

export const projectsSection = {
    kicker: "Applied Machine Learning",
    title: "Featured ML & Data Projects",
    copy: "End-to-end machine learning pipelines, predictive classification models, exploratory data analysis, and practical solutions turning data into actionable insights.",
    categories: [
        { filter: "all", label: "All Systems", active: true },
        { filter: "ai", label: "Machine Learning & AI" },
        { filter: "automation", label: "Predictive Pipelines" },
        { filter: "web", label: "Data Analytics & EDA" }
    ]
};

export const projects = [
    {
        id: "project-1",
        index: "01",
        title: "E-Commerce Purchase Intent Prediction",
        categories: ["ai", "web"],
        meta: ["Machine Learning", "Classification", "NTI × ITIDA"],
        problemStatement: "Predicting whether an online browsing session will convert into a completed purchase despite severe class imbalance in real-world visitor transactions.",
        description: "Engineered an end-to-end machine learning pipeline during the NTI & ITIDA Summer Training. Processed e-commerce customer browsing data, mitigated extreme class imbalance, compared multiple classification algorithms, and extracted key behavioral conversion drivers through feature importance analysis.",
        highlights: [
            "Conducted comprehensive Exploratory Data Analysis (EDA) on visitor duration, bounce rates, and page values.",
            "Handled acute class imbalance using SMOTE resampling and cost-sensitive class weighting to maximize recall without sacrificing precision.",
            "Benchmarked and compared classification algorithms (Random Forest, XGBoost, Logistic Regression) with cross-validation.",
            "Analyzed feature importance to uncover key visitor metrics that drive purchase decisions, translating model insights into strategic actions."
        ],
        metrics: [
            { label: "ROC-AUC", value: 93.4, suffix: "%", prefix: "" },
            { label: "F1-Score", value: 89.2, suffix: "%", prefix: "" },
            { label: "Class Balance", value: 100, suffix: "%", prefix: "" }
        ],
        tech: ["Python", "Scikit-Learn", "Pandas", "NumPy", "XGBoost", "Matplotlib", "Seaborn"],
        pipeline: [
            { label: "Exploration", detail: "EDA & Outliers" },
            { label: "Data Prep", detail: "Encoding & Scaling" },
            { label: "Resampling", detail: "SMOTE & Weighting" },
            { label: "Model Benchmarking", detail: "Random Forest & XGB" },
            { label: "Feature Signals", detail: "Importance Analysis" }
        ],
        image: {
            src: "images/bike_store.png",
            srcWebp: "images/bike_store.webp",
            alt: "E-Commerce Purchase Intent Prediction Preview"
        },
        previewUrl: "images/bike_store.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "E-Commerce Purchase Intent Prediction - Sarah Nabil"
    },
    {
        id: "project-2",
        index: "02",
        title: "Predictive Health & Biomarker Analytics",
        categories: ["ai"],
        meta: ["HealthTech", "Predictive ML", "Data Analysis"],
        problemStatement: "Anticipating critical glycemic trends and biometric changes using non-stationary health sensor telemetry.",
        description: "Built a predictive machine learning pipeline analyzing biometric sensor streams. Applied exploratory signal cleaning, extracted temporal statistical features, and evaluated classification thresholds to alert patients to adverse physiological shifts.",
        highlights: [
            "Trained predictive algorithms on complex physiological sensor sequences with adaptive calibration.",
            "Achieved 94.6% recall on adverse event classification with proactive lead times.",
            "Integrated explainable feature importance (SHAP) to interpret key biometric risk indicators."
        ],
        metrics: [
            { label: "Adverse Recall", value: 94.6, suffix: "%", prefix: "" },
            { label: "Evaluation F1", value: 91.2, suffix: "%", prefix: "" },
            { label: "Data Clean Rate", value: 99.1, suffix: "%", prefix: "" }
        ],
        tech: ["Python", "Scikit-Learn", "Pandas", "NumPy", "Plotly", "SHAP"],
        pipeline: [
            { label: "Data Ingestion", detail: "Sensor Signals" },
            { label: "Noise Cleaning", detail: "Filtering & Imputation" },
            { label: "Feature Extract", detail: "Temporal Windows" },
            { label: "ML Classification", detail: "Risk Prediction" },
            { label: "Explainability", detail: "SHAP Values" }
        ],
        image: {
            src: "images/sugary_project.png",
            srcWebp: "images/sugary_project.webp",
            alt: "Predictive Health Analytics Preview"
        },
        previewUrl: "images/sugary_project.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Predictive Health Analytics - Sarah Nabil"
    },
    {
        id: "project-3",
        index: "03",
        title: "Intelligent Text & Document Classification",
        categories: ["ai", "automation"],
        meta: ["NLP", "Classification", "Information Extraction"],
        problemStatement: "Automated categorization and entity understanding from unstructured, multi-format business documents.",
        description: "Developed a text classification and information extraction pipeline. Implemented text preprocessing, TF-IDF and embedding representations, and compared classification models to route incoming documents efficiently.",
        highlights: [
            "Preprocessed messy unstructured text including tokenization, normalization, and stop-word optimization.",
            "Benchmarked linear and ensemble classifiers achieving 97.2% F1 score across multiple document classes.",
            "Automated downstream validation to eliminate manual routing bottlenecks."
        ],
        metrics: [
            { label: "Entity F1 Score", value: 97.2, suffix: "%", prefix: "" },
            { label: "Latency", value: 185, suffix: "ms", prefix: "<" },
            { label: "Accuracy", value: 96.8, suffix: "%", prefix: "" }
        ],
        tech: ["Python", "Scikit-Learn", "NLP", "Pandas", "NumPy"],
        pipeline: [
            { label: "Text Extraction", detail: "Document Ingestion" },
            { label: "Tokenization", detail: "Cleaning & Lemmatization" },
            { label: "Vectorization", detail: "TF-IDF / Embeddings" },
            { label: "Classification", detail: "Multi-class Model" },
            { label: "Output Schema", detail: "Structured JSON" }
        ],
        image: {
            src: "images/invoice_classifier.png",
            srcWebp: "images/invoice_classifier.webp",
            alt: "Document Classification Preview"
        },
        previewUrl: "images/invoice_classifier.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Intelligent Text Classification - Sarah Nabil"
    },
    {
        id: "project-4",
        index: "04",
        title: "Retail Demand Forecasting & Customer Analytics",
        categories: ["web", "automation"],
        meta: ["Predictive ML", "Analytics", "Feature Engineering"],
        problemStatement: "Dynamic product demand forecasting across seasonality, regional trends, and store-level supply constraints.",
        description: "Architected a predictive analytics and demand forecasting platform. Combines gradient boosted models with automated feature engineering to forecast inventory requirements and uncover customer purchasing trends.",
        highlights: [
            "Built automated continuous feature engineering pipelines with rolling statistics and lag variables.",
            "Reduced critical inventory stockouts by 38% while improving forecast accuracy.",
            "Delivered comprehensive data visualization dashboards communicating trends clearly to non-technical stakeholders."
        ],
        metrics: [
            { label: "Forecast Accuracy", value: 92.4, suffix: "%", prefix: "" },
            { label: "Stockout Reduction", value: 38, suffix: "%", prefix: "-" },
            { label: "Pipeline Runtime", value: 3.5, suffix: "min", prefix: "<" }
        ],
        tech: ["Python", "XGBoost", "LightGBM", "Pandas", "NumPy", "SQL"],
        pipeline: [
            { label: "Data Warehouse", detail: "Transaction Records" },
            { label: "Feature Store", detail: "Lag & Calendar Features" },
            { label: "GBM Model", detail: "Gradient Boosting" },
            { label: "Forecast Engine", detail: "Demand Projections" },
            { label: "BI Insights", detail: "Visual Dashboards" }
        ],
        image: {
            src: "images/bike_store.png",
            alt: "Retail Demand Forecasting Preview"
        },
        previewUrl: "images/bike_store.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Retail Demand Forecasting - Sarah Nabil"
    }
];
