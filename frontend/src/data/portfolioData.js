export const portfolioData = {
  // 1. Hero Section & Personal Info
  personal: {
    fullName: "Kirtan Patel",
    professionalTitle: "Lead Full-Stack Developer & UI Architect",
    age: 26,
    dob: "April 15, 2000",
    gender: "Male",
    height: "5'10\"",
    weight: "72 kg",
    bloodGroup: "O+",
    maritalStatus: "Single",
    motherTongue: "Gujarati",
    religion: "Hindu",
    location: "Ahmedabad, Gujarat, India",
    statusBadge: "Available for Projects",
    avatarImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=350",
    resumeUrl: "/resume.pdf", // Matches public/resume.pdf
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com"
    }
  },

  // 2. About Me
  about: {
    biography: "Passionate Software Engineer specialized in creating high-performance web systems and immersive digital experiences. Believes in writing clean, self-documenting code and designing intuitive user interfaces. Currently leading development stacks on modern SaaS architectures.",
    careerGoals: [
      "Pioneer modular layout patterns for next-generation micro-frontends.",
      "Contribute to open-source UI libraries and state-management utilities.",
      "Architect cloud-native infrastructures with minimal latency footprints."
    ]
  },

  // 3. Education Timeline
  education: [
    {
      school: "Gujarat Technological University",
      degree: "Bachelor of Engineering (B.E.) in Computer Engineering",
      duration: "2018 - 2022",
      percentageOrCgpa: "9.1 CGPA",
      achievements: "First Class with Distinction, Winner of Inter-College Hackathon, Lead organizer of Tech Fest."
    },
    {
      school: "St. Xavier's High School",
      degree: "Higher Secondary Certificate (HSC) - Science Stream",
      duration: "2016 - 2018",
      percentageOrCgpa: "92.4%",
      achievements: "Top 1% in Mathematics in District Board Examinations."
    }
  ],

  // 4. Experience Timeline (Internships, Freelance, Training)
  experience: [
    {
      role: "Freelance Technical Consultant",
      company: "Independent Contract",
      duration: "Jan 2023 - Present",
      type: "Freelance",
      description: "Designed customizable business dashboards, configured serverless database syncing scripts, and customized Bootstrap UI sheets for global startups."
    },
    {
      role: "Software Developer Intern",
      company: "Helix Software Solutions",
      duration: "Jan 2022 - Jun 2022",
      type: "Internship",
      description: "Collaborated on React and Node.js enterprise portals, optimized MySQL database queries, and implemented automated API test suites."
    },
    {
      role: "Cloud Engineering Training Participant",
      company: "Tech Academy",
      duration: "Jul 2021 - Sep 2021",
      type: "Training Program",
      description: "Participated in an intensive training program covering containerization, AWS hosting, continuous deployment pipelines, and security modules."
    }
  ],

  // 5. Skills (Frontend, Backend, Cloud, Soft Skills)
  skills: {
    frontend: [
      { name: "React.js & Next.js", levelPercent: 95 },
      { name: "JavaScript / TypeScript", levelPercent: 90 },
      { name: "Bootstrap 5 & TailwindCSS", levelPercent: 95 },
      { name: "HTML5 & CSS3 Stylesheets", levelPercent: 92 }
    ],
    backend: [
      { name: "Node.js & Express.js", levelPercent: 88 },
      { name: "REST APIs & WebSockets", levelPercent: 90 },
      { name: "MongoDB & MySQL Databases", levelPercent: 85 }
    ],
    cloud: [
      { name: "AWS (S3, EC2, Lambda)", levelPercent: 80 },
      { name: "Docker Containerization", levelPercent: 75 },
      { name: "GitHub Actions CI/CD", levelPercent: 82 }
    ],
    soft: [
      { name: "Problem Solving", levelPercent: 95 },
      { name: "Team Leadership", levelPercent: 88 },
      { name: "Agile Coordination", levelPercent: 85 }
    ]
  },

  // 6. Projects Section
  projects: [
    {
      title: "Zenith Crypto Asset Manager",
      description: "A premium dashboard representing digital asset charts, wallet balances, and simulated transaction models.",
      tags: ["React.js", "Chart.js", "Bootstrap 5", "CSS Glassmorphism"],
      githubLink: "https://github.com",
      demoLink: "https://example.com",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Aetheria SaaS Project Planner",
      description: "A team planner system featuring drag-and-drop task boards, workspace divisions, and activity timelines.",
      tags: ["React Router", "CSS Modules", "Context API"],
      githubLink: "https://github.com",
      demoLink: "https://example.com",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Helios Audio wave Hub",
      description: "A mobile-first responsive audio streaming library with native audio wave rendering and custom playlists.",
      tags: ["React.js", "Web Audio API", "Bootstrap 5"],
      githubLink: "https://github.com",
      demoLink: "https://example.com",
      image: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&q=80&w=400"
    }
  ],

  // 7. Certifications
  certifications: [
    {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services (AWS)",
      date: "Feb 2024",
      link: "https://aws.amazon.com",
      credentialId: "AWS-ASA-99432"
    },
    {
      title: "Advanced React State Management",
      issuer: "Frontend Masters",
      date: "Nov 2023",
      link: "https://frontendmasters.com",
      credentialId: "FM-ARM-8812"
    }
  ],

  // 8. Family Information
  family: {
    familyType: "Nuclear",
    backgroundText: "Residing in Ahmedabad. We value academic excellence, modern industrial growth, and cultural heritage.",
    fatherDetails: {
      name: "Shri Ramesh Patel",
      occupation: "Business Executive in Engineering Exports",
      contact: "+91 98765 00101"
    },
    motherDetails: {
      name: "Smt. Gitaben Patel",
      occupation: "Primary School Administrator",
      contact: "+91 98765 00102"
    },
    siblings: [
      {
        name: "Pooja Patel",
        role: "Elder Sister",
        occupation: "Data Analyst at Infosys",
        maritalStatus: "Married"
      }
    ]
  },

  // 9. Hobbies & Interests
  lifestyle: {
    languages: ["English (Fluent)", "Gujarati (Native)", "Hindi (Conversational)"],
    hobbies: [
      { name: "Gym & Fitness", description: "Bodyweight training, calisthenics, and active functional fitness." },
      { name: "Technology & Gadgets", description: "Experimenting with microcontrollers, self-hosting servers, and automation." },
      { name: "Travel & Hiking", description: "Exploring mountainous paths, national parks, and scenic viewpoints." },
      { name: "Street Photography", description: "Capturing expressions, cityscape lighting, and structural geometries." }
    ]
  },

  // 10. Gallery Grid
  gallery: [
    {
      title: "Ahmedabad Workspace Setup",
      category: "Workspace",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Organizing Tech Summit",
      category: "Milestones",
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Hiking in Western Ghats",
      category: "Travel",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Digital Portrait Photography",
      category: "Photography",
      url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=500"
    }
  ],

  // 11. Contact Info
  contact: {
    email: "kirtan.patel@example.com",
    phone: "+91 98765 43210",
    address: "Satellite Road, Bodakdev, Ahmedabad, Gujarat, 380054",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.697926227926!2d72.51173937580649!3d23.034813753763784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84df83272d17%3A0xe542617651a44e59!2sSatellite%20Rd%20Ahmedabad!5e0!3m2!1sen!2sin!4v1717900000000!5m2!1sen!2sin"
  }
};
