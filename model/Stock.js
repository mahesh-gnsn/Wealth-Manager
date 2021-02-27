const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    priceBought: {
        type: Number,
        required: true
    },
    marketPrice: {
        type: Number,
        required: true
    },    
    sum: {
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    modifiedDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = mongoose.model('Stock', stockSchema);