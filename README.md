# news-scraper

### A nutrition news-scraper web app

Run Application: [Launch news-scraper ](https://.us.herokuapp.com/)

**Features**
* Scrape new articles from Medical News Today - nutrition
* Save and remove scraped articles
* Save and remove notes for any scraped article
* Search scraped article titles by word

**Technologies Used**
* jQuery
* JavaScript
* Node.js
* Express, Express-Handlebars
* Mongoose
* Cheerio
* Axios
* Model View Controller (MVC) design pattern
* RESTful API design

**Problems to Solve**
* Dynamically present content to user
* Allow user to interact with content (save/remove/comment)
* Securely and reliably store data, with scalability in mind
* Design for separation of concerns to improve maintainability/expandability of code
* Deploy full-stack project for others to use

**Solutions**
* Apply Express-handlebars templating to dynamically update user's display
* Use Mongoose for noSQL database
* Combine Mongoose, Express and AJAX for routing and CRUD operations
* Follow Model View Controller (MVC) design pattern
* Deploy project using Heroku

**Setup to run application on your system**
* Node.js must be installed on your system
* Clone the news-scraper repo into a dirctory on your system
* From command line, while in that directory key:
```
 npm install
```
* Then, key:
 ```
 node server.js
  ```
* in browser, navigate to "http://localhost:3000", you should see the news-scraper application
![Home Page](public/images/newsScraper_main.jpg)

**To use news-scaper**
* To populate the database with nutrition articles from Medical News Today, click "Scrape Articles" menu option
  * when scrape is complete, user will see list of articles, sorted by date
  * from this list, user may save an article, add/remove notes, remove article from saved status
* To view ONLY saved articles, click the "Saved Articles" menu option
  * from this l ist the use


**Resource Contributors**
* Home page background image: [Unsplash: Apples by Holly Mindrup](https://unsplash.com/photos/-uPDkAK6f8A)

**Future Enhancement Ideas**
* Improve UI so all text displays with the same width
* Add Progress bar when scraping articles so user knows the application is working
* Expand "search" options
* In production - may remove the Clear Database option OR add "are you sure" option
* Sort "Saved Articles" by date to match "Scrape Articles" sort

