/**
 * @file
 * Browser AI UI plugin for CKEditor 5.
 */

import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5/src/ui';
import { isAIAvailable } from './utils/aihelpers';
import WriteForMeFormView from './ui/writeforme-formview';

// Import icons
import rewriteIcon from '../../../../icons/rewrite.svg';
import summarizeIcon from '../../../../icons/summarize.svg';
import proofreadIcon from '../../../../icons/proofread.svg';
import writeIcon from '../../../../icons/write.svg';

// Loading spinner SVG
const spinnerIcon = '<svg class="ck-browser-ai-spinner" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="25 75" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.8s" repeatCount="indefinite"/></circle></svg>';

/**
 * Shows loading state on a button.
 * @param {ButtonView} buttonView - The button view.
 */
function showLoading(buttonView) {
  if (!buttonView.element) return;
  
  // Store original icon
  const iconElement = buttonView.element.querySelector('.ck-icon');
  if (iconElement) {
    buttonView._originalIconHTML = iconElement.innerHTML;
    iconElement.innerHTML = spinnerIcon;
    iconElement.style.animation = 'none'; // Prevent any CKEditor animations
  }
  
  // Disable the button visually
  buttonView.element.style.opacity = '0.7';
  buttonView.element.style.pointerEvents = 'none';
}

/**
 * Hides loading state on a button.
 * @param {ButtonView} buttonView - The button view.
 */
function hideLoading(buttonView) {
  if (!buttonView.element) return;
  
  // Restore original icon
  const iconElement = buttonView.element.querySelector('.ck-icon');
  if (iconElement && buttonView._originalIconHTML) {
    iconElement.innerHTML = buttonView._originalIconHTML;
    iconElement.style.animation = '';
  }
  
  // Re-enable the button
  buttonView.element.style.opacity = '';
  buttonView.element.style.pointerEvents = '';
}

/**
 * Browser AI UI plugin.
 *
 * Provides toolbar buttons for AI operations.
 */
export default class BrowserAiUI extends Plugin {
  /**
   * @inheritdoc
   */
  static get requires() {
    return [ContextualBalloon];
  }

  /**
   * @inheritdoc
   */
  static get pluginName() {
    return 'BrowserAiUI';
  }

  /**
   * @inheritdoc
   */
  init() {
    const editor = this.editor;

    // Get the contextual balloon for the Write for Me form
    this._balloon = editor.plugins.get(ContextualBalloon);

    // Create the form view for Write for Me
    this._formView = this._createFormView();

    // Register toolbar buttons
    this._registerButton('aiRewrite', 'Rewrite', rewriteIcon);
    this._registerButton('aiSummarize', 'Summarize', summarizeIcon);
    this._registerButton('aiProofread', 'Proofread', proofreadIcon);
    this._registerWriteForMeButton();
  }

  /**
   * @inheritdoc
   */
  destroy() {
    super.destroy();
    this._formView.destroy();
  }

  /**
   * Registers a standard AI toolbar button.
   *
   * @param {string} name - The button/command name.
   * @param {string} label - The button label.
   * @param {string} icon - The button icon SVG.
   * @private
   */
  _registerButton(name, label, icon) {
    const editor = this.editor;

    editor.ui.componentFactory.add(name, (locale) => {
      const command = editor.commands.get(name);
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: Drupal.t('AI @label', { '@label': label }),
        icon,
        tooltip: true,
        withText: false,
      });

      // Bind button state to command state
      buttonView.bind('isEnabled').to(command, 'isEnabled');

      // Execute command on button click and show loading state
      this.listenTo(buttonView, 'execute', async () => {
        // Show loading immediately
        showLoading(buttonView);

        try {
          await editor.execute(name);
        } catch (error) {
          console.error(`[BrowserAI UI] Error executing ${name}:`, error);
        } finally {
          // Hide loading when done
          hideLoading(buttonView);
        }
        
        editor.editing.view.focus();
      });

      return buttonView;
    });
  }

  /**
   * Registers the Write for Me button with modal functionality.
   *
   * @private
   */
  _registerWriteForMeButton() {
    const editor = this.editor;

    editor.ui.componentFactory.add('aiWriteForMe', (locale) => {
      const command = editor.commands.get('aiWriteForMe');
      const buttonView = new ButtonView(locale);

      // Store reference to button for loading state
      this._writeForMeButton = buttonView;

      buttonView.set({
        label: Drupal.t('AI Write for Me'),
        icon: writeIcon,
        tooltip: true,
        withText: false,
      });

      // Bind button state to command state
      buttonView.bind('isEnabled').to(command, 'isEnabled');

      // Open the form balloon on click
      this.listenTo(buttonView, 'execute', () => {
        this._showForm();
      });

      return buttonView;
    });
  }

  /**
   * Creates the Write for Me form view.
   *
   * @returns {WriteForMeFormView} The form view instance.
   * @private
   */
  _createFormView() {
    const editor = this.editor;
    const formView = new WriteForMeFormView(editor.locale);

    // Handle form submission
    this.listenTo(formView, 'submit', async () => {
      const topic = formView.topicInputView.fieldView.element.value;

      if (topic.trim()) {
        // Show loading state on submit button and Write for Me toolbar button
        showLoading(formView.submitButtonView);
        if (this._writeForMeButton) {
          showLoading(this._writeForMeButton);
        }
        formView.cancelButtonView.isEnabled = false;

        try {
          await editor.execute('aiWriteForMe', { topic });
        } catch (error) {
          console.error('[BrowserAI UI] Error executing command:', error);
        } finally {
          // Remove loading state
          hideLoading(formView.submitButtonView);
          if (this._writeForMeButton) {
            hideLoading(this._writeForMeButton);
          }
          formView.cancelButtonView.isEnabled = true;
          this._hideForm();
        }
      }
    });

    // Handle form cancellation
    this.listenTo(formView, 'cancel', () => {
      this._hideForm();
    });

    // Close on click outside
    clickOutsideHandler({
      emitter: formView,
      activator: () => this._balloon.visibleView === formView,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideForm(),
    });

    // Close on Escape key
    formView.keystrokes.set('Esc', (data, cancel) => {
      this._hideForm();
      cancel();
    });

    return formView;
  }

  /**
   * Shows the Write for Me form in a balloon.
   *
   * @private
   */
  _showForm() {
    if (this._balloon.hasView(this._formView)) {
      return;
    }

    this._balloon.add({
      view: this._formView,
      position: this._getBalloonPositionData(),
    });

    // Focus the input field
    this._formView.topicInputView.fieldView.element.focus();
  }

  /**
   * Hides the Write for Me form balloon.
   *
   * @private
   */
  _hideForm() {
    if (!this._balloon.hasView(this._formView)) {
      return;
    }

    // Clear the input
    this._formView.topicInputView.fieldView.element.value = '';

    this._balloon.remove(this._formView);

    // Focus editor
    this.editor.editing.view.focus();
  }

  /**
   * Gets the balloon position data.
   *
   * @returns {Object} Position data for the balloon.
   * @private
   */
  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;

    // Get the selection position
    const target = view.domConverter.viewRangeToDom(
      viewDocument.selection.getFirstRange()
    );

    return { target };
  }
}
