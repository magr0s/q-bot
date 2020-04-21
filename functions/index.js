const functions = require('firebase-functions');
const webhook = require('./src/webhook')

// Create and Deploy Your Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.webhook = functions.https.onRequest(webhook)
