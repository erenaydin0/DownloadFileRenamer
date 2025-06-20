# Download File Renamer

İndirilen dosyaların adını URL'ye göre otomatik olarak değiştiren Chrome uzantısı. Minimal arayüz ile kural yönetimi ve dosya organizasyonu.

## ✨ Özellikler

### 🔄 Otomatik Dosya Yeniden Adlandırma
- Belirli domainlerden indirilen dosyaların başına otomatik prefix ekleme
- URL tabanlı dosya organizasyonu
- Gerçek zamanlı dosya adı değiştirme

### 🎛️ Gelişmiş Kural Yönetimi
- **Popup Arayüzü**: Kolay kural ekleme/silme
- **Dinamik Güncelleme**: Kurallar anında aktif oluyor
- **Validation**: Geçersiz domain/prefix kontrolü

### 📁 İçe/Dışa Aktarma
- **JSON Export**: Kuralları yedekleme
- **JSON Import**: Kuralları geri yükleme
- **Paylaşım**: Ekip arkadaşlarıyla kural paylaşımı
- **Geçersiz Kural Filtreleme**: İçe aktarmada otomatik validation

### 🌑 Minimal Dark UI
- Modern karanlık tema
- Compact tasarım (320x500px)
- Temiz tipografi
- Responsive scrollbar

## 🚀 Kurulum

1. Chrome'da `chrome://extensions/` adresine gidin
2. **"Geliştirici modu"**nu etkinleştirin (sağ üst köşe)
3. **"Paketlenmemiş uzantı yükle"** butonuna tıklayın
4. Bu proje klasörünü seçin
5. Uzantı toolbar'da görünecek

## 📋 Kullanım

### Kural Ekleme
1. **Uzantı ikonuna** tıklayın
2. **"Yeni Kural"** bölümünde:
   - **Domain**: `github.com`
   - **Prefix**: `github_`
3. **"Kural Ekle"** butonuna tıklayın

### Dosya İndirme
- Tanımlı domainlerden dosya indirin
- Dosya adının başına otomatik prefix eklenir
- Örnek: `document.pdf` → `github_document.pdf`

### Kural Yönetimi
- **Silme**: Kuralın yanındaki "Sil" butonuna tıklayın
- **Dışa Aktarma**: Tüm kuralları JSON dosyası olarak kaydedin
- **İçe Aktarma**: JSON dosyasından kuralları yükleyin

## 🛠️ Konfigürasyon

### Desteklenen Domain Formatları
```
✅ github.com
✅ subdomain.example.com
✅ test.site.co.uk
❌ http://site.com (protokol olmadan)
❌ site (TLD olmadan)
```

### Prefix Kuralları
```
✅ github_
✅ test-
✅ prod_v2_
❌ (boş prefix)
```

## 📤 Dışa Aktarma Formatı

```json
{
  "exportDate": "2024-01-15T10:30:00.000Z",
  "version": "1.2",
  "rules": {
    "github.com": "github_",
    "stackoverflow.com": "so_",
    "docs.google.com": "gdocs_"
  }
}
```

## 🔧 Gelişmiş Ayarlar

### Background.js Konfigürasyonu
```javascript
const CONFIG = {
  createTrackingFile: false,  // JSON log dosyası
  keepTrackingData: true,     // Storage'da geçmiş
  maxRecords: 50             // Max kayıt sayısı
};
```

### Storage Yapısı
```javascript
// Chrome Storage'da saklanan veriler
{
  urlPrefixRules: {
    "domain.com": "prefix_"
  },
  downloadTrackingData: [...],
  config: {...}
}
```

## 🎯 Kullanım Senaryoları

### 📊 Proje Bazlı Organizasyon
```
github.com        → github_
gitlab.com        → gitlab_
bitbucket.org     → bb_
```

### 🏢 Ortam Bazlı Ayrım
```
test.company.com  → test_
dev.company.com   → dev_
app.company.com   → prod_
```

### 📚 Kaynak Bazlı Grouping
```
docs.google.com   → gdocs_
drive.google.com  → gdrive_
stackoverflow.com → so_
```

## 🐛 Sorun Giderme

### Kural Çalışmıyor
- ✅ Domain formatını kontrol edin
- ✅ Prefix boş olmamalı
- ✅ Browser'ı yeniden başlatın

### Popup Açılmıyor
- ✅ Extensions sayfasında aktif olduğunu kontrol edin
- ✅ Permissions'ları kontrol edin
- ✅ Console'da hata var mı bakın

### İçe Aktarma Hatası
- ✅ JSON formatını kontrol edin
- ✅ `rules` objesi olduğunu doğrulayın
- ✅ Domain formatlarını kontrol edin

## 📝 Changelog

### v1.2 (Güncel)
- ✨ Popup arayüzü eklendi
- ✨ İçe/dışa aktarma özellikleri
- ✨ Minimal dark mode tasarımı
- ✨ Dinamik kural yönetimi
- 🗑️ Varsayılan kurallar kaldırıldı
- 🛠️ Storage tabanlı konfigürasyon

### v1.1
- 🔄 Service Worker migrasyonu
- 📊 İndirme takibi eklendi
- 🛡️ Hata yönetimi iyileştirildi

### v1.0
- 🎉 İlk sürüm
- 🔄 Temel dosya yeniden adlandırma

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun: `git checkout -b yeni-ozellik`
3. Commit yapın: `git commit -am 'Yeni özellik eklendi'`
4. Push yapın: `git push origin yeni-ozellik`
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔗 Bağlantılar

- **Issues**: Sorun bildirin
- **Discussions**: Önerilerde bulunun
- **Wiki**: Detaylı dokümantasyon

---

**File Renamer** - Dosyalarınızı otomatik olarak organize edin! 🚀