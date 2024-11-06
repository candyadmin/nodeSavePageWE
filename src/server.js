const express = require('express');
const savePageWE = require('./nodeSavePageWE');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000; // 可以根据需求修改端口号

// 解析 JSON 请求
app.use(express.json());

// 生成文件名的函数
const generateFilenameFromUrl = (url) => {
    // 解码 URL
    const decodedUrl = decodeURIComponent(url);

    // 从 URL 中提取有意义的部分作为文件名
    const baseName = decodedUrl.replace(/^https?:\/\//, '').replace(/[\/\\?%*:|"<>]/g, '_'); // 移除协议部分并替换特殊字符

    // 限制文件名长度，最多使用 50 个字符
    const maxLength = 50;
    let filename = baseName.length > maxLength ? baseName.substring(0, maxLength) : baseName;

    // 如果文件名为空，则使用一个默认的名称
    if (!filename) {
        filename = 'default_filename';
    }

    return filename + '.html'; // 加上 `.html` 后缀
};

// 抓取页面的接口
app.post('/scrape', async (req, res) => {
    const { url, filename, lazyload } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Please provide url' });
    }

    // 如果 filename 为空，使用生成的文件名
    const finalFilename = filename || generateFilenameFromUrl(url);

    // 目标文件的保存路径
    const savePath = path.join("/opt/savePage/nodeSavePageWE/output", finalFilename);

    try {
        await savePageWE.scrape({ url, path: savePath, lazyload });
        res.json({ message: 'Page saved successfully', path: savePath });
    } catch (error) {
        console.error(`Error scraping page: ${error.message}`);
        res.status(500).json({ error: 'Failed to save page' });
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Scraping service is running at http://localhost:${PORT}`);
});
