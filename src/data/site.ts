export interface ResumeVariant {
  label: string;
  /** Path under public/ */
  path: string;
  /** Not-yet-published variants render as disabled/hidden */
  available: boolean;
}

export interface Web3Identity {
  ens: string;
  cloakedName: string;
  /** Live rotating-address payment page (fgdev.clkd.id) — addresses rotate,
   *  so the site links/QRs to this page instead of embedding a raw address. */
  payUrl: string;
  /** One captured rotating address, shown as an explicit SNAPSHOT (the live
   *  page mints a fresh one per payment). Captured 2026-07-03. */
  addressSnapshot: string;
}

export interface SiteConfig {
  name: string;
  /** Terminal-style display handle used in the header/hero. */
  handle: string;
  /** Rotated in the hero role glitch animation; roles[0] is the static
   *  fallback for no-JS and reduced-motion. */
  roles: string[];
  /** Single-line role for <title>/meta/JSON-LD. */
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
    'Network Engineer',
    'Software Engineer',
    'IT Infra Specialist',
    'System Engineer',
  ],
  metaRole: 'DevOps & Network Infrastructure Engineer',
  // Condensed from his own CV "About me" paragraph.
  description:
    'Engineer with hands-on experience building secure, scalable applications and the infrastructure behind them — Docker, Kubernetes, Terraform and Ansible for orchestration and IaC, CI/CD on GitLab and Jenkins, with a strong foundation in network engineering and full-stack development.',
  email: 'perdanaputrafigo@gmail.com',
  location: 'Jakarta, Indonesia',
  timezone: 'WIB (UTC+7)',
  // TODO_CONTENT: confirm the availability statement with Figo
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
      path: '/resume/figo-perdana-devops.pdf',
      available: true,
    },
    {
      label: 'RESUME_IT_INFRA',
      path: '/resume/figo-perdana-it-infra.pdf',
      available: true,
    },
    {
      // TODO_CONTENT: publish when the Software Engineer CV is ready
      label: 'RESUME_SOFTWARE_ENGINEER',
      path: '/resume/figo-perdana-software-engineer.pdf',
      available: false,
    },
  ],
};
