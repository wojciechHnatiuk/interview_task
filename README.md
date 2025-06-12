# Google Web Interface Test Suite

This project demonstrates an automated testing solution for Google's web interfaces using Cypress. It was created as part of a job interview task to showcase test automation skills and best practices.

## 🧪 Test Plan & Approach

### Testing Approach

This project uses a hybrid approach combining:

- **Page Object Model (POM)** - Encapsulates page elements and interactions into reusable classes
- **App Actions Pattern** - Implements high-level custom utilities and shorthands as cy chainable methods
- **Cross-browser & Cross-viewport Testing** - Tests run across different screen sizes
- **Multi-language Support** - Tests verify the application across multiple languages
- **Abstract Base Class** - Provides core functionality for all page objects

### Testing Limitations

⚠️ **Important Note**: This test suite focuses on UI navigation and element verification. Automated search testing is intentionally excluded as it would violate Google's Terms of Service, which prohibits automated queries to their search engine.

### What's Being Tested

The test suite verifies the following Google web interfaces and functionality:

1. **Google Homepage**

   - Initial load elements visibility
   - Cookie consent modal behavior
   - Language-specific content
   - Country-specific content based on IP
   - SVG icons visibility

2. **Google Apps Menu**

   - Menu toggle functionality
   - Visibility of app items
   - Proper menu dismissal

3. **Navigation**

   - Gmail navigation link functionality
   - Google Images navigation link functionality

4. **Responsive Design**

   - Tests run across multiple viewports (desktop, tablet, mobile)
   - Ensures UI components adapt properly to different screen sizes

5. **Internationalization**
   - Tests run in multiple languages (English, Polish)
   - Verifies translated elements display correctly

## 📂 Project Structure

```
cypress/
  ├── e2e/                 # Test specifications
  │   └── google-search.cy.ts
  │
  ├── pages/               # Page Object Models
  │   ├── BasePage.ts      # Abstract base class for all page objects
  │   ├── GoogleHomePage.ts
  │   ├── GmailHomePage.ts
  │   └── ImagesHomePage.ts
  │
  ├── support/             # Support files and custom commands
  │   ├── commands/
  │   │   ├── assertions.ts    # Custom assertion commands
  │   │   ├── interceptors.ts  # Network request interceptors
  │   │   └── utils.ts         # Utility functions
  │   │
  │   ├── functions/           # Reusable helper functions
  │   │   ├── customArrayMethods.ts
  │   │   └── dataGetters.ts
  │   │
  │   ├── requirements/        # Test requirements and constants
  │   │   └── requirementVars.ts
  │   │
  │   ├── commands.d.ts        # Type definitions for custom commands
  │   ├── commands.ts          # Command aggregator
  │   ├── e2e.ts              # Global configuration for E2E tests
  │   └── types.ts            # TypeScript type definitions
  │
  └── translations/        # Localization resources
      └── appTranslations.ts  # Multi-language translation strings
```

## 🚀 Key Features

### 1. Page Object Model with App Actions

Each page is represented as a class, encapsulating selectors and providing chainable methods for interacting with the page:

```typescript
// Example from GoogleHomePage.ts
visit(language?: AppLanguage): this {
  cy.visit(this.getBaseUrl(language))
  return this
}

acceptCookiesIfPresent(language?: Language): this {
  // Implementation...
  return this
}
```

This approach allows for expressive, readable test scenarios:

```typescript
GoogleHomePage.visit()
	.acceptCookiesIfPresent()
	.openGoogleAppsMenu()
	.assertGoogleAppsMenuIsVisible()
```

### 2. Abstract Base Page

An abstract `BasePage` class provides a foundation for all page objects with shared functionality:

```typescript
export abstract class BasePage {
	protected abstract urlTemplate: string

	protected getBaseUrl(
		language?: AppLanguage,
		overrideLangCode?: string
	): string {
		const langCode =
			overrideLangCode ?? languageCodeMap[language ?? DEFAULT_LANGUAGE]
		return this.urlTemplate.replace('{langCode}', langCode)
	}
}
```

This design:

- Enforces consistent URL handling across all pages
- Centralizes language-specific URL generation
- Promotes code reuse and maintainability
- Provides a standardized interface for all page objects

The abstract base class could be further expanded in the future to include more universal methods such as:

- Common navigation patterns
- Shared component interactions (headers, footers, etc.)
- Global error handling and standardized assertions

### 3. Multi-language & Localization Support

The test suite handles translations dynamically, allowing tests to run in multiple languages:

```typescript
LANGUAGES_TO_TEST.forEach((language) => {
	it(`should check elements in ${language}`, () => {
		GoogleHomePage.visit(language)
		// Test assertions with localized strings
	})
})
```

### 4. Cross-viewport Testing

Tests run across multiple device sizes to ensure responsive design:

```typescript
VIEWPORTS.forEach(({ name, width, height }) => {
	it(`should check visibility on ${name} viewport`, () => {
		cy.viewport(width, height)
		// Test assertions for this viewport
	})
})
```

### 5. Custom Commands & Utilities

Numerous custom commands improve test readability and maintainability:

```typescript
cy.isVisibleContentMultiple(['Text 1', 'Text 2'])
cy.getCountryFromCurrentIp()
cy.findScrollableParent()
```

### 6. Continuous Integration Ready

The project includes a GitHub Actions workflow for continuous integration that:

- Automatically runs tests on pushes to main/master branches and pull requests
- Supports manual triggering via workflow_dispatch
- **Runs tests across multiple browsers (Chrome, Firefox, Edge)** using a matrix strategy
- Uses efficient caching strategies to optimize build times

```yaml
# Cross-browser testing with GitHub Actions matrix
strategy:
  fail-fast: false
  matrix:
    browser: [chrome, firefox, edge]

steps:
  # ...existing code...
  - name: Cypress run
    uses: cypress-io/github-action@v6
    with:
      browser: ${{ matrix.browser }}
      headed: true
      config: >-
        screenshotOnRunFailure=true
```

The workflow is optimized to:

- Cache npm dependencies based on package-lock.json hash (only reinstalls when dependencies change)
- Separately cache the large Cypress binary (~1GB) to avoid repeated downloads
- Run tests on specific self-hosted runners for consistent environments
- Preserve screenshots and videos from failed test runs as artifacts

These optimizations significantly reduce CI execution time and resource usage by avoiding unnecessary dependency reinstallation across workflow runs.

### 7. Global Scope Management

The architecture separates concerns by placing cross-cutting functionality in the global e2e.ts file rather than in the Page Object classes:

```typescript
// e2e.ts handles global setup and cross-cutting concerns
import './commands'

Cypress.on('uncaught:exception', () => {
	return false
})
```

This pattern could be further expanded to include:

- Performance measurement methods
- Logging and reporting capabilities
- Global test hooks
- Environment-specific configurations

This approach keeps the Page Objects focused on their core responsibility (page interactions) while global concerns are managed at the appropriate level.

## 🔄 Running the Tests

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

```bash
# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm run cy:run
```

## 🌐 Browser & Device Coverage

Tests run on:

- **Browsers**:
  - Chrome
  - Firefox
  - Edge
- **Viewports**:
  - Desktop (1920×1080)
  - Tablet (768×1024)
  - Mobile (500×667)

## 📋 Future Improvements

- Add visual regression testing
- Expand test coverage to search functionality
- Add performance testing metrics
- Add API testing for backend services
- Implement data-driven test scenarios

## 📜 License

This project is part of a job interview task and is provided as a demonstration of testing skills.

---
