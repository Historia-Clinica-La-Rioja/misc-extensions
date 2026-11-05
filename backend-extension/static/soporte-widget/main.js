(function (customElements) {

    const STYLES = `
  <style>
    .link-button {
      display: inline-block;
      padding: 12px 28px;
      margin: 8px;
      font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px;
      font-weight: 400;
      text-align: center;
      text-decoration: none;
      color: #ffffff;
      background-color: #0078D7;
      border: 2px solid #0078D7;
      border-radius: 0;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }
    .link-button:hover {
      background-color: #ffffff;
      color: #0078D7;
    }
  </style>`;

    class TicketButtonWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        async fetchUsernameFromToken() {
            const rawToken = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
            const cleanToken = rawToken.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');

            if (!cleanToken) return null;

            const urls = [
                `/api/public-api/user/info/from-token?user-token=${encodeURIComponent(cleanToken)}`,
                `/public-api/user/info/from-token?user-token=${encodeURIComponent(cleanToken)}`
            ];

            for (const url of urls) {
                try {
                    const res = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'user-token': cleanToken,
                            'Accept': 'application/json'
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data && data.username) {
                            return data.username;
                        }
                    }
                } catch (e) {
            
                }
            }

            try {
                const parts = cleanToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                    if (payload.username) return payload.username;
                }
            } catch (e) {}

            return null;
        }

        connectedCallback() {
            this.shadowRoot.innerHTML = `
                ${STYLES}
                <a href="#" class="link-button">Ingresar a Soporte</a>
            `;

            this.shadowRoot.querySelector('.link-button').addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const [accountRes, tokenUsername] = await Promise.all([
                        fetch('/api/account/info'),
                        this.fetchUsernameFromToken()
                    ]);

                    if (!accountRes.ok) throw new Error("Sin sesión");
                    const accountData = await accountRes.json();

                    const realUsername = tokenUsername || accountData.username || accountData.email;

                    const payloadToEncode = {
                        id: accountData.id,
                        email: accountData.email,
                        username: realUsername,
                        personDto: accountData.personDto
                    };

                    const jsonStr = JSON.stringify(payloadToEncode);
                    const utf8Str = unescape(encodeURIComponent(jsonStr));
                    const base64Payload = window.btoa(utf8Str);

                    const safePayload = encodeURIComponent(base64Payload);
                    const ssoUrl = `http://128.201.239.37:8083/sso-redirect?token=${safePayload}`;

                    window.open(ssoUrl, '_blank', 'noopener,noreferrer');
                } catch (err) {
                    console.error("Error al iniciar SSO:", err);
                    alert("No pudimos detectar tu sesión en HSI. Por favor, volvé a iniciar sesión.");
                }
            });
        }
    }

    customElements.define('ticket-button-widget', TicketButtonWidget);

})(window.customElements);