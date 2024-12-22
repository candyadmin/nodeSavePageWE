/************************************************************************/
/*                                                                      */
/*      Based on: Save Page WE - Generic WebExtension - Background Page */
/*                (forked on December 31, 2018)                         */
/*      Copyright (C) 2016-2018 DW-dev                                  */
/*                                                                      */
/*      Adapted for Node/Puppeteer by Markus Mobius                     */
/*      markusmobius@gmail.com                                          */
/*                                                                      */
/*      Distributed under the GNU General Public License version 2      */
/*      See LICENCE.txt file and http://www.gnu.org/licenses/           */
/*                                                                      */
/************************************************************************/

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

module.exports = {
    scrape: async function (task) {

        const fs = require('fs');
        const path = require('path');
        const puppeteer = require('puppeteer');

        require('events').EventEmitter.defaultMaxListeners = 50;

        const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));


        // 设置代理服务器地址和认证信息
        // const proxyServer = "http://overseas.tunnel.qg.net:13577"; // 替换为你的代理服务器地址和端口
        const proxyUsername = "TW9O7NSP"; // 替换为你的代理用户名
        const proxyPassword = "FA5E417D5D25"; // 替换为你的代理密码
        const proxyServer = "http://127.0.0.1:7897"; // 替换为你的代理服务器地址和端口

        //disable web security to allow CORS requests
        const browser = await puppeteer.launch({ headless: true, args: ["--disable-features=BlockInsecurePrivateNetworkRequests","--disable-features=IsolateOrigins", "--disable-site-isolation-trials", '--disable-web-security'
                // , "--proxy-server='direct://'"
                ,"--proxy-server=" + proxyServer // 设置代理服务器
                , '--proxy-bypass-list=*'] });
        const page = await browser.newPage();

        // 如果代理需要认证，进行认证
        await page.authenticate({
            username: proxyUsername,
            password: proxyPassword
        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36');

        await page.setViewport({
            width: 1600,
            height: 10000
        });

        // Allow injected scripts to be executed
        await page.setBypassCSP(true);

        await page.goto(task.url, { timeout: 180000, waitUntil: ['domcontentloaded'] });


        await page.addScriptTag({ path: path.join(__dirname, 'nodeSavePageWE_client.js') });


        await page.evaluate(async (params) => {
            runSinglePage(params);
        }, {"lazyload":task.lazyload});

        await page.on('framenavigated', async (frame) => {
            console.log(`Navigated to: ${frame.url()}`);
            if (frame.url() !== task.url) {
                await page.goto(task.url, { waitUntil: 'domcontentloaded' });
            }
        });

        await page.on('response', async (response) => {
            if (response.status() === 200) {
                const text = await response.text();
                console.log('Page content:', text);
            }
        });


        var savedPageHTML="";
        while(true)
        {
            savedPageHTML = await page.evaluate(async () => {
                return htmlFINAL;
            }, {});
            if (savedPageHTML!="NONE")
            {
                break;
            }
            /*var status = await page.evaluate(async () => {
                return htmlSTATUS;
            }, {});
            console.log(status);*/
            await snooze(100);
        }
        console.log("savedPageHTML",savedPageHTML);
        //now inject resources back into page
        fs.writeFileSync(task.path, savedPageHTML);
        await browser.close();
    }
};

