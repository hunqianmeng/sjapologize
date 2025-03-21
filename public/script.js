async function generateEssay() {
    // 1️⃣ 获取输入框的值
    const name = document.getElementById("name").value.trim();
    const studentId = document.getElementById("studentId").value.trim();
    const topic = document.getElementById("topic").value.trim();
    const tone = document.getElementById("tone").value.trim();
    const result = document.getElementById("result");
    const button = document.querySelector("button");
    const loading = document.getElementById("loading");

    // 2️⃣ 检查所有必要字段是否填写
    if (!name || !studentId || !topic || !tone) {
        result.innerText = "⚠️ 请填写所有字段！";
        return;
    }

    // 3️⃣ 防止重复点击 & 启动加载动画
    button.disabled = true;
    button.innerText = "生成中...";
    result.innerText = "";  // 清空上次的结果
    result.classList.add("loading");  // ⬅️ 添加加载动画
    loading.style.display = "block"; // 显示加载动画

    try {
        // 4️⃣ 发送请求到后端服务器
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, studentId, topic, tone })
        });

        const data = await response.json();

        // 5️⃣ 判断返回结果
        if (response.ok && data.essay) {
            result.innerText = data.essay;
        } else {
            result.innerText = `🚨 生成失败: ${data.error || "未知错误，请重试"}`;
        }

    } catch (error) {
        result.innerText = "⚡ 请求失败，请检查网络！";
        console.error("生成失败:", error);

    } finally {
        // 6️⃣ 恢复按钮状态 & 关闭加载动画
        button.disabled = false;
        button.innerText = "生成小作文";
        result.classList.remove("loading");  // ⬅️ 移除加载动画
        loading.style.display = "none";  // 隐藏加载动画
    }
}
