const languageCodeMap = {
    cpp: 54,
    python: 92,
    javascript: 93,
    java: 91,
}

async function getSubmission(tokenId, callback) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '22a25c39f8msh6fbe8a012808b37p1494d1jsnc64cc04a84a9',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        callback({apiStatus: 'error', message: error.message || 'Failed to get submission status'});
        return null;
    }
}

//stdin za standarden vlez
export async function makeSubmission({code, language, callback, stdin = ''}) {
    if (!code.trim()) {
        callback({
            apiStatus: 'error',
            message: 'Please enter some code before running!'
        });
        return;
    }

    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
    const httpOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '22a25c39f8msh6fbe8a012808b37p1494d1jsnc64cc04a84a9',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language_id: languageCodeMap[language],
            source_code: btoa(code),
            stdin: btoa(stdin || '')
        })
    }

    try {
        callback({apiStatus: 'loading'});
        const response = await fetch(url, httpOptions);
        const result = await response.json();

        if (!result.token) {
            throw new Error('Failed to get submission token');
        }

        const tokenId = result.token;
        let statusCode = 1;
        let apiSubmissionResult;

        while(statusCode === 1 || statusCode === 2) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                apiSubmissionResult = await getSubmission(tokenId, callback);

                if (!apiSubmissionResult) {
                    throw new Error('Failed to get submission result');
                }

                statusCode = apiSubmissionResult.status.id;
            } catch (error) {
                callback({
                    apiStatus: 'error',
                    message: error.message || 'Error checking submission status'
                });
                return;
            }
        }

        if (apiSubmissionResult) {
            if (apiSubmissionResult.compile_output) {
                const decodedError = decodeURIComponent(escape(atob(apiSubmissionResult.compile_output)));
                callback({
                    apiStatus: 'error',
                    message: decodedError
                });
                return;
            }

            if (apiSubmissionResult.stderr) {
                const decodedError = decodeURIComponent(escape(atob(apiSubmissionResult.stderr)));
                callback({
                    apiStatus: 'error',
                    message: decodedError
                });
                return;
            }

            callback({
                apiStatus: 'success',
                data: apiSubmissionResult
            });
        }
    } catch (error) {
        callback({
            apiStatus: 'error',
            message: error.message || 'Failed to make submission'
        });
    }
}