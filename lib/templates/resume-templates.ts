import { DocumentSchema } from "@/lib/types/schema"

export const RESUME_TEMPLATES: DocumentSchema[] = [
    {
        id: "resume-minimal",
        type: "resume",
        theme: "minimal",
        title: "Minimal Resume",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: "header",
                type: "resume-header",
                name: "Alex Morgan",
                title: "Software Engineer",
                email: "alex@example.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA",
                website: "alexmorgan.dev",
                linkedin: "linkedin.com/in/alexmorgan",
                github: "github.com/alexmorgan",
            },
            {
                id: "summary",
                type: "summary",
                content:
                    "Passionate software engineer with 5+ years of experience in building scalable web applications. Expert in React, TypeScript, and Node.js. Committed to writing clean, maintainable code and solving complex problems.",
            },
            {
                id: "experience",
                type: "experience",
                title: "Work Experience",
                items: [
                    {
                        id: "exp-1",
                        role: "Senior Frontend Developer",
                        company: "Tech Corp",
                        duration: "2021 - Present",
                        location: "San Francisco, CA",
                        description:
                            "Led the frontend team in rebuilding the core product using Next.js and Tailwind CSS. Improved performance by 40% and reduced build times by 50%. Mentored junior developers and established code quality standards.",
                    },
                    {
                        id: "exp-2",
                        role: "Software Engineer",
                        company: "StartUp Inc",
                        duration: "2018 - 2021",
                        location: "New York, NY",
                        description:
                            "Developed and maintained multiple client-facing applications using React and Redux. Collaborated with designers and product managers to deliver high-quality features on time.",
                    },
                ],
            },
            {
                id: "education",
                type: "education",
                title: "Education",
                items: [
                    {
                        id: "edu-1",
                        degree: "Bachelor of Science in Computer Science",
                        school: "University of Technology",
                        duration: "2014 - 2018",
                        location: "Boston, MA",
                    },
                ],
            },
            {
                id: "skills",
                type: "skills",
                title: "Skills",
                items: [
                    { id: "skill-1", name: "JavaScript / TypeScript", level: "Expert" },
                    { id: "skill-2", name: "React / Next.js", level: "Expert" },
                    { id: "skill-3", name: "Node.js", level: "Advanced" },
                    { id: "skill-4", name: "Tailwind CSS", level: "Advanced" },
                    { id: "skill-5", name: "PostgreSQL", level: "Intermediate" },
                    { id: "skill-6", name: "Docker", level: "Intermediate" },
                ],
            },
        ],
    },
    {
        id: "resume-professional",
        type: "resume",
        theme: "professional",
        title: "Professional Resume",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: "header",
                type: "resume-header",
                name: "Sarah Jenkins",
                title: "Project Manager",
                email: "sarah.j@example.com",
                phone: "+1 (555) 987-6543",
                location: "London, UK",
                linkedin: "linkedin.com/in/sarahjenkins",
            },
            {
                id: "summary",
                type: "summary",
                content:
                    "Certified Project Manager (PMP) with extensive experience in leading cross-functional teams to deliver complex software projects. Skilled in Agile methodologies, risk management, and stakeholder communication.",
            },
            {
                id: "experience",
                type: "experience",
                title: "Professional Experience",
                items: [
                    {
                        id: "exp-1",
                        role: "Senior Project Manager",
                        company: "Global Solutions Ltd",
                        duration: "2020 - Present",
                        location: "London, UK",
                        description:
                            "Overseeing a portfolio of enterprise projects valued at over $2M. implemented Agile transformation reducing time-to-market by 30%.",
                    },
                    {
                        id: "exp-2",
                        role: "Project Coordinator",
                        company: "Creative Agency",
                        duration: "2017 - 2020",
                        location: "Manchester, UK",
                        description:
                            "Coordinated resources and timelines for digital marketing campaigns. Managed client expectations and ensured deliverables met quality standards.",
                    },
                ],
            },
            {
                id: "education",
                type: "education",
                title: "Education",
                items: [
                    {
                        id: "edu-1",
                        degree: "MBA in Management",
                        school: "London Business School",
                        duration: "2016 - 2017",
                    },
                    {
                        id: "edu-2",
                        degree: "Bachelor of Arts in Business",
                        school: "University of Manchester",
                        duration: "2012 - 2015",
                    },
                ],
            },
            {
                id: "certifications",
                type: "certifications",
                title: "Certifications",
                items: [
                    { id: "cert-1", name: "Project Management Professional (PMP)", issuer: "PMI", date: "2019" },
                    { id: "cert-2", name: "Certified Scrum Master (CSM)", issuer: "Scrum Alliance", date: "2018" },
                ],
            },
        ],
    },
    {
        id: "resume-executive",
        type: "resume",
        theme: "professional",
        title: "Executive Resume",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: crypto.randomUUID(),
                type: "resume-header",
                name: "Elizabeth Thorne",
                title: "Chief Operating Officer",
                email: "e.thorne@executive.com",
                phone: "+1 (555) 777-8888",
                location: "New York, NY",
                linkedin: "linkedin.com/in/ethorne-coo",
            },
            {
                id: crypto.randomUUID(),
                type: "summary",
                content:
                    "Visionary C-Suite Executive with 20+ years of experience in driving operational excellence and strategic growth for Fortune 500 companies. Proven track record in scaling global operations, optimizing supply chains, and delivering double-digit revenue growth. Expert in transformational leadership and stakeholder management.",
            },
            {
                id: crypto.randomUUID(),
                type: "experience",
                title: "Professional Experience",
                items: [
                    {
                        id: crypto.randomUUID(),
                        role: "Chief Operating Officer",
                        company: "Global Logistics Corp",
                        duration: "2018 - Present",
                        location: "New York, NY",
                        description:
                            "Lead a global workforce of 5,000+ employees across 20 countries. spearheading a digital transformation initiative that increased operational efficiency by 25%. Managed an annual budget of $150M and exceeded EBITDA targets for 5 consecutive years.",
                    },
                    {
                        id: crypto.randomUUID(),
                        role: "VP of Operations",
                        company: "Nexus Industries",
                        duration: "2012 - 2018",
                        location: "Chicago, IL",
                        description:
                            "Directed regional operations and supply chain management. Reduced overhead costs by 15% through strategic vendor renegotiations and process automation. Played a key role in the company's successful IPO in 2015.",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "education",
                title: "Education",
                items: [
                    {
                        id: crypto.randomUUID(),
                        degree: "MBA, Global Management",
                        school: "Wharton School of Business",
                        duration: "2002",
                    },
                    {
                        id: crypto.randomUUID(),
                        degree: "BS, Engineering",
                        school: "MIT",
                        duration: "2000",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "skills",
                title: "Expertise",
                items: [
                    { id: crypto.randomUUID(), name: "Strategic Planning", level: "Expert" },
                    { id: crypto.randomUUID(), name: "Global Operations", level: "Expert" },
                    { id: crypto.randomUUID(), name: "C-Level Leadership", level: "Expert" },
                    { id: crypto.randomUUID(), name: "Digital Transformation", level: "Expert" },
                    { id: crypto.randomUUID(), name: "M&A Integration", level: "Advanced" },
                ],
            },
        ],
    },
    {
        id: "resume-creative",
        type: "resume",
        theme: "modern",
        title: "Creative Resume",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: crypto.randomUUID(),
                type: "resume-header",
                name: "Liam Rivera",
                title: "Lead Creative Designer",
                email: "liam@riveradesign.studio",
                phone: "+1 (555) 234-5678",
                location: "Los Angeles, CA",
                website: "riveradesign.studio",
                github: "behance.net/liamrivera",
            },
            {
                id: crypto.randomUUID(),
                type: "summary",
                content:
                    "Award-winning designer with a passion for creating immersive digital experiences. 8+ years of experience in UI/UX design, brand identity, and motion graphics. Expert in turning complex ideas into intuitive, beautiful interfaces that drive engagement and tell compelling stories.",
            },
            {
                id: crypto.randomUUID(),
                type: "experience",
                title: "Journey",
                items: [
                    {
                        id: crypto.randomUUID(),
                        role: "Lead UI/UX Designer",
                        company: "Visionary Media",
                        duration: "2020 - Present",
                        location: "Los Angeles, CA",
                        description:
                            "Redesigned the flagship mobile app, resulting in a 50% increase in daily active users. Lead a team of 4 designers and 2 researchers. Established the company's first unified design system, adopted across 3 product lines.",
                    },
                    {
                        id: crypto.randomUUID(),
                        role: "Brand Architect",
                        company: "Studio 55",
                        duration: "2016 - 2020",
                        location: "Austin, TX",
                        description:
                            "Crafted unique brand identities for 20+ startups, ranging from fintech to healthcare. Won the Platinum A' Design Award for the 'EcoMove' rebranding project. Managed end-to-end creative processes from concept to launch.",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "projects",
                title: "Selected Works",
                items: [
                    {
                        id: crypto.randomUUID(),
                        name: "Lumina App",
                        description: "A meditation and wellness app with a focus on generative soundscapes and minimalist UI.",
                        link: "https://lumina-app.design",
                    },
                    {
                        id: crypto.randomUUID(),
                        name: "Solaris Rebrand",
                        description: "Comprehensive rebranding for a renewable energy giant, including logo, typography, and site.",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "skills",
                title: "Toolkit",
                items: [
                    { id: crypto.randomUUID(), name: "Figma / Adobe XD", level: "Expert" },
                    { id: crypto.randomUUID(), name: "UI/UX / Interaction Design", level: "Expert" },
                    { id: crypto.randomUUID(), name: "Brand Identity", level: "Expert" },
                    { id: crypto.randomUUID(), name: "Motion Graphics / After Effects", level: "Expert" },
                    { id: crypto.randomUUID(), name: "WebGL / Three.js", level: "Intermediate" },
                ],
            },
        ],
    },
    {
        id: "resume-academic",
        type: "resume",
        theme: "professional",
        title: "Academic Resume",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: crypto.randomUUID(),
                type: "resume-header",
                name: "Dr. Emily Watson",
                title: "Associate Professor of AI",
                email: "e.watson@university.edu",
                phone: "+1 (555) 444-5555",
                location: "Cambridge, MA",
                website: "emilywatson.ai",
                linkedin: "linkedin.com/in/emilywatson-ai",
            },
            {
                id: crypto.randomUUID(),
                type: "summary",
                content:
                    "Dedicated researcher and educator with 12+ years of experience in Artificial Intelligence and Machine Learning. Published over 20 peer-reviewed papers in top-tier journals. Specialized in Computer Vision and Neural Networks.",
            },
            {
                id: crypto.randomUUID(),
                type: "experience",
                title: "Academics & Research",
                items: [
                    {
                        id: crypto.randomUUID(),
                        role: "Associate Professor",
                        company: "University of Technology",
                        duration: "2018 - Present",
                        location: "Cambridge, MA",
                        description:
                            "Teaching advanced ML courses and supervising PhD candidates. Lead researcher in the Lab for Autonomous Intelligence.",
                    },
                    {
                        id: crypto.randomUUID(),
                        role: "Postdoctoral Researcher",
                        company: "Standard Tech",
                        duration: "2015 - 2018",
                        location: "Palo Alto, CA",
                        description:
                            "Conducted research on deep learning optimization techniques. Published in NeurIPS and ICML.",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "education",
                title: "Academic Background",
                items: [
                    {
                        id: crypto.randomUUID(),
                        degree: "Ph.D. in Computer Science",
                        school: "Stanford University",
                        duration: "2010 - 2015",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "publications",
                title: "Key Publications",
                items: [
                    {
                        id: crypto.randomUUID(),
                        name: "Advancements in Neural Networks",
                        description: "Journal of AI Research, 2023. A comprehensive study on transformer architectures.",
                    },
                ],
            },
        ],
    },
    {
        id: "resume-tech-modern",
        type: "resume",
        theme: "modern",
        title: "Modern Tech Resume",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: crypto.randomUUID(),
                type: "resume-header",
                name: "James Carter",
                title: "Full Stack Developer",
                email: "james.carter@tech.dev",
                phone: "+1 (555) 000-1111",
                location: "Seattle, WA",
                github: "github.com/jcarter-dev",
                website: "jcarter.dev",
            },
            {
                id: crypto.randomUUID(),
                type: "summary",
                content:
                    "Modern full-stack engineer focused on building performant, user-centric applications. Expert in React, Node.js, and Cloud Infrastructure. Passionate about Open Source and cutting-edge web technologies.",
            },
            {
                id: crypto.randomUUID(),
                type: "skills",
                title: "Tech Stack",
                items: [
                    { id: crypto.randomUUID(), name: "TypeScript / Go / Rust", level: "Expert" },
                    { id: crypto.randomUUID(), name: "React / Next.js / Tailwind", level: "Expert" },
                    { id: crypto.randomUUID(), name: "AWS / Kubernetes / Docker", level: "Advanced" },
                    { id: crypto.randomUUID(), name: "GraphQL / Redis / PostgreSQL", level: "Expert" },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "experience",
                title: "Engineering Roles",
                items: [
                    {
                        id: crypto.randomUUID(),
                        role: "Tech Lead",
                        company: "CloudNative SaaS",
                        duration: "2021 - Present",
                        location: "Remote",
                        description:
                            "Architecting microservices architecture and leading a team of 10 developers. Reduced infra costs by 35%.",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "projects",
                title: "Open Source & Side Projects",
                items: [
                    {
                        id: crypto.randomUUID(),
                        name: "FastAPI-Rust",
                        description: "A high-performance backend framework connector.",
                        link: "github.com/jcarter-dev/fastapi-rust",
                    },
                ],
            },
        ],
    },
    {
        id: "resume-designer",
        type: "resume",
        theme: "developer",
        title: "Designer Professional",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        components: [
            {
                id: crypto.randomUUID(),
                type: "resume-header",
                name: "Sophia Chen",
                title: "Senior Product Designer",
                email: "sophia.design@portfolio.com",
                phone: "+1 (555) 333-2222",
                location: "New York, NY",
                website: "sophiachen.design",
                linkedin: "linkedin.com/in/sophiachen-design",
            },
            {
                id: crypto.randomUUID(),
                type: "summary",
                content:
                    "Human-centered product designer with a focus on creating elegant solutions for complex problems. 6+ years of experience in mobile and web design. Expertise in Figma, design systems, and user research.",
            },
            {
                id: crypto.randomUUID(),
                type: "experience",
                title: "Design Experience",
                items: [
                    {
                        id: crypto.randomUUID(),
                        role: "Senior Product Designer",
                        company: "FinTech Innovations",
                        duration: "2021 - Present",
                        location: "New York, NY",
                        description:
                            "Led the redesign of the main investment portal, increasing conversion by 25%. Built a multi-platform design system from scratch.",
                    },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "skills",
                title: "Design Toolkit",
                items: [
                    { id: crypto.randomUUID(), name: "Product Design / UI / UX", level: "Expert" },
                    { id: crypto.randomUUID(), name: "Figma / ProtoPie / Framer", level: "Expert" },
                    { id: crypto.randomUUID(), name: "Design Systems", level: "Expert" },
                    { id: crypto.randomUUID(), name: "HTML / CSS / React", level: "Intermediate" },
                ],
            },
            {
                id: crypto.randomUUID(),
                type: "projects",
                title: "Recent Projects",
                items: [
                    {
                        id: crypto.randomUUID(),
                        name: "CryptoWallet Redesign",
                        description: "A complete overhaul of the mobile wallet app focus on accessibility and ease of use.",
                        link: "behance.net/sophiachen/cryptowallet",
                    },
                ],
            },
        ],
    },
]
