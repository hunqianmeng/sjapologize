async function generateEssay() {
    const name = document.getElementById("name").value;
    const studentId = document.getElementById("studentId").value;
    const topic = document.getElementById("topic").value;
    const tone = document.getElementById("tone").value;
    const result = document.getElementById("result");

    if (!name || !studentId) {
        result.innerText = "请填写名字和学号！";
        return;
    }

    result.innerText = "正在生成，请稍等...";

    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, studentId, topic, tone })
        });

        const data = await response.json();
        result.innerText = data.essay || "生成失败，请重试！";

    } catch (error) {
        result.innerText = "请求失败，请检查网络！";
        console.error("生成失败:", error);
    }
}
