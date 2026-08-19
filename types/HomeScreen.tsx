export type CardProp = {
    title: string;
    count: number;
    onChange: (count: number) => void;
    url?: string;
    colors: string[];
}