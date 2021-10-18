const fs = require('fs');
const path = require('path');
const inflector = require('inflected');
const basename = path.basename(module.filename);

module.exports.addCrudRoutes = function addCrudRoutes(app) {
  const loadRoutes = (rootPath) => {
    fs.readdirSync(rootPath)
      .filter((file) => {
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
        );
      })
      .forEach((file) => {
        let name = file.replace('Routes.js', '');
        const slug = inflector.dasherize(inflector.underscore(name));
        app.use(
          `/api/${slug}`,
          require(path.join(__dirname, '../../app/routes', file))
        );
      });
  };

  // Load Core Routes
  loadRoutes(path.join(__dirname, '../../app/routes'));
};
