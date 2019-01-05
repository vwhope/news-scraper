# news-scraper

### A news-scraper web app

Run Application: [Launch news-scraper ](https://.us.herokuapp.com/)

**Features**
* Scrape new articles
* Save and remove scraped articles
* Save and remove personal comments for any scraped article

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
* Apply handlebars templating to dynamically update user's display
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

**Resource Contributors**
* Home page background image: [Unsplash](https://unsplash.com/photos/-uPDkAK6f8A)

Photo by Holly Mindrup on Unsplash
<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@hollymindrup?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Holly Mindrup"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-2px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Holly Mindrup</span></a>

**Future Enhancement Ideas**
* Improve User Experience with additional modal windows

