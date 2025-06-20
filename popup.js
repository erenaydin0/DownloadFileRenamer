// Popup JavaScript - URL Prefix Kuralları Yönetimi
console.log('🎯 Popup script loaded');

// DOM Elements
const rulesList = document.getElementById('rulesList');
const domainInput = document.getElementById('domainInput');
const prefixInput = document.getElementById('prefixInput');
const addRuleBtn = document.getElementById('addRuleBtn');

const exportRulesBtn = document.getElementById('exportRulesBtn');
const importRulesBtn = document.getElementById('importRulesBtn');
const importFileInput = document.getElementById('importFileInput');
const statusMessage = document.getElementById('statusMessage');



// Sayfa yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Popup DOM loaded');
  loadRules();
  setupEventListeners();
});

// Event listeners kurulumu
function setupEventListeners() {
  addRuleBtn.addEventListener('click', addNewRule);

  exportRulesBtn.addEventListener('click', exportRules);
  importRulesBtn.addEventListener('click', triggerImport);
  importFileInput.addEventListener('change', handleFileImport);
  
  // Enter tuşu ile kural ekleme
  domainInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addNewRule();
  });
  
  prefixInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addNewRule();
  });
}

// Kuralları yükle ve görüntüle
async function loadRules() {
  try {
    const result = await chrome.storage.local.get(['urlPrefixRules']);
    const rules = result.urlPrefixRules || {};
    
    console.log('📋 Loading rules:', rules);
    displayRules(rules);
  } catch (error) {
    console.error('❌ Error loading rules:', error);
    showStatus('Kurallar yüklenirken hata oluştu', 'error');
  }
}

// Kuralları görüntüle
function displayRules(rules) {
  rulesList.innerHTML = '';
  
  if (Object.keys(rules).length === 0) {
    rulesList.innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <p>Henüz kural eklenmemiş</p>
      </div>
    `;
    return;
  }
  
  Object.entries(rules).forEach(([domain, prefix]) => {
    const ruleElement = createRuleElement(domain, prefix);
    rulesList.appendChild(ruleElement);
  });
}

// Kural elementi oluştur
function createRuleElement(domain, prefix) {
  const ruleDiv = document.createElement('div');
  ruleDiv.className = 'rule-item';
  
  // Domain bilgisini escape et ve data attribute kullan
  ruleDiv.innerHTML = `
    <div class="rule-info">
      <div class="rule-domain">${escapeHtml(domain)}</div>
      <div class="rule-prefix">${escapeHtml(prefix)}</div>
    </div>
    <div class="rule-actions">
      <button class="btn-small btn-delete" data-domain="${escapeHtml(domain)}">Sil</button>
    </div>
  `;
  
  // Delete button event listener ekle
  const deleteBtn = ruleDiv.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', function() {
    const domainToDelete = this.getAttribute('data-domain');
    deleteRule(domainToDelete);
  });
  
  return ruleDiv;
}

// Yeni kural ekle
async function addNewRule() {
  const domain = domainInput.value.trim();
  const prefix = prefixInput.value.trim();
  
  if (!domain || !prefix) {
    showStatus('Domain ve prefix alanları doldurulmalıdır', 'error');
    return;
  }
  
  // Domain formatını kontrol et
  if (!isValidDomain(domain)) {
    showStatus('Geçerli bir domain giriniz', 'error');
    return;
  }
  
  try {
    const result = await chrome.storage.local.get(['urlPrefixRules']);
    const rules = result.urlPrefixRules || {};
    
    // Yeni kuralı ekle
    rules[domain] = prefix;
    
    // Storage'a kaydet
    await chrome.storage.local.set({ urlPrefixRules: rules });
    
    // Background script'e bildir
    chrome.runtime.sendMessage({
      action: 'updateRules',
      rules: rules
    });
    
    console.log('✅ Rule added:', domain, '->', prefix);
    showStatus(`Kural eklendi: ${domain} → ${prefix}`, 'success');
    
    // Formu temizle
    domainInput.value = '';
    prefixInput.value = '';
    
    // Kuralları yeniden yükle
    loadRules();
    
  } catch (error) {
    console.error('❌ Error adding rule:', error);
    showStatus('Kural eklenirken hata oluştu', 'error');
  }
}

// Kural sil
async function deleteRule(domain) {
  if (!confirm(`"${domain}" kuralını silmek istediğinizden emin misiniz?`)) {
    return;
  }
  
  try {
    const result = await chrome.storage.local.get(['urlPrefixRules']);
    const rules = result.urlPrefixRules || {};
    
    delete rules[domain];
    
    await chrome.storage.local.set({ urlPrefixRules: rules });
    
    // Background script'e bildir
    chrome.runtime.sendMessage({
      action: 'updateRules',
      rules: rules
    });
    
    console.log('🗑️ Rule deleted:', domain);
    showStatus(`Kural silindi: ${domain}`, 'info');
    
    loadRules();
    
  } catch (error) {
    console.error('❌ Error deleting rule:', error);
    showStatus('Kural silinirken hata oluştu', 'error');
  }
}

// HTML escape fonksiyonu
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}



// Kuralları dışa aktar
async function exportRules() {
  try {
    const result = await chrome.storage.local.get(['urlPrefixRules']);
    const rules = result.urlPrefixRules || {};
    
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.2',
      rules: rules
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Download'u başlat
    const link = document.createElement('a');
    link.href = url;
    link.download = `file-renamer-rules-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    console.log('📤 Rules exported');
    showStatus('Kurallar dışa aktarıldı', 'success');
    
  } catch (error) {
    console.error('❌ Error exporting rules:', error);
    showStatus('Kurallar dışa aktarılırken hata oluştu', 'error');
  }
}

// Dosya seçme dialogunu tetikle
function triggerImport() {
  importFileInput.click();
}

// Dosya içe aktarma işlemi
async function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Dosya tipini kontrol et
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    showStatus('Lütfen JSON formatında bir dosya seçin', 'error');
    return;
  }
  
  try {
    const fileContent = await readFile(file);
    const importData = JSON.parse(fileContent);
    
    // Dosya formatını kontrol et
    if (!importData.rules || typeof importData.rules !== 'object') {
      showStatus('Geçersiz dosya formatı. "rules" objesi bulunamadı', 'error');
      return;
    }
    
    // Kuralları validate et
    const rules = importData.rules;
    const validRules = {};
    let validCount = 0;
    let invalidCount = 0;
    
    for (const [domain, prefix] of Object.entries(rules)) {
      if (typeof domain === 'string' && typeof prefix === 'string' && 
          domain.trim() && prefix.trim() && isValidDomain(domain.trim())) {
        validRules[domain.trim()] = prefix.trim();
        validCount++;
      } else {
        invalidCount++;
        console.warn('Invalid rule skipped:', domain, '->', prefix);
      }
    }
    
    if (validCount === 0) {
      showStatus('Dosyada geçerli kural bulunamadı', 'error');
      return;
    }
    
    // Kullanıcıdan onay al
    const confirmMessage = `${validCount} geçerli kural içe aktarılacak` + 
                          (invalidCount > 0 ? ` (${invalidCount} geçersiz kural atlanacak)` : '') + 
                          '. Mevcut kurallar silinecek. Devam etmek istiyor musunuz?';
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Storage'a kaydet
    await chrome.storage.local.set({ urlPrefixRules: validRules });
    
    // Background script'e bildir
    chrome.runtime.sendMessage({
      action: 'updateRules',
      rules: validRules
    });
    
    console.log('📥 Rules imported:', validRules);
    showStatus(`${validCount} kural başarıyla içe aktarıldı` + 
              (invalidCount > 0 ? ` (${invalidCount} geçersiz atlandı)` : ''), 'success');
    
    // Kuralları yeniden yükle
    loadRules();
    
    // File input'u temizle
    importFileInput.value = '';
    
  } catch (error) {
    console.error('❌ Error importing rules:', error);
    if (error instanceof SyntaxError) {
      showStatus('Geçersiz JSON formatı', 'error');
    } else {
      showStatus('Dosya içe aktarılırken hata oluştu', 'error');
    }
    importFileInput.value = '';
  }
}

// Dosyayı oku (Promise tabanlı)
function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// Domain formatını kontrol et
function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain) || domain.includes('.');
}

// Status mesajı göster
function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type} show`;
  
  setTimeout(() => {
    statusMessage.classList.remove('show');
  }, 3000);
}

console.log('✅ Popup script initialized'); 