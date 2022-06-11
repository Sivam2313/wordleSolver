const puppeteer = require("puppeteer");
const next_st = require("./script.js");
(async () => {
    const browser = await puppeteer.launch({ headless: false, executablePath: "C:/Program Files/chrome-win/chrome.exe", timeout:  0})
    const page = await browser.newPage()
    await page.goto('https://wordlegame.org/')
    page.setDefaultNavigationTimeout(0); 
    
    await page.waitForSelector('.alert', {hidden: true})
    await page.type('.Row-letter', "piano")
    await page.keyboard.press("Enter")
    await page.waitForTimeout(4000)
    var solve = new next_st.solver();
    for(let i=0;i<5;i++){
        const otherplace = await page.evaluate(() => {
          // let elsewhere = document.querySelectorAll(".Row-letter.letter-elsewhere");
          let elsewhere = document.querySelectorAll(".Row-locked-in");
          const datarr=[...elsewhere[elsewhere.length-1].querySelectorAll(".Row-letter")];
          let clas=[];
          datarr.forEach((h,i)=>{
            clas[i]={text: h.innerText, cls: h.classList[1], index: i}
          })
          return clas;
        });
        solve.ini(otherplace);
        await page.type('.Row-letter',solve.next_string)
        await page.keyboard.press("Enter")
        await page.waitForTimeout(4000)
    }
   })()