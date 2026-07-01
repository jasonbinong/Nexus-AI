# Contributing

Nexus AI is a student-built career operating system. Contributions should improve the product's usefulness, clarity, reliability, or privacy.

## Development Setup

Run the static frontend:

```bash
python -m http.server 8070
```

Run the backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

Open:

```text
http://127.0.0.1:8070/
```

## Checks

Run the SQLite smoke test:

```bash
cd backend
python smoke_test.py
```

Run API tests after installing backend dependencies:

```bash
pytest test_api_contract.py
```

## Contribution Guidelines

- Keep the GitHub Pages demo usable without a backend
- Do not commit local databases, secrets, or generated environment files
- Keep features tied to student career readiness
- Prefer clear workflows over broad generic AI features
- Update docs when adding backend routes or major UI behavior

## Good First Issues

- Add calendar view
- Improve mobile layout
- Add CSV export
- Add frontend tests
- Add authentication research notes
- Connect CareerLens AI report imports
