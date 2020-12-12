
const Mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const {random} = require('../random')
const {randomRange} = require('../random')
const {venue} = require('../data/venue.json')
const { g, b, gr, r, y } =  require('../console')
const url = process.env.ATLAS_URI

let dbName = 'machine'
let db
let cnt = 0
let traffic = 0
Mongo.connect(url, { useUnifiedTopology: true }, ((err, client) => {
  if (err) console.log(r(`Error connecting to MongoDB`))
  db = client.db(dbName)
  console.log(b(`MongoDB is Live`))
}))

const seed = (router) => {
	router.use(async(req, res, next) => {  
    let data = await random()
    console.log(data)
    const cursor = db.collection('markets').find({});
    for await (const doc of cursor) {      
      
      // merge db object and venue template
      let newDoc = {...doc, ...venue}
      console.log(newDoc)
      // update newDoc with random data  
      newDoc.timestamp = Date.now()
      if (data.enterprise[0].name == 'local') {
        newDoc.eid.splice(0, 1, 'local')
        newDoc.image = 'https://placeimg.com/200/200/arch/grayscale'
      } else {
        let name = data.enterprise[0].name
        newDoc.eid.splice(0, 1, name )       
        newDoc.image = data.enterprise[0].image
      }      
      let gid = data.geography
      newDoc.gid.splice(0, 1, gid)
      let lid = data.lifemode
      newDoc.lid.splice(0, 1, lid)

      // custom assign a market
      let ent = newDoc.eid[0]
      switch(ent) {
        case 'Marriot':
          newDoc.mid.splice(0, 1, 'Hotels')
          traffic = randomRange(500, 3500)
          newDoc.attributes.map((a) => {
            if (a.id == 42453) a.weeklyTraffic = traffic
            return a
          })
          break;
        case 'University of Texas':
          newDoc.mid.splice(0, 1, 'Education')
          traffic = randomRange(10000, 30000)
          newDoc.attributes.map((a) => {
            if (a.id == 42453) a.weeklyTraffic = traffic
            return a
          })
          break
        //
        case 'YMCA':
          newDoc.mid.splice(0, 1, 'Fitness Centers')
          traffic = randomRange(8000, 12000)
          newDoc.attributes.map((a) => {
            if (a.id == 42453) a.weeklyTraffic = traffic
            return a
          })
          break;
        case 'local':
          newDoc.mid.splice(0, 1,'Grocery Stores')
          traffic = randomRange(100, 1000)
          newDoc.attributes.map((a) => {
            if (a.id == 42453) a.weeklyTraffic = traffic
            return a
          })
          break
        default:
          newDoc.mid.splice(0, 1,'Supermarkets')
          traffic = randomRange(4000, 15000)
          newDoc.attributes.map((a) => {
            if (a.id == 42453) a.weeklyTraffic = traffic
            return a
          })
          break
      }

      // remove redundant fields      
      delete newDoc.name
      delete newDoc.location
      delete newDoc.category
      delete newDoc.latitude
      delete newDoc.longitude
      delete newDoc.zipcode
      delete newDoc.address
      delete newDoc.dailytraffic
      delete newDoc.description

      // update location and coordinates for mongodb
      newDoc.address = data.address
      let lng = data.address.coordinates.lng
      let lat = data.address.coordinates.lat
      if (newDoc.location) {
        newDoc.location.coordinates.splice(0, 1, lng )
        newDoc.location.coordinates.splice(1, 1, lat )
      } else {
        newDoc.location = {}
        newDoc.location.type = "Point"
        newDoc.location.coordinates = []
        newDoc.location.coordinates.splice(0, 1, lng )
        newDoc.location.coordinates.splice(1, 1, lat )
      }
      
      newDoc.timestamp = Date.now()
      newDoc.created = Date.now()

      console.log(newDoc)
      // update the database with new object
      let objId = newDoc._id
      /*
      let result = await db.collection('markets')
        .updateOne({_id: ObjectId(objId)}, {$set: newDoc})
      console.log(result.modifiedCount) 
      if (result.modifiedCount) {cnt = cnt + 1}
      */
      cursor.close()
      break
      
    }
    let html = `<h2>${cnt} records modified!</h2>`
    res.send(html)   
    next()
  })  
}

module.exports = seed
/*
let data = await seeder()
        let html = `<h2>${data.result.n} records inserted!</h2>`
        res.send(html)
*/
 
  
  
 

  
