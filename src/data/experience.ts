export interface ExperienceEntry {
  company: string;
  role: string;
  displayDate: string;
  /** ISO dates for ordering; null dateEnd = current position. */
  dateStart: string;
  dateEnd: string | null;
  summary: string;
  /** Per-job skill tags, rendered as chips in the timeline card. */
  skills: string[];
}

// Condensed from CV_DevOps_Figo_2026.pdf.
export const experience: ExperienceEntry[] = [
  {
    company: 'Indonesian Oil Palm Plantations Fund Management Agency',
    role: 'IT Infra Specialist',
    displayDate: '2026 - PRESENT',
    dateStart: '2026-01-01',
    dateEnd: null,
    summary:
      'Operating on-prem infrastructure and platform services for 10+ business-critical applications: Linux and Proxmox VMs, GitLab/GitLab Runner CI/CD, Docker, reverse proxies, Restic backup recovery, availability checks, and incident response.',
    skills: [
      'Proxmox',
      'GitLab CI/CD',
      'Docker',
      'Restic',
      'Linux',
      'Incident Response',
    ],
  },
  {
    company: 'PT. Mastersystem Infotama Tbk',
    role: 'Network Engineer',
    displayDate: '2023 - 2026',
    dateStart: '2023-10-01',
    dateEnd: '2026-01-01',
    summary:
      'Supported nationwide branch operations across 1,000+ sites for PT Bank Central Asia Tbk: SD-WAN/I-WAN troubleshooting, Cisco ACI fabrics (APIC, Nexus), Cisco UCS, and VMware ESXi under controlled change and capacity-management processes.',
    skills: [
      'Cisco ACI',
      'SD-WAN',
      'Nexus',
      'VMware ESXi',
      'Cisco UCS',
      'Network Design',
    ],
  },
  {
    company: 'PT. Presentologics (Dicoding)',
    role: 'Mentor & Advisor, Independent Study',
    displayDate: '2023 - 2024',
    dateStart: '2023-07-01',
    dateEnd: '2024-06-01',
    summary:
      'Mentored 30 students in Docker, Kubernetes, full-stack development, deployment fundamentals, and project troubleshooting, contributing to an 85% completion rate.',
    skills: [
      'Mentoring',
      'Docker',
      'Kubernetes',
      'React',
      'Fullstack Development',
    ],
  },
  {
    company: 'PT. Nusabot Inovasi Teknologi',
    role: 'Backend Developer',
    displayDate: '2022',
    dateStart: '2022-09-01',
    dateEnd: '2022-12-01',
    summary:
      'Maintained and enhanced Laravel backend features, collaborating on page and API integration for 7+ platform pages while improving database queries and data structures.',
    skills: ['Laravel', 'PHP', 'MySQL', 'REST API', 'Query Optimization'],
  },
];
