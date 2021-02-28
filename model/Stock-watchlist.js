const mongoose = require('mongoose');

const stockWatchlistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    marketPrice: {
        type: Number,
        required: false
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

module.exports = mongoose.model('StockWatchlist', stockWatchlistSchema);