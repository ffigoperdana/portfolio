import type { IconName } from './icons';

export interface SocialLink {
  label: string;
  url: string;
  icon: IconName;
}

export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/ffigoperdana',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/figoperdana',
    icon: 'linkedin',
  },
];
