# Cypress Sweet Shop Tests 🍬

[![Cypress Tests](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/cypress.yml/badge.svg)](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/cypress.yml)
[![Nightly Tests](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/nightly.yml/badge.svg)](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/nightly.yml)
[![PR Tests](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/pr-tests.yml/badge.svg)](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/pr-tests.yml)

Automatizuoti E2E testai Sweet Shop demo aplikacijai naudojant Cypress.

## 📋 Turinys

- [Projekto aprašymas](#projekto-aprašymas)
- [Reikalavimai](#reikalavimai)
- [Įdiegimas](#įdiegimas)
- [Testų paleidimas](#testų-paleidimas)
- [CI/CD](#cicd)
- [Projekto struktūra](#projekto-struktūra)

## 🎯 Projekto aprašymas

Šis projektas testuoja [Sweet Shop](https://sweetshop.netlify.app) demo aplikaciją, kuri yra sąmoningai sukurta su klaidomis testavimo tikslais.

### Testuojami scenarijai:

- ✅ **Smoke tests** - pagrindiniai kritiniai testai
- 🔐 **Authentication** - login funkcionalumas
- 🏠 **Homepage** - pagrindinio puslapio turinio validacija
- 🛒 **Catalog & Basket** - prekių katalogas ir krepšelio operacijos
- 📋 **Basket Validation** - formos validacijos testai
- 💳 **Checkout** - checkout proceso testai

## 🔧 Reikalavimai

- Node.js 18+ arba 20+
- npm arba yarn
- Git

## 📥 Įdiegimas

1. **Klonuoti repozitoriją:**
```bash
git clone https://github.com/edgzub/Cypress-sweetshop.git
cd Cypress-sweetshop
```

2. **Įdiegti priklausomybes:**
```bash
npm install
```

## 🚀 Testų paleidimas

### Interaktyvi Cypress Console
```bash
npm run cy:open
```

### Headless režimas (CLI)
```bash
# Visi testai
npm test

# Tik sweetshop testai
npm run cy:run

# Specifiniai testai
npm run cy:run:smoke      # Smoke testai
npm run cy:run:auth       # Login testai
npm run cy:run:homepage   # Homepage testai
npm run cy:run:catalog    # Katalogo ir krepšelio testai
npm run cy:run:basket     # Basket validacijos testai
npm run cy:run:checkout   # Checkout testai
```

### Skirtingose naršyklėse
```bash
npm run test:chrome   # Chrome
npm run test:firefox  # Firefox
npm run test:edge     # Edge
```

### Headed režimas (matoma naršyklė)
```bash
npm run test:headed
```

## 🔄 CI/CD

### GitHub Actions Workflows

Projektas naudoja **4 GitHub Actions workflows**:

#### 1️⃣ **Main Cypress Tests** (`.github/workflows/cypress.yml`)
- ⚡ Paleidžiamas: `push` į `main`/`develop` šakas, `pull request`, kasdien 9:00 UTC
- 🌐 Testuoja: **Chrome, Firefox, Edge** naršyklėse
- 🔄 Naudoja: Paralelizaciją su 2 konteineriais
- 📊 Rezultatai: Automatiškai įkeliami screenshots/videos esant klaidoms

**Kaip veikia:**
```yaml
Trigger: push to main → Install deps → Run tests in parallel → Upload artifacts
```

#### 2️⃣ **Nightly Full Suite** (`.github/workflows/nightly.yml`)
- 🌙 Paleidžiamas: Kiekvieną naktį 2:00 UTC
- 📋 Testuoja: Visus 6 test suites atskirai
- 📧 Siunčia: Pranešimus apie rezultatus
- 🎯 Tikslas: Pilnas regresijos testavimas

#### 3️⃣ **PR Tests** (`.github/workflows/pr-tests.yml`)
- 🔍 Paleidžiamas: Pull Request atidarymas/atnaujinimas
- ⚡ Testuoja: Tik smoke ir auth testus (greiti kritiškiausi testai)
- 💬 Komentuoja: PR su rezultatais
- 🎯 Tikslas: Greitas feedback ciklas

#### 4️⃣ **Manual Test Run** (`.github/workflows/manual-run.yml`)
- 👤 Paleidžiamas: Rankiniu būdu per GitHub UI
- ⚙️ Galima pasirinkti:
  - Kokį spec failą paleisti
  - Kokią naršyklę naudoti
  - Headed/headless režimą
- 🎯 Tikslas: Debugging ir ad-hoc testavimas

### Kaip paleisti CI/CD:

#### Automatinis paleidimas:
```bash
# Commit ir push į main šaką
git add .
git commit -m "feat: add new tests"
git push origin main
```

#### Rankinis paleidimas:
1. Eiti į GitHub repository
2. Skiltis **Actions**
3. Pasirinkti **Manual Test Run**
4. Spausti **Run workflow**
5. Pasirinkti parametrus ir paleisti

### CI/CD Rezultatų peržiūra:

```
GitHub → Actions tab → Pasirinkti workflow run → Peržiūrėti:
├── ✅ Test results
├── 📸 Screenshots (jei failed)
├── 🎥 Videos
└── 📊 Logs
```

### Artifacts:
Visi artifacts (screenshots, videos) saugomi **90 dienų** ir pasiekiami:
```
Actions → Workflow run → Artifacts section → Download
```

## 📁 Projekto struktūra

```
cypress/
├── e2e/                              # Test failai
│   ├── sweetshop.smoke.cy.js         # Smoke testai (2 tests)
│   ├── sweetshop.auth.cy.js          # Login testai (5 tests)
│   ├── sweetshop.homepage.cy.js      # Homepage testai (8 tests)
│   ├── sweetshop.catalog-basket.cy.js # Katalogo testai (10 tests)
│   ├── sweetshop.basket-validation.cy.js # Validacijos testai (11 tests)
│   └── sweetshop.checkout.cy.js      # Checkout testai (13 tests)
├── fixtures/
│   └── products.json                 # Test duomenys
├── support/
│   ├── commands.js                   # Custom Cypress komandos
│   └── e2e.js                        # Global setup
├── screenshots/                      # Screenshots (kai testai failed)
└── videos/                          # Test execution videos

.github/
└── workflows/                        # CI/CD workflows
    ├── cypress.yml                   # Pagrindiniai testai
    ├── nightly.yml                   # Naktiniai testai
    ├── pr-tests.yml                  # PR testai
    └── manual-run.yml                # Rankiniai testai

cypress.config.js                     # Cypress konfiguracija
package.json                          # NPM dependencies ir scripts
```

## 🛠️ Custom Commands

Projektas turi kelis custom Cypress commands:

```javascript
cy.nav('/sweets')                    // Navigacija
cy.addProduct('Chocolate Cups')      // Pridėti produktą
cy.basketBadge()                     // Gauti krepšelio badge elementą
cy.assertNoVisibleInvalidFeedback()  // Tikrinti validacijos klaidas
```

## 🐛 Žinomos aplikacijos problemos

Sweet Shop aplikacija turi sąmoningai įdėtų klaidų:

- Dubliuoti `id="name"` laukai (first name ir last name)
- Pristatymo kaina lieka po krepšelio ištuštinimo
- About puslapis kartais rodo "Page not found"
- JS skaičiavimai kartais netikslūs

Testai yra pritaikyti dirbti su šiomis problemomis.

## 📊 Test Coverage

| Test Suite | Tests Count | Status |
|-----------|-------------|--------|
| Smoke | 4 | ✅ |
| Auth | 5 | ✅ |
| Homepage | 8 | ✅ |
| Catalog & Basket | 10 | ✅ |
| Basket Validation | 11 | ✅ |
| Checkout | 13 | ✅ |
| **Total** | **51** | **✅** |


## 👤 Autorius

**edgzub** - [GitHub](https://github.com/edgzub)

## 🔗 Nuorodos

- [Sweet Shop Demo](https://sweetshop.netlify.app)
- [Cypress Documentation](https://docs.cypress.io)
- [GitHub Actions](https://docs.github.com/en/actions)