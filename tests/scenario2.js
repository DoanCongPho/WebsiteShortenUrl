import http from 'k6/http'
import { check } from 'k6'

export const options = {
    discardResponseBodies: true,  // ✅ fixed typo
    scenarios: {
        redirect_scenario: {
            executor: 'constant-vus',
            exec: 'redirectUrl',
            duration: '10s',
            vus: 900,
        },
        create_scenario: {
            executor: 'constant-vus',
            exec: 'createShortUrl',
            duration: '10s',
            vus: 100,
        },
    },
};

let index = 0;

const shortUrls = ['f0c32g', 'm4g66l', 'xs4kc6', '5hvi2v', 'c0e9ze', '7q7e2i', '5ykwnt', 'ewwg73', 'kjbhdh', ' 1q9oxz'];

function getNextUrl() {
    const shortUrl = shortUrls[index];
    index = (index + 1) % shortUrls.length;



    return shortUrl;
}

export function createShortUrl() {

    const url = `http://localhost:3000/api/shorten`;
    const payload = JSON.stringify({
        original: 'https://example.com/some/long/url',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    check(res, {
        'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    });

}

export function redirectUrl() {
    const shortUrl = getNextUrl();
    const url = `http://localhost:3000/${shortUrl}`;
    const res = http.get(url, { redirects: 0 });

    check(res, {
        'status is 307': (r) => r.status === 307,
        'has Location header': (r) => r.headers['Location'] !== undefined,
    });
}