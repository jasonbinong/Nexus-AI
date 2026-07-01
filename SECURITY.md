# Security Policy

## Supported Version

This is a student-built portfolio project. The current public version is the only maintained version.

## Data Stored

Nexus AI may store:

- Career profile details
- Internship applications
- Certification progress
- Project links and impact notes
- Skill confidence and evidence
- Networking contacts
- Interview preparation notes
- Resume notes
- Career goals

Do not store passwords, financial information, government IDs, private health information, or other sensitive personal data in Nexus AI.

## Public Demo Security

The GitHub Pages demo stores data in the user's browser through localStorage. Data is not sent to a server in this mode.

Users can clear browser storage or use the app's reset option to remove local workspace data.

## Backend Security

The current backend is designed for local development. It does not include authentication yet.

Do not deploy the current backend publicly with real user data until authentication, authorization, production CORS rules, input validation hardening, and secure hosting are added.

## Planned Security Improvements

- User authentication
- User-specific workspace ownership
- PostgreSQL production database
- Environment-based CORS configuration
- Rate limiting
- Audit-friendly activity logs
- Export/delete data controls
- Secrets stored only in environment variables

## Reporting Issues

If you find a security issue, open a GitHub issue without including private data or secrets.
