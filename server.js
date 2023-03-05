import express from 'express'
import cors from 'cors'
import api from 'api'
import https from 'https'

const app = express();

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// catch 400
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(400).send(`Error: ${res.originUrl} not found`)
  next()
})

// catch 500
app.use((err, req, res, next) => {
  console.log(err.stack)
  res.status(500).send(`Error: ${err}`)
  next()
})

// CORS
const corsOptions = {
  origin: ['https://blog.daviddiener.de'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.get('/servers', (req, res) => {
    const sdk = api('@render-api/v1.0#1bmwdfld2bezs7');
    sdk.auth(process.env.RENDER_TOKEN);
    sdk.getServices({limit: '20'})
    .then(({ data }) => {
        console.log(JSON.parse(data))
        const myServers = []
        JSON.parse(data).forEach(element => {
            myServers.push({
                name: element['service']['name'],
                suspended: element['service']['suspended'],
                updatedAt: element['service']['updatedAt']
            })
        });
        res.json(myServers)
    })
    .catch(err => res.send(err));
});

//  ************ Spin up ********************
const port = process.env.PORT || '3000'
app.listen(port)

console.log(`Listening on port ${port}`)