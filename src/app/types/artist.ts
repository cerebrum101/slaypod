import { Album } from "./album";

export interface Artist {
    id: string;
    name: string;
    coverSrc?: string;
    bio?: string;
    genres?: string[];
    albums: Album[];
    followers?: number;
    monthlyListeners?: number;
}