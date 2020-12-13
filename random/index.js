
const {addresses} = require('../data/addresses1000.json')

// random data 
const randomRange = (min, max) => { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

const enterprises = [
    {
        name: 'Trader Joes',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1589919682/brands/traderjoe_stafql.png'
    },
    {
        name: 'Whole Foods',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1589919584/brands/wholefoods_tutpvs.jpg'
    },
    {
        name: 'Publix',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1589919542/brands/publix_rqqxj6.jpg'
    },
    {
        name: 'Dunkin Donut',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1589645787/brands/dunkin_xszk8w.jpg'
    },
    {
        name: 'Circle K',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1589645782/brands/circlek_gaacr7.jpg'
    },
    {
        name: 'Marriott',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1607716482/brands/marriott_irjajh.png'
    },
    {
        name: 'University of Texas',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1607716488/brands/ut_ltekgv.jpg'
    },
    {
        name: 'YMCA',
        image: 'https://res.cloudinary.com/stratmachine/image/upload/v1607716467/brands/ymca_s2lpun.png'
    },
    {   
        name: 'local'
    }
]

const geography = ['Northeast', 'Midwest', 'South', 'West', 'Chicago Area', 'Los Angeles Area', 'Atlanta Area', 'New York Area', 'Austin Area']

const markets = [
    'Supermarkets',
    'HealthCare',
    'Churches',
    'Sports and Entertainment',
    'Education',
    'Grocery Stores',
    'Department Stores',
    'Restaurants',
    'Specialty Stores',
    'Malls',
    'Hotels',
    'Fitness Centers'
]
const lifemodes = [
                    'Affluent Estates',
                    'Upscale Avenues',
                    'Uptown Individuals',
                    'Family Landscapes',
                    'Gen X Urban',
                    'Cozy Country Living',
                    'Ethnic Enclaves',
                    'Middle Ground',
                    'Senior Styles',
                    'Rustic Outposts',
                    'Midtown Singles',
                    'Hometown',
                    'Next Wave',
                    'Scholars and Patriots' ]
let cnt = 0
const random = () => {   
        let data = {}
        cnt++
        data.lifemode = lifemodes[Math.floor(Math.random() * lifemodes.length)]
        data.geography = geography[Math.floor(Math.random() * geography.length)]
        data.market = markets[Math.floor(Math.random() * markets.length)]
        data.address = addresses[Math.floor(Math.random() * addresses.length)]
        if (cnt % 5) {
            data.enterprise = [{name: 'local'}]
        } else {
            data.enterprise = [enterprises[Math.floor(Math.random() * enterprises.length)]]
        }
        return data     
}
                    
module.exports = {
    random,
    randomRange
}