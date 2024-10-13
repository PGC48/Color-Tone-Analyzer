// Theme toggle functionality
const themeToggle = document.querySelector('#themeToggle');
const body = document.body;

function toggleTheme() {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Set initial theme
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', toggleTheme);

// File upload functionality
const fileInput = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const analyzeButton = document.getElementById('analyzeBtn');
const resultDiv = document.getElementById('result');
const colorInfo = document.getElementById('colorInfo');
const colorPieChart = document.getElementById('colorPieChart');
const loading = document.getElementById('loading');
const loadingBar = document.getElementById('loadingBar');

let colorPieChartInstance = null;

fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            analyzeButton.disabled = false;
            resultDiv.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});

// Analyze button functionality
analyzeButton.addEventListener('click', function() {
    loading.style.display = 'block';
    loadingBar.style.width = '0%';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        loadingBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loading.style.display = 'none';
                analyzeImage(preview);
                analyzeButton.classList.add('loading-complete');
            }, 500);
        }
    }, 200);
});

function analyzeImage(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let warmPixels = 0;
    let coolPixels = 0;
    let totalR = 0, totalG = 0, totalB = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        totalR += r;
        totalG += g;
        totalB += b;
        
        const hue = getHue(r, g, b);
        if (hue < 180) warmPixels++;
        else coolPixels++;
    }
    
    const totalPixels = data.length / 4;
    const warmPercentage = (warmPixels / totalPixels) * 100;
    const coolPercentage = (coolPixels / totalPixels) * 100;
    
    const avgR = Math.round(totalR / totalPixels);
    const avgG = Math.round(totalG / totalPixels);
    const avgB = Math.round(totalB / totalPixels);
    
    // คำนวณความสว่าง
    const brightness = calculateBrightness(avgR, avgG, avgB);
    
    colorInfo.innerHTML = `
        <strong>ผลการวิเคราะห์สี:</strong><br>
        <strong>🟥 โทนร้อน:</strong> ${warmPercentage.toFixed(2)}%<br>
        <strong>🟦 โทนเย็น:</strong> ${coolPercentage.toFixed(2)}%<br>
        <strong>🎨 ค่า RGB เฉลี่ย:</strong><br>
        <strong>🟥 R:</strong> <span style="color: red;">${avgR}</span><br>
        <strong>🟩 G:</strong> <span style="color: green;">${avgG}</span><br>
        <strong>🟦 B:</strong> <span style="color: blue;">${avgB}</span><br>
        <strong>🌑 ความมืด:</strong> ${brightness.darkness}%<br>
        <strong>🌞 ความสว่าง:</strong> ${brightness.brightness}%<br>
    `;

    // Pie chart creation (modified)
    if (colorPieChartInstance) {
        colorPieChartInstance.destroy();
    }

    // สร้างกราฟหลังจากข้อมูลทั้งหมดประมวลผลเสร็จสิ้น
    colorPieChartInstance = new Chart(colorPieChart, {
        type: 'pie',
        data: {
            labels: ['Warm Colors', 'Cool Colors'],
            datasets: [{
                data: [warmPixels, coolPixels],
                backgroundColor: ['#FF5733', '#33B5FF']
            }]
        }
    });

    resultDiv.style.display = 'block';
}

function calculateBrightness(r, g, b) {
    // คำนวณความสว่าง
    const brightnessValue = (0.299 * r + 0.587 * g + 0.114 * b);
    
    // คำนวณเปอร์เซ็นต์
    const brightnessPercentage = (brightnessValue / 255) * 100;
    const darknessPercentage = 100 - brightnessPercentage;

    return {
        brightness: brightnessPercentage.toFixed(2),
        darkness: darknessPercentage.toFixed(2)
    };
}
function analyzeImage(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let warmPixels = 0;
    let coolPixels = 0;
    let totalR = 0, totalG = 0, totalB = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        totalR += r;
        totalG += g;
        totalB += b;
        
        const hue = getHue(r, g, b);
        if (hue < 180) warmPixels++;
        else coolPixels++;
    }
    
    const totalPixels = data.length / 4;
    const warmPercentage = (warmPixels / totalPixels) * 100;
    const coolPercentage = (coolPixels / totalPixels) * 100;
    
    const avgR = Math.round(totalR / totalPixels);
    const avgG = Math.round(totalG / totalPixels);
    const avgB = Math.round(totalB / totalPixels);
    
    // คำนวณความสว่าง
    const brightness = calculateBrightness(avgR, avgG, avgB);
    
    colorInfo.innerHTML = `
        <strong>ผลการวิเคราะห์สี:</strong><br>
        <strong>🟥 โทนร้อน:</strong> ${warmPercentage.toFixed(2)}%<br>
        <strong>🟦 โทนเย็น:</strong> ${coolPercentage.toFixed(2)}%<br>
        <strong>🎨 ค่า RGB เฉลี่ย:</strong><br>
        <strong>🟥 R:</strong> <span style="color: red;">${avgR}</span><br>
        <strong>🟩 G:</strong> <span style="color: green;">${avgG}</span><br>
        <strong>🟦 B:</strong> <span style="color: blue;">${avgB}</span><br>
        <strong>🌑 ความมืด:</strong> ${brightness.darkness}%<br>
        <strong>🌞 ความสว่าง:</strong> ${brightness.brightness}%<br>
    `;

    // Pie chart creation (modified)
    if (colorPieChartInstance) {
        colorPieChartInstance.destroy();
    }

    // หน่วงเวลา 1 วินาทีก่อนสร้างกราฟ
    setTimeout(() => {
        colorPieChartInstance = new Chart(colorPieChart, {
            type: 'pie',
            data: {
                labels: ['Warm Colors', 'Cool Colors'],
                datasets: [{
                    data: [warmPixels, coolPixels],
                    backgroundColor: ['#FF5733', '#33B5FF']
                }]
            }
        });
    }, 1000); // หน่วงเวลา 1000 ms (1 วินาที)

    resultDiv.style.display = 'block';
}

function calculateBrightness(r, g, b) {
    const brightnessValue = (0.299 * r + 0.587 * g + 0.114 * b);
    const brightnessPercentage = (brightnessValue / 255) * 100;
    const darknessPercentage = 100 - brightnessPercentage;

    return {
        brightness: brightnessPercentage.toFixed(2),
        darkness: darknessPercentage.toFixed(2)
    };
}



function getHue(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    
    if (max === min) {
        h = 0;
    } else {
        const d = max - min;
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    
    return h;
}
