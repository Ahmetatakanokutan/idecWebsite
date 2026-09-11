import i18n from '../i18n';

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
const normalizedApiBaseUrl = API_BASE_URL.replace(/\/$/, '');
const API_URL = normalizedApiBaseUrl + '/api';

const resolveAssetUrl = (url?: string | null) => {
    if (!url) {
        return '';
    }

    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    if (url.startsWith('/')) {
        return normalizedApiBaseUrl + url;
    }

    return url;
};

// fetch yalnizca sunucuya hic ulasilamadiginda (ag yok, CORS, sunucu kapali) TypeError
// atar; mesaji tarayiciya gore degisen Ingilizce "Failed to fetch" olur ve sayfalar bunu
// oldugu gibi gosteriyordu. Kullaniciya secili dilde anlasilir bir mesaj veriyoruz.
// HTTP hata yanitlari (4xx/5xx) buraya dusmez, onlarin mesaji asagida ayrica uretiliyor.
const safeFetch = async (input: string, init: RequestInit) => {
    try {
        return await fetch(input, init);
    } catch {
        throw new Error(i18n.t('common.network_error'));
    }
};

/** HTTP hata yaniti. `status` ile kod bazli karar verilebilir (orn. giris sayfasi 401'e bakar). */
export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

const statusMessage = (status: number) => {
    if (status >= 500) return i18n.t('common.server_error');
    switch (status) {
        case 401: return i18n.t('common.unauthorized');
        case 403: return i18n.t('common.forbidden');
        case 404: return i18n.t('common.not_found_error');
        case 413: return i18n.t('common.file_too_large');
        case 429: return i18n.t('common.too_many_requests');
        default: return i18n.t('common.error');
    }
};

// Eskiden backend mesaj gondermezse kullaniciya "HTTP error! status: 500" gidiyordu.
// - 4xx: backend'in aciklamasi (dogrulama hatasi vb.) varsa o, yoksa secili dilde hazir mesaj.
// - 5xx: backend'in mesaji ic hata detayi olabilir (SQL, dosya yolu); kullaniciya hep genel mesaj.
const throwApiError = async (response: Response): Promise<never> => {
    let backendMessage = '';
    try {
        const errorData = await response.json();
        backendMessage = errorData.message || (errorData.errors && errorData.errors.map((err: any) => err.defaultMessage).join(', ')) || '';
    } catch { /* govde JSON degil */ }

    const message = response.status < 500 && backendMessage ? backendMessage : statusMessage(response.status);
    throw new ApiError(message, response.status);
};

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
        const response = await safeFetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: buildHeaders()
        });
        if (!response.ok) {
            await throwApiError(response);
        }
        return await parseResponseBody(response);
    },
    post: async (endpoint: string, data: any) => {
        const response = await safeFetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: buildHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            await throwApiError(response);
        }
        return await parseResponseBody(response);
    },
    put: async (endpoint: string, data: any) => {
        const response = await safeFetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: buildHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            await throwApiError(response);
        }
        return await parseResponseBody(response);
    },
    delete: async (endpoint: string) => {
        const response = await safeFetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: buildHeaders()
        });
        if (!response.ok) {
            await throwApiError(response);
        }
    },
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await safeFetch(`${API_URL}/upload`, {
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
};

const progressService = {
    recordWatch: (lessonId: number, courseId: number) =>
        apiService.post(`/progress/lesson/${lessonId}/watch`, { courseId }),

    markComplete: (lessonId: number, courseId: number) =>
        apiService.post(`/progress/lesson/${lessonId}/complete`, { courseId }),

    getCourseProgress: (courseId: number) =>
        apiService.get(`/progress/course/${courseId}`),

    getSummary: () =>
        apiService.get('/progress/summary'),
};

const seminarCertificateService = {
    list: (q?: string) =>
        apiService.get(`/seminar-certificates${q ? `?q=${encodeURIComponent(q)}` : ''}`),

    upload: async (file: File, fullName: string) => {
        const formData = new FormData();
        formData.append('file', file);
        if (fullName) {
            formData.append('fullName', fullName);
        }

        const response = await safeFetch(`${API_URL}/seminar-certificates`, {
            method: 'POST',
            headers: buildHeaders(false),
            body: formData
        });

        if (!response.ok) {
            let errorMessage = 'Sertifika yüklenirken hata oluştu.';
            try {
                errorMessage = await response.text() || errorMessage;
            } catch (e) { /* ignore */ }
            throw new Error(errorMessage);
        }

        return await parseResponseBody(response);
    },

    remove: (id: number) =>
        apiService.delete(`/seminar-certificates/${id}`),
};

export { apiService, resolveAssetUrl, progressService, seminarCertificateService };
