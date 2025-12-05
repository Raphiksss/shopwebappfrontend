const API_BASE_URL = 'http://109.172.114.164:8000';

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Формируем URL для backend API
    const apiPath = url.pathname.replace(/^\/api/, '/api');
    const apiUrl = `${API_BASE_URL}${apiPath}${url.search}`;

    // Копируем headers из оригинального запроса
    const headers = new Headers(request.headers);
    headers.set('Host', new URL(API_BASE_URL).host);

    // Создаем новый запрос к backend API
    const apiRequest = new Request(apiUrl, {
        method: request.method,
        headers: headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
    });

    try {
        // Отправляем запрос к backend
        const response = await fetch(apiRequest);

        // Создаем новый response с CORS headers
        const newResponse = new Response(response.body, response);

        // Добавляем CORS headers
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return newResponse;
    } catch (error) {
        return new Response(JSON.stringify({ error: 'API request failed', message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}