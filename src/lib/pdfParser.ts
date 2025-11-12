import pdf from 'pdf-parse';

export interface PDFParseResult {
  text: string;
  numpages: number;
  info: any;
}

export class PDFParser {
  static async parsePDF(buffer: Buffer): Promise<PDFParseResult> {
    try {
      const data = await pdf(buffer);
      return {
        text: data.text,
        numpages: data.numpages,
        info: data.info
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async extractTextFromPDF(buffer: Buffer): Promise<string> {
    const result = await this.parsePDF(buffer);
    return result.text;
  }
}