import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import path from 'path';
import * as mm from 'music-metadata';
import { updateMetadataStore, readMetadataStore } from '@/app/lib/metadataStore';

// Define the structure of a single metadata entry (can be shared or re-defined here)
interface TrackMetadataEntry {
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverSrc: string | null;
  audioUrl: string;
  originalFilename: string;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const coverDir = path.join(uploadDir, 'covers');

    // Ensure base upload and cover directories exist
    await mkdir(uploadDir, { recursive: true });
    await mkdir(coverDir, { recursive: true });

    const uploadedFileDetails: any[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const safeFilename = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
      const filenameWithoutExt = path.parse(safeFilename).name;
      const filePath = path.join(uploadDir, safeFilename);


      await writeFile(filePath, buffer);



      let extractedData: TrackMetadataEntry = {
          title: filenameWithoutExt, 
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: 0,
          coverSrc: null,
          audioUrl: `/uploads/${safeFilename}`,
          originalFilename: file.name
      };

      try {
        const metadata = await mm.parseFile(filePath); 
        const common = metadata.common;
        
        extractedData = {
            ...extractedData, // Keep defaults like audioUrl and originalFilename
            title: common.title || filenameWithoutExt, 
            artist: common.artist || 'Unknown Artist',
            album: common.album || 'Unknown Album',
            duration: metadata.format.duration || 0,
        };

        // Handle Cover Art
        if (common.picture && common.picture.length > 0) {
            const picture = common.picture[0];
            // Use filenameWithoutExt for cover to avoid issues if multiple formats uploaded (e.g. .mp3, .flac)
            const coverFilename = `${filenameWithoutExt}.${picture.format.split('/')[1] || 'jpg'}`;
            const coverPath = path.join(coverDir, coverFilename);
            try {
                await writeFile(coverPath, picture.data);
                extractedData.coverSrc = `/uploads/covers/${coverFilename}`;

            } catch(coverError) {
                console.error(`Failed to save cover art for ${safeFilename}:`, coverError);
                // coverSrc remains null
            }
        }


      } catch (parseError) {
        console.error(`Could not parse metadata for ${safeFilename}:`, parseError);
      }

      await updateMetadataStore(safeFilename, extractedData);

      uploadedFileDetails.push(extractedData); 
    }

    return NextResponse.json({ 
      message: `Successfully uploaded and processed ${files.length} file(s)`, 
      uploadedTracks: uploadedFileDetails  
    });

  } catch (error) {
    console.error('Upload process failed:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Upload process failed', details: errorMessage }, { status: 500 });
  }
} 