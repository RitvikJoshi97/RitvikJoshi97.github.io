"use client"

import { FaPhone, FaEnvelope, FaLinkedin, FaGlobe, FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import { useEffect, useState } from 'react';


// Define the experience type with skills
type Experience = {
  company: string;
  companyLogo: string;
  linkedIn?: string; // Optional LinkedIn URL
  location: string;
  roles: Array<{
    title: string;
    period: string;
    responsibilities: string[];
    skills: string[];  // Add skills to each role
  }>;
};

const experiences: Experience[] = [
    {
      company: "SITA Aero",
      companyLogo: "https://media.licdn.com/dms/image/v2/D4E0BAQEct2bplOS3Uw/company-logo_100_100/company-logo_100_100/0/1713242143215/sita_logo?e=1741219200&v=beta&t=lb2SDhG6GGfMoBw2d6JFtLyUpSLQG8shUGq1iw6alpE",
      linkedIn: "https://www.linkedin.com/company/sita/posts/?feedView=all",
      location: "Aldershot, United Kingdom",
      roles: [
        {
          title: "Associate Software Engineer, Customer Success",
          period: "Aug '23 — Present",
          responsibilities: [
            "Provided support for mid-high severity production issues for SmartPath & BagDrop products requiring development and patching for hardware drivers, core APIs and custom system profiles in C, JS and Java.",
            "Created a VSCode extension that automates error analysis by processing log files and code repositories, securely connected to Azure identities and an API."
          ],
          skills: ["JavaScript", "Java", "C#", "Azure", "VSCode Extension Development"]
        },
        {
          title: "Graduate Software Engineer",
          period: "Sept '22 — Aug '23",
          responsibilities: [
            "Architectured and Developed a full-stack application for product-component repository for post-deployment risk minimisation for every SITA product.",
            "Framed guidelines for generative AI for the Technology team across the globe."
          ],
          skills: ["C#", "React", "SQL", "Azure AD", "REST APIs"]
        }
      ]
    },
    {
      company: "Blueskeye AI",
      companyLogo: "https://media.licdn.com/dms/image/v2/C4D0BAQFNirUlHL4lTg/company-logo_100_100/company-logo_100_100/0/1630543655245/blueskeye_ai_logo?e=1741219200&v=beta&t=oPrI7LVe1qPg84wwrBIw3PyXhjT-Z2WbUdurxd5P_wI",
      linkedIn: "https://www.linkedin.com/company/blueskeye-ai/posts/?feedView=all",
      location: "Nottingham, United Kingdom",
      roles: [
        {
          title: "Machine Learning Engineering Intern",
          period: "May '22 — Aug '22",
          responsibilities: [
            "Developed a Deep Learning model to predict eye gaze utilising Infrared cameras for automotive safety",
            "Set up a visual data collection and storage pipeline with Python",
            "Carried out development in Tensorflow and OpenCV using WandB visualisation tools"
          ],
          skills: ["Python", "Tensorflow", "OpenCV", "Deep Learning", "Computer Vision", "WandB"]
        }
      ]
    },
    {
      company: "Wipro Limited (R&D)",
      companyLogo: "https://media.licdn.com/dms/image/v2/D4E0BAQEINH3Vf1swig/company-logo_200_200/company-logo_200_200/0/1730379480485/wipro_logo?e=1741219200&v=beta&t=0AvquN8D-4LoocNI8Tx0FFQBVDPtBRu0btereRPSFQQ",
      linkedIn: "https://www.linkedin.com/company/wipro/posts/?feedView=all",
      location: "Bangalore, India",
      roles: [
        {
          title: "Project Engineer, Chief Technology Office",
          period: "Sept '20 — Aug '21",
          responsibilities: [
            "Developed a Node application to acquire and setup AWS systems reducing time required",
            "Worked with AWS APIs(Boto), UNIX automations(Ansible), NoSQL databases(Mongo)",
            "Built a full-stack blockchain banking application using Angular, Node and Hyperledger Fabric"
          ],
          skills: ["Node.js", "AWS", "Ansible", "MongoDB", "Angular", "Hyperledger"]
        }
      ]
    },
    {
      company: "Fracktal Works",
      companyLogo: "https://media.licdn.com/dms/image/v2/C560BAQExfAjvXCekyw/company-logo_200_200/company-logo_200_200/0/1630649233643/fracktal_works_logo?e=1741219200&v=beta&t=Cn2-k8XwLrekE9kq3-cctITRrcSvdjBu-6-GkXu4lVs",
      linkedIn: "https://www.linkedin.com/company/fracktal/posts/?feedView=all",
      location: "Bangalore, India",
      roles: [
        {
          title: "Summer Intern, R&D",
          period: "May '19 — July '19",
          responsibilities: [
            "Developed a Flutter based iOS and Android mobile app to connect to 3D printers",
            "Worked with Python and FreeCAD to cut 3D models to printable sizes"
          ],
          skills: ["Flutter", "Dart", "Python", "FreeCAD"]
        }
      ]
    }
];

// Function to extract unique skills and their experiences
const getSkillDetails = () => {
  const skillMap = new Map<string, Array<{
    company: string;
    role: string;
    details: string;
  }>>();

  experiences.forEach(exp => {
    exp.roles.forEach(role => {
      role.skills.forEach(skill => {
        if (!skillMap.has(skill)) {
          skillMap.set(skill, []);
        }
        skillMap.get(skill)?.push({
          company: exp.company,
          role: role.title,
          details: role.responsibilities[0] // Using first responsibility as details
        });
      });
    });
  });

  return Object.fromEntries(
    Array.from(skillMap.entries()).map(([skill, experiences]) => [
      skill,
      {
        name: skill,
        experiences
      }
    ])
  );
};

const skillDetails = getSkillDetails();

// Create a component for the skill badge with dialog
const SkillBadge = ({ skill }: { skill: string }) => {
  const details = skillDetails[skill];
  const hasDetails = details && details.experiences.length > 0;

  // Color mapping for different skill types
  const getColorClass = (skill: string) => {
    const colorMap: Record<string, string> = {
      // Languages
      "Python": "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
      "JavaScript": "bg-yellow-200 hover:bg-yellow-300 text-yellow-800",
      "TypeScript": "bg-blue-100 hover:bg-blue-200 text-blue-800",
      "C#": "bg-purple-100 hover:bg-purple-200 text-purple-800",
      "Java": "bg-red-100 hover:bg-red-200 text-red-800",
      // Frameworks
      "React": "bg-cyan-100 hover:bg-cyan-200 text-cyan-800",
      "Node.js": "bg-green-100 hover:bg-green-200 text-green-800",
      // Add more mappings as needed
    };
    return colorMap[skill] || "bg-gray-100 hover:bg-gray-200 text-gray-800";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge 
          variant="secondary" 
          className={`px-3 py-1 cursor-pointer transition-colors ${getColorClass(skill)} ${!hasDetails && 'opacity-60'}`}
        >
          {skill}
        </Badge>
      </DialogTrigger>
      {hasDetails && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Experience with {skill}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {details.experiences.map((exp, index) => (
              <div key={index} className="border-b last:border-b-0 pb-4">
                <h4 className="font-semibold">{exp.company}</h4>
                <p className="text-sm text-gray-600">{exp.role}</p>
                <p className="text-sm mt-1">{exp.details}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

const RitvikPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <Header />
          <ExperienceSection />
          <SkillsSection />
          <EducationSection />
        </div>
      </div>
    </div>
  );
};

const SkillsSection = () => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Skills</h2>
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Programming Languages</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "Python",
            "JavaScript",
            "TypeScript",
            "C#",
            "Java",
            "C/C++",
            "SQL",
            "Go",
            "R",
            "Swift",
            "Dart"
          ].map((lang) => (
            <SkillBadge key={lang} skill={lang} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frameworks & Libraries</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "React",
            "Node.js",
            "Angular",
            "Tensorflow",
            "OpenCV",
            ".NET",
            "Spring Boot",
            "Flutter"
          ].map((framework) => (
            <SkillBadge key={framework} skill={framework} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cloud & DevOps</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "AWS",
            "Azure",
            "Git",
            "CI/CD",
            "Docker",
            "Kubernetes",
            "Ansible"
          ].map((tool) => (
            <SkillBadge key={tool} skill={tool} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Skills</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "REST APIs",
            "Microservices",
            "Agile",
            "Machine Learning",
            "Deep Learning",
            "Computer Vision"
          ].map((skill) => (
            <SkillBadge key={skill} skill={skill} />
          ))}
        </CardContent>
      </Card>
    </div>
  </section>
);

const ExperienceCard = ({ exp }: { exp: typeof experiences[0] }) => {
  return (
    <div id={exp.company.toLowerCase().replace(/\s+/g, '-')} className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={exp.companyLogo}
                    alt={exp.company}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">{exp.company}</span>
                    {exp.linkedIn && (
                      <a 
                        href={exp.linkedIn} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="View company updates"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{exp.location}</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {exp.roles[0].period}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Show only the first role in the card */}
            <div>
              <p className="font-medium">{exp.roles[0].title}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {exp.roles[0].responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-sm">
                    {resp.length > 100 ? `${resp.substring(0, 100)}...` : resp}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {exp.roles[0].skills.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dialog for showing all roles and details */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-blue-600">
                  ... more
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{exp.company}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {exp.roles.map((role, roleIdx) => (
                    <div key={roleIdx} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{role.title}</p>
                        <span className="text-sm text-gray-600">{role.period}</span>
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {role.responsibilities.map((resp, respIdx) => (
                          <li key={respIdx} className="text-sm">{resp}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {role.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Update the Experience section
const ExperienceSection = () => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Experience</h2>
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <ExperienceCard 
          key={index} 
          exp={exp}
        />
      ))}
    </div>
  </section>
);

const Header = () => (
  <header className="mb-8">
    <div className="flex items-center gap-6 mb-4">
      <div className="relative w-24 h-24">
        <Image
          src="https://media.licdn.com/dms/image/v2/D4E03AQGW9SJLrJNrTA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1674829941272?e=1738195200&amp;v=beta&amp;t=PcPHAzCLVwmvO490T4dyZx_Q4bkY-CVQ59OwCusht_4"//"/profile-pic.jpg"
          alt="Ritvik Joshi"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <h1 className="text-4xl font-bold">Ritvik Joshi</h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-400" />
            <span>+44 (0)7760 917811</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>London, United Kingdom</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />
            <a href="mailto:ritvikjoshi97@gmail.com" className="hover:text-blue-600">
              ritvikjoshi97@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <FaGlobe className="text-gray-400" />
            <a href="#" className="hover:text-blue-600">Faster Foods</a>
          </div>
          <div className="flex items-center gap-2">
            <FaLinkedin className="text-gray-400" />
            <a href="https://linkedin.com/in/ritvik-joshi-327508ba" className="hover:text-blue-600">
              ritvik-joshi-327508ba
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// First, define the education type
type Education = {
  institution: string;
  logo: string;
  website?: string;
  location: string;
  degree: string;
  period: string;
  grade?: string;
  details: string[];
};

// Add education data
const educationData: Education[] = [
  {
    institution: "University of Nottingham",
    logo: "https://media.licdn.com/dms/image/v2/C4E0BAQHO2SMiN1HSMA/company-logo_100_100/company-logo_100_100/0/1675599021016/university_of_nottingham_logo?e=1741219200&v=beta&t=bmBEnmis7znjHNcmYOrV6lyBwNx8jlicb8lPS00pxtk",
    website: "https://www.nottingham.ac.uk/",
    location: "Nottingham, UK",
    degree: "MSc in Computer Science with Artificial Intelligence",
    period: "Sept '21 - Sept '22",
    grade: "Merit",
    details: [
      "Machine Learning - Regression, Classification, Support Vector Machines, Decision Trees, Artificial Neural Network, Deep Learning",
      "Data Modelling and Analysis - Data Wrangling, Pre-processing, Modelling, Visualisation, Clustering",
      "Dissertation Project: Eye Gaze Tracking Utilising Infrared Multi-camera setup"
    ]
  },
  {
    institution: "Manipal Institute of Technology",
    logo: "https://media.licdn.com/dms/image/v2/C510BAQH66KkTTZFJ2A/company-logo_100_100/company-logo_100_100/0/1630615963889/manipal_institute_of_technology_logo?e=1741219200&v=beta&t=8F8GNuxnPYDq1AE3LH1dGm6hukhZ6f6VO-iOSUuzNsc",
    website: "https://manipal.edu/mit.html",
    location: "Manipal, India",
    degree: "BTech in Instrumentation and Control with minor in Data Science",
    period: "Aug '16 - July '20",
    grade: "CGPA: 6.86/10",
    details: []
  }
];

const AnimatedText = () => {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const text = "Saccades are rapid, ballistic movements of the eyes that abruptly change the point of fixation. These movements are interrupted by fixations, where the eyes remain relatively still to focus on and process visual information.";
  
  const words = text.split(' ');
  const animatableIndices = new Set();
  let currentIndex = 0;
  
  words.forEach(word => {
    const animateCount = Math.ceil(word.length / 2);
    for (let i = 0; i < animateCount; i++) {
      animatableIndices.add(currentIndex + i);
    }
    currentIndex += word.length + 1;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLetterIndex((prev) => (prev + 1) % text.length);
    }, 100);

    return () => clearInterval(interval);
  }, [text.length]);

  return (
    <div className="font-mono relative min-h-[6rem] leading-relaxed">
      {/* Base layer - static text */}
      <div className="whitespace-pre-wrap break-words">
        {text}
      </div>

      {/* Overlay layer - animated characters */}
      <div className="absolute top-0 left-0 whitespace-pre-wrap break-words">
        {text.split('').map((char, index) => {
          const isAnimatable = animatableIndices.has(index);
          const isActive = index === currentLetterIndex && isAnimatable;
          
          return (
            <span
              key={index}
              className="transition-all duration-300"
              style={{
                opacity: isActive ? 1 : 0,
                color: 'black',
                fontWeight: 'bold',
                fontSize: isActive ? '150%' : '100%',
                display: 'inline-block',
                width: char === ' ' ? '0.4em' : 'auto',
                position: 'relative',
                transform: isActive ? 'translateY(-15%)' : 'none',
                visibility: char === ' ' ? 'hidden' : 'visible'
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Education Card Component
const EducationCard = ({ education }: { education: Education }) => {
  return (
    <div id={education.institution.toLowerCase().replace(/\s+/g, '-')} className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex flex-col gap-1">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={education.logo}
                    alt={education.institution}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">{education.institution}</span>
                    {education.website && (
                      <a 
                        href={education.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Visit institution website"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{education.location}</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {education.period}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium">{education.degree}</p>
              {education.grade && (
                <p className="text-sm text-gray-600 mt-1">{education.grade}</p>
              )}
              {education.details.length > 0 && (
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  {education.details.map((detail, idx) => (
                    <li key={idx} className="text-sm">{detail}</li>
                  ))}
                </ul>
              )}
              
              {education.institution === "Manipal Institute of Technology" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-4 ml-auto block text-xs"
                    >
                      Demo Dissertation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Understanding Saccades</DialogTitle>
                      <DialogDescription className="pt-4 space-y-4">
                        <div className="overflow-hidden">
                          <AnimatedText />
                        </div>
                        
                        <p className="mt-4">
                          They range from the small movements made while reading, to the much larger movements made while scanning a room. Saccades can be triggered voluntarily, but occur reflexively whenever the eyes are open, even when fixated on a target.
                        </p>
                        
                        <p>
                          When scanning a visual scene, the brain uses a combination of saccades and fixations (temporary pauses) to gather detailed information about specific areas of interest. The study of saccades is crucial in understanding visual perception, attention mechanisms, and various neurological conditions.
                        </p>
                        
                        <p>
                          In my dissertation, I focused on making a system for analyzing saccadic movements with a low cost single camera setup.
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Education Section Component
const EducationSection = () => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4">Education</h2>
    <div className="space-y-6">
      {educationData.map((edu, index) => (
        <EducationCard 
          key={index} 
          education={edu}
        />
      ))}
    </div>
  </section>
);

// Export the page component
export default RitvikPage;
