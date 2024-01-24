const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const Discord = require('discord.js-selfbot-v13');
const colors = require('colors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let config = require('./config.json');
const client = new Discord.Client();

async function anaMenu() {
  console.log("XANAX HESAP TOOL'A HOŞGELDİNİZ GİRİŞ İÇİN KEY GİRİNİZ".rainbow);

  await sorKey();
}

async function sorKey() {
  await rl.question('Lütfen API keyinizi girin: ', async (key) => {
    try {
      const response = await axios.get(`https://handsomely-sable-hunter.glitch.me/atilla?key=${key}`);
      const apiCevap = response.data;

      if (apiCevap.Status === true) {
        console.log('Giriş başarılı!'.green);
        console.clear();
        await bekletVeIslemSec();
      } else {
        console.log('Giriş reddedildi. Geçerli bir API key giriniz.'.red);
        rl.close();
      }
    } catch (error) {
      console.error('API ile iletişim hatası:', error.message.red);
      rl.close();
    }
  });
}

async function bekletVeIslemSec() {
  console.log('Ana Menü'.magenta);
  console.log('1- Botu Başlat'.green);
  console.log('2- Ayarlar'.yellow);
  console.log('3- Çıkış'.red);

  await rl.question('Yapmak istediğiniz işlemi seçin (1-3): ', async (secim) => {
    switch (secim) {
      case '1':
        console.log('Botu başlat seçildi.'.green);
        await baslat();
        break;
      case '2':
        console.log('Ayarlar seçildi.'.yellow);
        await ayarlarMenu();
        break;
      case '3':
        console.log('Çıkış seçildi. Konsol kapatılıyor.'.red);
        rl.close();
        break;
      default:
        console.log('Geçersiz bir seçim yaptınız. Lütfen tekrar deneyin.'.red);
        await bekletVeIslemSec();
    }
  });
}

async function ayarlarMenu() {
  console.log('Ayarlar Menüsü'.yellow);
  console.log('1- Token Değiştir'.cyan);
  console.log('2- Webhook Değiştir'.cyan);
  console.log('3- Sunucu Güncelle'.cyan);
  console.log('4- Yeni Sunucu Ekle'.magenta);
  console.log('5- Sunucu Sil'.red);
  console.log('6- Ana Menüye Dön'.magenta);

  await rl.question('Yapmak istediğiniz ayar numarasını seçin (1-6): ', async (secim) => {
    switch (secim) {
      case '1':
        await tokenDegistir();
        break;
      case '2':
        await webhookDegistir();
        break;
      case '3':
        await sunucuGuncelle();
        break;
      case '4':
        await yeniSunucuEkle();
        break;
      case '5':
        await sunucuSil();
        break;
      case '6':
        await bekletVeIslemSec();
        break;
      default:
        console.log('Geçersiz bir seçim yaptınız. Lütfen tekrar deneyin.'.red);
        await ayarlarMenu();
    }
  });
}

async function tokenDegistir() {
  await rl.question('Yeni token\'ı girin: ', (yeniToken) => {
    config.token = yeniToken;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    console.log('Token başarıyla değiştirildi.'.green);
    ayarlarMenu();
  });
}

async function webhookDegistir() {
  await rl.question('Yeni webhook\'u girin: ', (yeniWebhook) => {
    config.webhook = yeniWebhook;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    console.log('Webhook başarıyla değiştirildi.'.green);
    ayarlarMenu();
  });
}

async function sunucuGuncelle() {
  console.log('Sunucular:'.cyan);
  config.değişkenler.forEach((sunucu, index) => {
    console.log(`${index + 1}- ${sunucu.isim}`);
  });

  await rl.question('Güncellenecek sunucunun numarasını seçin: ', async (secim) => {
    const sunucuIndex = parseInt(secim) - 1;

    if (sunucuIndex >= 0 && sunucuIndex < config.değişkenler.length) {
      await sunucuDegiskenleriniGuncelle(sunucuIndex);
    } else {
      console.log('Geçersiz bir seçim yaptınız. Lütfen tekrar deneyin.'.red);
      await sunucuGuncelle();
    }
  });
}

async function yeniSunucuEkle() {
  const yeniSunucu = {};

  await rl.question('Yeni sunucu ismini girin: ', async (isim) => {
    yeniSunucu.isim = isim.trim();
  });

  const degiskenler = ['sunucuId', 'kanalId', 'time', 'message', 'botId'];

  for (const degisken of degiskenler) {
    await rl.question(`Yeni sunucu için ${degisken} girin: `, async (cevap) => {
      yeniSunucu[degisken] = cevap.trim();
    });
  }

  config.değişkenler.push(yeniSunucu);
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

  console.log(`${yeniSunucu.isim} sunucu başarıyla eklendi.`.green);

  await sunucuGuncelle();
}

async function sunucuDegiskenleriniGuncelle(sunucuIndex) {
  const guncellenecekSunucu = config.değişkenler[sunucuIndex];
  const degiskenler = ['isim', 'sunucuId', 'kanalId', 'time', 'message', 'botId'];

  async function degiskenSor(index) {
    if (index < degiskenler.length) {
      await rl.question(`Yeni ${degiskenler[index]} girin (${guncellenecekSunucu[degiskenler[index]]}): `, async (cevap) => {
        guncellenecekSunucu[degiskenler[index]] = cevap.trim();
        await degiskenSor(index + 1);
      });
    } else {
      fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
      console.log(`${guncellenecekSunucu.isim} sunucu başarıyla güncellendi.`.green);
      await sunucuGuncelle();
    }
  }

  await degiskenSor(0);
}

async function sunucuSil() {
  console.log('Sunucular:'.cyan);
  config.değişkenler.forEach((sunucu, index) => {
    console.log(`${index + 1}- ${sunucu.isim}`);
  });

  await rl.question('Silinecek sunucunun numarasını seçin: ', async (secim) => {
    const sunucuIndex = parseInt(secim) - 1;

    if (sunucuIndex >= 0 && sunucuIndex < config.değişkenler.length) {
      const silinecekSunucu = config.değişkenler[sunucuIndex];
      console.log(`"${silinecekSunucu.isim}" sunucu siliniyor...`.yellow);

      // Sunucuyu config dosyasından kaldır
      config.değişkenler.splice(sunucuIndex, 1);
      fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

      console.log(`"${silinecekSunucu.isim}" sunucu başarıyla silindi.`.green);
      await ayarlarMenu();
    } else {
      console.log('Geçersiz bir seçim yaptınız. Lütfen tekrar deneyin.'.red);
      await sunucuSil();
    }
  });
}

async function baslat() {
  client.once('ready', async () => {
    console.log(`Bot giriş yaptı: ${client.user.tag}`.green);
    await mesajlariAt();
    setInterval(async () => await mesajlariAt(), 1000 * 60); // 1 dakika (60 saniye) aralıklarla kontrol et
  });

  await client.login(config.token);
}

async function mesajlariAt() {
  config.değişkenler.forEach(async (sunucu) => {
    try {
      const sunucuObjesi = await client.guilds.fetch(sunucu.sunucuId);

      if (!sunucuObjesi) {
        console.log(`Sunucu bulunamadı: ${sunucu.sunucuId}`.red);
        return;
      }

      const kanalObjesi = sunucuObjesi.channels.cache.get(sunucu.kanalId);

      if (!kanalObjesi) {
        console.log(`Kanal bulunamadı: ${sunucu.kanalId}`.red);
        return;
      }

      const botObjesi = sunucuObjesi.members.cache.get(sunucu.botId);

      if (!botObjesi || botObjesi.presence.status === 'offline') {
        console.log(`Bot offline veya bulunamadı: ${sunucu.botId}`.red);
        return;
      }

      // Sadece belirtilen bot ID'sine sahip botların mesajlarını işle
      if (botObjesi.user.id === sunucu.botId) {
        kanalObjesi.send(sunucu.message)
          .then(() => console.log(`Mesaj gönderildi: ${sunucu.isim}`.green))
          .catch((error) => console.error(`Mesaj gönderme hatası: ${error.message}`.red));
      }

      // Kullanıcıdan gelen DM'leri kontrol et
      if (botObjesi.user.id === client.user.id) {
        client.on('message', async (dmMessage) => {
          if (dmMessage.channel.type === 'dm') {
            // DM'den gelen mesajı webhook ile belirtilen URL'ye gönder
            await axios.post(sunucu.webhook, { content: `DM'den mesaj alındı: ${dmMessage.content}` });
          }
        });
      }
    } catch (error) {
      console.error(`Sunucu bulma hatası: ${error.message}`.red);
    }
  });
}

anaMenu();
