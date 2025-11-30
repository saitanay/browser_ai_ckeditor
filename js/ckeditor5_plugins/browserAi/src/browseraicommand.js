/**
 * @file
 * Browser AI command for CKEditor 5.
 */

import { Command } from 'ckeditor5/src/core';
import { isAIAvailable, rewrite, summarize, proofread, writeForMe } from './utils/aihelpers';

/**
 * Command for executing AI operations on selected text.
 */
export default class BrowserAiCommand extends Command {
  /**
   * Creates a new BrowserAiCommand.
   *
   * @param {module:core/editor/editor~Editor} editor - The editor instance.
   * @param {string} operation - The AI operation type: 'rewrite', 'summarize', 'proofread', or 'writeForMe'.
   */
  constructor(editor, operation) {
    super(editor);
    this.operation = operation;

    // Make isProcessing observable so UI can react to changes
    this.set('isProcessing', false);
  }

  /**
   * @inheritdoc
   */
  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const aiAvailable = isAIAvailable();

    // For writeForMe, always enabled (doesn't require selection)
    if (this.operation === 'writeForMe') {
      this.isEnabled = aiAvailable && !this.isProcessing;
      return;
    }

    // For other operations, require selected text
    const range = selection.getFirstRange();
    const hasSelection = range && !range.isCollapsed;

    this.isEnabled = aiAvailable && hasSelection && !this.isProcessing;
  }

  /**
   * Executes the AI operation.
   *
   * @param {Object} options - Command options.
   * @param {string} [options.topic] - Topic for writeForMe operation.
   */
  async execute(options = {}) {
    if (this.isProcessing) {
      return;
    }

    const editor = this.editor;
    const model = editor.model;
    const selection = model.document.selection;

    this.isProcessing = true;
    this.refresh();

    try {
      let result;

      if (this.operation === 'writeForMe') {
        // Use the topic from options
        const topic = options.topic || '';
        if (!topic.trim()) {
          return;
        }
        result = await writeForMe(topic);
      } else {
        // Get selected text for other operations
        const selectedText = this._getSelectedText();
        
        if (!selectedText) {
          return;
        }

        switch (this.operation) {
          case 'rewrite':
            result = await rewrite(selectedText);
            break;
          case 'summarize':
            result = await summarize(selectedText);
            break;
          case 'proofread':
            result = await proofread(selectedText);
            break;
          default:
            return;
        }
      }

      if (result) {
        // Insert the result
        model.change((writer) => {
          if (this.operation === 'writeForMe') {
            // Insert at cursor position
            const insertPosition = selection.getFirstPosition();
            writer.insertText(result, insertPosition);
          } else {
            // Replace selected text
            const range = selection.getFirstRange();
            if (range) {
              model.insertContent(writer.createText(result), range);
            }
          }
        });
      }
    } catch (error) {
      console.error('[BrowserAI] Error:', error);
    } finally {
      this.isProcessing = false;
      this.refresh();
    }
  }

  /**
   * Gets the currently selected text from the editor.
   *
   * @returns {string} The selected text.
   * @private
   */
  _getSelectedText() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const range = selection.getFirstRange();

    if (!range || range.isCollapsed) {
      return '';
    }

    let text = '';
    for (const item of range.getItems()) {
      if (item.is('$text') || item.is('$textProxy')) {
        text += item.data;
      }
    }

    return text;
  }
}
