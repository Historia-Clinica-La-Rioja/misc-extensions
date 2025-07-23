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

        // Observe the 'params' attribute for changes.
        static get observedAttributes() {
            return ['params'];
        }

        /**
         * Called when an observed attribute has been added, removed, or changed.
         * @param {string} name - The name of the attribute that changed.
         * @param {string} oldValue - The previous value of the attribute.
         * @param {string} newValue - The new value of the attribute.
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'params' && oldValue !== newValue) {
                // Parse the parameters and re-render the component.
                const params = JSON.parse(newValue || '{}');
                this.render(params);
            }
        }

        /**
         * Renders the component based on the provided parameters.
         * @param {object} params - The parameters for the component.
         */
        render(params) {
            // Extract parameters from the 'params' object passed by the system.
            // The 'defParams' property contains the values from the definition.json.
            const { href = '#', label = 'Click Me' } = params.defParams || {};

            // Clear any existing content in the shadow DOM.
            this.shadowRoot.innerHTML = '';

            // Create and append the new template.
            const template = createTemplate(href, label);
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    // Define the new custom element so it can be used in HTML.
    customElements.define('link-button-widget', LinkButtonWidget);

})(window.customElements);
