# Project TODO

- [x] Build an elegant public attorney and law-firm directory landing experience for the Salt Lake City metro area
- [x] Add searchable directory listing with practice-area filters, including Family Law, Personal Injury, Criminal Defense, Real Estate, and Business Law
- [x] Add geographic filters for Salt Lake City, Ogden, Layton, Bountiful, Sandy, Draper, Lehi, and Park City
- [x] Add attorney and law-firm profile pages with SEO-friendly slugs, metadata, and LegalService schema markup
- [x] Display profile bio, firm, practice areas, address, phone, website, office hours, and bar admissions
- [x] Integrate multi-pin Google Maps on the directory page and single-location maps on profiles
- [x] Add user star ratings, written reviews, aggregate score display, and moderation-safe submission states
- [x] Add profile lead inquiry forms and persist incoming leads
- [ ] Add owner self-serve profile claim flow with listing management and photo upload (claim UI and backend procedure are present; photo storage and profile selector remain to be hardened)
- [ ] Add owner portal lead inbox and attorney responses (inbox shell is present; response mutation remains to be hardened)
- [x] Add $49/month recurring premium subscription activation flow
- [ ] Add subscription lifecycle handling for activation, renewal, and cancellation (Stripe webhook receiver is present; local subscription state sync remains to be hardened)
- [ ] Add admin panel for listing seeding, profile-claim approvals, and subscription status (admin dashboard shell is present; write actions remain to be hardened)
- [x] Add site-owner email alerts for new leads, profile claims, and new subscriptions
- [x] Add backend procedures, database schema, migrations, and access controls
- [ ] Add Vitest coverage for core directory, review, lead, claim, and subscription logic
- [x] Verify responsive UI, map states, auth states, error states, and production build (desktop preview, TypeScript, Vitest, and production build verified)

## Change History

- [x] Scope revised from general local-business directory to an attorney and law-firm directory marketplace for the Salt Lake City metro area
- [x] Subscription price fixed at $49/month per attorney
- [x] Required metro cities and practice-area minimums recorded
- [x] Required site-owner alert triggers recorded
- [x] Wire Resend email delivery into new lead, profile claim, and subscription activation alerts
