var savePageWE=require('./nodeSavePageWE');


savePageWE.scrape({ url: "https://www.baidu.com", path: "baidu.html", lazyload: false }).then(function ()
{
    console.log("ok");
});
