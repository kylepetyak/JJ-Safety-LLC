export interface Service {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: string
  features: string[]
  benefits: string[]
  process: Array<{ step: number; title: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  relatedServices: string[]
}

export const services: Record<string, Service> = {
  'isnetworld-management': {
    slug: 'isnetworld-management',
    title: 'ISNetworld Management Services',
    description: 'Expert ISNetworld account management to achieve and maintain your A+ rating',
    longDescription:
      'ISNetworld is one of the most demanding contractor prequalification platforms. Our team of ISNetworld experts handles every aspect of your account - from initial setup to ongoing maintenance - ensuring you maintain the highest possible grade.',
    icon: 'shield',
    features: [
      'Complete account setup and optimization',
      'Weekly monitoring and updates',
      'RAVS questionnaire completion',
      'MS&Q questionnaire management',
      'Document library management',
      'Grade improvement strategies',
      'Expiration tracking and alerts',
      'Client connection management',
    ],
    benefits: [
      'Achieve and maintain A+ rating',
      'Win more contracts',
      'Save 10+ hours per week',
      'Never miss a deadline',
      'Expert guidance on requirements',
      'Faster client approval process',
    ],
    process: [
      {
        step: 1,
        title: 'Account Audit',
        description: 'We review your current ISNetworld account to identify gaps and opportunities for improvement.',
      },
      {
        step: 2,
        title: 'Optimization Plan',
        description: 'Create a customized strategy to improve your grade and streamline ongoing maintenance.',
      },
      {
        step: 3,
        title: 'Implementation',
        description: 'Complete all questionnaires, upload required documents, and optimize your profile.',
      },
      {
        step: 4,
        title: 'Ongoing Management',
        description: 'Weekly monitoring, proactive updates, and continuous optimization to maintain A+ status.',
      },
    ],
    faqs: [
      {
        question: 'How long does it take to improve my ISNetworld grade?',
        answer: 'Most clients see improvement within 30-60 days. The timeline depends on your starting grade and the complexity of your operations.',
      },
      {
        question: 'Do you guarantee an A+ rating?',
        answer: 'While we cannot guarantee specific grades (as ISNetworld has final say), we have a proven track record of helping companies achieve and maintain A+ ratings when they provide the necessary documentation.',
      },
      {
        question: 'What information do you need from us?',
        answer: 'We need access to your ISNetworld account, copies of relevant safety documents, insurance certificates, and information about your operations. We provide a complete checklist during onboarding.',
      },
    ],
    relatedServices: ['avetta-management', 'veriforce-management', 'safety-manuals'],
  },
  'avetta-management': {
    slug: 'avetta-management',
    title: 'Avetta Management Services',
    description: 'Complete Avetta account management and compliance support',
    longDescription:
      'Avetta Connect is a critical platform for contractors working with major corporations. We handle all aspects of your Avetta account to ensure you meet client requirements and maintain prequalification status.',
    icon: 'check',
    features: [
      'Account setup and configuration',
      'Questionnaire completion',
      'Document management',
      'Insurance tracking',
      'Client-specific requirements',
      'Compliance monitoring',
      'Audit preparation',
      'Renewal management',
    ],
    benefits: [
      'Maintain prequalified status',
      'Meet all client requirements',
      'Reduce administrative burden',
      'Never miss renewals',
      'Expert compliance support',
      'Faster approval times',
    ],
    process: [
      {
        step: 1,
        title: 'Initial Setup',
        description: 'Configure your Avetta account with all required company information and documentation.',
      },
      {
        step: 2,
        title: 'Compliance Review',
        description: 'Ensure all safety programs, insurance, and documentation meet Avetta standards.',
      },
      {
        step: 3,
        title: 'Client Connections',
        description: 'Manage connections with hiring clients and respond to specific requirements.',
      },
      {
        step: 4,
        title: 'Continuous Monitoring',
        description: 'Track expirations, update documents, and maintain compliance status.',
      },
    ],
    faqs: [
      {
        question: 'What is Avetta Connect?',
        answer: 'Avetta is a supply chain risk management platform used by major corporations to prequalify contractors. It verifies insurance, safety programs, and compliance before allowing contractors to bid on projects.',
      },
      {
        question: 'How often does Avetta need updates?',
        answer: 'Documents like insurance and safety programs need regular updates as they expire. We monitor your account continuously and handle all updates proactively.',
      },
      {
        question: 'Can you help with client-specific requirements?',
        answer: 'Yes, we handle all client-specific questionnaires and requirements within Avetta to ensure you meet each hiring client\'s standards.',
      },
    ],
    relatedServices: ['isnetworld-management', 'compliance-platforms', 'weekly-management'],
  },
  'veriforce-management': {
    slug: 'veriforce-management',
    title: 'Veriforce Management Services',
    description: 'Professional Veriforce account management and compliance solutions',
    longDescription:
      'Veriforce is essential for contractors in the energy and utilities sectors. We manage your Veriforce account to ensure you meet industry-specific safety and compliance requirements.',
    icon: 'award',
    features: [
      'Account setup and maintenance',
      'Safety program management',
      'Drug and alcohol policy compliance',
      'Operator qualification tracking',
      'Client relationship management',
      'Renewal coordination',
      'Compliance reporting',
      'Audit support',
    ],
    benefits: [
      'Industry-specific expertise',
      'Maintain qualification status',
      'Streamlined compliance',
      'Reduced administrative costs',
      'Expert support team',
      'Peace of mind',
    ],
    process: [
      {
        step: 1,
        title: 'Account Assessment',
        description: 'Review your current Veriforce status and identify compliance requirements.',
      },
      {
        step: 2,
        title: 'Documentation Gathering',
        description: 'Collect and organize all required safety programs and certifications.',
      },
      {
        step: 3,
        title: 'Profile Optimization',
        description: 'Complete all questionnaires and upload documentation to meet industry standards.',
      },
      {
        step: 4,
        title: 'Ongoing Compliance',
        description: 'Monitor requirements, track renewals, and maintain qualification status.',
      },
    ],
    faqs: [
      {
        question: 'Who uses Veriforce?',
        answer: 'Veriforce is primarily used in the oil & gas, utilities, and energy sectors. Major operators require contractors to be Veriforce qualified.',
      },
      {
        question: 'What makes Veriforce different from other platforms?',
        answer: 'Veriforce has industry-specific requirements including operator qualifications, pipeline safety, and energy sector compliance that require specialized knowledge.',
      },
      {
        question: 'How do you stay current with Veriforce changes?',
        answer: 'Our team specializes in these platforms and stays updated on all policy changes, new requirements, and industry best practices.',
      },
    ],
    relatedServices: ['isnetworld-management', 'avetta-management', 'custom-policies'],
  },
  'safety-manuals': {
    slug: 'safety-manuals',
    title: 'OSHA Safety Manual Creation',
    description: 'Custom OSHA-compliant safety manuals tailored to your operations',
    longDescription:
      'Every contractor needs a comprehensive, OSHA-compliant safety manual. We create customized safety programs that meet regulatory requirements and platform standards while reflecting your actual operations.',
    icon: 'file-text',
    features: [
      'Industry-specific content',
      'OSHA compliance',
      'Customized to your operations',
      'Written safety programs',
      'Job hazard analyses',
      'Emergency action plans',
      'Policies and procedures',
      'Platform-ready formatting',
    ],
    benefits: [
      'Meet platform requirements',
      'OSHA compliance',
      'Professional documentation',
      'Platform approval',
      'Risk reduction',
      'Employee safety',
    ],
    process: [
      {
        step: 1,
        title: 'Consultation',
        description: 'Discuss your operations, industry, and specific requirements.',
      },
      {
        step: 2,
        title: 'Research & Development',
        description: 'Research industry best practices and OSHA requirements for your sector.',
      },
      {
        step: 3,
        title: 'Manual Creation',
        description: 'Write comprehensive, customized safety programs and policies.',
      },
      {
        step: 4,
        title: 'Review & Delivery',
        description: 'Review with you, make revisions, and deliver in platform-ready formats.',
      },
    ],
    faqs: [
      {
        question: 'How long does it take to create a safety manual?',
        answer: 'Most safety manuals are completed within 2-3 weeks, depending on complexity and the number of required programs.',
      },
      {
        question: 'Will my manual be accepted by prequalification platforms?',
        answer: 'Yes, we create manuals specifically formatted and written to meet the requirements of ISNetworld, Avetta, Veriforce, and other major platforms.',
      },
      {
        question: 'Can you update an existing safety manual?',
        answer: 'Absolutely. We can review and update your current manual to improve compliance and platform acceptance.',
      },
    ],
    relatedServices: ['custom-policies', 'isnetworld-management', 'avetta-management'],
  },
  'weekly-management': {
    slug: 'weekly-management',
    title: 'Weekly Account Management',
    description: 'Ongoing weekly maintenance for all your prequalification platforms',
    longDescription:
      'Platforms require constant attention - new questionnaires, document expirations, client requests, and updates. Our weekly management service handles everything so you never miss a deadline or lose a qualification.',
    icon: 'calendar',
    features: [
      'Weekly account monitoring',
      'Expiration tracking',
      'Document updates',
      'Questionnaire responses',
      'Client request handling',
      'Grade monitoring',
      'Proactive alerts',
      'Monthly reporting',
    ],
    benefits: [
      'Never miss deadlines',
      'Maintain A+ ratings',
      'Save 10+ hours weekly',
      'Peace of mind',
      'Expert oversight',
      'Consistent compliance',
    ],
    process: [
      {
        step: 1,
        title: 'Account Access',
        description: 'Gain secure access to all your prequalification platform accounts.',
      },
      {
        step: 2,
        title: 'Baseline Assessment',
        description: 'Document current status, grades, and upcoming requirements.',
      },
      {
        step: 3,
        title: 'Weekly Monitoring',
        description: 'Check accounts every week for new requirements, expirations, and updates.',
      },
      {
        step: 4,
        title: 'Proactive Management',
        description: 'Handle all updates, respond to requests, and keep you informed of status.',
      },
    ],
    faqs: [
      {
        question: 'How many platforms can you manage?',
        answer: 'We manage all major platforms including ISNetworld, Avetta, Veriforce, ComplyWorks, PEC Safety, BROWZ, and more.',
      },
      {
        question: 'What if I need help between weekly check-ins?',
        answer: 'We provide 24-48 hour response times for urgent requests and can log in at any time to handle critical issues.',
      },
      {
        question: 'Do I still have access to my accounts?',
        answer: 'Yes, you maintain full access to your accounts at all times. We work collaboratively with your team.',
      },
    ],
    relatedServices: ['isnetworld-management', 'avetta-management', 'veriforce-management'],
  },
  'compliance-platforms': {
    slug: 'compliance-platforms',
    title: 'All Prequalification Platforms',
    description: 'Comprehensive management for all contractor prequalification platforms',
    longDescription:
      'We manage accounts across all major contractor prequalification platforms. Whether you need help with one platform or all of them, we have the expertise to keep you qualified and compliant.',
    icon: 'grid',
    features: [
      'ISNetworld',
      'Avetta',
      'Veriforce',
      'ComplyWorks',
      'PEC Safety',
      'BROWZ',
      'Veriforce Operator Qualification',
      'Other regional platforms',
    ],
    benefits: [
      'Single point of contact',
      'Consistent management across all platforms',
      'Expertise in each platform',
      'Streamlined processes',
      'Cost-effective solution',
      'Comprehensive oversight',
    ],
    process: [
      {
        step: 1,
        title: 'Platform Assessment',
        description: 'Identify which platforms you need and assess current status on each.',
      },
      {
        step: 2,
        title: 'Centralized Strategy',
        description: 'Develop a unified compliance strategy across all platforms.',
      },
      {
        step: 3,
        title: 'Multi-Platform Setup',
        description: 'Optimize accounts on all platforms simultaneously.',
      },
      {
        step: 4,
        title: 'Unified Management',
        description: 'Manage all platforms from a single team with consolidated reporting.',
      },
    ],
    faqs: [
      {
        question: 'Which platforms do you support?',
        answer: 'We support all major platforms: ISNetworld, Avetta, Veriforce, ComplyWorks, PEC Safety, BROWZ, and many regional platforms. Contact us about specific platforms.',
      },
      {
        question: 'Is it more cost-effective to manage multiple platforms with you?',
        answer: 'Yes, we offer package pricing for multiple platforms that is more cost-effective than managing each separately.',
      },
      {
        question: 'Do you handle industry-specific platforms?',
        answer: 'Yes, we have experience with industry-specific platforms and can adapt to new platforms as needed.',
      },
    ],
    relatedServices: ['weekly-management', 'isnetworld-management', 'avetta-management'],
  },
  'custom-policies': {
    slug: 'custom-policies',
    title: 'Custom Safety Policy Writing',
    description: 'Professional safety policy creation for specific needs and platforms',
    longDescription:
      'Beyond full safety manuals, we create individual safety policies, procedures, and programs tailored to specific requirements, whether for a platform questionnaire or a client-specific request.',
    icon: 'edit',
    features: [
      'Job-specific safety procedures',
      'Hazard-specific policies',
      'Client-specific programs',
      'Platform questionnaire responses',
      'Emergency response plans',
      'Environmental policies',
      'Subcontractor management plans',
      'Site-specific safety plans',
    ],
    benefits: [
      'Professional quality',
      'OSHA compliant',
      'Platform approved',
      'Quick turnaround',
      'Expert knowledge',
      'Tailored content',
    ],
    process: [
      {
        step: 1,
        title: 'Requirements Gathering',
        description: 'Understand exactly what policy or program you need and why.',
      },
      {
        step: 2,
        title: 'Research',
        description: 'Research industry standards, regulations, and best practices.',
      },
      {
        step: 3,
        title: 'Policy Development',
        description: 'Write customized policy that meets all requirements.',
      },
      {
        step: 4,
        title: 'Review & Revision',
        description: 'Collaborate with you on revisions and deliver final policy.',
      },
    ],
    faqs: [
      {
        question: 'What types of policies can you write?',
        answer: 'We can write any safety-related policy including hazard-specific procedures, emergency plans, environmental policies, and client-specific safety programs.',
      },
      {
        question: 'How quickly can you create a policy?',
        answer: 'Most individual policies are completed within 3-5 business days. Complex programs may take 1-2 weeks.',
      },
      {
        question: 'Can you help with client-specific safety requirements?',
        answer: 'Yes, we frequently create custom safety programs to meet specific client requirements for project awards.',
      },
    ],
    relatedServices: ['safety-manuals', 'isnetworld-management', 'avetta-management'],
  },
}

export function getServiceBySlug(slug: string): Service | null {
  return services[slug] || null
}

export function getAllServices(): Service[] {
  return Object.values(services)
}
