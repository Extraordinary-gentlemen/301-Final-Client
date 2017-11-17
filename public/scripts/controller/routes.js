'use strict';

page('/', app.pageView.initSetupView);
page('/results', app.pageView.initMapView);
page('/about', app.pageView.initAboutView);


page();

// Set the page.js base if site is deployed on gh-pages
// if(location.hostname === 'but-yeah-book-list.github.io') page.base('/book-list-client');

// This is where we define the client-side routes
// page();
