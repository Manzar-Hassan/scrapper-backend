import express from "express";
import cors from "cors"
import webdriver from "selenium-webdriver";
import "chromedriver";

//website url
const url =
  "https://www.pinnacle.it/scommesse/calcio/uefa-champions-league/matchups/";

//importing By for css selectors
const { By, Builder } = webdriver;
const PORT = process.env.PORT || 5000;

//initializing the server
const app = express();

app.use(cors())

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
    var driver = new Builder().forBrowser("chrome").build();

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

    //initializing output array
    let outputArrangedData = [];

    //arranging output format
    for (let i = 0; i < data.length; i++) {
      let arrangedData = {
        alias: 0,
        time: "",
        teams: "",
        value: 0,
        bet1: "",
        betx: "",
        bet2: "",
        betx1: "",
        bet12: "",
        x2: "",
        under: "",
        over: "",
        goal: "",
        nogoal: "",
      };

      if (Number(data[i]) > 1000) {
        arrangedData.alias = data[i];
        arrangedData.time = data[i + 1];
        arrangedData.teams = `${data[i + 2]} ${data[i + 3]} ${data[i + 4]}`;
        arrangedData.value = data[i + 5];
        arrangedData.bet1 = data[i + 8];
        arrangedData.betx = data[i + 10];
        arrangedData.bet2 = data[i + 12];
        arrangedData.betx1 = data[i + 15];
        arrangedData.bet12 = data[i + 17];
        arrangedData.x2 = data[i + 19];
        arrangedData.under = data[i + 22];
        arrangedData.over = data[i + 24];
        arrangedData.goal = data[i + 27];
        arrangedData.nogoal = data[i + 29];

        outputArrangedData.push(arrangedData);
        i += 29;
      }
    }

    //quiting the browser after the task completes
    driver.quit();

    //returning the fetched data
    return outputArrangedData;
  } catch (error) {
    throw new Error(error);
  }
}

//starting the server at required
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
