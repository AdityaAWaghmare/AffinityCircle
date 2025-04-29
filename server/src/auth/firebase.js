const admin = require('firebase-admin');
const serviceAccount = require('../../affinity-circle-firebase-adminsdk-fbsvc-78a65fee55.json'); // downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;