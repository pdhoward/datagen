
const Mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const {random} = require('../random')
const {venue} = require('../data/venue.json')
const { g, b, gr, r, y } =  require('../console')
const url = process.env.ATLAS_URI

let dbName = 'machine'
let db
let cnt = 0
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

      /// prep objects
      delete venue.name
      delete venue.location
      delete doc.category
      delete doc.latitude
      delete doc.longitude
      delete doc.zipcode
      delete doc.address
      delete doc.dailytraffic
      delete doc.description
      
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
          newDoc.mid.push('Hotels')
          break;
        case 'University of Texas':
          newDoc.mid.push('Education')
          break
        //
        case 'YMCA':
          newDoc.mid.push('Fitness Centers')
          break;
        case 'local':
          newDoc.mid.push('Grocery Stores')
          break
        default:
          newDoc.mid.push('Supermarkets')
          break
      }

      // update location and coordinates for mongodb
      newDoc.address = data.address
      let lng = data.address.coordinates.lng
      let lat = data.address.coordinates.lat
      newDoc.location.coordinates.splice(0, 1, lng )
      newDoc.location.coordinates.splice(1, 1, lat )
      newDoc.timestamp = Date.now()
      newDoc.created = Date.now()

      console.log(newDoc)
      // update the database with new object
      let objId = newDoc._id
      let result = await db.collection('markets')
        .updateOne({_id: ObjectId(objId)}, {$set: newDoc})
      console.log(result.modifiedCount) 
      if (result.modifiedCount) {cnt = cnt + 1}
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
 
  
  
 

  
