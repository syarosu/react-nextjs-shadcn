interface HTTPInstance {
    get<T>(url: string, config?: RequestInit): Promise<T>;
    delete<T>(url: string, config?: RequestInit): Promise<T>;
    head<T>(url: string, config?: RequestInit): Promise<T>;
    options<T>(url: string, config?: RequestInit): Promise<T>;
    post<T>(url: string, data?: unknown, config?: RequestInit): Promise<T>;
    put<T>(url: string, data?: unknown, config?: RequestInit): Promise<T>;
    patch<T>(url: string, data?: unknown, config?: RequestInit): Promise<T>;
}

const baseURL = `${process.env.NEXT_PUBLIC_LOCAL_URL ?? ""}`;
const headers: Record<string, string> = {
    csrf: 'token',
    Referer: baseURL,
};

const request = async <T = unknown>(
    method: string,
    url: string,
    data?: unknown,
    config?: RequestInit
): Promise<T> => {
    try {
        const response = await fetch(baseURL + url, {
            method,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                ...config?.headers,
            },
            credentials: 'include',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData: T = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const get = <T>(url: string, config?: RequestInit): Promise<T> => {
    return request<T>('GET', url, undefined, config);
};

const del = <T>(url: string, config?: RequestInit): Promise<T> => {
    return request<T>('DELETE', url, undefined, config);
};

const head = <T>(url: string, config?: RequestInit): Promise<T> => {
    return request<T>('HEAD', url, undefined, config);
};

const options = <T>(url: string, config?: RequestInit): Promise<T> => {
    return request<T>('OPTIONS', url, undefined, config);
};

const post = <T>(url: string, data?: unknown, config?: RequestInit): Promise<T> => {
    return request<T>('POST', url, data, config);
};

const put = <T>(url: string, data?: unknown, config?: RequestInit): Promise<T> => {
    return request<T>('PUT', url, data, config);
};

const patch = <T>(url: string, data?: unknown, config?: RequestInit): Promise<T> => {
    return request<T>('PATCH', url, data, config);
};

export const http: HTTPInstance = {
    get,
    delete: del,
    head,
    options,
    post,
    put,
    patch,
};