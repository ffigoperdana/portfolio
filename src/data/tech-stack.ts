import type { IconName } from './icons';

export interface TechGroup {
  label: string;
  icon: IconName;
  items: string[];
}

// Grouping mirrors the skills sections in CV_DevOps_Figo_2026.pdf.
export const techStack: TechGroup[] = [
  {
    label: 'Infrastructure & Systems',
    icon: 'server',
    items: [
      'Linux',
      'Windows Server',
      'Proxmox',
      'VMware ESXi',
      'Active Directory',
      'DNS',
      'SSL/TLS',
      'Reverse Proxy',
    ],
  },
  {
    label: 'DevOps & Automation',
    icon: 'container',
    items: [
      'Docker',
      'Docker Compose',
      'Kubernetes',
      'Terraform',
      'Ansible',
      'GitLab CI/CD',
      'GitHub Actions',
      'Jenkins',
    ],
  },
  {
    label: 'Cloud Platforms',
    icon: 'cloud',
    items: ['AWS', 'GCP', 'Microsoft Azure', 'Alibaba Cloud'],
  },
  {
    label: 'Networking & Security',
    icon: 'network',
    items: ['Cisco ACI', 'MikroTik', 'TCP/IP', 'Firewalls', 'VPN', 'IAM'],
  },
  {
    label: 'Databases & Messaging',
    icon: 'database',
    items: ['PostgreSQL', 'MySQL', 'MariaDB', 'Redis', 'Kafka', 'RabbitMQ'],
  },
  {
    label: 'Monitoring & Operations',
    icon: 'activity',
    items: [
      'Prometheus',
      'Grafana',
      'Loki',
      'Alloy',
      'Blackbox Exporter',
      'Node Exporter',
      'Zabbix',
      'Restic',
      'Incident Response',
    ],
  },
  {
    label: 'Programming & Frameworks',
    icon: 'code',
    items: [
      'Go',
      'Python',
      'TypeScript',
      'PHP',
      'SQL',
      'Bash',
      'Laravel',
      'React',
    ],
  },
  {
    label: 'Tools & Platforms',
    icon: 'wrench',
    items: [
      'GitLab',
      'GitHub',
      'Nginx',
      'Apache',
      'PM2',
      'Coolify',
      'Portainer',
    ],
  },
];
