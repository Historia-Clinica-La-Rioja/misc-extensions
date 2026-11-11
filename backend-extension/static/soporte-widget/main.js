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

        // Obtiene el JWT activo que HSI guarda en el navegador
        getHsiJwt() {
            const keys = ['token', 'access_token', 'jwt', 'auth_token'];
            for (const k of keys) {
                const val = localStorage.getItem(k) || sessionStorage.getItem(k);
                if (val) {
                    return val.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim();
                }
            }
            return '';
        }

        // Busca el username real en HSI usando la sesión activa del navegador
        async resolveRealUsername(personId, hsiJwt) {
            // 1. Intento por endpoint /backoffice/users (y variante con /api)
            const userUrls = [
                `/backoffice/users?page=0&size=25&sort=id,DESC&personId=${personId}`,
                `/api/backoffice/users?page=0&size=25&sort=id,DESC&personId=${personId}`
            ];

            for (const url of userUrls) {
                try {
                    const headers = { 'Accept': 'application/json' };
                    if (hsiJwt) headers['Authorization'] = `Bearer ${hsiJwt}`;
                    const res = await fetch(url, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        if (data && Array.isArray(data.content) && data.content.length > 0 && data.content[0].username) {
                            return data.content[0].username;
                        }
                    }
                } catch (e) {}
            }

            // 2. Intento por /auth/public-user y /public-api/user/info/from-token si hay JWT
            if (hsiJwt) {
                const tokenUrls = [
                    `/api/auth/public-user?token=${encodeURIComponent(hsiJwt)}`,
                    `/auth/public-user?token=${encodeURIComponent(hsiJwt)}`,
                    `/api/public-api/user/info/from-token?user-token=${encodeURIComponent(hsiJwt)}`,
                    `/public-api/user/info/from-token?user-token=${encodeURIComponent(hsiJwt)}`
                ];

                for (const url of tokenUrls) {
                    try {
                        const res = await fetch(url, {
                            headers: {
                                'Accept': 'application/json',
                                'token': hsiJwt,
                                'user-token': hsiJwt
                            }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            if (data && data.username) {
                                return data.username;
                            }
                        }
                    } catch (e) {}
                }

                // 3. Respaldo: leer el username/sub directamente del payload del JWT de HSI
                try {
                    const parts = hsiJwt.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                        if (payload.username) return payload.username;
                        if (payload.sub && isNaN(payload.sub)) return payload.sub;
                    }
                } catch (e) {}
            }

            return '';
        }

        connectedCallback() {
            this.shadowRoot.innerHTML = `
                ${STYLES}
                <a href="#" class="link-button">Ingresar a Soporte</a>
            `;

            this.shadowRoot.querySelector('.link-button').addEventListener('click', async (e) => {
                e.preventDefault();

                try {
                    const response = await fetch('/api/account/info');
                    if (!response.ok) throw new Error("Sin sesión");
                    const data = await response.json();

                    const hsiJwt = this.getHsiJwt();
                    const realUsername = await this.resolveRealUsername(data.id, hsiJwt);

                    // Armamos el JSON inyectando el username real y el JWT de HSI para Go
                    const payload = {
                        ...data,
                        username: realUsername || data.username || '',
                        token: hsiJwt
                    };

                    const jsonStr = JSON.stringify(payload);
                    const utf8Str = unescape(encodeURIComponent(jsonStr));
                    const base64Payload = window.btoa(utf8Str);

                    const safePayload = encodeURIComponent(base64Payload);
                    const ssoUrl = `http://128.201.239.37:8083/sso-redirect?token=${safePayload}`;

                    window.open(ssoUrl, '_blank', 'noopener,noreferrer');
                } catch (err) {
                    alert("No pudimos detectar tu sesión en HSI. Por favor, volvé a iniciar sesión.");
                }
            });
        }
    }

    customElements.define('ticket-button-widget', TicketButtonWidget);

})(window.customElements);