// グローバル変数
let certificatesData = [];

// CSVデータのロード
async function loadCertificatesData() {
    try {
        const response = await fetch('Data/certificates_master.csv');
        const csvText = await response.text();
        certificatesData = parseCSV(csvText);
        console.log('Certificates data loaded:', certificatesData);
        renderChecklist();
    } catch (error) {
        console.error('Error loading certificates data:', error);
        alert('証明書データの読み込みに失敗しました。');
    }
}

// CSVパーサー
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(obj);
    }
    
    return data;
}

// CSV行のパース（ダブルクォートで囲まれたカンマを考慮）
function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);
    
    return values;
}

// チェックリストの描画
function renderChecklist() {
    const checklistElement = document.getElementById('checklist');
    checklistElement.innerHTML = '';
    
    certificatesData.forEach(cert => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checklist-item';
        itemDiv.onclick = () => showCertificateDetail(cert);
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'item-checkbox';
        checkbox.onclick = (e) => e.stopPropagation();
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = cert.cert_name;
        
        const keySpan = document.createElement('span');
        keySpan.className = 'item-key';
        keySpan.textContent = `(${cert.cert_key})`;
        
        itemDiv.appendChild(checkbox);
        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(keySpan);
        checklistElement.appendChild(itemDiv);
    });
}

// 証明書詳細の表示
function showCertificateDetail(cert) {
    // 証明書名
    document.getElementById('cert-name').textContent = cert.cert_name;
    
    // メソッドバッジの生成
    const badgesContainer = document.getElementById('method-badges');
    badgesContainer.innerHTML = '';
    
    const methods = [
        { key: 'online', label: 'オンライン', value: cert.online },
        { key: 'mail', label: '郵送', value: cert.by_mail },
        { key: 'counter', label: '窓口', value: cert.by_counter }
    ];
    
    methods.forEach(method => {
        const badge = document.createElement('span');
        const isAvailable = method.value === '○';
        const isPartial = method.value === '△';
        
        badge.className = `badge ${isAvailable || isPartial ? method.key : 'unavailable'}`;
        badge.textContent = method.label;
        
        if (isPartial) {
            badge.textContent += ' (制限あり)';
        } else if (!isAvailable) {
            badge.textContent += ' (不可)';
        }
        
        badgesContainer.appendChild(badge);
    });
    
    // 詳細情報
    document.getElementById('dept-name').textContent = cert.dept || '未設定';
    
    const etaDays = cert.eta_days || '0';
    document.getElementById('eta-days').textContent = etaDays === '0' ? '即時' : `約${etaDays}営業日`;
    
    const fee = cert.fee || '0';
    document.getElementById('fee').textContent = fee === '0' ? '無料' : `${fee}円`;
    
    const linkElement = document.getElementById('cert-link');
    if (cert.url) {
        linkElement.href = cert.url;
        linkElement.textContent = cert.url;
        linkElement.style.display = 'inline';
    } else {
        linkElement.style.display = 'none';
    }
    
    // 注記の表示
    const notesContent = document.getElementById('notes-content');
    if (cert.notes) {
        notesContent.innerHTML = `<p>${cert.notes}</p>`;
    } else {
        notesContent.innerHTML = '<p>特記事項なし</p>';
    }
    
    // ドロワーを表示
    openDrawer();
}

// ドロワーを開く
function openDrawer() {
    const drawer = document.getElementById('detail-drawer');
    drawer.classList.add('active');
    
    // オーバーレイクリックでドロワーを閉じる
    const overlay = drawer.querySelector('.drawer-overlay');
    overlay.onclick = closeDrawer;
}

// ドロワーを閉じる
function closeDrawer() {
    const drawer = document.getElementById('detail-drawer');
    drawer.classList.remove('active');
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    loadCertificatesData();
    
    // ESCキーでドロワーを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDrawer();
        }
    });
});
