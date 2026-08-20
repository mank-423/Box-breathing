import { ImageSourcePropType } from "react-native";

export type CardProp = {
    title: string;
    description?: string;
    count: number;
    onChange: (count: number) => void;
    url?: string;
    image: ImageSourcePropType;
    icon?: string;
}