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
            data: data.data,
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

        var options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
            params: { region: 'DE', symbols: req.query.symbol + ".F", exchange: 'EUR' },
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
 * Add new stock
 */
router.post('/add', async (req, res) => {
    try {
        req.userId = "101" //logged in user need to replace with token
        const stockData = new Stocks(req.body);
        data = await stockData.save();
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

/**
 * Edit stock 
 */
router.patch('/edit/:id', async (req, res) => {
    try {
        req.userId = "101" //logged in user need to replace with token
        var marketPrice = "1500" //Need to be logged from yahoo
        var sum = "2500" //Need to be calculated against live market price

        //let stockData = await Stocks.findOne({ _id: }).exec();
        const stockData = await Stocks.findById(req.params.id).exec();
        if (stockData) {
            stockData.qty= req.body.qty;
            stockData.priceBought = req.body.priceBought;
            stockData.marketPrice = marketPrice;
            stockData.sum = sum; 
        }
        const data = await Stocks.findOneAndUpdate({ _id: req.params.id }, { $set: stockData }, { new: true, upsert: false, useFindAndModify: false }).exec();
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

/**
 * Add new stock to watchlist
 */
router.post('/addWatchList', async (req, res) => {
    try {
        req.userId = "101" //logged in user need to replace with token
        const stockData = new StockWatchlist(req.body);
        data = await stockData.save();
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

/**
 * Chart for stock
 */
router.get('/chart', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token

        req.query.symbol = "013A"; //change this to one send from ui

        var options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart',
            params: {
                "interval": req.query.interval,
                "symbol": req.query.symbol + ".F",
                "range": req.query.range,
                "region": "DE"
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