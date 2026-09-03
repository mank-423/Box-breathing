export interface CardProp {
  title: string;
  description?: string;
  count: number;
  onChange: (count: number) => void;
  url?: string;
  color: string;
  icon?: string;
}