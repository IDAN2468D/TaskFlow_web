"use server";

import { google } from 'googleapis';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { getUserIdFromToken } from '@/lib/authHelper';

export async function exportPrdToGoogleDoc(projectId: string, accessToken: string) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();
    if (!userId) throw new Error("Unauthorized");

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) throw new Error("Project not found");

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const docs = google.docs({ version: 'v1', auth });
    const drive = google.drive({ version: 'v3', auth });

    // 1. Create a new document in Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `TaskFlow AI - ${project.productName} (PRD)`,
        mimeType: 'application/vnd.google-apps.document',
      },
      fields: 'id,webViewLink',
    });

    const docId = driveResponse.data.id;
    if (!docId) throw new Error("Failed to create document");

    // 2. Prepare content with aesthetic formatting
    const requests = [
      // Title
      {
        insertText: {
          location: { index: 1 },
          text: `${project.productName}\n`,
        },
      },
      {
        updateParagraphStyle: {
          range: { startIndex: 1, endIndex: project.productName.length + 1 },
          paragraphStyle: { namedStyleType: 'HEADING_1', alignment: 'CENTER' },
          fields: 'namedStyleType,alignment',
        },
      },
      {
        updateTextStyle: {
          range: { startIndex: 1, endIndex: project.productName.length + 1 },
          textStyle: { bold: true, fontSize: { magnitude: 26, unit: 'PT' }, foregroundColor: { color: { rgbColor: { blue: 0.94, green: 0.4, red: 0.38 } } } },
          fields: 'bold,fontSize,foregroundColor',
        },
      },
      // Sections
      {
        insertText: {
          location: { index: project.productName.length + 2 },
          text: `\nELEVATOR PITCH\n${project.elevatorPitch}\n\nTARGET AUDIENCE\n${project.targetAudience}\n\nCORE FEATURES\n${project.coreFeatures.map(f => `• ${f}`).join('\n')}\n\nDESIGN BRIEF\n${project.designBrief}\n\nTIMELINE\n${project.estimatedDevTime}\n`,
        },
      },
    ];

    // Note: Applying styles to specific ranges for headers
    // For brevity in this iteration, I'll use a more robust way to find indices if needed, 
    // but here I'll stick to a clean structure.
    
    // Auto-formatting headers (Quick but effective)
    const headers = ['ELEVATOR PITCH', 'TARGET AUDIENCE', 'CORE FEATURES', 'DESIGN BRIEF', 'TIMELINE'];
    const fullText = `${project.productName}\n\nELEVATOR PITCH\n${project.elevatorPitch}\n\nTARGET AUDIENCE\n${project.targetAudience}\n\nCORE FEATURES\n${project.coreFeatures.map(f => `• ${f}`).join('\n')}\n\nDESIGN BRIEF\n${project.designBrief}\n\nTIMELINE\n${project.estimatedDevTime}\n`;

    headers.forEach(header => {
      const startIndex = fullText.indexOf(header);
      if (startIndex !== -1) {
        requests.push({
          updateTextStyle: {
            range: { startIndex: startIndex + 1, endIndex: startIndex + header.length + 1 },
            textStyle: { bold: true, fontSize: { magnitude: 14, unit: 'PT' }, foregroundColor: { color: { rgbColor: { blue: 0.6, green: 0.2, red: 0.2 } } } },
            fields: 'bold,fontSize,foregroundColor',
          },
        });
      }
    });

    await docs.documents.batchUpdate({
      documentId: docId,
      requestBody: { requests },
    });

    return {
      success: true,
      fileId: docId,
      webViewLink: driveResponse.data.webViewLink,
    };
  } catch (error: any) {
    console.error('[DriveService] Export failed:', error);
    return { success: false, error: error.message };
  }
}
