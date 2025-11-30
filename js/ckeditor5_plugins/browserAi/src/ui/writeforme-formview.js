/**
 * @file
 * Write for Me form view for the Browser AI CKEditor plugin.
 */

import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler,
} from 'ckeditor5/src/ui';
import { KeystrokeHandler, FocusTracker } from 'ckeditor5/src/utils';

// Inline SVG icons to avoid import issues
const checkIcon = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.972 16.615a.997.997 0 0 1-.744-.292l-4.596-4.596a1 1 0 1 1 1.414-1.414l3.926 3.926 9.937-9.937a1 1 0 0 1 1.414 1.414L7.716 16.323a.997.997 0 0 1-.744.292z"/></svg>';
const cancelIcon = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m11.591 10.177 4.243 4.242a1 1 0 0 1-1.415 1.415l-4.242-4.243-4.243 4.243a1 1 0 0 1-1.414-1.415l4.243-4.242-4.243-4.243a1 1 0 0 1 1.414-1.414l4.243 4.243 4.242-4.243a1 1 0 1 1 1.415 1.414l-4.243 4.243z"/></svg>';

/**
 * Form view for the "Write for Me" AI feature.
 *
 * Displays a text input for the topic and submit/cancel buttons.
 */
export default class WriteForMeFormView extends View {
  /**
   * Creates a new WriteForMeFormView.
   *
   * @param {module:utils/locale~Locale} locale - The locale instance.
   */
  constructor(locale) {
    super(locale);

    const t = locale.t;

    /**
     * Tracks focus in the form.
     *
     * @type {module:utils/focustracker~FocusTracker}
     */
    this.focusTracker = new FocusTracker();

    /**
     * Keystroke handler for the form.
     *
     * @type {module:utils/keystrokehandler~KeystrokeHandler}
     */
    this.keystrokes = new KeystrokeHandler();

    /**
     * The topic input view.
     *
     * @type {module:ui/labeledfield/labeledfieldview~LabeledFieldView}
     */
    this.topicInputView = this._createInput(t('Topic or prompt'));

    /**
     * The submit button view.
     *
     * @type {module:ui/button/buttonview~ButtonView}
     */
    this.submitButtonView = this._createButton(
      t('Generate'),
      checkIcon,
      'ck-button-save'
    );
    this.submitButtonView.type = 'submit';

    /**
     * The cancel button view.
     *
     * @type {module:ui/button/buttonview~ButtonView}
     */
    this.cancelButtonView = this._createButton(
      t('Cancel'),
      cancelIcon,
      'ck-button-cancel'
    );

    // Delegate cancel button execute to the form's cancel event
    this.cancelButtonView.delegate('execute').to(this, 'cancel');

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-browser-ai-form'],
        tabindex: '-1',
      },
      children: [
        this.topicInputView,
        this._createActionsView(),
      ],
    });
  }

  /**
   * @inheritdoc
   */
  render() {
    super.render();

    submitHandler({
      view: this,
    });

    // Register focusable elements
    [this.topicInputView, this.submitButtonView, this.cancelButtonView].forEach(
      (view) => {
        this.focusTracker.add(view.element);
      }
    );

    // Start listening for keystrokes
    this.keystrokes.listenTo(this.element);
  }

  /**
   * @inheritdoc
   */
  destroy() {
    super.destroy();

    this.focusTracker.destroy();
    this.keystrokes.destroy();
  }

  /**
   * Focuses the topic input.
   */
  focus() {
    this.topicInputView.focus();
  }

  /**
   * Creates a labeled input view.
   *
   * @param {string} label - The input label.
   * @returns {module:ui/labeledfield/labeledfieldview~LabeledFieldView} The labeled input view.
   * @private
   */
  _createInput(label) {
    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

    labeledInput.label = label;
    labeledInput.fieldView.placeholder = Drupal.t('Enter a topic to write about...');

    return labeledInput;
  }

  /**
   * Creates a button view.
   *
   * @param {string} label - The button label.
   * @param {string} icon - The button icon SVG string.
   * @param {string} className - Additional CSS class.
   * @returns {module:ui/button/buttonview~ButtonView} The button view.
   * @private
   */
  _createButton(label, icon, className) {
    const button = new ButtonView(this.locale);

    button.set({
      label,
      icon,
      tooltip: true,
      class: className,
    });

    return button;
  }

  /**
   * Creates the actions container view with submit and cancel buttons.
   *
   * @returns {module:ui/view~View} The actions view.
   * @private
   */
  _createActionsView() {
    const actionsView = new View(this.locale);

    actionsView.setTemplate({
      tag: 'div',
      attributes: {
        class: ['ck', 'ck-browser-ai-form__actions'],
      },
      children: [this.cancelButtonView, this.submitButtonView],
    });

    return actionsView;
  }
}
