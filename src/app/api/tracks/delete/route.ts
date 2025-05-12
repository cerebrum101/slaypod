import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { readMetadataStore, updateMetadataStore } from '@/app/lib/metadataStore';

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const trackId = body.trackId as string; // trackId is the safeFilename

    if (!trackId) {
      return NextResponse.json({ error: 'Missing trackId in request body' }, { status: 400 });
    }



    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const coversDir = path.join(uploadsDir, 'covers');
    const metadataStore = await readMetadataStore();
    const metadataEntry = metadataStore[trackId];

    if (!metadataEntry) {
       console.warn(`Metadata not found for trackId: ${trackId}. Attempting to delete files anyway.`);
       // Allow deletion attempt even if metadata is missing
    }

    // --- Delete Audio File ---
    const audioFilePath = path.join(uploadsDir, trackId); // Assuming trackId is the filename
    try {
      await fs.unlink(audioFilePath);

    } catch (err: any) {
      if (err.code !== 'ENOENT') { // Ignore if file doesn't exist
        console.error(`Error deleting audio file ${audioFilePath}:`, err);
        // Decide if we should still proceed to delete metadata/cover
        // For now, we'll log the error and continue
      }
    }

    // --- Delete Cover File (if it exists) ---
    if (metadataEntry?.coverSrc) {
      const coverFilename = path.basename(metadataEntry.coverSrc);
      const coverFilePath = path.join(coversDir, coverFilename);
      try {
        await fs.unlink(coverFilePath);

      } catch (err: any) {
        if (err.code !== 'ENOENT') { // Ignore if file doesn't exist
          console.error(`Error deleting cover file ${coverFilePath}:`, err);
        }
      }
    }

    // --- Remove from Metadata Store --- 
    if (metadataStore[trackId]) {
        delete metadataStore[trackId];
        // Rewriting the entire store. For large stores, more efficient methods exist.
        try {
            const data = JSON.stringify(metadataStore, null, 2); 
            const metadataFilePath = path.join(uploadsDir, 'metadata.json');
            await fs.writeFile(metadataFilePath, data, 'utf-8');

        } catch (writeError) {
            console.error(`Error writing updated metadata store after deleting ${trackId}:`, writeError);
            // Return error if updating store fails, as state is now inconsistent
            return NextResponse.json({ error: 'Failed to update metadata store after deletion' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: `Track ${trackId} deleted successfully` });

  } catch (error) {
    console.error('DELETE /api/tracks/delete error:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to delete track', details: errorMessage }, { status: 500 });
  }
} 