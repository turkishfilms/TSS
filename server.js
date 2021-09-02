/*



*/
const express = require('express'),
    cors = require('cors'),
    app = express(),
    p = 3008

app.use(cors())
app.use(express.static('public'))
app.listen(p, () => console.log(`Look to the Beyond, Look to port ${p}.`))