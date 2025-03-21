async function generateEssay() {
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const topic = document.getElementById("topic").value;
    const tone = document.getElementById("tone").value;
    const result = document.getElementById("result");
    const button = document.querySelector("button");

    // 1️⃣ 检查名字和学号是否填写
    if (!name || !studentId) {
        result.innerText = "⚠️ 请填写名字和学号！";
        return;
    }

    // 2️⃣ 防止重复点击 & 启动加载动画
    button.disabled = true;
    button.innerText = "生成中...";
    result.innerHTML = "<p>正在生成，请稍等...</p>";

    try {
        // 3️⃣ 发送请求到后端服务器
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, studentId, topic, tone })
        });

        const data = await response.json();
        result.innerHTML = `<p>${data.essay ? data.essay : "生成失败，请重试！"}</p>`;

        // 4️⃣ 新增功能：一键复制
        const copyButton = document.createElement('button');
        copyButton.innerText = "📋 复制到剪贴板";
        copyButton.style.margin = "5px";
        copyButton.onclick = () => {
            navigator.clipboard.writeText(data.essay || "");
            alert("已复制到剪贴板！");
        };
        result.appendChild(copyButton);

        // 5️⃣ 新增功能：保存为TXT文件
        const saveButton = document.createElement('button');
        saveButton.innerText = "💾 保存为TXT";
        saveButton.style.margin = "5px";
        saveButton.onclick = () => {
            const blob = new Blob([data.essay || ""], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${name}-${topic}-小作文.txt`;
            link.click();
            URL.revokeObjectURL(url);
        };
        result.appendChild(saveButton);

    } catch (error) {
        result.innerText = "⚡ 请求失败，请检查网络！";
        console.error("生成失败:", error);

    } finally {
        // 6️⃣ 恢复按钮状态
        button.disabled = false;
        button.innerText = "生成小作文";
    }
}
