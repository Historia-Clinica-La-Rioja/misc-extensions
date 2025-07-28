(function (customElements) {

    /**
     * Creates the HTML template for the link button.
     * @param {string} href - The URL the button will link to.
     * @param {string} label - The text displayed on the button.
     * @returns {HTMLTemplateElement} The template element.
     */
    const createTemplate = (href, label) => {
        const template = document.createElement('template');
        // Using Bootstrap button classes: btn and btn-primary
        template.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
      <a href="${href}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
        ${label}
      </a>
    `;
        return template;
    };

    /**
     * Defines the LinkButtonBootstrappedWidget custom element.
     */
    class LinkButtonBootstrappedWidget extends HTMLElement {
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
            // For debugging, we are now using hardcoded parameters to ensure the
            // component renders correctly, bypassing attribute parsing.
            const hardcodedParams = {
                href: "https://blog-hsi.nubecenter.com.ar/",
                label: "Acceder al blog"
            };

            this.render(hardcodedParams);
        }

        /**
         * Renders the component based on the provided parameters.
         * @param {object} params - The parameters for the component.
         */
        render(params) {
            const { href, label } = params;

            // Clear any existing content to prevent duplication on re-renders.
            this.shadowRoot.innerHTML = '';

            // Create and append the new template.
            const template = createTemplate(href, label);
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    // Define the new custom element so it can be used in HTML.
    customElements.define('link-button-bootstrapped', LinkButtonBootstrappedWidget);

})(window.customElements);
