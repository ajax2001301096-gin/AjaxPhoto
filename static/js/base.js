// Tạo cánh hoa động bằng JavaScript
const container = document.getElementById('petalsContainer');
const petalCount = 8;
for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    container.appendChild(petal);
}