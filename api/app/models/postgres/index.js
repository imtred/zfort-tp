const fs = require('fs');
const path = require('path');
const dataSource = require('../../datasources/postgres-datasource');
const basename = path.basename(module.filename);

fs
    .readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
        let model = dataSource.db['import'](path.join(__dirname, file));
        dataSource[model.name] = model;
    });

Object.keys(dataSource).forEach(modelName => {
    if (dataSource[modelName].associate) {
        dataSource[modelName].associate(dataSource);
    }
});

module.exports = dataSource;
