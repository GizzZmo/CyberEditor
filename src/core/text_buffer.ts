// src/core/text_buffer.ts
/**
 * A simulation of a high-performance text buffer.
 * A production version would use a Rope data structure for O(log n) operations.
 * For this prototype, we use a simple array of strings to model the public API.
 */
export class TextBuffer {
  private lines: string[] = [''];

  insert(line: number, column: number, text: string): void {
    if (line < 0 || line >= this.lines.length) {
      throw new Error(`Invalid line number: ${line}`);
    }
    const currentLine = this.lines[line];
    const before = currentLine.substring(0, column);
    const after = currentLine.substring(column);
    this.lines[line] = before + text + after;
  }

  delete(line: number, column: number, length: number): void {
    if (line < 0 || line >= this.lines.length) {
        throw new Error(`Invalid line number: ${line}`);
    }
    const currentLine = this.lines[line];
    const before = currentLine.substring(0, column);
    const after = currentLine.substring(column + length);
    this.lines[line] = before + after;
  }

  getLine(lineNumber: number): string {
    return this.lines[lineNumber] || '';
  }

  getLineCount(): number {
    return this.lines.length;
  }

  getFullText(): string {
    return this.lines.join('\n');
  }
}
