(() => {
  async function request(path, options = {}) {
    const response = await fetch(path, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    let payload = {};
    try {
      payload = await response.json();
    } catch (error) {
      // A JSON response is expected from every authentication endpoint.
    }

    if (!response.ok) {
      const error = new Error(payload.message || 'The request could not be completed');
      error.errors = payload.errors || [];
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  async function csrf() {
    const payload = await request('/api/auth/csrf');
    return payload.csrfToken;
  }

  async function authenticatedRequest(path, body) {
    const token = await csrf();
    return request(path, {
      method: 'POST',
      headers: { 'x-csrf-token': token },
      body: JSON.stringify(body),
    });
  }

  window.AuthAPI = { authenticatedRequest, request };
})();
