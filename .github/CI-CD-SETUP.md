# CI/CD Setup Instrukcijos

## 🚀 Greitas CI/CD Setup

### 1. GitHub Secrets (nebūtina, bet rekomenduojama)

Jei norite naudoti Cypress Dashboard (recording):

1. Eiti į GitHub repository settings
2. **Settings** → **Secrets and variables** → **Actions**
3. Pridėti secrets:
   - `CYPRESS_RECORD_KEY` - jūsų Cypress Dashboard project key
   - (GITHUB_TOKEN jau automatiškai prieinamas)

### 2. Įjungti GitHub Actions

GitHub Actions automatiškai aktyvuojasi kai push'inate workflows failus. Patikrinti:

```bash
# Commit ir push CI/CD failus
git add .github/
git add package.json
git add .gitignore
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

### 3. Peržiūrėti Workflows

Eiti į: `https://github.com/edgzub/Cypress-sweetshop/actions`

Matysite 4 workflows:
- ✅ Cypress Tests (main CI)
- 🌙 Nightly Full Test Suite
- 🔍 PR Tests
- 👤 Manual Test Run

## 📋 Workflow Aprašymai

### Cypress Tests (Main CI)
**Failas:** `.github/workflows/cypress.yml`

**Kada paleidžiama:**
- Push į `main` arba `develop` šakas
- Pull Request į `main` arba `develop`
- Kiekvieną dieną 9:00 UTC (automatiškai)
- Rankiniu būdu

**Kas testuojama:**
- Visi sweetshop testai
- 3 naršyklėse: Chrome, Firefox, Edge
- Paralelizacija su 2 konteineriais (greičiau)

**Rezultatai:**
- Screenshots (jei failed)
- Videos
- Test results

### Nightly Full Suite
**Failas:** `.github/workflows/nightly.yml`

**Kada paleidžiama:**
- Kiekvieną naktį 2:00 UTC
- Rankiniu būdu

**Kas testuojama:**
- Visi 6 test suites atskirai:
  - sweetshop.smoke.cy.js
  - sweetshop.auth.cy.js
  - sweetshop.homepage.cy.js
  - sweetshop.catalog-basket.cy.js
  - sweetshop.basket-validation.cy.js
  - sweetshop.checkout.cy.js

**Tikslas:**
- Pilnas regresijos testavimas
- Ankstyvų bugų aptikimas

### PR Tests
**Failas:** `.github/workflows/pr-tests.yml`

**Kada paleidžiama:**
- Pull Request atidarymas
- PR atnaujinimas (nauji commits)

**Kas testuojama:**
- Smoke testai (kritiniai)
- Auth testai (login)

**Rezultatai:**
- Automatinis komentaras PR su rezultatais
- ✅ arba ❌ status

### Manual Test Run
**Failas:** `.github/workflows/manual-run.yml`

**Kada paleidžiama:**
- Tik rankiniu būdu per GitHub UI

**Galima pasirinkti:**
- Konkretų spec failą arba visus
- Naršyklę (Chrome/Firefox/Edge)
- Headed/headless režimą

**Kaip paleisti:**
1. Eiti į GitHub → Actions tab
2. Kairėje pasirinkti "Manual Test Run"
3. Dešinėje spausti "Run workflow"
4. Pasirinkti parametrus
5. Spausti žalią "Run workflow" mygtuką

## 🔧 Workflow Konfigūracija

### Pakeisti test schedule:

Redaguoti `.github/workflows/cypress.yml`:
```yaml
schedule:
  - cron: '0 9 * * *'  # Kiekvieną dieną 9:00 UTC
  # Arba:
  - cron: '0 */6 * * *'  # Kas 6 valandas
  - cron: '0 9 * * 1-5'  # Tik darbo dienomis 9:00
```

### Pridėti daugiau naršyklių:

Redaguoti `.github/workflows/cypress.yml`:
```yaml
strategy:
  matrix:
    browser: [chrome, firefox, edge, electron]  # Pridėti electron
```

### Pakeisti paralelizaciją:

```yaml
strategy:
  matrix:
    containers: [1, 2, 3, 4]  # 4 konteineriai vietoj 2
```

## 📊 Status Badges

Pridėti į README.md:

```markdown
![Cypress Tests](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/cypress.yml/badge.svg)
![Nightly Tests](https://github.com/edgzub/Cypress-sweetshop/actions/workflows/nightly.yml/badge.svg)
```

## 🐛 Troubleshooting

### Tests nepavyksta CI, bet lokaliai veikia:

1. **Timeout problemos:**
   ```javascript
   // cypress.config.js
   defaultCommandTimeout: 10000,
   pageLoadTimeout: 60000
   ```

2. **Skirtingi viewport:**
   ```javascript
   // cypress.config.js
   viewportWidth: 1280,
   viewportHeight: 900
   ```

3. **Browserai nepalaiko:**
   - Patikrinti ar GitHub Actions ubuntu-latest palaiko jūsų browser versiją

### Artifacts neatsiranda:

Patikrinti ar yra:
```yaml
- name: Upload screenshots
  if: failure()  # arba always()
  uses: actions/upload-artifact@v4
  with:
    path: cypress/screenshots
```

### Workflow nepaleidžiama:

1. Patikrinti ar failas `.github/workflows/*.yml` formatas teisingas
2. Patikrinti GitHub Actions logs: Actions tab → Failed workflow → View logs
3. Patikrinti ar branch pavadinimas atitinka trigger:
   ```yaml
   on:
     push:
       branches: [ main ]  # Turi būti "main", ne "master"
   ```

### ❌ ERROR: "npm ci can only install packages when your package.json and package-lock.json are in sync"

**Problema:** `package-lock.json` neegzistuoja arba yra ignore'inamas `.gitignore` faile.

**Sprendimas:**

1. **Pašalinti `package-lock.json` iš `.gitignore`:**
   ```bash
   # Redaguoti .gitignore ir ištrinti eilutę:
   # package-lock.json
   ```

2. **Sugeneruoti naują `package-lock.json`:**
   ```bash
   npm install
   ```

3. **Commitinti į repository:**
   ```bash
   git add package-lock.json
   git commit -m "fix: add package-lock.json for CI/CD"
   git push origin main
   ```

**Kodėl svarbu:**
- `npm ci` yra greitesnis nei `npm install` CI/CD aplinkoje
- `npm ci` užtikrina, kad visi instaliuoja tą pačią dependencies versiją
- `package-lock.json` **TURI** būti commitintas į git repository

## 💡 Best Practices

### 1. Suskirstyti testus pagal prioritetą:

```yaml
# PR - tik smoke (greita)
spec: cypress/e2e/sweetshop.smoke.cy.js

# Nightly - visi testai (pilna)
spec: cypress/e2e/sweetshop.*.cy.js
```

### 2. Naudoti test retries CI:

```javascript
// cypress.config.js
retries: {
  runMode: 2,    // CI/CD - 2 retries
  openMode: 0    // Local - 0 retries
}
```

### 3. Disable video tik smoke testams:

```javascript
// cypress.config.js
video: process.env.CI ? true : false
```

### 4. Cache dependencies:

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Cache npm dependencies
```

## 🎯 Sekantys Žingsniai

1. ✅ Push workflows į GitHub
2. ✅ Patikrinti ar Actions veikia
3. ✅ Sukurti test PR ir peržiūrėti PR tests
4. ✅ Laukti nightly run rezultatų
5. ✅ Pridėti status badges į README
6. 🔄 Optimizuoti pagal poreikius

## 📚 Naudingi Šaltiniai

- [Cypress CI Documentation](https://docs.cypress.io/guides/continuous-integration/introduction)
- [GitHub Actions - Cypress](https://github.com/cypress-io/github-action)
- [Cron Schedule Expression](https://crontab.guru/)
