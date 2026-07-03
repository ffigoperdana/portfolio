export interface ExperienceEntry {
  company: string;
  role: string;
  displayDate: string;
  /** ISO dates for ordering; null dateEnd = current position. */
  dateStart: string;
  dateEnd: string | null;
  summary: string;
  /** Per-job skill tags (rendered as chips in the timeline card). */
  skills: string[];
}

// Condensed from CV_DevOps_Dana_2026.pdf / CV_IT_Infra_Dana_2026.pdf.
export const experience: ExperienceEntry[] = [
  {
    company: 'Indonesian Oil Palm Plantations Fund Management Agency',
    role: 'IT Infra Specialist',
    displayDate: '2026 — PRESENT',
    dateStart: '2026-01-01',
    dateEnd: null,
    summary:
      'Managing on-prem infrastructure and platform operations for 10+ business-critical applications: Proxmox virtualization, GitLab CI/CD administration, service availability and incident response.',
    skills: [
      'Proxmox',
      'GitLab CI/CD',
      'Linux',
      'Incident Response',
      'On-Prem Infrastructure',
    ],
  },
  {
    company: 'PT. Mastersystem Infotama Tbk',
    role: 'Network Engineer',
    displayDate: '2023 — 2026',
    dateStart: '2023-10-01',
    dateEnd: '2026-01-01',
    summary:
      'Supported nationwide branch operations (1000+ sites) for PT. Bank Central Asia Tbk — SD-WAN/I-WAN troubleshooting, Cisco ACI fabrics (APIC, Nexus), UCS/VMware ESXi clusters under change control.',
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
    displayDate: '2023 — 2024',
    dateStart: '2023-07-01',
    dateEnd: '2024-06-01',
    summary:
      'Guided 30 students through fullstack web development and DevOps (Docker, Kubernetes) tracks, reaching an 85% batch completion rate.',
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
      'Maintained and extended the Laravel-based Nusabot.id platform — backend integration for 7+ new pages and database optimizations improving query performance by 15%.',
    skills: ['Laravel', 'PHP', 'MySQL', 'REST API', 'Query Optimization'],
  },
];
