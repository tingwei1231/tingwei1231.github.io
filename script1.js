document.addEventListener('DOMContentLoaded', () => {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropTargets = document.querySelectorAll('.drop-target');
    const verifyBtn = document.getElementById('verifyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const message = document.getElementById('message');
    const labelsContainer = document.querySelector('.labels-container');

    let draggedItem = null;

    // 設定拖曳事件
    function setupDragEvents(items) {
        items.forEach(item => {
            item.setAttribute('draggable', 'true'); // 確保元素可拖曳
            item.addEventListener('dragstart', (e) => {
                draggedItem = e.target;
                e.dataTransfer.setData('text/plain', e.target.dataset.label); // 傳遞標籤數據
                setTimeout(() => {
                    e.target.style.opacity = '0.5'; 
                }, 0);
            });

            item.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });
    }

    // 初始設定所有標籤的拖曳事件
    setupDragEvents(dragItems);
    
    // 初始化放置區塊的提示文字
    dropTargets.forEach(target => {
        target.textContent = '請放置標籤';
    });

    // 設定放置目標事件
    dropTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault(); 
            if (target.children.length === 0 && !target.textContent) {
                target.classList.add('hover');
            }
        });

        target.addEventListener('dragleave', () => {
            target.classList.remove('hover');
        });

        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('hover');
            message.textContent = '';

            // 檢查目標區域是否已經有標籤
            if (target.children.length > 0) {
                // 如果目標區域不為空，讓被拖曳的標籤回到原始位置
                draggedItem.style.opacity = '1';
                return;
            }

            // 將標籤放入目標並更新樣式
            target.textContent = ''; // 清除提示文字
            target.appendChild(draggedItem);
            target.classList.add('filled');
        });
    });

    // 驗證按鈕的邏輯：統一驗證所有答案
    verifyBtn.addEventListener('click', () => {
        const filledTargets = document.querySelectorAll('.drop-target.filled');
        const totalTargets = document.querySelectorAll('.drop-target').length;

        // 檢查是否所有目標都已填滿
        if (filledTargets.length !== totalTargets) {
            message.textContent = '不可以空白！';
            return;
        }

        let isCorrect = true;
        filledTargets.forEach(target => {
            const placedItem = target.querySelector('.drag-item');
            if (placedItem) {
                const placedLabel = placedItem.dataset.label;
                const correctLabel = target.dataset.label;
                if (placedLabel !== correctLabel) {
                    isCorrect = false;
                }
            } else {
                isCorrect = false;
            }
        });

        if (isCorrect) {
            alert('好強！不愧是聊天都在看嘴巴的人！即將跳轉...');
            window.location.href = 'https://tingwei1231.github.io/card.html';
        } else {
            message.textContent = '驗證失敗，請檢查標籤是否正確！(真的答不出來可以善用右鍵「檢視網頁原始碼」)';
        }
    });

    // 重設按鈕的邏輯
    resetBtn.addEventListener('click', () => {
        const dropTargets = document.querySelectorAll('.drop-target');
        dropTargets.forEach(target => {
            const placedItem = target.querySelector('.drag-item');
            if (placedItem) {
                labelsContainer.appendChild(placedItem);
            }
            target.classList.remove('filled');
            target.classList.remove('hover');
            target.textContent = '請放置標籤'; // 重設提示文字
        });
        message.textContent = '';
        setupDragEvents(document.querySelectorAll('.drag-item')); 
    });
});
