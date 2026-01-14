export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  badgeColor?: 'accent' | 'green' | 'red';
}

export interface NavSection {
  title: string;
  items: NavItem[];
}