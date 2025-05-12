import { Artist } from "./artist";
import { Album } from "./album";

export interface Track {
    id: string;
    title: string;
    artist: Artist;
    album: Album;
    duration: number; // duration in seconds
    coverSrc?: string;
    genre?: string;
    audioUrl?: string;
}