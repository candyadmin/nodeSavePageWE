var savePageWE=require('./nodeSavePageWE');


savePageWE.scrape({ url: "https://www.binance.com/zh-CN/support/announcement/%E5%B8%81%E5%AE%89%E6%9C%80%E6%96%B0%E5%8A%A8%E6%80%81?c=49&navId=49&hl=zh-CN"
    , path: "binance.html", lazyload: false }).then(function ()
{
    console.log("ok");
});
