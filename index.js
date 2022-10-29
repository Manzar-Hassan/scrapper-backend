import express from "express";
import webdriver from "selenium-webdriver";
import "chromedriver";

//website url
const url =
  "https://www.pinnacle.it/scommesse/calcio/uefa-champions-league/matchups/";

//importing By for css selectors
const { By } = webdriver;
const PORT = process.env.PORT || 5000;

//initializing the server
const app = express();

//function to receive a get request from client side
app.get("/", async (request, response) => {
  try {
    const data = await scrapeData();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({
      message: "Server error occurred",
    });
  }
});

//function to scrape data from url
async function scrapeData() {
  try {

    //initializing chrome webdriver 
    var driver = new webdriver.Builder().forBrowser("chrome").build()

    //fetching url
    await driver.get(url);

    //synchronizing 
    await driver.manage().setTimeouts({ implicit: 500 });

    //finding the required elements by id
    const requiredData = await driver.findElement(By.id("primo-blocco-sport"));

    //extracting texts from elements
    const value = await requiredData.getText();

    //saving the values in an array
    const data = value.split("\n");

    //quiting the browser after the task completes
    driver.quit();

    //returning the fetched data
    return data;

  } catch (error) {
    throw new Error(error);
  }
}

//starting the server at required port
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
