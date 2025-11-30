/**
 * @file
 * Main Browser AI plugin class.
 */

import { Plugin } from 'ckeditor5/src/core';
import BrowserAiUI from './browseraiui';
import BrowserAiCommand from './browseraicommand';

/**
 * Browser AI plugin for CKEditor 5.
 *
 * Provides AI-powered toolbar buttons using Chrome's built-in AI APIs.
 */
export default class BrowserAi extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [BrowserAiUI];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'BrowserAi';
  }

  /**
   * @inheritdoc
   */
  init() {
    const editor = this.editor;

    // Register AI commands
    editor.commands.add('aiRewrite', new BrowserAiCommand(editor, 'rewrite'));
    editor.commands.add('aiSummarize', new BrowserAiCommand(editor, 'summarize'));
    editor.commands.add('aiProofread', new BrowserAiCommand(editor, 'proofread'));
    editor.commands.add('aiWriteForMe', new BrowserAiCommand(editor, 'writeForMe'));
  }
}

