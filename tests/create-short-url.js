import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1000,
  duration: '10s',
};

export default function () {
  const url = 'https://website-shorten-url-qryv.vercel.app/shorten'; 
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
