import express from 'express'
import cors from 'cors'
import api from 'api'

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
  origin: ['https://daviddiener.de', 'http://localhost:8080'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

app.get('/servers', (req, res) => {
    const sdk = api('@render-api/v1.0#1bmwdfld2bezs7');
    sdk.auth(process.env.RENDER_TOKEN);
    sdk.getServices({limit: '20'})
    .then(({ data: serviceData }) => {        
        const myServers = []
        let counter = 0

        var buildServerList = new Promise((resolve, reject) => {
            serviceData.forEach(element => {
                sdk.getDeploys({limit: '1', serviceId: element['service']['id']})
                .then(({ data: deployData }) => {
                    myServers.push({
                        id: element['service']['id'],
                        status: deployData[0]['deploy']['status'],
                        name: element['service']['name'],
                        suspended: element['service']['suspended'],
                        updatedAt: element['service']['updatedAt'],
                        region: element['service']['serviceDetails']['region'],
                    })

                    // resolve once the last server has their status assigned
                    counter++
                    if (counter === serviceData.length) resolve();
                })
                .catch(err => {
                    console.log('Error ' + err)
                    console.error(err)
                })  
            })
        });

        buildServerList.then(() => res.json(myServers));
    })
    .catch(err => {
        console.log('Error ' + err)
        res.send(err)
    })
});

//  ************ Spin up ********************
const port = process.env.PORT || '3000'
app.listen(port)

console.log(`Listening on port ${port}`)