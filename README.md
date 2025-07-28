- test: 
    cd tests 
    k6 run create_short_url.js 
    k6 run redirect_url.js 

- cron job: 
    auto call delete api to remove the expired record 
    https://console.cron-job.org/jobs

- database: 
    supabase



