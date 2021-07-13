const { builder }   = require("@netlify/functions");
const QRCode        = require('qrcode');
const fetch         = require('node-fetch');
const rootURL       = "https://findthat.at";
const pageTemplate  = require('../../includes/page.js');



const handler = async event => {

  // Get the original short URL (without the qr part of the path)
  const path = event.path.replace("/qr/")[1];
  const shortURL = `${rootURL}/${path}`;

  // follow the redirect to get te destination to display
  const destinationURL = await fetch(shortURL);

  // make a QR cade and then return a page displaying it
  return QRCode.toString(shortURL, {'type':'svg'} )
  .then(svg => {
  
    // render the data into the template
    console.log(`ODB render of ${shortURL}`);
    return {
      statusCode: 200,
      body: pageTemplate({
        shortURL : shortURL,
        destinationURL : destinationURL.url,
        svg: escape(svg)
      })
    };
  })
  .catch(err => {
    console.error(err)
  })
};

exports.handler = builder(handler);