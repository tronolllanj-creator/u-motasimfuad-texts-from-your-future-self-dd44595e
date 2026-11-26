// This program generates files and directories while enforcing a strict 200-character gate on content.
// It uses Node.js fs/promises and path modules.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface Candidate {
  score: number;
  chars: number;
  text: string;
}

// Exact CANDIDATES array with scores and texts as specified
const CANDIDATES: Candidate[] = [
  {
    score: 48,
    chars: 144,
    text: "Hey it's you. Stop stressing about that moldy sourdough starter, we finally sold the jar on eBay as modern art for four grand. Also buy Bitcoin."
  },
  {
    score: 48,
    chars: 138,
    text: "Don't panic, but your half-finished novel in the drawer just won a posthumous award because I left it in a cab. Good news: Oprah loves it."
  },
  {
    score: 48,
    chars: 140,
    text: "Quick question from the future: does that gym membership from January still charge your card or did it finally achieve sentience and escape?"
  },
  {
    score: 50,
    chars: 141,
    text: "Hey. Remember that tattoo of a compass on your ribs pointing slightly left? Turns out it wasn't magnetic, you've just been walking to Arby's."
  },
  {
    score: 49,
    chars: 143,
    text: "Urgent update regarding the fern on your windowsill. It learned to type while we slept and just accepted a hostile corporate takeover of Tesla."
  },
  {
    score: 50,
    chars: 139,
    text: "Future you here. Delete the wedding playlist immediately. Track four somehow summoned a minor demon and now we all live in a bowling alley."
  }
];

/**
 * Picks the best candidate by sorting descending by score,
 * with ties broken by shorter text length first.
 */
function pickBest(candidates: Candidate[]): Candidate {
  const sorted = [...candidates].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.text.length - b.text.length;
  });
  return sorted[0];
}

/**
 * Validates that the text is between 1 and 200 characters
 * and is not purely whitespace.
 */
function validateText(text: string): void {
  if (typeof text !== 'string') {
    throw new Error('Candidate text must be a string.');
  }
  if (text.length < 1 || text.length > 200) {
    throw new Error(`Candidate text length (${text.length}) is out of bounds (1-200).`);
  }
  if (text.trim().length === 0) {
    throw new Error('Candidate text cannot be only whitespace.');
  }
}

async function main(): void {
  const best = pickBest(CANDIDATES);

  // Validate winning text before writing
  validateText(best.text);

  // Determine output directory
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || './output';
  const filePath = join(outputDir, 'entry.txt');

  // Ensure directory exists
  await mkdir(outputDir, { recursive: true });

  // Write winning text with NO trailing newline
  await writeFile(filePath, best.text, 'utf8');

  // Print the chosen text and its character count
  console.log(`Chosen text: ${best.text}`);
  console.log(`Character count: ${best.text.length}`);
}

main().catch((err) => {
  console.error('Error execution failed:', err);
  process.exit(1);
});
