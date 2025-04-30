const admin = require('firebase-admin');
const serviceAccount = require('../../globe-920d8-firebase-adminsdk-o27d5-a3671dc82b.json'); // downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;