# Download File Renamer

İndirilen dosyaların adını URL'ye göre otomatik olarak değiştiren Chrome uzantısı.

## Özellikler

- Belirli domainlerden indirilen dosyaların başına prefix ekler
- Otomatik dosya adı değiştirme
- İndirme geçmişi takibi

## Kurulum

1. Chrome'da `chrome://extensions/` adresine gidin
2. "Geliştirici modu"nu etkinleştirin
3. "Paketlenmemiş uzantı yükle" butonuna tıklayın
4. Bu klasörü seçin

## Kullanım

Uzantı otomatik olarak çalışır. Desteklenen domainlerden dosya indirdiğinizde dosya adının başına uygun prefix eklenir:
- `test.dakika.com.tr` → `test_` prefix
- `dev.dakika.com.tr` → `dev_` prefix  
- `app.dakika.com.tr` → `prod_` prefix 

urlPrefixRules fonksiyonu içerisine örnekteki gibi istediğiniz url ve indirilen dosyanın başına eklenecek değeri yazabilirsiniz.