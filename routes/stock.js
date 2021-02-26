const express = require('express');
const router = express.Router();
const Stocks = require('../model/Stock');
var axios = require("axios").default;
var unirest = require("unirest");


router.get('/', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token

        req.query.symbol="DRI.F"; //change this to one send from ui

        var options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
            params: { region: 'DE', symbols: req.query.symbol, exchange: 'EUR' },
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

        let stockData=await Stocks.find({userId:req.userId}).exec();

        res.status(201).json({
            success: true,
            data: stockData,
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
router.post('/', async (req, res) => {
    try {
        const stockData = new Stock(req.body);
        const data = await stockData.save();
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
 * Update stock 
 */
router.patch('/', async (req, res) => {
    try {

        const stockData = await Stocks.find({ symbol: req.body.symbol, userId: req.userId }).exec();

        if (stockData) {
            stockData.qty += req.body.qty;
            stockData.priceBought += req.body.priceBought;


            const data = await Stocks.findOneAndUpdate({ symbol: req.body.symbol, userId: req.body.userId }, { $set: stockData }, { new: true, upsert: false, useFindAndModify: false }).exec();
            res.status(201).json({
                success: true,
                data: data,
                meta: {}
            });
        }

    } catch (exception) {
        console.error(exception.message);
        res.status(500).json({
            success: false,
            data: exception.message
        });
    }
});


/**
 * Get all stock list
 */
router.get('/allStocks', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token

        //req.query.symbol="DRI.F"; //change this to one send from ui

        var options = {
            method: 'GET',
            url: 'https://yahoofinance-stocks1.p.rapidapi.com/companies/list-by-exchange',
            params: { 'ExchangeCode': 'XFRA' },
            headers: {
                'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
	            'x-rapidapi-host': 'yahoofinance-stocks1.p.rapidapi.com',
	            'useQueryString': true
            }
        };

        let data = await axios.request(options).then(function (response) {
            console.log(response.data);
            return response.data;
        }).catch(function (error) {
            console.error(error);
        });

        let stockData=await Stocks.find({userId:req.userId}).exec();

        res.status(201).json({
            success: true,
            data: stockData,
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