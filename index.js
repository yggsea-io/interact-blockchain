const axios = require('axios');

(async() =>{
    const result  = await axios.get('https://www.tapfantasy.io/game/bsc?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IndlYkFjY291bnRJZCI6MTI1MjI3LCJ3ZWJBY2NvdW50TmFtZSI6ImtpZXVkYWl0aGllbjEifSwiZXhwIjoxNjYzMzAwMzMwLCJpYXQiOjE2NjI2OTU1MzB9.3xMJJfGF-Vv590lw5jvvn5osMqAVlvMqqmidompO3Sg&bcid=56&lang=en')
    console.log(result.request.path)
})()
