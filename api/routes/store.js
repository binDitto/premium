const express = require('express');
const router = express.Router();

// BRING IN MODEL
const Store = require('.././models/store');

// BUILD API FOR INCOMING REQUESTS TO /storeInfo
router.get('/', (req, res, next) => {
    Store.find({}, (err, storeinfo) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Error pulling in store data', error: err});
        }
        if (!storeinfo) {
            return res.status(400).json({ success: false, message: 'No store info found' });
        }
        return res.status(200).json({ success: true, message: 'Data retrieved successfully', data: storeinfo});
    });
});

router.post('/', (req, res, next) => {
    console.log(req.body.name);
    console.log(req.body.phone);
    console.log(req.body.street);
    console.log(req.body.state);
    console.log(req.body.zipcode);
    if (!req.body.name) {
        return res.status(400).json({
            success: false, message: 'Business name is required'
        });
    }

    if (!req.body.phone) {
        return res.status(400).json({
            success: false, message: 'Business phone number is required'
        });
    }

    // ENOUGH FIELDS FILLED OUT
    const store_info = new Store({
        name: req.body.name,
        image_url: req.body.image_url,
        yelp_url: req.body.yelp_url,
        facebook_url: req.body.facebook_url,
        phone: req.body.phone,
        display_phone: req.body.display_phone,
        location: { 
            line1: req.body.street,
            line2: req.body.city + ', ' + req.body.state + ' ' + req.body.zipcode },
       coordinates: {
           latitude: req.body.latitude,
           longitude: req.body.longitude
       },
       services_des: req.body.servicedes,
       aboutus_des: req.body.aboutus_des
    });

    store_info.save((err, saved_info) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).json({ success: true, message: 'Successfully created store data', data: saved_info });
    });
});

router.post('/hours/new', (req, res, next) => {
    if (!req.body.day) {
        return res.status(400).json({ success: false, message: 'Please choose a day'});
    }
    if (!req.body.open) {
        return res.status(400).json({ success: false, message: 'Please choose a opening time'});
    }
    if (!req.body.close) { 
        return res.status(400).json({ success: false, message: 'Please choose a closing time'});
    }
    const shopname = req.body.name;
    const newdayhours = {
        day: req.body.day,
        open: req.body.open,
        close: req.body.close
    };
    const daysoftheweek = [
        ["sunday", "1"], ["monday", "2"], ["tuesday", "3"], ["wednesday", "4"], ["thursday", "5"], ["friday", "6"], ["saturday", "7"]
    ];
    let onematch = false;

    for ( let i = 0; i < daysoftheweek.length; i++ ){
        if (newdayhours.day === daysoftheweek[i][0]) { 
            onematch = true;
            newdayhours.order = daysoftheweek[i][1];
        } 
    }
    if (onematch === false) {
        return res.status(400).json({ success: false, message: 'Day entered does not match a day of the week' });
    }
    
    Store.findOne({name: shopname}, ( err, storeinfo) => {
        if (storeinfo.hours) {
            for ( let hour of storeinfo.hours ) {
                if ( hour.day === newdayhours.day) {
                    return res.status(400).json({ success: false, message: 'Hours already exist for that day'});
                }
            }
        }
            
        if (storeinfo.hours.length === 7) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Already have hours for 7 days a week"
              });
          }
        storeinfo.hours.push(newdayhours);
        storeinfo.save((err, newstoreinfo ) => {
            if ( err) { 
                console.log(err);
            }
            return res.status(200).json({ success: true, message: `Successfully added hours for ${newdayhours.day}`, data: newstoreinfo.hours});
        });
    });
});

module.exports = router;