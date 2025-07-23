(function (customElements) {

  const LINK = 'https://docs.google.com/forms/d/e/1FAIpQLSdpwym8lpH6ANd2c4gRJdH9VhrftyJheFPL_4mAjyoFzAFPZA/viewform?chromeless=1';

  const STYLES = `
  <style>
    iframe {
      width: 100%;
      height: 2100px;
      border: none;
    }
  </style>`;

  const createTemplate = (link) => {
    const template = document.createElement('template');
    template.innerHTML = `
      ${STYLES}
      <div>
        <iframe id="iframe" src="${link}" title="Formulario de Opinión"></iframe>
      </div>
    `;
    return template;
  };

  class FeedbackWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      console.debug('FeedbackWidget');
    }

    static get observedAttributes() {
      return ['params'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'params' && oldValue !== newValue) {
        const paramsAttribute = JSON.parse(this.getAttribute('params') || '{}');
        console.debug('FeedbackWidget attributeChangedCallback', paramsAttribute);
        this.render(paramsAttribute);
      }
    }

    render({defParams}) {
      console.debug('FeedbackWidget render', defParams);
      const link = defParams?.link || LINK;

      // Lógica de inicialización del componente
      const template = createTemplate(link);
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

  }

  // Define el feedback-widget
  customElements.define('feedback-widget', FeedbackWidget);

  class FeedbackBanner extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      console.debug('FeedbackBanner');
    }

    static get observedAttributes() {
      return ['params'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'params' && oldValue !== newValue) {
        const paramsAttribute = JSON.parse(this.getAttribute('params') || '{}');
        console.debug('FeedbackBanner attributeChangedCallback', paramsAttribute);
        this.render(paramsAttribute);
      }
    }

    render({url}) {
      console.debug('FeedbackWidget render', url);
      const absoluteUrl = url;

      const imageUrl = new URL('./done.png', absoluteUrl);

      // Create a container div
      const container = document.createElement('div');
      container.setAttribute('class', 'banner');
  
      // Style the container
      const style = document.createElement('style');
      style.textContent = `
        .banner {
          width: 100%;
          height: 100px; /* Especifica la altura */
          margin-top: -20px;
          background-image: url(${imageUrl});
          background-size: auto 100%; /* Ajusta la altura */
          background-repeat: no-repeat;
          background-position: left; /* Muestra el lado izquierdo */
          cursor: pointer; /* Cambia el cursor a clickeable */
        }
      `;
  
      // Add click event listener
      container.addEventListener('click', () => {
        window.location.href = '/home/web-components/feedback-widget';
      });
  
      // Attach elements to shadow DOM
      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(container);
    }
  }

  customElements.define('feedback-banner', FeedbackBanner);

})(window.customElements);
