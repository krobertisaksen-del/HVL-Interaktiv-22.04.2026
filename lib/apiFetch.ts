export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlParams = new URLSearchParams(window.location.search);
  const ltik = urlParams.get('ltik') || sessionStorage.getItem('ltik');
  
  if (ltik) {
    sessionStorage.setItem('ltik', ltik);
    
    // Only intercept requests to our own API
    const resourceUrl = typeof input === 'string' ? input : (input instanceof URL ? input.href : input.url);
    if (resourceUrl.startsWith('/api/')) {
      const newInit = init || {};
      newInit.headers = {
        ...newInit.headers,
        'Authorization': `Bearer ${ltik}`
      };
      return window.fetch(input, newInit);
    }
  }
  return window.fetch(input, init);
};
