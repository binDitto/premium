const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// NAME VALIDATIONS
let nameLengthCheck = (name ) => {
    if (!name) { return false; }
    if (name.length < 5 || name.length > 70) {
        return false;
    } else { 
        return true;
    }
};

let alphaNumericNameCheck = (name) => {
    if (!name) { return false; }
    // can include a-z lowercase A-Z uppercase, numbers and spaces
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(name);
};

const nameValidators = [
    { 
        validator: nameLengthCheck,
        message: 'Must be longer than 5 characters and less than 70'
    },
    {
        validator: alphaNumericNameCheck,
        message: 'Must be alphanumeric'
    }
];

// URL VALIDATIONS
let validUrlCheck = (url) => {
    if (!url) { return false; }
    const regExp = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g);
    return regExp.test(url);
};

const urlValidators = [
    {
        validator: validUrlCheck,
        message: 'Must be a valid url'
    }
];

// DESCRIPTION VALIDATIONS
let desLengthCheck = (des) => {
    if (!des) { return false; }
    if (des.length < 10 || des.length > 1000) {
        return false;
    } else { 
        return true;
    }
};

const desValidators = [
    { 
        validator: desLengthCheck,
        message: 'Must be longer than 10 characters and less than 1000'
    }
];

// SCHEMA
const storeSchema = new Schema({
    name: { type: String, required: true, validate: nameValidators }, 
    image_url: { type: String, validate: urlValidators },
    yelp_url: { type: String, validate: urlValidators },
    facebook_url: { type: String, validate: urlValidators },
    phone: { type: String, required: true },
    display_phone: { type: String },
    location: {
        line1: { type: String, required: true },
        line2: { type: String, required: true }
    },
    coordinates: { 
        latitude: { type: Number },
        longitue: { type: Number }
     },
    hours: [
        {   
            order: { type: String },
            day: { type: String },
            open: { type: String },
            close: { type: String } 
        }
    ],
    services_des: { type: String, validate: desValidators },
    aboutus_des: { type: String, validate: desValidators},
    services_provided: [
        {
            title: { type: String, validate: nameValidators },
            description: { type: String, validate: desValidators }
        }
    ],
    policy: [
        {
            for: { type: String, validate: nameValidators},
            description: { type: String, validate: desValidators }
        }
    ],
    payments: [{
        type: { type: String }
    }]

});


module.exports = mongoose.model('StoreInfo', storeSchema);

