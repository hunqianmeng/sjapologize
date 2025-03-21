const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { fetch } = require('undici'); // 使用 undici
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// AI生成作文接口，调用 DeepSeek API
app.post("/generate", async (req, res) => {
    const { name, studentId, topic, tone } = req.body;

    // 参数验证
    if (!name || !studentId || !topic || !tone) {
        return res.status(400).json({ error: "缺少必要参数" });
    }

    // 构造提示词
    const prompt = `${name}（学号${studentId}）因为${topic}，需要给沈坚写一篇小作文。请用“${tone}”的语气，生成一篇合适的作文。`;

    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            // 添加HTTP状态码的错误处理
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // 检查返回数据是否正确
        if (data.choices && data.choices[0] && data.choices[0].message) {
            res.json({ essay: data.choices[0].message.content });
        } else {
            console.error("DeepSeek API 返回数据异常：", data);
            res.status(500).json({ error: "生成失败，请稍后再试", details: data });
        }
    } catch (error) {
        console.error("DeepSeek AI 请求失败:", error);
        console.error("错误堆栈:", error.stack); // 打印错误堆栈
        res.status(500).json({ error: "生成失败，请稍后再试", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
