(function (customElements) {

    // Styles for the link button to make it look modern and clickable.
    const STYLES = `
  <style>
    .link-button {
      display: inline-block;
      padding: 12px 24px;
      margin: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      color: #ffffff;
      background-color: #007aff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.2s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .link-button:hover {
      background-color: #005ecb;
      transform: translateY(-2px);
    }
    .link-button:active {
      background-color: #004aaa;
      transform: translateY(0);
    }
  </style>`;

    /**
     * Creates the HTML template for the link button.
     * @param {string} href - The URL the button will link to.
     * @param {string} label - The text displayed on the button.
     * @returns {HTMLTemplateElement} The template element.
     */
    const createTemplate = (href, label) => {
        const template = document.createElement('template');
        template.innerHTML = `
      ${STYLES}
      <a href="${href}" class="link-button" target="_blank" rel="noopener noreferrer">
        ${label}
      </a>
    `;
        return template;
    };

    /**
     * Defines the LinkButtonWidget custom element.
     */
    class LinkButtonWidget extends HTMLElement {
        constructor() {
            super();
            // Attach a shadow DOM to encapsulate the component's styles and structure.
            this.attachShadow({ mode: 'open' });
        }

        /**
         * Called when the element is added to the document's DOM.
         * This is a reliable lifecycle callback for initial setup.
         */
        connectedCallback() {
            // The host system provides a stringified JSON object in the 'params' attribute.
            const hostParams = JSON.parse(this.getAttribute('params') || '{}');

            // Following the pattern in `main_test.js`, the user-defined parameters
            // from `definition.json` are nested inside a 'params' property.
            const userParams = hostParams.params || {};

            this.render(userParams);
        }

        /**
         * Renders the component based on the provided user parameters.
         * @param {object} params - The user-defined parameters from definition.json.
         */
        render(params) {
            // Destructure the href and label from the user-defined params, providing defaults.
            const { href = '#', label = 'Click Me' } = params;

            // Clear any existing content to prevent duplication on re-renders.
            this.shadowRoot.innerHTML = '';

            // Create and append the new template.
            const template = createTemplate(href, label);
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    // Define the new custom element so it can be used in HTML.
    customElements.define('link-button-widget', LinkButtonWidget);

})(window.customElements);
