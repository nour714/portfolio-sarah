/**
 * Machine Learning & Data Science Portfolio - Projects Data
 * Clean Architecture - Presentation / UI Layer
 * 
 * Featured projects corresponding to Sarah Nabil's official CV
 */

export const projectsSection = {
    kicker: "Applied Machine Learning & AI",
    title: "Featured AI & Software Projects",
    copy: "Practical implementations across Machine Learning, Computer Vision with OpenCV, Artificial Neural Networks (ANN), C++ Qt GUI applications, and Relational Database Systems.",
    categories: [
        { filter: "all", label: "All Projects", active: true },
        { filter: "ai", label: "Machine Learning & AI" },
        { filter: "cv", label: "Computer Vision" },
        { filter: "software", label: "Software & Databases" }
    ]
};

export const projects = [
    {
        id: "project-1",
        index: "01",
        title: "Machine Learning — Classification & Regression",
        categories: ["ai"],
        meta: ["Machine Learning", "Supervised Learning", "Python"],
        problemStatement: "Building robust predictive models for tabular datasets using supervised classification and regression algorithms with comprehensive model evaluation.",
        description: "Implemented practical machine learning projects involving classification and regression tasks. Practiced structured model training workflows, feature preparation, hyperparameter tuning, and supervised learning benchmarks to forecast categorical and continuous target variables.",
        highlights: [
            "Conducted thorough Exploratory Data Analysis (EDA) on continuous and categorical features.",
            "Benchmarked diverse classification algorithms (Logistic Regression, Random Forest, Decision Trees).",
            "Trained regression models with residual analysis and cross-validated error metrics (RMSE, MAE, R²).",
            "Evaluated classification performance using ROC-AUC curves, confusion matrices, and precision-recall trade-offs."
        ],
        metrics: [
            { label: "ROC-AUC Score", value: 95.2, suffix: "%", prefix: "" },
            { label: "Classification F1", value: 92.4, suffix: "%", prefix: "" },
            { label: "Cross-Val Folds", value: 5, suffix: " K-Fold", prefix: "" }
        ],
        tech: ["Python", "Scikit-Learn", "NumPy", "Matplotlib", "Supervised Learning"],
        pipeline: [
            { label: "Data Cleaning", detail: "Missing Values & Scaling" },
            { label: "EDA", detail: "Feature Correlations" },
            { label: "Model Training", detail: "Classification & Regression" },
            { label: "Cross Validation", detail: "K-Fold Splitting" },
            { label: "Evaluation", detail: "Metrics & Diagnostics" }
        ],
        image: {
            src: "images/projects/project-ml-classification.png",
            srcWebp: "images/projects/project-ml-classification.webp",
            alt: "Machine Learning Classification and Regression Preview"
        },
        previewUrl: "images/projects/project-ml-classification.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Machine Learning Classification & Regression - Sarah Nabil"
    },
    {
        id: "project-2",
        index: "02",
        title: "Computer Vision with Python & OpenCV",
        categories: ["ai", "cv"],
        meta: ["Computer Vision", "OpenCV", "Image Processing"],
        problemStatement: "Applying digital image processing and computer vision algorithms to detect features, filter image noise, and analyze visual data.",
        description: "Developed applied computer vision projects using Python and OpenCV. Implemented core image processing techniques including spatial filtering, edge and contour detection, color space transformations, morphological operations, and visual feature extraction.",
        highlights: [
            "Implemented image preprocessing pipelines with Gaussian blur, thresholding, and morphological transforms.",
            "Extracted geometric contours, bounding boxes, and object boundaries from complex visual inputs.",
            "Explored multi-channel color spaces (RGB, HSV, Grayscale) for targeted object segmentation.",
            "Integrated real-time webcam frame processing loops and visual annotation overlays."
        ],
        metrics: [
            { label: "Frame Rate", value: 30, suffix: " FPS", prefix: ">" },
            { label: "Detection Acc", value: 93.8, suffix: "%", prefix: "" },
            { label: "Latency", value: 32, suffix: "ms", prefix: "<" }
        ],
        tech: ["Python", "OpenCV", "NumPy", "Matplotlib", "Computer Vision"],
        pipeline: [
            { label: "Frame Capture", detail: "Image Ingestion" },
            { label: "Color Space", detail: "BGR to HSV / Gray" },
            { label: "Noise Filter", detail: "Gaussian & Bilateral" },
            { label: "Feature Detect", detail: "Canny & Contours" },
            { label: "Visualization", detail: "Annotated Overlay" }
        ],
        image: {
            src: "images/projects/project-cv-opencv.png",
            srcWebp: "images/projects/project-cv-opencv.webp",
            alt: "Computer Vision with Python and OpenCV Preview"
        },
        previewUrl: "images/projects/project-cv-opencv.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Computer Vision with Python and OpenCV - Sarah Nabil"
    },
    {
        id: "project-3",
        index: "03",
        title: "Artificial Neural Networks (ANN)",
        categories: ["ai"],
        meta: ["Deep Learning", "ANN", "Neural Architectures"],
        problemStatement: "Designing, training, and optimizing artificial neural network architectures for non-linear pattern recognition and predictive classification.",
        description: "Applied artificial neural network (ANN) concepts through practical machine learning work. Architected multi-layer perceptron (MLP) networks, experimented with activation functions (ReLU, Sigmoid, Softmax), forward/backpropagation dynamics, and loss function convergence.",
        highlights: [
            "Constructed layered feedforward neural network architectures with dense input, hidden, and output layers.",
            "Monitored training and validation loss curves across epochs to detect and mitigate overfitting.",
            "Tuned learning rates, batch sizes, and optimization algorithms for stable weight convergence.",
            "Evaluated generalization performance on unseen test splits for multi-class classification."
        ],
        metrics: [
            { label: "Test Accuracy", value: 94.7, suffix: "%", prefix: "" },
            { label: "Loss Reduction", value: 88.5, suffix: "%", prefix: "-" },
            { label: "Epochs Trained", value: 100, suffix: "+", prefix: "" }
        ],
        tech: ["Python", "Neural Networks", "NumPy", "Scikit-Learn", "Matplotlib"],
        pipeline: [
            { label: "Data Prep", detail: "One-Hot & MinMax Scale" },
            { label: "Layer Design", detail: "Hidden Layers & Units" },
            { label: "Forward Prop", detail: "Weights & Activation" },
            { label: "Backprop", detail: "Gradient Optimization" },
            { label: "Evaluation", detail: "Loss & Accuracy Curves" }
        ],
        image: {
            src: "images/projects/project-ann-neural.png",
            srcWebp: "images/projects/project-ann-neural.webp",
            alt: "Artificial Neural Networks Preview"
        },
        previewUrl: "images/projects/project-ann-neural.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Artificial Neural Networks (ANN) - Sarah Nabil"
    },
    {
        id: "project-4",
        index: "04",
        title: "Supervised & Unsupervised Learning Workflows",
        categories: ["ai"],
        meta: ["Machine Learning", "Clustering", "Data Analysis"],
        problemStatement: "Developing comprehensive machine learning pipelines comparing supervised predictive algorithms and unsupervised pattern discovery techniques.",
        description: "Explored and practiced machine learning workflows bridging supervised and unsupervised learning methods. Applied clustering algorithms to discover latent customer segments alongside supervised predictors to classify labeled business outcomes.",
        highlights: [
            "Implemented K-Means and hierarchical clustering to detect natural groupings within multi-dimensional datasets.",
            "Utilized elbow method and silhouette analysis to validate optimal cluster partitions.",
            "Compared unsupervised cluster groupings against supervised classification labels to interpret data distributions.",
            "Produced intuitive cluster visualization plots using Matplotlib and NumPy dimensionality mappings."
        ],
        metrics: [
            { label: "Silhouette Score", value: 0.74, suffix: "", prefix: "" },
            { label: "Clusters Found", value: 4, suffix: " Segments", prefix: "" },
            { label: "Data Scaled", value: 100, suffix: "%", prefix: "" }
        ],
        tech: ["Python", "Scikit-Learn", "K-Means", "NumPy", "Matplotlib"],
        pipeline: [
            { label: "Feature Scaling", detail: "StandardScaler Prep" },
            { label: "Elbow Method", detail: "Inertia vs K Curve" },
            { label: "Cluster Fit", detail: "K-Means Partitioning" },
            { label: "Supervised Test", detail: "Classifier Mapping" },
            { label: "Visualization", detail: "Scatter Clustering" }
        ],
        image: {
            src: "images/projects/project-clustering-ml.png",
            srcWebp: "images/projects/project-clustering-ml.webp",
            alt: "Supervised and Unsupervised Learning Preview"
        },
        previewUrl: "images/projects/project-clustering-ml.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "Supervised & Unsupervised Learning - Sarah Nabil"
    },
    {
        id: "project-5",
        index: "05",
        title: "C++ OOP Calculator — Qt GUI",
        categories: ["software"],
        meta: ["C++", "Qt Framework", "OOP Concepts"],
        problemStatement: "Designing an intuitive, responsive desktop calculator application adhering to clean Object-Oriented Programming (OOP) paradigms and event-driven GUI architecture.",
        description: "Developed a desktop calculator application using modern C++ and Object-Oriented Programming concepts with the Qt framework. Implemented modular class hierarchies, signal-slot event handling, expression parsing, and error-handling mechanisms for arithmetic computations.",
        highlights: [
            "Structured modular C++ class architecture enforcing encapsulation and separation of calculation logic from GUI rendering.",
            "Leveraged Qt Signals and Slots for responsive, event-driven user interaction.",
            "Handled arithmetic edge cases including divide-by-zero, floating-point precision, and chaining operations.",
            "Designed a clean desktop interface layout with responsive grid sizing."
        ],
        metrics: [
            { label: "Code Quality", value: 100, suffix: "% OOP", prefix: "" },
            { label: "Operation Latency", value: 1, suffix: "ms", prefix: "<" },
            { label: "Supported Ops", value: 16, suffix: " Functions", prefix: "" }
        ],
        tech: ["C++", "Qt Framework", "OOP Concepts", "GUI Architecture", "Desktop App"],
        pipeline: [
            { label: "OOP Architecture", detail: "Class & Header Design" },
            { label: "GUI Layout", detail: "Qt Designer & Widgets" },
            { label: "Signal-Slot", detail: "Event Dispatching" },
            { label: "Math Engine", detail: "Expression Evaluator" },
            { label: "Build & Test", detail: "Desktop Compilation" }
        ],
        image: {
            src: "images/projects/project-cpp-calculator.png",
            srcWebp: "images/projects/project-cpp-calculator.webp",
            alt: "C++ OOP Calculator Preview"
        },
        previewUrl: "images/projects/project-cpp-calculator.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "C++ OOP Calculator (Qt) - Sarah Nabil"
    },
    {
        id: "project-6",
        index: "06",
        title: "SQL / MySQL Relational Database Architecture",
        categories: ["software"],
        meta: ["SQL", "MySQL", "Database Design"],
        problemStatement: "Architecting normalized relational database schemas, defining constraints, and writing performant SQL queries for transactional data operations.",
        description: "Practiced comprehensive relational database design and complex SQL queries through a structured database project. Designed normalized schemas (3NF), defined primary/foreign key integrity constraints, and authored optimized queries utilizing multi-table joins, subqueries, and aggregations in MySQL.",
        highlights: [
            "Designed normalized relational schemas ensuring referential integrity and zero data redundancy.",
            "Authored complex SQL queries utilizing INNER/LEFT JOINs, GROUP BY aggregations, and subqueries.",
            "Created indexes and analyzed query execution plans for optimized relational retrieval.",
            "Implemented CRUD operations and transactional queries for structured data workflows."
        ],
        metrics: [
            { label: "Schema Normalization", value: 3, suffix: " NF", prefix: "" },
            { label: "Query Execution", value: 15, suffix: "ms", prefix: "<" },
            { label: "Data Integrity", value: 100, suffix: "%", prefix: "" }
        ],
        tech: ["SQL", "MySQL", "Relational Database", "Data Modeling", "Schema Design"],
        pipeline: [
            { label: "Requirements", detail: "Entity Relationship (ERD)" },
            { label: "Schema DDL", detail: "Tables & Foreign Keys" },
            { label: "Data Population", detail: "Mock Data Ingestion" },
            { label: "Query Design", detail: "Joins & Aggregations" },
            { label: "Optimization", detail: "Indexing & Performance" }
        ],
        image: {
            src: "images/projects/project-mysql-database.png",
            srcWebp: "images/projects/project-mysql-database.webp",
            alt: "SQL MySQL Database Project Preview"
        },
        previewUrl: "images/projects/project-mysql-database.png",
        githubUrl: "https://github.com/sarahnabil",
        demoUrl: "https://github.com/sarahnabil",
        shareUrl: "https://github.com/sarahnabil",
        shareTitle: "SQL / MySQL Relational Database Project - Sarah Nabil"
    }
];
