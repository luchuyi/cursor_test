let array = [];
let originalArray = []; // 保存原始数组用于重置
let isSorting = false;
let isPaused = false;
let comparisons = 0;
let swaps = 0;
let startTime = 0;

const algorithmInfo = {
    bubble: {
        name: "冒泡排序",
        description: "冒泡排序是一种简单的排序算法，它重复地遍历要排序的数组，比较相邻的两个元素，如果它们的顺序错误就交换它们。",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stability: "稳定"
    },
    quick: {
        name: "快速排序",
        description: "快速排序使用分治策略，选择一个基准元素，将数组分为两部分，左边都小于基准，右边都大于基准，然后递归排序。",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(log n)",
        stability: "不稳定"
    },
    merge: {
        name: "归并排序",
        description: "归并排序是分治算法的典型应用，将数组分成两半，递归排序，然后合并两个有序数组。",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)",
        stability: "稳定"
    },
    insertion: {
        name: "插入排序",
        description: "插入排序通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stability: "稳定"
    },
    selection: {
        name: "选择排序",
        description: "选择排序每次从未排序区间中找到最小的元素，存放到已排序区间的末尾。",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        stability: "不稳定"
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    generateArray();
    updateAlgorithmInfo();
    updateButtonStates();
    
    // 事件监听器
    document.getElementById('arraySize').addEventListener('input', function() {
        document.getElementById('arraySizeValue').textContent = this.value;
    });
    
    document.getElementById('speed').addEventListener('input', function() {
        document.getElementById('speedValue').textContent = this.value;
    });
    
    document.getElementById('algorithm').addEventListener('change', updateAlgorithmInfo);
});

function generateArray() {
    const size = parseInt(document.getElementById('arraySize').value);
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    originalArray = [...array]; // 保存原始数组
    displayArray();
    resetStats();
    updateButtonStates();
}

function displayArray() {
    const display = document.getElementById('arrayDisplay');
    display.innerHTML = '';
    
    const maxValue = Math.max(...array);
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxValue) * 250}px`;
        bar.textContent = value;
        bar.dataset.index = index;
        display.appendChild(bar);
    });
}

function updateAlgorithmInfo() {
    const algorithm = document.getElementById('algorithm').value;
    const info = algorithmInfo[algorithm];
    
    document.getElementById('currentAlgorithm').textContent = info.name;
    document.getElementById('algorithmDescription').textContent = info.description;
    document.getElementById('timeComplexity').textContent = info.timeComplexity;
    document.getElementById('spaceComplexity').textContent = info.spaceComplexity;
    document.getElementById('stability').textContent = info.stability;
}

function resetStats() {
    comparisons = 0;
    swaps = 0;
    document.getElementById('comparisons').textContent = '0';
    document.getElementById('swaps').textContent = '0';
    document.getElementById('time').textContent = '0ms';
}

function resetArray() {
    if (isSorting && !isPaused) return;
    
    // 恢复原始数组
    array = [...originalArray];
    displayArray();
    resetStats();
    
    // 重置排序状态
    isSorting = false;
    isPaused = false;
    updateButtonStates();
    
    // 清除所有高亮
    clearHighlights();
    clearSortedMarks();
}

async function startSort() {
    if (isSorting && !isPaused) return;
    
    if (isPaused) {
        // 继续暂停的排序
        isPaused = false;
        updateButtonStates();
        return;
    }
    
    // 开始新的排序
    isSorting = true;
    isPaused = false;
    resetStats();
    startTime = Date.now();
    updateButtonStates();
    
    const algorithm = document.getElementById('algorithm').value;
    const speed = parseInt(document.getElementById('speed').value);
    const delay = (11 - speed) * 50; // 速度越快，延迟越短
    
    try {
        switch(algorithm) {
            case 'bubble':
                await bubbleSort(delay);
                break;
            case 'quick':
                await quickSort(0, array.length - 1, delay);
                break;
            case 'merge':
                await mergeSort(0, array.length - 1, delay);
                break;
            case 'insertion':
                await insertionSort(delay);
                break;
            case 'selection':
                await selectionSort(delay);
                break;
        }
    } catch (error) {
        if (error.message === 'PAUSED') {
            return; // 排序被暂停
        }
    }
    
    isSorting = false;
    isPaused = false;
    updateButtonStates();
    document.getElementById('time').textContent = `${Date.now() - startTime}ms`;
}

function pauseSort() {
    if (isSorting && !isPaused) {
        isPaused = true;
        updateButtonStates();
    }
}

function updateButtonStates() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (isSorting && !isPaused) {
        startBtn.textContent = '▶️ 开始排序';
        startBtn.disabled = true;
        pauseBtn.disabled = false;
    } else if (isSorting && isPaused) {
        startBtn.textContent = '▶️ 继续排序';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    } else {
        startBtn.textContent = '▶️ 开始排序';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

async function bubbleSort(delay) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // 检查是否暂停
            if (isPaused) {
                throw new Error('PAUSED');
            }
            
            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;
            
            highlightBars(j, j + 1, 'comparing');
            await sleep(delay);
            
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                displayArray();
                highlightBars(j, j + 1, 'swapping');
                await sleep(delay);
            }
            
            clearHighlights();
        }
        // 标记已排序的元素
        markSorted(n - i - 1);
    }
    markSorted(0);
}

async function quickSort(low, high, delay) {
    if (low < high) {
        const pi = await partition(low, high, delay);
        await quickSort(low, pi - 1, delay);
        await quickSort(pi + 1, high, delay);
    }
}

async function partition(low, high, delay) {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        // 检查是否暂停
        if (isPaused) {
            throw new Error('PAUSED');
        }
        
        comparisons++;
        document.getElementById('comparisons').textContent = comparisons;
        
        highlightBars(j, high, 'comparing');
        await sleep(delay);
        
        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                [array[i], array[j]] = [array[j], array[i]];
                swaps++;
                document.getElementById('swaps').textContent = swaps;
                displayArray();
                highlightBars(i, j, 'swapping');
                await sleep(delay);
            }
        }
        clearHighlights();
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    document.getElementById('swaps').textContent = swaps;
    displayArray();
    
    return i + 1;
}

async function mergeSort(low, high, delay) {
    if (low < high) {
        const mid = Math.floor((low + high) / 2);
        await mergeSort(low, mid, delay);
        await mergeSort(mid + 1, high, delay);
        await merge(low, mid, high, delay);
    }
}

async function merge(low, mid, high, delay) {
    const left = array.slice(low, mid + 1);
    const right = array.slice(mid + 1, high + 1);
    
    let i = 0, j = 0, k = low;
    
    while (i < left.length && j < right.length) {
        // 检查是否暂停
        if (isPaused) {
            throw new Error('PAUSED');
        }
        
        comparisons++;
        document.getElementById('comparisons').textContent = comparisons;
        
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
        displayArray();
        await sleep(delay);
    }
    
    while (i < left.length) {
        // 检查是否暂停
        if (isPaused) {
            throw new Error('PAUSED');
        }
        
        array[k] = left[i];
        i++;
        k++;
        displayArray();
        await sleep(delay);
    }
    
    while (j < right.length) {
        // 检查是否暂停
        if (isPaused) {
            throw new Error('PAUSED');
        }
        
        array[k] = right[j];
        j++;
        k++;
        displayArray();
        await sleep(delay);
    }
}

async function insertionSort(delay) {
    for (let i = 1; i < array.length; i++) {
        const key = array[i];
        let j = i - 1;
        
        while (j >= 0 && array[j] > key) {
            // 检查是否暂停
            if (isPaused) {
                throw new Error('PAUSED');
            }
            
            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;
            
            array[j + 1] = array[j];
            swaps++;
            document.getElementById('swaps').textContent = swaps;
            j--;
            
            displayArray();
            highlightBars(j + 1, i, 'comparing');
            await sleep(delay);
            clearHighlights();
        }
        
        array[j + 1] = key;
        displayArray();
    }
}

async function selectionSort(delay) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        
        for (let j = i + 1; j < array.length; j++) {
            // 检查是否暂停
            if (isPaused) {
                throw new Error('PAUSED');
            }
            
            comparisons++;
            document.getElementById('comparisons').textContent = comparisons;
            
            highlightBars(minIndex, j, 'comparing');
            await sleep(delay);
            
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            clearHighlights();
        }
        
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            swaps++;
            document.getElementById('swaps').textContent = swaps;
            displayArray();
            highlightBars(i, minIndex, 'swapping');
            await sleep(delay);
            clearHighlights();
        }
        
        markSorted(i);
    }
    markSorted(array.length - 1);
}

function highlightBars(index1, index2, className) {
    const bars = document.querySelectorAll('.array-bar');
    if (bars[index1]) bars[index1].classList.add(className);
    if (bars[index2]) bars[index2].classList.add(className);
}

function clearHighlights() {
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        bar.classList.remove('comparing', 'swapping');
    });
}

function markSorted(index) {
    const bars = document.querySelectorAll('.array-bar');
    if (bars[index]) bars[index].classList.add('sorted');
}

function clearSortedMarks() {
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach(bar => {
        bar.classList.remove('sorted');
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
