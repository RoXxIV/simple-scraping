const puppeteer = require("puppeteer");
const ObjectsToCsv = require("objects-to-csv");

/**
 * Dans cet exemple, nous récupérons la liste des 250 meilleurs films d'après
 * le classement du site imdb.com
 * @param {string} documentName - Nom du Csv dans lequel sera stocké les résultats
 * @param {*} pageUrl - URL de la page ciblée
 * @param {*} target - Sélecteur cible principale du scraping
 */
function scrapThis(documentName, pageUrl, target) {
  try {
    (async () => {
      // Fetching
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(pageUrl);
      // Parsing
      let arrayOfResults = [];
      const results = await page.$$(target);

      for (const result of results) {
        /**
         * Personalisation et structure des resultats
         *  - Debut des modifications avec exemple
         */
        let url = await page.evaluate(
          (el) => el.querySelector(".titleColumn > a").getAttribute("href"),
          result
        );
        let title = await page.evaluate(
          (el) => el.querySelector(".titleColumn").innerText.trim(),
          result
        );
        arrayOfResults.push([title, pageUrl.replace("/chart/top/", "") + url]);
        // - Fin des modifications
      }

      console.log(arrayOfResults);
      // Stockage
      const csv = new ObjectsToCsv(arrayOfResults);
      await csv.toDisk(`Results/${documentName}.csv`, { append: true });
    })();
  } catch (err) {
    console.error(err);
  }
}

/**
 * appel de la fonction avec exemple
 */
scrapThis(
  "top_movies",
  "https://www.imdb.com/chart/top/",
  "tbody.lister-list tr"
);
