import { promises as fs } from 'fs';
import path from 'path';

// Define the structure of a single metadata entry
interface TrackMetadataEntry {
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverSrc: string | null;
  audioUrl: string;
  originalFilename: string;
}

// Define the structure of the entire metadata store (object mapping filename to entry)
interface MetadataStore {
  [filename: string]: TrackMetadataEntry;
}

const metadataFilePath = path.join(process.cwd(), 'public', 'uploads', 'metadata.json');

/**
 * Reads the metadata store from metadata.json.
 * Returns an empty object if the file doesn't exist or is invalid.
 */
export async function readMetadataStore(): Promise<MetadataStore> {
  try {
    const data = await fs.readFile(metadataFilePath, 'utf-8');
    return JSON.parse(data) as MetadataStore;
  } catch (error: any) {
    // If file not found, it's okay, return empty object
    if (error.code === 'ENOENT') {
      return {};
    }
    // For other errors (e.g., invalid JSON), log and return empty
    console.error("Error reading metadata store:", error);
    return {};
  }
}

/**
 * Updates a single entry in the metadata store and writes it back to the file.
 * @param safeFilename - The sanitized filename used as the key.
 * @param metadataEntry - The metadata object for the track.
 */
export async function updateMetadataStore(safeFilename: string, metadataEntry: TrackMetadataEntry): Promise<void> {
  try {
    const currentStore = await readMetadataStore();
    currentStore[safeFilename] = metadataEntry;
    const data = JSON.stringify(currentStore, null, 2); // Pretty print JSON
    
    // Ensure the directory exists before writing
    await fs.mkdir(path.dirname(metadataFilePath), { recursive: true });
    
    await fs.writeFile(metadataFilePath, data, 'utf-8');
  } catch (error) {
    console.error(`Error updating metadata store for ${safeFilename}:`, error);
    // Decide if we should re-throw or handle differently
    // throw error; // Uncomment if you want errors to propagate
  }
} 