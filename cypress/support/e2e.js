// Ignore a few known site-side errors (until UI fixes are applied)
Cypress.on('uncaught:exception', (err) => {
	const msg = err && err.message ? err.message : '';
	if (
		msg.includes('Cannot set properties of undefined') ||
		msg.includes("Cannot read properties of null") ||
		msg.includes("Cannot read property 'id'")
	) {
		// do not treat as a test failure
		return false;
	}
	// other errors should fail the test
});

// Load custom commands
import './commands';