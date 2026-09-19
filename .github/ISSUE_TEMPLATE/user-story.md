# User Story Template — GiftLink Capstone Project

Every GiftLink user story is written with the template below and tracked as a
GitHub issue in the `fullstack-capstone-project` repository, labeled `new`,
`icebox`, `technical debt` or `backlog`.

## Template

```
**As a** [role]
**I need** [function]
**So that** [benefit]

### Details and Assumptions
    * [document what you know]

### Acceptance Criteria
    gherkin
    Given [some context]
    When [certain action is taken]
    Then [the outcome of action is observed]
```

---

# GiftLink User Stories

GiftLink connects **givers**, who list items they no longer need, with
**receivers**, who browse and claim those items for free.

Stack: Node.js / Express back-end services, MongoDB datastore, React front end,
containerized with Docker and deployed to the cloud.

---

## 1. Finish user stories

**As a** product owner
**I need** the ten GiftLink user stories written and tracked as issues in the GitHub repository
**So that** the team has an agreed, visible backlog before any code is written

### Details and Assumptions
* The capstone defines ten steps; each step becomes one user story.
* Stories are created as GitHub issues in the `fullstack-capstone-project` repository.
* Every issue is labeled `new`, `icebox`, `technical debt` or `backlog`.
* Every story uses the standard template: role, function, benefit, assumptions, Gherkin criteria.
* Estimation and prioritization happen once all ten stories exist.

### Acceptance Criteria

```gherkin
Given the list of ten capstone project steps
When the product owner opens the GitHub repository issues
Then there is one user story issue for each of the ten steps

Given a user story issue
When a developer reads it
Then it states a role, a function and a benefit, and contains at least one Gherkin scenario

Given the ten stories exist
When the team reviews the backlog
Then every issue carries one of the agreed labels and is ready to be estimated
```

---

## 2. Initialize and populate MongoDB

**As a** back-end developer
**I need** a MongoDB database initialized and populated with the GiftLink gift catalog
**So that** the services can serve real gift data instead of hard-coded stubs

### Details and Assumptions
* MongoDB is the datastore; the connection string comes from the `MONGO_URL` environment variable.
* The database is `giftdb`; collections are `gifts`, `users` and `comments`.
* A seed script imports the provided `gifts.json` fixture file.
* The seed script is idempotent: rerunning it does not duplicate documents.
* Indexes are created on the fields used by search (name, category, condition).
* Credentials live in a `.env` file that is git-ignored.

### Acceptance Criteria

```gherkin
Given a running MongoDB instance and an empty giftdb database
When the developer runs the seed script
Then the gifts collection is created and contains every gift from the fixture file

Given the database has already been seeded
When the developer runs the seed script a second time
Then the gift count is unchanged and no duplicate documents exist

Given the MONGO_URL environment variable is missing or invalid
When the application attempts to connect
Then it fails fast with an explicit configuration error rather than starting

Given the seeded database
When a developer queries a gift by its id
Then the document returned contains name, category, condition, age and image fields
```

---

## 3. Run skeleton application

**As a** developer
**I need** the GiftLink back-end services and React front end to start locally with documented commands
**So that** every team member can verify their setup and begin feature work immediately

### Details and Assumptions
* The back end exposes `GET /api/gifts` returning the seeded catalog.
* The React app runs on its own dev server and calls the back end through a configurable base URL.
* The README documents prerequisites, install and start commands for each service.
* Ports and the API base URL come from environment variables, never hard-coded.
* CORS is configured so the React dev server can reach the API.

### Acceptance Criteria

```gherkin
Given a freshly cloned repository with dependencies installed
When the developer runs the documented start command for the back end
Then the server starts on the configured port and logs a successful database connection

Given the back end is running against a seeded database
When a client calls GET /api/gifts
Then the response status is 200 and the body is a JSON array of gifts

Given the back end is running
When the developer starts the React dev server and opens the app in a browser
Then the skeleton page renders with no errors in the browser console

Given both services are running
When the React app requests the gift list
Then the request succeeds without a CORS error
```

---

## 4. Implement a landing page and navigation

**As a** visitor
**I need** a landing page that explains GiftLink and a navigation bar linking the main sections
**So that** I understand the service immediately and can reach the available gifts in one click

### Details and Assumptions
* The landing page is the public React route `/` and needs no authentication.
* It shows the site name, a short tagline and a **Get Started** button.
* Navigation links: Home, Gifts, Search, Login, Register.
* The navigation bar is a shared React component rendered on every page.
* Routing uses React Router; the active link is visually marked.
* The layout is responsive across mobile, tablet and desktop widths.

### Acceptance Criteria

```gherkin
Given an anonymous visitor
When they open the root URL of the application
Then the landing page displays the GiftLink title, a tagline and a Get Started button

Given the landing page is displayed
When the visitor clicks the Get Started button
Then the router navigates to the gifts listing page without a full page reload

Given the visitor is on any page of the application
When they look at the navigation bar
Then the link matching the current route is visually marked as active

Given the visitor opens the application on a mobile-width screen
When the page renders
Then the navigation collapses into a usable menu and the page has no horizontal scrolling
```

---

## 5. Add authentication components and logic

**As a** GiftLink user
**I need** to register an account, log in and log out securely
**So that** I can access member-only features such as commenting on gifts

### Details and Assumptions
* Registration collects first name, last name, email and password; email must be unique.
* Passwords are hashed with bcrypt and never stored, logged or returned in clear text.
* Successful authentication returns a JWT with an expiry; the React app stores it and sends it as a Bearer token.
* Protected API routes reject requests without a valid token with HTTP 401.
* Register, Login and Profile are separate React components sharing form validation.
* The navigation bar reflects the authentication state.

### Acceptance Criteria

```gherkin
Given a visitor on the registration page
When they submit a valid, unused email with a password meeting the policy
Then the account is created, a JWT is returned and they are logged in

Given a visitor on the registration page
When they submit an email that already belongs to an account
Then no account is created and an explicit error message is displayed

Given a registered user on the login page
When they submit their correct email and password
Then they receive a valid JWT and the navigation bar shows their logged-in state

Given a registered user on the login page
When they submit an incorrect password
Then login is refused with a generic error that does not reveal whether the email exists

Given a logged-in user
When they click Logout
Then the stored token is cleared and the navigation bar returns to its anonymous state

Given a request to a protected endpoint with a missing, malformed or expired token
When the server handles the request
Then it responds with 401 Unauthorized and performs no action
```

---

## 6. Implement Gifts details page

**As a** receiver
**I need** a detail page showing everything about a gift and how to contact the giver
**So that** I can decide whether to claim it and reach out to the person offering it

### Details and Assumptions
* The route is `/gifts/:id`, publicly readable without authentication.
* Displayed fields: name, image, category, condition, age, description, date posted and the giver.
* Data comes from `GET /api/gifts/:id`.
* Gifts without an image fall back to a placeholder rather than a broken image.
* Loading, not-found and error states are handled explicitly.

### Acceptance Criteria

```gherkin
Given a gift exists in the database
When a visitor opens the detail page for that gift id
Then the gift name, image, description, category, condition and date posted are displayed

Given the request for the gift data is still in flight
When the page renders
Then a loading indicator is shown instead of empty or partial content

Given a gift id that matches no document
When a visitor opens that detail page
Then a clear "gift not found" message is displayed and the application does not crash

Given a gift whose record has no image
When its detail page renders
Then a placeholder image is displayed instead of a broken image

Given a visitor on a gift detail page
When they click the back link
Then they return to the gifts listing page
```

---

## 7. Implement a search component

**As a** receiver
**I need** to search the gift catalog by keyword and narrow it down with filters
**So that** I can quickly find a gift that matches what I actually need

### Details and Assumptions
* Search calls `GET /api/search` with query parameters: name, category, condition and age_years.
* Keyword matching on the gift name is case-insensitive and matches partial words.
* Filters combine with each other and with the keyword; omitted filters are ignored.
* An empty search returns the default gift listing.
* Results are limited or paginated so responses stay fast.

### Acceptance Criteria

```gherkin
Given gifts exist in the database
When the receiver searches for a keyword contained in a gift name
Then only the gifts whose name matches that keyword are listed

Given the receiver has entered a keyword
When they also select a category and a condition and submit the search
Then the results satisfy the keyword and both filters together

Given the receiver submits a search that matches no gift
When the results are returned
Then an explicit "no gifts found" message is displayed instead of an empty page

Given the receiver has an active search
When they clear the form and submit
Then the full default gift listing is displayed again

Given a search request is in progress
When the page renders
Then a loading state is shown and the submit control is disabled
```

---

## 8. Design and implement the comments feature

**As a** logged-in user
**I need** to read and post comments on a gift
**So that** I can ask the giver questions and share useful feedback with the community

### Details and Assumptions
* A comment stores the gift id, the author, the text and a timestamp.
* Reading comments is public; posting requires a valid JWT.
* Comment text is validated (non-empty, maximum length) and escaped on render to prevent XSS.
* Comments appear on the gift detail page, newest first.
* A newly posted comment appears without a full page reload.

### Acceptance Criteria

```gherkin
Given a gift that already has comments
When any visitor opens its detail page
Then the comments are listed with their author and date, newest first

Given a gift with no comments
When a visitor opens its detail page
Then a message invites them to be the first to comment

Given a logged-in user on a gift detail page
When they submit a non-empty comment
Then the comment is saved and appears at the top of the list without a page reload

Given an anonymous visitor on a gift detail page
When they attempt to post a comment
Then they are prompted to log in and nothing is saved

Given a logged-in user
When they submit an empty comment or one exceeding the maximum length
Then a validation error is displayed and nothing is saved

Given a comment whose text contains HTML or script markup
When the comment list renders
Then the markup is displayed as plain text and is not executed
```

---

## 9. Containerize the services and applications

**As a** DevOps engineer
**I need** each GiftLink service packaged as a container image and orchestrated together
**So that** the whole stack runs identically on any machine and can be deployed reproducibly

### Details and Assumptions
* One Dockerfile per service: the gift service, the auth/search service and the React front end.
* A `docker-compose.yml` wires the services together with MongoDB on a shared network.
* All configuration is injected through environment variables; nothing is baked into the images.
* MongoDB data persists in a named volume across container restarts.
* Images build from a clean checkout with no manual steps.

### Acceptance Criteria

```gherkin
Given a clean checkout of the repository
When the engineer builds every container image
Then all images build successfully without manual intervention

Given the images are built
When the engineer starts the stack with docker compose up
Then the database, the back-end services and the front end all start and report healthy

Given the stack is running
When the user opens the front-end URL in a browser
Then the application loads and successfully retrieves gift data from the back-end service

Given the stack has been seeded and then stopped and restarted
When the application queries the gifts
Then the previously seeded data is still present thanks to the persistent volume

Given a built image
When its contents and configuration are inspected
Then no credential or secret value is baked into the image
```

---

## 10. Deploy backend and frontend

**As a** product owner
**I need** the GiftLink back-end services and React front end deployed to a public environment
**So that** real users and reviewers can access the working application over the internet

### Details and Assumptions
* Deployment targets a cloud container platform (IBM Code Engine or equivalent).
* Deployment is driven by a GitHub Actions CI/CD workflow, not performed by hand.
* Production secrets and the MongoDB connection string come from the platform secret store.
* The React build points at the deployed back-end URL, never localhost.
* A rollback path exists: redeploy the previous image revision.

### Acceptance Criteria

```gherkin
Given the container images are published to the registry
When the deployment pipeline runs
Then the back-end services and the front end are deployed and report a healthy status

Given the application is deployed
When an external user opens the public front-end URL
Then the landing page loads over HTTPS and gift data is retrieved from the deployed back end

Given the deployed front end
When a user registers, logs in, searches for a gift and posts a comment
Then every step succeeds end to end against the deployed services

Given a deployment introduces a regression
When the team triggers a rollback
Then the previous working revision is restored and the application is healthy again

Given the deployed environment
When its configuration is inspected
Then every secret is supplied by the platform and none is hard-coded in the repository or images
```
