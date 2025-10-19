document.addEventListener('DOMContentLoaded', () => {
    const imageGrid = document.getElementById('imageGrid');
    const stageTitle = document.getElementById('stageTitle');
    const verifyBtn = document.getElementById('verifyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const message = document.getElementById('message');

    let currentStage = 1; // 追蹤當前階段 (1, 2, or 3)
    const totalStages = 2;

    // --- 題庫定義 (包含三個階段的題目) ---
    const quizData = [
        {
            title: "【階段 1】請選出所有我們曾經去過的地方",
            // 0, 1, 2, 3, 4, 5, 6, 7, 8 (索引從 0 開始)
            correctIndices: [0, 3, 5, 6, 8], 
            images: [
                { url: "./image/part1/1.jpg", isCorrect: true },
                { url: "./image/part1/2.jpg", isCorrect: false },
                { url: "./image/part1/3.jpg", isCorrect: false },
                { url: "./image/part1/4.jpg", isCorrect: true },
                { url: "./image/part1/5.jpg", isCorrect: false },
                { url: "./image/part1/6.jpg", isCorrect: true },
                { url: "./image/part1/7.jpg", isCorrect: true },
                { url: "./image/part1/8.jpg", isCorrect: false },
                { url: "./image/part1/9.jpg", isCorrect: true }
            ]
        },
        {
            title: "【階段 2】請選擇我「沒有」購買的小木貼圖",
            correctIndices: [0, 1, 2, 3, 4, 6, 8],
            images: [
                { url: "./image/part2/1.png", isCorrect: true },
                { url: "./image/part2/2.png", isCorrect: true },
                { url: "./image/part2/3.png", isCorrect: true },
                { url: "./image/part2/4.png", isCorrect: true },
                { url: "./image/part2/5.png", isCorrect: true },
                { url: "./image/part2/6.png", isCorrect: false },
                { url: "./image/part2/7.png", isCorrect: true },
                { url: "./image/part2/8.png", isCorrect: false },
                { url: "./image/part2/9.png", isCorrect: true }
            ]
        },
        {
            title: "【階段 3】請選擇所有包含「動物」的圖片",
            correctIndices: [2, 4, 8],
            images: [
                { url: "./image/part3/1.jpg", isCorrect: false },
                { url: "./image/part3/2.jpg", isCorrect: false },
                { url: "./image/part3/3.jpg", isCorrect: true },
                { url: "./image/part3/4.jpg", isCorrect: false },
                { url: "./image/part3/5.jpg", isCorrect: true },
                { url: "./image/part3/6.jpg", isCorrect: false },
                { url: "./image/part3/7.jpg", isCorrect: false },
                { url: "./image/part3/8.jpg", isCorrect: false },
                { url: "./image/part3/9.jpg", isCorrect: true }
            ]
        }
    ];

    // 載入當前階段的內容
    function loadStage(stage) {
        // 確保階段編號在有效範圍內
        if (stage > totalStages) return; 

        const data = quizData[stage - 1];
        
        // 1. 更新標題和按鈕文字
        stageTitle.textContent = data.title;
        verifyBtn.textContent = `驗證 (階段 ${stage} / ${totalStages})`;
        message.textContent = '';
        
        // 2. 清空並動態建立九宮格
        imageGrid.innerHTML = '';
        data.images.forEach((img, index) => {
            const item = document.createElement('div');
            item.classList.add('grid-item');
            
            // 使用 data-index 儲存圖片在題庫中的索引，方便驗證
            item.dataset.index = index; 
            
            item.innerHTML = `
                <img src="${img.url}" alt="圖片 ${index + 1}">
                <div class="overlay">&#10003;</div>
            `;
            
            // 監聽圖片點擊事件
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                message.textContent = '';
            });
            
            imageGrid.appendChild(item);
        });
    }

    // 驗證當前階段的答案
    function verifyStage() {
        const data = quizData[currentStage - 1];
        const selectedItems = document.querySelectorAll('.grid-item.selected');
        
        // 1. 檢查勾選的數量是否與正確答案的數量相同
        if (selectedItems.length !== data.correctIndices.length) {
            message.textContent = '驗證失敗，請選擇所有正確的圖片！';
            return false;
        }

        // 2. 檢查所有勾選的圖片是否都正確
        let isCorrect = true;
        
        // 將正確索引轉換成 Set 結構，方便快速查找
        const correctSet = new Set(data.correctIndices.map(String)); 

        selectedItems.forEach(item => {
            const selectedIndex = item.dataset.index;
            // 如果勾選的圖片索引不在正確答案的 Set 中，則錯誤
            if (!correctSet.has(selectedIndex)) {
                isCorrect = false;
            }
        });

        if (isCorrect) {
            if (currentStage < totalStages) {
                // 成功通過當前階段，進入下一階段
                currentStage++;
                message.textContent = `階段 ${currentStage - 1} 驗證成功！正在載入階段 ${currentStage}...`;
                // 延遲一點時間再載入下一階段，讓使用者看到成功訊息
                setTimeout(() => {
                    loadStage(currentStage);
                }, 1000);
            } else {
                // 成功通過所有階段，跳轉頁面
                alert('恭喜！驗證全部成功！即將跳轉...');
                // 替換成你想要跳轉的網頁網址
                window.location.href = 'https://www.google.com'; 
            }
        } else {
            message.textContent = '驗證失敗，請檢查選擇的圖片是否有誤！';
            return false;
        }
        return true;
    }

    // 處理重設功能
    function resetAll() {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.classList.remove('selected');
        });
        message.textContent = '已重設當前階段。';
    }

    // --- 事件監聽器 ---
    verifyBtn.addEventListener('click', verifyStage);
    resetBtn.addEventListener('click', resetAll);

    // 初始載入第一個階段
    loadStage(currentStage);
});