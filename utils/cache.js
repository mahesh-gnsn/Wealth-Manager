const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-ioredis');
const { Logger } = require('./logger');
const logger = new Logger(process.env.logLevel);

let cacheClient = cacheManager.caching({
    store: redisStore,
    host: process.env.CACHE_ENDPOINT,
    port: process.env.CACHE_PORT,
    db: 0,
    ttl: 300
});
const redisClient = cacheClient.store.getClient();
redisClient.on('connect', () => {
    logger.debug("REDIS:CONNECTED");
});
redisClient.on('error', (error) => {
    logger.debug("REDIS:ERROR");
    logger.error(error);
});

async function deleteItem(key) {
    try {
        logger.debug(`Deleting item from cache with key: ${key}`);
        await cacheClient.del(key);
        return true;
    } catch (exception) {
        logger.error(exception);
        return false;
    }
}

async function getItem(key) {
    try {
        logger.debug(`Getting item from cache with key: ${key}`);
        const valueFromCache = await cacheClient.get(key);
        if (valueFromCache) { return valueFromCache; }
        return null;
    } catch (exception) {
        logger.error(exception);
        return null;
    }
}

async function setItem(key, value) {
    try {
        logger.debug(`Adding item to cache with key: ${key} and value: ${value}`);
        await cacheClient.set(key, value);
        return true;
    } catch (exception) {
        logger.error(exception);
        return false;
    }
}

module.exports.deleteItem = deleteItem;
module.exports.getItem = getItem;
module.exports.setItem = setItem;