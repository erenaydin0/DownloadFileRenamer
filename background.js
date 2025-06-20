// Download tracker for file renaming automation
console.log('🚀 Download File Renamer Extension Started!');

// Konfigürasyon
const CONFIG = {
  createTrackingFile: false, // JSON dosyası oluşturulsun mu?
  keepTrackingData: true,    // Storage'da tracking verisi tutulsun mu?
  maxRecords: 50            // Maksimum kayıt sayısı
};

// URL'den prefix belirleme kuralları
const urlPrefixRules = {
  'test.dakika.com.tr': 'test_',
  'dev.dakika.com.tr': 'dev_',
  'app.dakika.com.tr': 'prod_'
};

console.log('📋 URL Prefix Rules loaded:', urlPrefixRules);
console.log('⚙️ Configuration:', CONFIG);

// İndirme dosya adı belirleme - EN ÖNEMLİ KISIM!
chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
  console.log('🎯 Determining filename for:', downloadItem.url);
  
  try {
    // URL'den domain'i çıkar
    const url = new URL(downloadItem.url);
    const domain = url.hostname;
    console.log('🏠 Domain extracted:', domain);
    
    // Prefix'i belirle
    let prefix = '';
    for (const [ruleDomain, rulePrefix] of Object.entries(urlPrefixRules)) {
      if (domain.includes(ruleDomain)) {
        prefix = rulePrefix;
        console.log('✅ Prefix found:', prefix, 'for domain:', domain);
        break;
      }
    }
    
    if (prefix && downloadItem.filename) {
      // Dosya adının başına prefix ekle
      const originalFilename = downloadItem.filename;
      const newFilename = prefix + originalFilename;
      
      console.log('📝 Original filename:', originalFilename);
      console.log('🔄 New filename:', newFilename);
      
      // Yeni dosya adını öner
      suggest({filename: newFilename});
      console.log('✅ Filename changed successfully!');
      
      // Tracking için kaydet (isteğe bağlı)
      if (CONFIG.keepTrackingData) {
        saveTrackingData({
          downloadId: downloadItem.id,
          originalFilename: originalFilename,
          newFilename: newFilename,
          url: downloadItem.url,
          domain: domain,
          prefix: prefix,
          timestamp: new Date().toISOString()
        });
      }
    } else {
      console.log('❌ No prefix rule found for domain:', domain);
      suggest(); // Dosya adını değiştirme
    }
  } catch (error) {
    console.error('❌ Error determining filename:', error);
    suggest(); // Hata durumunda dosya adını değiştirme
  }
});

// İndirme başladığında çalışır (bilgi amaçlı)
chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log('📥 Download started:', downloadItem.url);
});

// İndirme tamamlandığında çalışır
chrome.downloads.onChanged.addListener((downloadDelta) => {
  if (downloadDelta.state && downloadDelta.state.current === 'complete') {
    console.log('✅ Download completed:', downloadDelta.id);
  }
});

// Tracking verilerini kaydet
function saveTrackingData(data) {
  console.log('💾 Saving tracking data:', data);
  
  chrome.storage.local.get(['downloadTrackingData'], (result) => {
    let existingData = result.downloadTrackingData || [];
    existingData.push(data);
    
    // Son N kaydı tut (performans için)
    if (existingData.length > CONFIG.maxRecords) {
      existingData = existingData.slice(-CONFIG.maxRecords);
    }
    
    chrome.storage.local.set({downloadTrackingData: existingData}, () => {
      console.log('✅ Tracking data saved to storage');
      console.log('📊 Total tracking records:', existingData.length);
      
      // JSON dosyasını oluştur (sadece istenirse)
      if (CONFIG.createTrackingFile) {
        createTrackingFile(existingData);
      } else {
        console.log('📋 JSON file creation disabled');
      }
    });
  });
}

// Tracking dosyasını oluştur (Service Worker uyumlu)
function createTrackingFile(data) {
  console.log('💾 Creating tracking file...');
  
  try {
    // JSON verisini string olarak hazırla
    const jsonContent = JSON.stringify(data, null, 2);
    
    // Data URL kullan (Service Worker'da çalışır)
    const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonContent);
    
    // Downloads API ile dosyayı indir
    chrome.downloads.download({
      url: dataUrl,
      filename: 'download_tracker.json',
      conflictAction: 'overwrite',
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Failed to create tracking file:', chrome.runtime.lastError);
      } else {
        console.log('✅ Tracking file created:', downloadId);
      }
    });
  } catch (error) {
    console.error('❌ Error creating tracking file:', error);
  }
}

// Extension kurulduğunda çalışır
chrome.runtime.onInstalled.addListener(() => {
  console.log('🎉 Download File Renamer Extension installed');
  
  // İlk konfigürasyonu kaydet
  chrome.storage.local.set({
    urlPrefixRules: urlPrefixRules,
    config: CONFIG,
    extensionVersion: '1.2'
  }, () => {
    console.log('⚙️ Initial configuration saved');
  });
});

console.log('🔄 Background script loaded and ready!'); 