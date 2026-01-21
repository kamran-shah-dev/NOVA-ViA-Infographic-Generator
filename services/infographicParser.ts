
import { InfographicData, Step } from "../types";

export class ParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParserError';
  }
}

export function parseStepsManually(text: string): InfographicData {
  if (!text || text.trim().length < 3) {
    throw new ParserError("Please provide content to transform into an infographic.");
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let title = "Process Overview";
  let subtitle = "Generated from manual input";
  let steps: Step[] = [];

  // Try to extract title from first line if it looks like "Title: Something" or is just a single short line
  if (lines[0].toLowerCase().startsWith('title:')) {
    title = lines[0].substring(6).trim();
    lines.shift();
  } else if (lines.length > 1 && lines[0].length < 50 && !/^\d+\.|->|•/.test(lines[0])) {
    title = lines[0];
    lines.shift();
  }

  const content = lines.join('\n');

  // Case 1: Arrow separated steps (e.g., Step 1 -> Step 2)
  if (content.includes('->')) {
    const parts = content.split('->').map(p => p.trim()).filter(p => p.length > 0);
    steps = parts.map((part, index) => {
      const [stepTitle, ...descParts] = part.split(/[:\-\n]/);
      return {
        id: `step-${index}`,
        number: index + 1,
        title: stepTitle.trim(),
        description: descParts.join(' ').trim() || `Execution of ${stepTitle.trim()}`,
        iconName: 'ArrowRight'
      };
    });
  } 
  // Case 2: Numbered List or New Lines
  else {
    steps = lines.map((line, index) => {
      // Clean up leading numbers like "1.", "1)", etc.
      const cleanLine = line.replace(/^\d+[\.\)]\s*/, '').trim();
      const [stepTitle, ...descParts] = cleanLine.split(/[:\-\n]/);
      
      return {
        id: `step-${index}`,
        number: index + 1,
        title: stepTitle.trim(),
        description: descParts.join(' ').trim() || `Description for ${stepTitle.trim()}`,
        iconName: 'CheckCircle'
      };
    });
  }

  if (steps.length === 0) {
    throw new ParserError("No clear steps found. Use '1. Step' or 'Step 1 -> Step 2' format.");
  }

  return { title, subtitle, steps };
}
