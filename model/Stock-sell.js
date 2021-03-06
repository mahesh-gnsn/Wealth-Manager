const mongoose = require('mongoose');

const stockSellSchema = mongoose.Schema({
    amountSold: {
        type: Number,
        required: true
    },
    priceSold: {
        type: Number,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    soldDate: {
        type: Date,
        required: false,
        default: Date.now()
    },
    modifiedDate: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = mongoose.model('StockSell', stockSellSchema);