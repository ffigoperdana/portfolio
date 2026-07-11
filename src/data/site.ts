export interface ResumeVariant {
  label: string;
  /** URL slug for the shareable page /resume/<slug>/ */
  slug: string;
  /** Path under public/ */
  path: string;
  /** Not-yet-published variants render as disabled/hidden */
  available: boolean;
}

export interface Web3Identity {
  ens: string;
  cloakedName: string;
  /** Live rotating-address payment page; addresses rotate, so the site links
   *  to this page instead of embedding a raw address. */
  payUrl: string;
  /** One captured rotating address, shown as an explicit snapshot. */
  addressSnapshot: string;
}

export interface SiteConfig {
  name: string;
  /** Terminal-style display handle used in the header and hero. */
  handle: string;
  /** Rotated in the hero role animation; roles[0] is the no-JS fallback. */
  roles: string[];
  /** Single-line role for title, meta, and JSON-LD. */
  metaRole: string;
  description: string;
  email: string;
  location: string;
  timezone: string;
  availability: string;
  web3: Web3Identity;
  resumes: ResumeVariant[];
}

export const site: SiteConfig = {
  name: 'Figo Perdana Putra',
  handle: 'FIGO_PERDANA',
  roles: [
    'DevOps Engineer',
    'Infrastructure Engineer',
    'Network Engineer',
    'IT Infra Specialist',
    'System Engineer',
  ],
  metaRole: 'DevOps & Infrastructure Engineer',
  description:
    'DevOps & Infrastructure Engineer with 3+ years of experience operating Linux platforms and application delivery for 10+ business-critical services. Hands-on with Proxmox, Docker, GitLab CI/CD, observability, backup recovery, and incident response - backed by a software engineering and enterprise network foundation.',
  email: 'perdanaputrafigo@gmail.com',
  location: 'Jakarta, Indonesia',
  timezone: 'WIB (UTC+7)',
  availability: 'Open for selected freelance & collaboration',
  web3: {
    ens: 'fgdev.eth',
    cloakedName: 'fgdev.clkd.eth',
    payUrl: 'https://fgdev.clkd.id/',
    addressSnapshot: '0x4567EFB28F0f89Ce45B10c3DBF18f0621D71F8c5',
  },
  resumes: [
    {
      label: 'RESUME_DEVOPS',
      slug: 'devops',
      path: '/resume/figo-perdana-devops.pdf',
      available: true,
    },
    {
      label: 'RESUME_IT_INFRA',
      slug: 'it-infra',
      path: '/resume/figo-perdana-it-infra.pdf',
      available: true,
    },
    {
      label: 'RESUME_SOFTWARE_ENGINEER',
      slug: 'software-engineer',
      path: '/resume/figo-perdana-software-engineer.pdf',
      available: false,
    },
  ],
};
