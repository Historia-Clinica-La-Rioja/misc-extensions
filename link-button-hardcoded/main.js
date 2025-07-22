class LinkButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const link = this.shadowRoot.querySelector('a');

    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
      link.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });

    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
      link.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });
  }

  render() {
    // Parámetros hardcodeados
    const href = 'https://blog-hsi.nubecenter.com.ar/';
    const text = 'Blog de Historia de Salud Integrada - La Rioja';
    const icon = '🌐';
    const target = '_blank';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #e64141 0%, #a61c1c 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          border: none;
          outline: none;
        }

        a:focus {
          box-shadow: 0 0 0 3px rgba(158,158,158,0.4);
        }

        .icon {
          font-size: 16px;
          line-height: 1;
          display: flex;
          align-items: center;
        }

        .text {
          line-height: 1;
        }

        @media (max-width: 480px) {
          a {
            padding: 10px 16px;
            font-size: 13px;
          }
          
          .icon {
            font-size: 14px;
          }
        }
      </style>
      
      <a href="${href}" target="${target}">
        <span class="icon">${icon}</span>
        <span class="text">${text}</span>
      </a>
    `;
  }
}

customElements.define('link-button', LinkButton);

export default LinkButton;