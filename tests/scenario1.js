import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1000,
  duration: '10s',
};



let index = 0; 
const ports = [3000]; 

function getNextPort(){ 
  const port = ports[index]; 
  index = (index+1)%ports.length; 
  return port; 
}


export default function () {
  const  port = getNextPort(); 
  const url = `http://localhost:${port}/api/shorten`; 
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
