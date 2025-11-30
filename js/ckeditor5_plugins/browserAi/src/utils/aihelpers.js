/**
 * @file
 * Chrome AI API helper functions for Browser AI CKEditor plugin.
 *
 * Based on the sample app at note-app-ai-extended/src/lib/ai.js
 */

/**
 * Checks if all required Chrome AI APIs are available.
 *
 * @returns {boolean} True if AI APIs are available, false otherwise.
 */
export function isAIAvailable() {
  return (
    typeof window !== 'undefined' &&
    'Summarizer' in window &&
    'Proofreader' in window &&
    'Rewriter' in window &&
    'Writer' in window
  );
}

/**
 * Rewrites the given text using Chrome's Rewriter API.
 *
 * @param {string} text - The text to rewrite.
 * @returns {Promise<string>} The rewritten text.
 */
export async function rewrite(text) {
  if (!window.Rewriter) {
    throw new Error('Rewriter API is not available');
  }

  const rewriter = await window.Rewriter.create();

  try {
    const result = await rewriter.rewrite(text, {});
    return result;
  } finally {
    rewriter.destroy();
  }
}

/**
 * Summarizes the given text using Chrome's Summarizer API.
 *
 * @param {string} text - The text to summarize.
 * @returns {Promise<string>} The summarized text.
 */
export async function summarize(text) {
  if (!window.Summarizer) {
    throw new Error('Summarizer API is not available');
  }

  const summarizer = await window.Summarizer.create({
    type: 'tldr',
    format: 'plain-text',
    length: 'long',
  });

  try {
    const result = await summarizer.summarize(text);
    return result;
  } finally {
    summarizer.destroy();
  }
}

/**
 * Proofreads the given text using Chrome's Proofreader API.
 * Only corrects grammar, spelling, and punctuation errors.
 *
 * @param {string} text - The text to proofread.
 * @returns {Promise<string>} The proofread/corrected text.
 */
export async function proofread(text) {
  if (!window.Proofreader) {
    throw new Error('Proofreader API is not available');
  }

  const proofreader = await window.Proofreader.create({
    expectedInputLanguages: ['en'],
  });

  try {
    const proofreadResult = await proofreader.proofread(text);
    // Return the corrected text
    return proofreadResult.correctedInput;
  } finally {
    proofreader.destroy();
  }
}

/**
 * Generates content based on a topic using Chrome's Writer API.
 *
 * @param {string} topic - The topic to write about.
 * @returns {Promise<string>} The generated content.
 */
export async function writeForMe(topic) {
  if (!window.Writer) {
    throw new Error('Writer API is not available');
  }

  const writer = await window.Writer.create({ format: 'plain-text' });

  try {
    const prompt = `Write content about: ${topic}. Give plain-text only. Don't use markdown.`;
    const result = await writer.write(prompt);
    return result;
  } finally {
    writer.destroy();
  }
}
