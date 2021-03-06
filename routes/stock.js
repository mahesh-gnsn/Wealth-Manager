const express = require('express');
const router = express.Router();
const Stocks = require('../model/Stock');
var axios = require("axios").default;
const StockWatchlist = require('../model/Stock-watchlist');
const StockSell = require('../model/Stock-sell');
const Tickers = require('../model/Tickers');


/**
 * Save all stocks to DB
 */

router.post('/savetickers', async (req, res) => {

    try {

        let deleteTickers = await Tickers.deleteMany();

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
            return response.data.data;
        }).catch(function (error) {
            console.error(error);
        });

        let stocks = data.map((item) => {
            return { name: item.name, symbol: item.symbol };
        });


        let tickerData = await Tickers.insertMany(stocks);


        res.status(201).json({
            success: true,
            data: tickerData,
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
 * Get all saved stock list 
 */


router.get('/allStocks', async (req, res) => {
    try {


        let limit = 5, skip = 0;
        if (req.query.limit && parseInt(req.query.limit) > 0) {
            limit = parseInt(req.query.limit);
        }

        if (req.query.pageNumber && parseInt(req.query.pageNumber) > 0) {
            skip = parseInt(req.query.pageNumber) * limit;
        }

        let searchQuery = req.query.search;
        let searchCriteria = {};
        if (searchQuery) {
            searchCriteria['name'] = new RegExp(searchQuery, 'i');
        }

        const tickerData = await Tickers.find(searchCriteria).limit(limit).skip(skip).exec();

        let stockSymbols = tickerData.map((item) => {
            return item.symbol + '.F';
        });

        stockSymbols = stockSymbols.toString();

        var options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
            params: { region: 'DE', symbols: stockSymbols, exchange: 'FRA' },
            headers: {
                'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };


        let data = await axios.request(options).then(function (response) {
            return response.data.quoteResponse.result;
        }).catch(function (error) {
            console.error(error);
        });

        let returnData = data.map((item) => {
            return {
                "name": item.longName,
                "symbol": item.name,
                "price": item.regularMarketPrice,
                "changePercent": item.regularMarketChangePercent
            };
        });


        res.status(201).json({
            success: true,
            data: returnData,
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
 * Stocks home page/ landing page
 */
router.get('/home', async (req, res) => {
    try {
        //UUU.F,4BSB.F,VSC.F,ACWN.F,ARL.F,A4Y.F,APM.F,ADS.F,ADJ.F

        req.userId = "1234567" //logged in user need to replace with token

        let stockData = await Stocks.find({ userId: req.userId }).exec();


        let stockSymbols = stockData.map((item) => {
            return item.symbol;
        });

        stockSymbols = stockSymbols.toString();

        var options = {
            method: 'GET',
            url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
            params: { region: 'DE', symbols: stockSymbols, exchange: 'FRA' },
            headers: {
                'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
                'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
            }
        };


        let data = await axios.request(options).then(function (response) {
            return response.data.quoteResponse.result;
        }).catch(function (error) {
            console.error(error);
        });



        for (var i = 0; i < stockData.length; i++) {
            var arrFound = data.filter(it => it.symbol === stockData[i].symbol);
            stockData[i].marketPrice = arrFound[0].regularMarketPrice;
        }

        let myStocks = stockData.map((element) => {
            return {
                "name": element.name,
                "symbol": element.symbol,
                "priceBought": element.priceBought,
                "qty": element.qty,
                "marketPrice": data.filter(it => it.symbol === element.symbol)[0].regularMarketPrice,
                "totalValue": data.filter(it => it.symbol === element.symbol)[0].regularMarketPrice * element.qty,
                "gv": data.filter(it => it.symbol === element.symbol)[0].regularMarketPrice * element.qty - element.qty * element.priceBought,
                "allocation": '',
                "dailyChange": '0'
            }
        });

        var total = 0;
        var totalQty = 0;

        stockData.map(function (x) { totalQty += x.qty })

        for (i = 0; i < myStocks.length; i++) {
            total += myStocks[i].totalValue;
            myStocks[i].allocation = myStocks[i].qty / totalQty * 100;
        }


        res.status(200).json({
            success: true,
            data: myStocks,
            meta: { "portfolioValue": total }
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
 * Get all stock list
 */
router.get('/allStocksold', async (req, res) => {
    try {

        req.userId = "101" //logged in user need to replace with token      
        var options = {
            method: 'GET',
            url: 'https://yahoofinance-stocks1.p.rapidapi.com/companies/list-by-exchange',
            params: { "ExchangeCode": "FSX", "format": "json" },
            headers: {
                "x-rapidapi-key": "cf5ed64704msh414b72946343cacp12a336jsn0286afa218ba",
                "x-rapidapi-host": "yahoofinance-stocks1.p.rapidapi.com",
                "useQueryString": true
            }
        };

        let data = await axios.request(options).then(function (response) {
            //console.log(response.data);
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
            params: { region: 'DE', symbols: req.query.symbol + ".F", exchange: 'XRA' },
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
            stockData.qty = req.body.qty;
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

        // req.query.symbol = "00D"; //change this to one send from ui

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

/**
 *  Delete Stock by ID
 */
router.delete('/:id', async (req, res) => {
    try {

        const data = await Stocks.findOneAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true, modifiedDate: Date.now() } }, { new: true, upsert: false, useFindAndModify: false }).exec();
        if (data) {
            res.status(200).json({
                success: true,
                data: data
            });
        } else {
            logger.debug("Stock not found in DB");
            res.status(404).json(createErrorResp("StockNotFound", "Stock could not be found"));
        }

    } catch (exception) {
        logger.error(exception);
        res.status(500).json(createErrorResp("StockNotFound", exception.message));
    }
});

/**
 * Get stock-watchlist data listing details 
 */
router.get('/stockWatchlist/listing', async (req, res) => {
    try {

        req.userId = "1234567" //logged in user need to replace with token      

        let stockData = await StockWatchlist.find({ userId: req.userId }).exec();

        const stockWatchListing = [];
        const stockWatchChart = [];
        const stockBigChart = [];
        for (let j = 0; j < stockData.length; j++) {
            const symbol = stockData[j].get('symbol');
            console.log("4545454545454545" + symbol);
            const options = {
                method: 'GET',
                url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart',
                params: {
                    "interval": req.query.interval,
                    "symbol": symbol + ".F",
                    "range": req.query.range,
                    "region": "DE"
                },
                headers: {
                    'x-rapidapi-key': 'cf5ed64704msh414b72946343cacp12a336jsn0286afa218ba',
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
                }
            };
            let data = await axios.request(options).then(function (response) {
                stockWatchChart.push({
                    timestamp: response.data.chart.result[0].timestamp,
                    priceRange: response.data.chart.result[0].indicators.quote[0].high,
                    symbol: response.data.chart.result[0].meta.symbol
                });

                // let array = response.data.chart.result[0].indicators.quote[0].high
                // stockBigChart.push({
                //     timestamp: response.data.chart.result[0].timestamp,
                //     priceRange: response.data.chart.result[0].indicators.quote[0].high[0],
                //     symbol: response.data.chart.result[0].meta.symbol
                // });
            }).catch(function (error) {
                console.error(error);
            });         



            const options1 = {
                method: 'GET',
                url: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes',
                params: { region: 'DE', symbols: symbol + ".F", exchange: 'XRA' },
                headers: {
                    'x-rapidapi-key': 'a1132eddecmsh03305a8dc157bfdp1438cbjsn24afae5eb725',
                    'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
                }
            };


            data = await axios.request(options1).then(function (response) {
                console.log(response.data);
                stockWatchListing.push({
                    symbol: response.data.quoteResponse.result[0].symbol,
                    stockName: response.data.quoteResponse.result[0].longName,
                    percentage: response.data.quoteResponse.result[0].regularMarketChangePercent,
                    marketPrice: response.data.quoteResponse.result[0].regularMarketPrice,
                });
            }).catch(function (error) {
                console.error(error);
            });

        }

        // let total = 0;

        // for (i = 0; i < stockWatchChart.length; i++) {
        //     if(stockWatchChart[i].priceRange)
        //     total += stockWatchChart[i].priceRange;
        //     // if(stockWatchChart[i].priceRange)
        //     // console.log(stockWatchChart[i].priceRange);
        // }

        // console.log('my total : '+total+';');

        res.status(200).json({
            success: true,
            symbol: stockData.symbol,
            stockWatchChart: stockWatchChart,
            stockWatchListing: stockWatchListing
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
 *  SELL Event by ID
 */
/**
 * Map private user to company employee
 */
 router.post('/:id/sell', async (req, res) => {
    try {
        let stockReqObject = {
            modifiedDate: Date.now(),
            soldDate:Date.now(),
            modifiedBy: req.userId       
        };

        const stockData = await Stock.find({ userId: req.userId }).exec();
        if (stockData) { 
            const stockData = new StockSell(req.body);
            let qty  = stockData.qty;
            if(!req.body.amountSold > qty){
            data = await StockSell.save();
            qty = qty-req.body.amountSold;
            const updatedstockData = await Stocks.findOneAndUpdate({ _id: req.params.id }, { $set: { qty: qty } }, { new: true, upsert: false, useFindAndModify: false }).exec();
            if (updatedCompanyData) {
                logger.debug("Company data updated");
                res.status(200).json({
                    success: true,
                    data: "User added to company as employee",
                    meta: {}
                })
            }
        } else {
            logger.info("User/Company could not be found");
            res.status(404).json(createErrorResp("UserNotFound", "User could not be found"));
        }
    }else{
            logger.info("Stock quantity is not enough");
            res.status(404).json(createErrorResp("QuantityNotEnough", "Stock Quantity Not Enough"));
    }

    } catch (exception) {
        logger.error(exception);
        res.status(500).json(createErrorResp("UserNotAdded", exception.message));
    }
});

module.exports = router;