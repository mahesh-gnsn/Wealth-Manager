const mongoose = require('mongoose');

const tickerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Tickers', tickerSchema);