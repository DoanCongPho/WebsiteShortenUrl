import http from 'k6/http'
import {check} from 'k6'

export let options = { 
    vus: 10, 
    duration: '10s', 
}




export default function(){ 
    const shortUrl = "https://website-shorten-url-qryv.vercel.app/84fqg3"; 
    const res = http.get(shortUrl, {redirects: 0}); 


    check(res, { 
        'status is 307': (r) => r.status === 307,
         'has Location header': (r) => r.headers['Location'] !== undefined,
    }); 
}