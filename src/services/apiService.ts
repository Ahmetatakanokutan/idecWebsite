const getAuthToken = () => {
    return localStorage.getItem('token');
};


const apiService = {
    get: async (endpoint: string) => {
        const response = await fetch(`http://localhost:8080/api${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`http://localhost:8080/api${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`

            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },
    put: async (endpoint: string, data: any) => {
        const response = await fetch(`http://localhost:8080/api${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    },
    delete: async (endpoint: string) => {
        const response = await fetch(`http://localhost:8080/api${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    },
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8080/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
                // Content-Type header'ı FormData kullanırken tarayıcı tarafından otomatik ayarlanır (boundary ile birlikte)
                // Bu yüzden buraya Content-Type eklememeliyiz!
            },
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