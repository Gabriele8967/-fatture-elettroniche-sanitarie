exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { path, method = 'GET', body, token } = JSON.parse(event.body || '{}');

        if (!path || !token) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Missing required parameters: path and token' 
                })
            };
        }

        const apiBaseUrl = process.env.FATTURE_API_BASE_URL;
        if (!apiBaseUrl) {
            return {
                statusCode: 500,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'API base URL not configured' 
                })
            };
        }

        const url = `${apiBaseUrl}${path}`;
        const fetchOptions = {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }

        console.log(`Making API call to: ${url}`);
        
        const response = await fetch(url, fetchOptions);
        const responseData = await response.json();
        
        // Log the response for debugging
        console.log(`API Response Status: ${response.status}`);
        console.log(`API Response Data:`, JSON.stringify(responseData, null, 2));

        return {
            statusCode: response.status,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(responseData)
        };

    } catch (error) {
        console.error('API proxy error:', error);
        
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message 
            })
        };
    }
};