const config = require('./../config');

/**
 * Dao factory
 * @class DaoFactory
 */
class DaoFactory {
    loadDao(daoName) {
        return require(`./../dao/${config.database.dialect}/${daoName}`);
    }
}

module.exports = new DaoFactory();
