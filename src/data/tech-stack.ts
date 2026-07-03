import type { IconName } from './icons';
export interface TechGroup {
  label: string;
  icon: IconName;
  items: string[];
}
// Grouping mirrors the CV skills sections + Figo's 2026-07 additions
// (frameworks, databases, messaging, cloud, MikroTik, tools).
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
    ],
  },
  {
    label: 'DevOps & Automation',
    icon: 'container',
    items: [
      'Docker',
      'Kubernetes',
      'Terraform',
      'Ansible',
      'GitLab CI/CD',
      'Jenkins',
    ],
  },
  {
    label: 'Cloud Platforms',
    icon: 'cloud',
    items: ['AWS', 'Alibaba Cloud', 'Microsoft Azure', 'DigitalOcean'],
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
    items: ['Grafana', 'Prometheus', 'Zabbix', 'Incident Response', 'Runbooks'],
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
    items: ['GitLab', 'GitHub', 'Coolify'],
  },
];
