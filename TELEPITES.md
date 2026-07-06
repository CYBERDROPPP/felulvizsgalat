# Raktárszerviz Állványfelülvizsgálat — Telepítési útmutató

## Mi ez?

Egyfájlos webalkalmazás az MSZ EN 15635 szerinti éves állványfelülvizsgálatok helyszíni
rögzítéséhez. Telefonon működik, **internet nélkül is** — minden adat az eszközön tárolódik,
és amikor van kapcsolat, Dropboxba szinkronizál.

## Fájlok

| Fájl | Szerepe |
|---|---|
| `index.html` | A teljes alkalmazás (minden funkció ebben van) |
| `manifest.json` | Telefonra telepítéshez (kezdőképernyő ikon) |
| `sw.js` | Offline működés (gyorsítótár) |
| `icon-192.png`, `icon-512.png` | Alkalmazás-ikonok |

## 1. Feltöltés GitHub Pages-re (ugyanúgy, mint a korábbi próbálkozásnál)

1. GitHub-on hozzatok létre egy repository-t (vagy használjátok a meglévő `felulvizsgalat` repót).
2. Töltsétek fel **mind az 5 fájlt** a repó gyökerébe (a meglévő fájlokat felülírva).
3. Settings → Pages → Source: `main` branch → Save.
4. Az app elérhető lesz: `https://<felhasznalonev>.github.io/<repo>/index.html`

Fontos: HTTPS kell a kamerához (QR-olvasás) — a GitHub Pages ezt automatikusan biztosítja.

## 2. Telepítés a telefonra

- **Android (Chrome):** nyissátok meg az oldalt → menü (⋮) → „Alkalmazás telepítése” / „Hozzáadás a kezdőképernyőhöz”.
- **iPhone (Safari):** Megosztás gomb → „Főképernyőhöz adás”.

Az első megnyitás után az app **offline is működik** (a szükséges részeket a telefon eltárolja).

## 3. Dropbox szinkronizáció beállítása (egyszer kell megcsinálni)

1. Menjetek a https://www.dropbox.com/developers/apps oldalra (a cég Dropbox fiókjával belépve).
2. „Create app” → **Scoped access** → **App folder** (így az app csak a saját mappáját látja,
   a Dropbox „Apps/<appnév>” mappájában).
3. Az app **Settings** fülén:
   - Az **App key**-t másoljátok ki (erre lesz szükség a telefonon).
   - **Redirect URIs** mezőbe írjátok be PONTOSAN az app címét, pl.:
     `https://<felhasznalonev>.github.io/<repo>/index.html`
     (Add gomb!)
4. A **Permissions** fülön pipáljátok be: `files.content.write` és `files.content.read` → Submit.
5. A telefonon az appban: **Beállítások → Dropbox szinkronizáció** → App key beillesztése →
   „Dropbox összekapcsolása” → engedélyezés.

Ezután minden eszköz, amin ugyanezzel az App key-jel és ugyanabba a Dropbox fiókba
kapcsolódtok, **ugyanazt az adatbázist látja** (jegyzőkönyvek, fotók, törzsadatok).

### Hogyan szinkronizál?

- Automatikusan: amikor az eszköz internetet kap, illetve 5 percenként, és lezáráskor.
- Kézzel: Beállítások → „Szinkronizálás most”.
- Ütközésnél a frissebb módosítás nyer (bejegyzésenként).
- Két vizsgáló esetén ajánlott: **külön raktárakat** vegyetek fel ugyanabban a jegyzőkönyvben.

## 4. Bejelentkezés és felhasználók

- **Első indításkor** az app admin fiók létrehozását kéri (név, felhasználónév, jelszó).
  Ha másik eszközön már használjátok, ehelyett a „Dropbox összekapcsolása és visszaállítás"
  gombbal töltsd le a meglévő fiókokat, majd lépj be a sajátoddal.
- **Az admin** a Beállítások → Felhasználók alatt vesz fel új vizsgálókat (név, felhasználónév,
  e-mail, jelszó, aláírás). Jelszót csak az admin tud állítani / visszaállítani.
- **Az aláírást** az admin egyszer felveszi a felhasználónál — lezáráskor automatikusan
  betöltődik a jegyzőkönyvre (át is rajzolható a helyszínen).
- **Mindenki a saját vizsgálatait látja**; az admin mindenkiét.
- **Dropboxban** minden felhasználó a saját almappájába szinkronizál
  (`Apps/<appnév>/felhasznalok/<mappanév>/`); a közös törzsadatok (ügyfelek, gyártók,
  sablonok, fiókok) a `kozos.json`-ban vannak.

## 5. Napi használat

1. **Új felülvizsgálat indítása** → ügyfél (korábbiból választható — ilyenkor a raktárak,
   tárhelyek, gyártók emlékezetből előtöltődnek), kapcsolattartó, vizsgáló(k).
2. Raktárak felvétele → tárhelyenként sérülések rögzítése:
   tárhelykód (kézzel / QR / vonalkód), sor, szint, gyártó, sérülés-mátrix,
   Zöld/Sárga/Piros besorolás, megjegyzés (sablonokból), fotók.
   Belső adatok (cikkszám, mennyiség, méret) csak a belső Excelben jelennek meg.
3. **Automatikus mentés** minden változásnál + percenként — áramszünet/összeomlás után folytatható.
4. **Lezárás**: összesítés, MEGFELELT / NEM FELELT MEG (automatikus), következő vizsgálat
   dátuma (+1 év), két aláírás az érintőkijelzőn.
5. **Exportok**:
   - PDF: megnyílik a nyomtatási nézet → a rendszer „Mentés PDF-ként” opciójával
     menthető / azonnal megosztható (fedlap + kategória-leírások + hibajegyzék-mátrix + fotómelléklet).
   - Excel ügyfélnek / Excel belső: valódi .xlsx fájl, megosztható közvetlenül (Gmail, Drive stb.).
   - E-mail gomb: előre megírt levelet nyit a kapcsolattartó címére.

## 6. Biztonsági mentés

Dropbox nélkül is: Beállítások → „Teljes mentés letöltése (JSON)” — ez mindent tartalmaz
(fotókkal együtt), és bármely eszközön visszatölthető.

## Ismert korlátok (első verzió)

- A PDF a rendszer nyomtatási párbeszédén keresztül készül (ez garantálja a hibátlan
  magyar ékezeteket minden telefonon).
- Az e-mail küldés a telefon levelezőjét nyitja meg; a csatolmányt az Excel/PDF
  megosztás gombbal kell hozzáadni (statikus app szerver nélkül nem tud automatikusan csatolni).
- Google Drive szinkron: későbbi bővítés (a Dropbox-integráció a teljes értékű).
