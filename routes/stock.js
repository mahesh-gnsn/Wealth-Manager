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

        // req.query.symbol = "00D"; //change this to one send from ui

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
        // req.query.symbol = "00D"; //change this to one send from ui
        req.userId = "101" //logged in user need to replace with token
        //const stockData = new Stocks(req.body);
        // let stockData = await Stocks.findOne({ symbol: req.body.symbol, userId: req.userId }).exec();
        // stockData = new Stocks(req.body);
        //const data = await Stocks.findOne({ symbol: req.body.symbol, userId: req.body.userId }, { $set: stockData }, { new: true, upsert: false, useFindAndModify: false }).exec();
        const stockData = new Stocks(req.body);
        // const stockData = await StockWatchlist.findOne({ symbol: req.body.symbol, userId: req.userId }).exec();
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
        // req.query.symbol = "00D"; //change this to one send from ui
        req.userId = "101" //logged in user need to replace with token
        var marketPrice = "1500" //Need to be logged from yahoo
        var sum = "2500" //Need to be calculated against live market price
        // const liveData = await getStockDetails(req.query.symbol);

        //let stockData = await Stocks.findOne({ _id: }).exec();
        const stockData = await Stocks.findById(req.params.id).exec();
        if (stockData) {
            stockData.qty = req.body.qty;
            stockData.priceBought = req.body.priceBought;
            stockData.marketPrice = marketPrice;
            stockData.sum = sum;
            //stockData.userId=req.userId;
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
        // req.query.symbol = "00D"; //change this to one send from ui
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

// /**
//  * Get all stocks added by the user
//  */
// router.get('/myStocks', async (req, res) => {
//     try {
//         req.userId = "1234567" //logged in user need to replace with token

//         let limit = 25, skip = 0;
//         if (req.query.limit && parseInt(req.query.limit) > 0) {
//             limit = parseInt(req.query.limit);
//         }
//         if (req.query.pageNumber && parseInt(req.query.pageNumber) > 0) {
//             skip = parseInt(req.query.pageNumber) * limit;
//         }
//         if (req.query.userId) { userId = req.query.userId; }
  
//         const data = await Stocks.find({ userId: userId, isDeleted: false }).sort({ modifiedDate: -1 }).limit(limit).skip(skip).exec();
//         const myTotalStocks = await Stocks.countDocuments({ userId: userId, isDeleted: false }).exec();
//         if (data) {
//             res.status(200).json({
//                 success: true,
//                 data: data,
//                 meta: {
//                     moreData: myTotalStocks > skip + limit ? true : false,
//                     items: data.length,
//                     totalItems: myTotalStocks
//                 }
//             });
//         } else {
//             logger.debug("No stocks found");
//             logger.debug(data);
//             res.status(404).json(createErrorResp("StocksNotFound", "Stock could not be found"));
//         }
  
//     } catch (exception) {
//         logger.error(exception);
//         res.status(500).json(createErrorResp("StockNotFound", exception.message));
//     }
//   });
  

async function getStockDetails(symbol) {

    // req.query.symbol = "00D"; //change this to one send from ui

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
        //console.log(response.data);
        // return {
        //     marketPrice: response.data.regularMarketPrice
        // };
        return response.data;
        // console.log("ghjghghghgh" + marketPrice);
    }).catch(function (error) {
        console.error(error);
    });
    return;
}
module.exports = router;