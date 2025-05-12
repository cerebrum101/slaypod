import { Track } from "./track";
import { Artist } from "./artist";

export interface Album {
    id: string;
    name: string;
    artist: Artist;
    coverSrc?: string;
    tracks: Track[];
}