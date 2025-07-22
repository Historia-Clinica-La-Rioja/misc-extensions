(function (customElements) {
    // Define the styles for the link button component.
    // These styles make the button visually appealing and responsive.
    const STYLES = `
  <style>
    .link-button-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      width: 100%;
      box-sizing: border-box; /* Include padding in the element's total width and height */
    }
    .link-button {
      background-color: #007bff; /* Blue background */
      color: white; /* White text */
      padding: 12px 24px; /* Ample padding for touch targets */
      border: none;
      border-radius: 8px; /* Rounded corners */
      cursor: pointer;
      font-size: 1.2rem;
      font-family: 'Inter', sans-serif; /* Use Inter font */
      text-align: center;
      text-decoration: none; /* Remove underline for anchor tag */
      transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions for hover/active states */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
      display: inline-block; /* Allows padding and margin to be applied correctly */
      min-width: 150px; /* Minimum width for better appearance */
      white-space: nowrap; /* Prevent text wrapping */
      overflow: hidden; /* Hide overflow if text is too long */
      text-overflow: ellipsis; /* Add ellipsis for overflowing text */
    }
    .link-button:hover {
      background-color: #0056b3; /* Darker blue on hover */
      transform: translateY(-2px); /* Slight lift effect */
    }
    .link-button:active {
      background-color: #004085; /* Even darker blue on click */
      transform: translateY(0); /* Return to original position */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Deeper shadow on click */
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      .link-button {
        font-size: 1rem;
        padding: 10px 20px;
        min-width: 120px;
      }
    }
  </style>`;

    /**
     * Creates the HTML template for the link button.
     * @param {string} buttonText - The text to display on the button.
     * @param {string} targetUrl - The URL to navigate to when the button is clicked.
     * @returns {HTMLTemplateElement} The constructed HTML template.
     */
    const createTemplate = (buttonText, targetUrl) => {
        const template = document.createElement('template');
        template.innerHTML = `
      ${STYLES}
      <div class="link-button-container">
        <a href="${targetUrl}" class="link-button" role="button" aria-label="${buttonText}">${buttonText}</a>
      </div>
    `;
        return template;
    };

    /**
     * Defines the custom element 'link-button'.
     * This component displays a clickable button that navigates to a specified URL.
     * The button text and URL are passed as 'params' attributes.
     */
    class LinkButton extends HTMLElement {
        constructor() {
            super();
            // Attach a shadow DOM to encapsulate the component's styles and markup.
            this.attachShadow({ mode: 'open' });
            console.debug('LinkButton component initialized.');
        }

        /**
         * Specifies which attributes to observe for changes.
         * When 'params' attribute changes, attributeChangedCallback will be called.
         */
        static get observedAttributes() {
            return ['params'];
        }

        /**
         * Called when an observed attribute changes.
         * Parses the 'params' attribute and re-renders the component.
         * @param {string} name - The name of the attribute that changed.
         * @param {string} oldValue - The old value of the attribute.
         * @param {string} newValue - The new value of the attribute.
         */
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'params' && oldValue !== newValue) {
                try {
                    // Parse the JSON string from the 'params' attribute.
                    const paramsAttribute = JSON.parse(this.getAttribute('params') || '{}');
                    console.debug('LinkButton attributeChangedCallback', paramsAttribute);
                    // Render the component with the new parameters.
                    this.render(paramsAttribute);
                } catch (e) {
                    console.error('Error parsing params attribute for LinkButton:', e);
                }
            }
        }

        /**
         * Renders or re-renders the component based on the provided parameters.
         * @param {object} params - An object containing the component's parameters.
         * @param {object} params.defParams - An object holding the actual button text and link.
         * @param {string} params.defParams.buttonText - The text to display on the button.
         * @param {string} params.defParams.link - The URL the button should navigate to.
         */
        render({ defParams }) {
            // Clear existing shadow DOM content to prevent duplicates on re-render.
            this.shadowRoot.innerHTML = '';

            // Get button text and link from defParams, with fallback defaults.
            const buttonText = defParams?.buttonText || 'Click Me';
            const targetUrl = defParams?.link || '#'; // Default to current page if no link is provided.

            console.debug(`LinkButton rendering with text: "${buttonText}" and link: "${targetUrl}"`);

            // Create the template with the provided text and URL.
            const template = createTemplate(buttonText, targetUrl);
            // Append a clone of the template's content to the shadow DOM.
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }

    // Define the custom element 'link-button' so it can be used in HTML.
    customElements.define('link-button', LinkButton);

})(window.customElements);
