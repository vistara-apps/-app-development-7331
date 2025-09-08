// Mock data for the RightCheck app
export const checklists = [
  {
    id: 'police-stop',
    title: 'Police Traffic Stop',
    category: 'Police Interactions',
    premium: false,
    tags: ['police', 'traffic', 'rights'],
    steps: [
      'Stay calm and keep your hands visible',
      'You have the right to remain silent',
      'Ask "Am I free to leave?" if unsure about detention',
      'You can refuse consent to search your vehicle',
      'Request a lawyer if arrested',
      'Remember or write down badge numbers and patrol car numbers'
    ],
    description: 'Essential rights and steps during police traffic stops'
  },
  {
    id: 'landlord-entry',
    title: 'Landlord Entry Rights',
    category: 'Housing',
    premium: true,
    tags: ['landlord', 'housing', 'privacy'],
    steps: [
      'Landlord must provide 24-48 hours notice (varies by state)',
      'Entry must be at reasonable times (usually 8am-6pm)',
      'Valid reasons: repairs, inspections, showing to prospective tenants',
      'You can refuse entry for invalid reasons',
      'Document unauthorized entries',
      'Contact local housing authority if rights are violated'
    ],
    description: 'Know your rights when landlords want to enter your rental'
  },
  {
    id: 'job-interview',
    title: 'Job Interview Rights',
    category: 'Employment',
    premium: true,
    tags: ['employment', 'interview', 'discrimination'],
    steps: [
      'Employers cannot ask about age, religion, or family plans',
      'Questions about disabilities are generally prohibited',
      'You can ask about salary ranges in many states',
      'Take notes during the interview',
      'Ask about company policies and culture',
      'Follow up within 24-48 hours'
    ],
    description: 'Protect yourself during job interviews'
  },
  {
    id: 'consumer-fraud',
    title: 'Consumer Fraud Protection',
    category: 'Consumer Rights',
    premium: false,
    tags: ['fraud', 'consumer', 'scams'],
    steps: [
      'Never give personal information over unsolicited calls',
      'Verify company legitimacy before making payments',
      'Keep records of all transactions',
      'Report suspected fraud to FTC and local authorities',
      'Contact your bank immediately if accounts are compromised',
      'Consider credit monitoring services'
    ],
    description: 'Steps to protect yourself from common scams and fraud'
  }
];

export const scenarioGuides = [
  {
    id: 'rental-application',
    title: 'Rental Application Process',
    category: 'Housing',
    premium: true,
    tags: ['rental', 'application', 'housing'],
    modules: [
      {
        title: 'Understanding Application Fees',
        content: 'Application fees should be reasonable and only cover actual costs of processing.'
      },
      {
        title: 'Required Documentation',
        content: 'Landlords can request income verification, references, and background checks.'
      },
      {
        title: 'Discrimination Protection',
        content: 'Fair Housing laws protect against discrimination based on protected classes.'
      }
    ],
    description: 'Navigate rental applications with confidence'
  },
  {
    id: 'workplace-harassment',
    title: 'Workplace Harassment Response',
    category: 'Employment',
    premium: true,
    tags: ['workplace', 'harassment', 'hr'],
    modules: [
      {
        title: 'Documenting Incidents',
        content: 'Keep detailed records of dates, times, witnesses, and what was said or done.'
      },
      {
        title: 'Reporting Procedures',
        content: 'Follow company policy for reporting, usually to HR or your supervisor.'
      },
      {
        title: 'Legal Protections',
        content: 'Title VII and state laws protect against harassment based on protected characteristics.'
      }
    ],
    description: 'Know how to respond to workplace harassment effectively'
  }
];

export const legalTerms = [
  {
    term: 'Miranda Rights',
    definition: 'Constitutional rights that police must inform suspects of before interrogation, including the right to remain silent and right to an attorney.',
    relatedGuides: ['police-stop']
  },
  {
    term: 'Fair Housing Act',
    definition: 'Federal law that prohibits discrimination in housing based on race, color, religion, sex, national origin, familial status, or disability.',
    relatedGuides: ['rental-application', 'landlord-entry']
  },
  {
    term: 'At-Will Employment',
    definition: 'Employment arrangement where either employer or employee can terminate the relationship at any time, for any reason (except illegal reasons).',
    relatedGuides: ['job-interview', 'workplace-harassment']
  },
  {
    term: 'Consumer Protection',
    definition: 'Laws and regulations designed to ensure fair trade, accurate information, and consumer rights in the marketplace.',
    relatedGuides: ['consumer-fraud']
  }
];

export const alerts = [
  {
    id: 'alert-1',
    title: 'New California Tenant Protection Act',
    content: 'California has enacted new protections limiting rent increases and requiring just cause for evictions statewide.',
    timestamp: new Date('2024-01-15'),
    readStatus: false,
    category: 'Housing'
  },
  {
    id: 'alert-2',
    title: 'Federal Minimum Wage Update',
    content: 'Several states have increased their minimum wage rates effective January 1st, 2024.',
    timestamp: new Date('2024-01-01'),
    readStatus: true,
    category: 'Employment'
  }
];