const languageCodeMap = {
    cpp: 54,
    python: 92,
    javascript: 93,
    java: 91,
}

async function getSubmission(tokenId, callback){
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '440bbe848fmsh931117c7177c7bep1920a8jsne4625a2d5251',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
        }
    };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            callback({apiStatus: 'error', message: JSON.stringify(error)})
        }
}

export async function makeSubmission({code, language, callback, stdin}){
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
    const httpOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '440bbe848fmsh931117c7177c7bep1920a8jsne4625a2d5251',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language_id: languageCodeMap[language],
            source_code: btoa(code),
            stdin: btoa(stdin)
        })
    }

    /*
    apiStatus - 'loading' | 'error' | 'success',
    data: response,
    message: 'Runtime error' | 'Compilation error'
    */

    try{
        callback({apiStatus: 'loading'})
        const response = await fetch(url, httpOptions);
        const result = await response.json();
        const tokenId = result.token;
        let statusCode = 1;
        let apiSubmissionResult;
        while(statusCode === 1 || statusCode === 2){
            try{
                apiSubmissionResult = await getSubmission(tokenId);
                statusCode = apiSubmissionResult.status.id;
            }
            catch(error){
                callback({apiStatus: 'error', message: JSON.stringify(error)})
                return;
            }
        }

        if(apiSubmissionResult){
            callback({apiStatus: 'success', data: apiSubmissionResult})
        }

    }
    catch(error){
        callback({
            apiStatus: 'error',
            message: JSON.stringify(error)
        })
    }
}