const express = require('express');
const router = express.Router();
const Stocks = require('../model/Stock');
var axios = require("axios").default;
const StockWatchlist = require('../model/Stock-watchlist');

/**
 * Get all stock list
 */
router.get('/allStocks', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token      

        var options = {
            method: 'GET',
            url: 'https://twelve-data1.p.rapidapi.com/stocks',
            params: { "exchange": "XFRA", "format": "json" },
            headers: {
                "x-rapidapi-key": "cf5ed64704msh414b72946343cacp12a336jsn0286afa218ba",
                "x-rapidapi-host": "twelve-data1.p.rapidapi.com",
                "useQueryString": true
            }
        };

        let data = await axios.request(options).then(function (response) {
            console.log(response.data);
            return response.data;
        }).catch(function (error) {
            console.error(error);
        });

        res.status(200).json({
            success: true,
            data: data,
            meta: {}
        });

    } catch (exception) {
        console.error(exception.message);
        res.status(500).json({
            success: false,
            data: exception.message
        });
    }
});

/**
 * Get stock details per stock
 */
router.get('/', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token

        req.query.symbol = "00D"; //change this to one send from ui

        var options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
            params: { region: 'DE', symbols: req.query.symbol+".F", exchange: 'EUR' },
            headers: {
                'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };

        let data = await axios.request(options).then(function (response) {
            console.log(response.data);
            return response.data;
        }).catch(function (error) {
            console.error(error);
        });

        let stockData = await Stocks.find({ userId: req.userId }).exec();

        res.status(200).json({
            success: true,
            data: data,
            meta: {}
        });

    } catch (exception) {
        console.error(exception.message);
        res.status(500).json({
            success: false,
            data: exception.message
        });
    }
});

/**
 * Add and Edit stock 
 */
router.post('/', async (req, res) => {
    try {

        let stockData = await Stocks.findOne({ symbol: req.body.symbol, userId: req.userId }).exec();
        req.userId = "101" //logged in user need to replace with token

        if (stockData) {
            stockData.qty += req.body.qty;
            stockData.priceBought += req.body.priceBought;
        } else {
            stockData = new Stocks(req.body);
        }
        const data = await Stocks.findOneAndUpdate({ symbol: req.body.symbol, userId: req.body.userId }, { $set: stockData }, { new: true, upsert: true, useFindAndModify: false }).exec();
        res.status(201).json({
            success: true,
            data: data,
            meta: {}
        });


    } catch (exception) {
        console.error(exception.message);
        res.status(500).json({
            success: false,
            data: exception.message
        });
    }
});


// /**
//  * Add new stock
//  */
// router.post('/', async (req, res) => {
//     try {
//         const stockData = new Stock(req.body);
//         const stockData = await Stocks.findOne({ symbol: req.body.symbol, userId: req.userId }).exec();

//         const data = await stockData.save();
//         res.status(201).json({
//             success: true,
//             data: data,
//             meta: {}
//         });
//     } catch (exception) {
//         console.error(exception.message);
//         res.status(500).json({
//             success: false,
//             data: exception.message
//         });
//     }
// });




// /**
//  * Add to watchlist
//  */
// router.post('/', async (req, res) => {
//     try {

//         req.userId = "101" //logged in user need to replace with token

//         const stockData = new StockWatchlist(req.body);
//         const stockData = await StockWatchlist.findOne({ symbol: req.body.symbol, userId: req.userId }).exec();

//         const data = await stockData.save();
//         res.status(201).json({
//             success: true,
//             data: data,
//             meta: {}
//         });


//     } catch (exception) {
//         console.error(exception.message);
//         res.status(500).json({
//             success: false,
//             data: exception.message
//         });
//     }
// });


/**
 * Chart for stock
 */
router.get('/', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token

        req.query.symbol = "DRI.F"; //change this to one send from ui

        var options = {
            method: 'GET',
            url: '"https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart',
            params: {
                "interval": "5m",
                "symbol": "AMRN",
                "range": "1d",
                "region": "US"
            },
            headers: {
                'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };

        let data = await axios.request(options).then(function (response) {
            console.log(response.data);
            return response.data;
        }).catch(function (error) {
            console.error(error);
        });

        //let stockData=await Stocks.find({userId:req.userId}).exec();

        res.status(201).json({
            success: true,
            data: data,
            meta: {}
        });

    } catch (exception) {
        console.error(exception.message);
        res.status(500).json({
            success: false,
            data: exception.message
        });
    }
});


module.exports = router;