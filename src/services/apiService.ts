const getAuthToken = () => {
    return localStorage.getItem('token');
};

const buildHeaders = (useJsonContentType: boolean = true) => {
    const headers: Record<string, string> = {};
    const token = getAuthToken();

    if (useJsonContentType) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const fallbackBaseUrl =
    typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'http://localhost:8080';
const API_BASE_URL = envBaseUrl || fallbackBaseUrl;
const API_URL = `${API_BASE_URL.replace(/\/$/, '')}/api`;

const parseResponseBody = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return null;
    }
    const text = await response.text();
    if (!text) {
        return null;
    }
    return JSON.parse(text);
};

const apiService = {
    get: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: buildHeaders()
        });
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || (errorData.errors && errorData.errors.map((err: any) => err.defaultMessage).join(', ')) || errorMessage;
            } catch (e) { /* ignore */ }
            throw new Error(errorMessage);
        }
        return await parseResponseBody(response);
    },
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || (errorData.errors && errorData.errors.map((err: any) => err.defaultMessage).join(', ')) || errorMessage;
            } catch (e) { /* ignore */ }
            throw new Error(errorMessage);
        }
        return await parseResponseBody(response);
    },
    put: async (endpoint: string, data: any) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: buildHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || (errorData.errors && errorData.errors.map((err: any) => err.defaultMessage).join(', ')) || errorMessage;
            } catch (e) { /* ignore */ }
            throw new Error(errorMessage);
        }
        return await parseResponseBody(response);
    },
    delete: async (endpoint: string) => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: buildHeaders()
        });
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || (errorData.errors && errorData.errors.map((err: any) => err.defaultMessage).join(', ')) || errorMessage;
            } catch (e) { /* ignore */ }
            throw new Error(errorMessage);
        }
    },
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: buildHeaders(false),
            body: formData
        });

        if (!response.ok) {
            throw new Error('Dosya yüklenirken hata oluştu.');
        }
        
        // Backend direkt string (URL) dönüyor
        return await response.text();
    }
}


export { apiService };
