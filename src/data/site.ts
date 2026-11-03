export const site = {
  name: 'Abdelhakim Gtat',
  shortName: 'Hakim',
  role: 'Computer Engineer',
  focus: ['embedded', 'networking', 'systems'],
  location: 'Ottawa, ON',
  email: 'ah.gtat@gmail.com',
  github: 'https://github.com/Hakim112',
  linkedin: 'https://www.linkedin.com/in/hakimgtat',
  // Drop a resume at public/resume.pdf and the download link appears automatically.
  resumePath: '/resume.pdf',
  description:
    'Computer engineer working on embedded systems, networking and low-level software. Projects with plain-English code walkthroughs.',
  certifications: [
    { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', status: 'earned' },
    { name: 'Azure Developer Associate (AZ-204)', status: 'in progress' },
  ],
} as const;
