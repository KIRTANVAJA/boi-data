import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Family from '../models/Family.js';
import EducationCareer from '../models/EducationCareer.js';
import Lifestyle from '../models/Lifestyle.js';
import Settings from '../models/Settings.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Gallery from '../models/Gallery.js';

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect DB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/biodata_cms');
    console.log('Database connected for seeding...');

    // 2. Clear current collections
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Family.deleteMany({});
    await EducationCareer.deleteMany({});
    await Lifestyle.deleteMany({});
    await Settings.deleteMany({});
    await Project.deleteMany({});
    await Achievement.deleteMany({});
    await Gallery.deleteMany({});
    console.log('Existing data cleared.');

    // 3. Create Admin User
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword123', // Will be hashed automatically by userSchema pre-save hook
    });
    console.log('Admin user seeded: admin / adminpassword123');

    // 4. Create Profile
    const profile = await Profile.create({
      fullName: 'Aravind Sharma',
      nickname: 'Aru',
      professionalTitle: 'Lead Full-Stack Architect & UI Designer',
      shortIntro: 'Crafting premium digital experiences at the intersection of aesthetic design and performant software architectures. Passionate about glassmorphism and modern web technologies.',
      statusBadge: 'Available for Consulting',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      age: 28,
      dob: new Date('1998-04-15'),
      gender: 'Male',
      height: "5'10\"",
      weight: '72 kg',
      bloodGroup: 'O+',
      maritalStatus: 'Single',
      motherTongue: 'Hindi',
      religion: 'Hindu',
      location: 'Mumbai, Maharashtra, India',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        facebook: '',
        youtube: '',
      },
      contactInfo: {
        email: 'aravind.sharma@example.com',
        phone: '+91 98765 43210',
        whatsapp: '+91 98765 43210',
        address: 'Suite 404, Sea Green Towers, Worli, Mumbai, 400018',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.803734689626!2d72.81223937580649!3d19.006313753763784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ceeb83272d17%3A0xe542617651a44e59!2sWorli%20Sea%20Face%2C%20Worli%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1717900000000!5m2!1sen!2sin',
      },
    });
    console.log('Profile details seeded.');

    // 5. Create Family
    await Family.create({
      fatherDetails: {
        name: 'Dr. Devendra Sharma',
        occupation: 'Senior Consultant Cardiologist',
        contact: '+91 98765 00001',
      },
      motherDetails: {
        name: 'Smt. Rajeshwari Sharma',
        occupation: 'Associate Professor of Sanskrit Literature',
        contact: '+91 98765 00002',
      },
      brothers: [
        {
          name: 'Nikhil Sharma',
          occupation: 'Investment Analyst at Goldman Sachs',
          maritalStatus: 'Married',
        },
      ],
      sisters: [
        {
          name: 'Anjali Sharma',
          occupation: 'UX Researcher at Google',
          maritalStatus: 'Single',
        },
      ],
      familyType: 'Nuclear',
      familyBackground: 'Educated, highly professional family residing in Mumbai. Value cultural heritage, modern scientific outlook, and academic pursuits.',
    });
    console.log('Family details seeded.');

    // 6. Create Education & Career
    await EducationCareer.create({
      education: [
        {
          school: 'Indian Institute of Technology (IIT), Bombay',
          degree: 'B.Tech in Computer Science and Engineering',
          stream: 'Computer Science',
          startYear: '2016',
          endYear: '2020',
          percentageOrCgpa: '9.2 CGPA',
          achievements: 'Dean\'s Honor List, 1st Place in Inter-IIT Hackathon',
        },
        {
          school: 'St. Xavier\'s College, Mumbai',
          degree: 'Higher Secondary Certificate (HSC)',
          stream: 'Science & Mathematics',
          startYear: '2014',
          endYear: '2016',
          percentageOrCgpa: '94.6%',
          achievements: 'State Merit List Holder',
        },
      ],
      experience: [
        {
          company: 'Aesthetic Labs',
          role: 'Lead Architect & Tech Lead',
          type: 'Full-Time',
          duration: 'Jan 2023 - Present',
          description: 'Architecting high-fidelity customer dashboards, building premium WebGL components, and mentoring a team of 8 frontend developers.',
        },
        {
          company: 'Hyperlink Solutions',
          role: 'Full-Stack Developer',
          type: 'Full-Time',
          duration: 'Jul 2020 - Dec 2022',
          description: 'Designed scalable Node.js microservices, optimized MongoDB queries reducing latency by 35%, and coded state-of-the-art React applications.',
        },
      ],
      skills: [
        { name: 'React.js & Next.js', level: 'Expert', category: 'Frontend' },
        { name: 'JavaScript (ES6+) / TypeScript', level: 'Expert', category: 'Frontend' },
        { name: 'Node.js & Express.js', level: 'Expert', category: 'Backend' },
        { name: 'MongoDB & Mongoose', level: 'Expert', category: 'Backend' },
        { name: 'Bootstrap 5 & TailwindCSS', level: 'Expert', category: 'Frontend' },
        { name: 'System Design & REST APIs', level: 'Intermediate', category: 'Backend' },
        { name: 'UI/UX & Glassmorphism Design', level: 'Expert', category: 'Frontend' },
      ],
      certifications: [
        {
          title: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          date: new Date('2024-02-15'),
          link: 'https://aws.amazon.com',
          credentialId: 'AWS-ASA-99432',
        },
        {
          title: 'Advanced React Patterns',
          issuer: 'Frontend Masters',
          date: new Date('2022-11-20'),
          link: 'https://frontendmasters.com',
          credentialId: 'FM-ARP-8812',
        },
      ],
      futureGoals: [
        'Build a multi-tenant SaaS portfolio builder platform for worldwide creatives.',
        'Expand expertise into Web3, WebGL, and generative AI interfaces.',
        'Contribute heavily to open-source UI libraries and tools.',
      ],
    });
    console.log('Education & Career seeded.');

    // 7. Create Projects
    await Project.create([
      {
        title: 'Zenith Cryptographic Exchange Dashboard',
        description: 'A dark premium cryptocurrency tracking interface featuring glassmorphic charts, transaction simulation, and real-time WebSocket integrations.',
        tags: ['React.js', 'Chart.js', 'CSS Glassmorphism', 'WebSockets'],
        githubLink: 'https://github.com',
        demoLink: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=400',
        order: 0,
      },
      {
        title: 'Helios SaaS Billing Infrastructure',
        description: 'An enterprise billing and subscription manager built for developers, enabling drag-and-drop workflow builders and robust webhook logs.',
        tags: ['Node.js', 'Express', 'MongoDB', 'React Router'],
        githubLink: 'https://github.com',
        demoLink: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400',
        order: 1,
      },
      {
        title: 'Vespera Audio Streaming Platform',
        description: 'A mobile-first responsive audio streaming library with native audio wave rendering, playlist organization, and custom audio filters.',
        tags: ['React', 'Web Audio API', 'Bootstrap 5', 'Express'],
        githubLink: 'https://github.com',
        demoLink: 'https://example.com',
        image: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?auto=format&fit=crop&q=80&w=400',
        order: 2,
      },
    ]);
    console.log('Projects seeded.');

    // 8. Create Achievements
    await Achievement.create([
      {
        title: 'Smart India Hackathon National Winner',
        description: 'Secured First Place under the Ministry of Electronics & IT for designing an offline village education platform.',
        category: 'Competition',
        date: new Date('2019-08-10'),
        documentUrl: '',
      },
      {
        title: 'Outstanding Engineer of the Year Award',
        description: 'Awarded by Aesthetic Labs for exceptional system design and driving UI architecture improvements across 3 major products.',
        category: 'Award',
        date: new Date('2024-12-15'),
        documentUrl: '',
      },
      {
        title: 'Full Stack Web Developer Nanodegree Certified',
        description: 'Successfully graduated from the Udacity Nanodegree covering advanced database migrations, OAuth systems, and server configurations.',
        category: 'Certificate',
        date: new Date('2021-03-05'),
        documentUrl: '',
      },
    ]);
    console.log('Achievements seeded.');

    // 9. Create Gallery
    await Gallery.create([
      {
        title: 'Worli Workspace Office Design',
        mediaUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
        mediaType: 'image',
        albumName: 'Professional Workspace',
      },
      {
        title: 'Smart India Hackathon Group Photo',
        mediaUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
        mediaType: 'image',
        albumName: 'Milestones',
      },
      {
        title: 'Tech Speaker Session at IIT Bombay',
        mediaUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
        mediaType: 'image',
        albumName: 'Speaking Engagements',
      },
    ]);
    console.log('Gallery media seeded.');

    // 10. Create Lifestyle
    await Lifestyle.create({
      hobbies: ['Digital Illustration', 'Astrophotography', 'Playing Classical Sitar'],
      interests: ['Quantum Computing', 'High-Altitude Trekking', 'Sustainable Architecture'],
      fitness: 'Yoga, Calisthenics 4 days a week, Marathon runner',
      travel: ['Ladakh, India', 'Kyoto, Japan', 'Swiss Alps'],
      languages: ['English (Fluent)', 'Hindi (Native)', 'Marathi (Conversational)', 'German (Basic)'],
    });
    console.log('Lifestyle details seeded.');

    // 11. Create Settings
    await Settings.create({
      theme: {
        primaryColor: '#000000',
        accentColor: '#D4AF37',
        isDarkMode: true,
        fontFamily: 'Outfit',
      },
      seo: {
        metaTitle: 'Aravind Sharma | Lead Full-Stack Architect Portfolio & Digital Resume',
        metaDescription: 'Explore the digital resume, professional milestones, family details, and premium portfolio of Aravind Sharma, Full-Stack Architect.',
        keywords: 'Aravind Sharma, Digital Biodata, Personal Resume, Full-Stack Architect, Portfolio CMS, Worli, IIT Bombay',
        ogImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      },
      sectionOrder: [
        'hero',
        'personal',
        'family',
        'education',
        'career',
        'projects',
        'achievements',
        'gallery',
        'lifestyle',
        'contact',
      ],
    });
    console.log('Settings seeded.');

    console.log('All seeding tasks completed successfully! Ready for launch.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
