# Privacy Notes

Nexus AI is designed around student control of career data.

## Public Demo

The GitHub Pages demo uses browser localStorage. This means workspace data stays in the user's browser and is not transmitted to a hosted Nexus AI server.

## Local Backend Mode

When the FastAPI backend is running locally, Nexus AI stores workspace data in a local SQLite database at:

```text
backend/nexus.db
```

This file is ignored by Git and should not be committed.

## User Control

Users can:

- Start a blank workspace
- Export a JSON snapshot
- Import a JSON snapshot
- Download resume notes
- Download a career plan
- Clear local browser data

## Responsible AI Direction

Future AI coaching features should:

- Explain why a recommendation was made
- Show which workspace data influenced the recommendation
- Avoid presenting career advice as a guaranteed answer
- Let users edit, ignore, or export recommendations
- Avoid collecting unnecessary personal data

## Data Minimization

Nexus AI should only collect data needed to help students organize career preparation and make better decisions.
