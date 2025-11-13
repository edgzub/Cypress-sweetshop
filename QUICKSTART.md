# 🚀 Quick Start Guide

## Greitas Pradžios Vadovas

### ⚡ 3 Žingsniai iki testų paleidimo:

```bash
# 1. Įdiegti priklausomybes
npm install

# 2. Paleisti testus
npm test

# 3. Arba atidaryti Cypress UI
npm run cy:open
```

## 📦 Kas buvo sukurta?

### ✅ Package.json Scripts

Dabar galite naudoti šias komandas:

| Komanda | Aprašymas |
|---------|-----------|
| `npm test` | Visi testai headless |
| `npm run cy:open` | Cypress UI |
| `npm run cy:run` | Tik sweetshop testai |
| `npm run cy:run:smoke` | Smoke testai |
| `npm run cy:run:auth` | Login testai |
| `npm run test:chrome` | Chrome naršyklėje |
| `npm run test:firefox` | Firefox naršyklėje |

### 🔄 GitHub Actions Workflows

4 automatiniai workflows:

1. **Cypress Tests** - main CI, kiekvienas push
2. **Nightly Full Suite** - pilni testai kas naktį
3. **PR Tests** - greiti testai Pull Request'ams
4. **Manual Run** - rankinis paleidimas su parametrais

### 📁 Nauji failai:

```
.github/
├── workflows/
│   ├── cypress.yml          # Main CI workflow
│   ├── nightly.yml          # Naktiniai testai
│   ├── pr-tests.yml         # PR testai
│   └── manual-run.yml       # Rankinis paleidimas
└── CI-CD-SETUP.md          # Detalios instrukcijos

.gitignore                   # Git ignore taisyklės
package.json                 # NPM scripts ir dependencies
README.md                    # Atnaujintas su CI/CD info
```

## 🎯 Sekantis žingsnis: GitHub Push

### Commit ir Push:

```bash
# 1. Pridėti visus failus
git add .

# 2. Commit
git commit -m "ci: add CI/CD with GitHub Actions workflows"

# 3. Push į GitHub
git push origin main
```

### Patikrinti CI/CD:

1. Eiti į: https://github.com/edgzub/Cypress-sweetshop
2. Paspausti **Actions** tab
3. Matysite paleidžiamus workflows! 🎉

## 🔧 Konfigūracija

### Lokalus testavimas:

```bash
# Smoke testai (greičiausi)
npm run cy:run:smoke

# Visi testai su Chrome
npm run test:chrome

# Interactive mode
npm run cy:open
```

### CI/CD testavimas:

**Automatinis:**
- Push commit → Automatic run
- Create PR → PR tests run
- 9:00 AM kasdien → Full tests run
- 2:00 AM kasdien → Nightly suite run

**Rankinis:**
1. GitHub → Actions → Manual Test Run
2. Run workflow
3. Pasirinkti parametrus
4. Run!

## 📊 Rezultatų Peržiūra

### GitHub Actions:

```
Actions tab → Pasirinkti run → Peržiūrėti:
├── Test results (passed/failed)
├── Screenshots (jei failed)
├── Videos (visos test runs)
└── Logs (detailed output)
```

### Lokaliai:

```
cypress/
├── screenshots/  # Kai testai nepavyksta
└── videos/       # Visos test runs
```

## 🎨 Status Badges

README.md dabar rodo CI/CD status:

![Cypress Tests](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/cypress.yml/badge.svg)

- ✅ Žalias = visi testai pavyko
- ❌ Raudonas = kažkas nepavyko
- 🟡 Geltonas = tebevyksta

## 💡 Pro Tips

### 1. Test vietą specifiniu failu:

```bash
npm run cy:run -- --spec "cypress/e2e/sweetshop.smoke.cy.js"
```

### 2. Headed režimas (matoma naršyklė):

```bash
npm run test:headed
```

### 3. Konkretaus testo paleidimas Cypress UI:

```bash
npm run cy:open
# Tada UI pasirinkti norimą spec failą
```

### 4. CI/CD debug:

- Pažiūrėti Actions → Failed workflow → Logs
- Download artifacts (screenshots/videos)
- Check test output sekciją

## 🆘 Pagalba

### Testai nepavyksta?

```bash
# 1. Patikrinti ar aplikacija veikia
curl https://sweetshop.netlify.app

# 2. Update Cypress
npm install cypress@latest --save-dev

# 3. Clear cache
npx cypress cache clear
npx cypress install
```

### CI/CD problemos?

**❌ "npm ci can only install packages..." klaida?**

```bash
# 1. Patikrinti ar package-lock.json yra commitintas
git ls-files | grep package-lock.json

# 2. Jei nėra, pridėti:
npm install
git add package-lock.json
git commit -m "fix: add package-lock.json"
git push

# 3. Patikrinti .gitignore - neturėtų būti:
# package-lock.json  ❌ Ištrinti šią eilutę!
```

**Kitos problemos?**

Žiūrėti: `.github/CI-CD-SETUP.md` - ten pilnos instrukcijos ir troubleshooting!

## ✨ Sekantys Žingsniai

- [ ] Push į GitHub
- [ ] Patikrinti Actions tab
- [ ] Sukurti test PR
- [ ] Peržiūrėti PR test rezultatus
- [ ] Laukti nightly run rytoj
- [ ] Enjoy automated testing! 🎉

## 📚 Dokumentacija

- **README.md** - Pilnas projekto aprašymas
- **.github/CI-CD-SETUP.md** - CI/CD detalės
- **QUICKSTART.md** - Šis failas (greitas startas)

---

**Paruošta ir pasiruošusi naudoti!** 🚀

Jei kiltų klausimų, žiūrėkite pilną dokumentaciją arba GitHub Actions logs.
