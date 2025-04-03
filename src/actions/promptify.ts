import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import path from 'node:path';
import { runCli } from 'repomix'
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';

const workingDir = process.cwd();

export const promptify = defineAction({
    accept: 'form',
    input: z.object({
        files: z.array(z.instanceof(File)),
    }),
    handler: async ({ files }) => {
        try {
            // Generate unique ID
            const submissionID = crypto.randomUUID();
            const tempDir = path.join(workingDir, '_temp', submissionID);
            
            // Create temporary directory
            await mkdir(tempDir, { recursive: true });
            
            // Save files to the temporary directory
            const savedFilePaths = await Promise.all(
                files.map(async (file, index) => {
                    
                    // Sanitize the filename to prevent path traversal
                    const filePath = path.join(tempDir, file.name);
                    
                    // Verify the path is still within our temp directory (prevent path traversal)
                    if (!filePath.startsWith(tempDir)) {
                        throw new Error(`Invalid file path detected: ${file.name}`);
                    }
                    
                    // Handle subdirectories in the file name if needed
                    const fileDir = path.dirname(filePath);
                    if (fileDir !== tempDir) {
                        await mkdir(fileDir, { recursive: true });
                    }
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    
                    await writeFile(filePath, buffer);
                    return filePath;
                })
            );

            const outputFile = path.join(tempDir, submissionID + '.md');

            const result = await runCli([tempDir],  workingDir, { 
                compress: true, 
                output: outputFile,
                style: 'markdown', 
                removeEmptyLines: true, 
                quiet: true,
                ignore: '**/*.lock,**/*.svg,/**/*.json' 
            });

            if (!result) return { success: false, error: 'No output from repomix' };

            const fileContent = await readFile(outputFile, 'utf-8');

            // Cleanup: remove the temporary directory and its contents
            await rm(tempDir, { recursive: true, force: true });
            await rm(outputFile, { recursive: true, force: true });
            console.log('Temporary directory cleaned up');
            
            return { 
                success: true,
                prompt: fileContent,
                metadata: result.packResult,
                message: `Successfully processed ${savedFilePaths.length} files` 
            };
        } catch (error) {
            console.error('Error processing files:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
});