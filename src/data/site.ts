export const site = {
  name: 'Abdelhakim Gtat',
  shortName: 'Hakim',
  role: 'Computer Engineer',
  focus: ['data', 'IT support', 'automation', 'embedded'],
  location: 'Ottawa, ON',
  email: 'ah.gtat@gmail.com',
  github: 'https://github.com/HakimGtat',
  linkedin: 'https://www.linkedin.com/in/hakimgtat',
  // Drop a resume at public/resume.pdf and the download link appears automatically.
  resumePath: '/resume.pdf',
  description:
    'Abdelhakim Gtat, computer engineer in Ottawa. I automate the boring parts: data clean-up and reporting, IT and support tasks, and embedded systems. Open to data, IT support, automation and embedded roles.',
  certifications: [
    { name: 'Microsoft Certified: Azure Fundamentals (AZ-900)', status: 'earned' },
    { name: 'Azure Developer Associate (AZ-204)', status: 'in progress' },
  ],
} as const;
