# Contributing

How our group works together in this repository. Everyone should read this file before making their first commit.

## Who Owns What

| Folder / File | Owner | Everyone Else |
|---|---|---|
| `backend/` (including `openapi.yaml`) | Backend | Suggests changes through a pull request |
| `client/` | Frontend | Suggests changes through a pull request |
| `docs/`, `README.md`, `CONTRIBUTING.md` | Documentation | Writes first drafts about their own work. Documentation members review and edit them. |
| `.github/` | Documentation / Repository Maintainer | Suggests improvements through a pull request |

**Owner** means you are responsible for keeping your assigned files correct and up to date. Other group members may still contribute changes through pull requests.

## Branches

- `main` must always contain working, reviewed code.
- Nobody should push directly to `main`.
- Create a new branch for each task.

| Kind of Work | Branch Name | Example |
|---|---|---|
| New feature | `feat/<short-description>` | `feat/add-faculty-endpoint` |
| Bug fix | `fix/<short-description>` | `fix/faculty-validation` |
| Documentation | `docs/<short-description>` | `docs/update-project-readme` |
| Code cleanup | `refactor/<short-description>` | `refactor/organize-api-routes` |
| Setup or dependencies | `chore/<short-description>` | `chore/setup-react-vite` |

### Starting a New Task

Run these commands from the repository root:

```bash
git switch main
git pull origin main
git switch -c feat/add-faculty-endpoint
```

Replace `feat/add-faculty-endpoint` with a branch name that describes your task.

Make your changes and commit them:

```bash
git add .
git commit -m "feat(backend): add faculty endpoint"
```

Push your branch:

```bash
git push -u origin feat/add-faculty-endpoint
```

Then open a **Pull Request (PR)** on GitHub.

## Commit Messages

Use this format:

`type(scope): what you did`

### Types

- `feat` — adds a new feature
- `fix` — fixes a bug
- `docs` — adds or updates documentation
- `refactor` — improves code structure without changing behavior
- `style` — formatting changes only
- `chore` — setup, configuration, or dependency changes
- `test` — adds or updates tests

### Examples

```text
feat(backend): add GET faculty endpoint
feat(client): add faculty registration form
fix(backend): validate duplicate faculty emails
fix(client): display API error messages
docs: add ER diagram to data-model.md
chore(client): configure React with Vite
test(backend): add department route tests
```

Make small, meaningful commits instead of combining unrelated changes into one large commit.

## Pull Requests

1. Keep each PR focused on one feature, fix, or documentation task.
2. Fill out the repository's pull request template.
3. Test the affected functionality before requesting review.
4. Update `backend/openapi.yaml` before implementing or changing API endpoints.
5. Update relevant documentation when your changes affect it.
6. At least one teammate must review and approve the PR before merging.
7. After approval, the PR author or authorized maintainer merges it and deletes the branch.

### Reviewing Another Member's Work

You do not need to be an expert in every part of the project. Check that:

- The application runs.
- The changes match `backend/openapi.yaml`.
- Existing functionality still works.
- Appropriate error handling and validation are included.
- Relevant documentation has been updated.
- No passwords, API keys, or other secrets have been committed.

## Never Commit

Do not commit these files or directories:

- `.env` files containing passwords, database connection strings, or keys.
- `node_modules/` and other installed dependencies.
- `.venv/`, `bin/`, and `obj/` generated folders.
- Large unnecessary files, such as videos, ZIP files, or datasets.
- Personal credentials or sensitive configuration files.

Commit `.env.example` instead, with placeholder values and no real secrets.

Make sure `.gitignore` excludes files that should not be uploaded.

### If You Accidentally Commit a Secret

1. Inform the group or repository maintainer immediately.
2. Change or revoke the exposed password, token, or key.
3. Remove the secret from the repository.
4. If necessary, coordinate removal from Git history with the repository maintainer.

Deleting a secret in a later commit does not remove it from earlier Git history.

## Staying in Sync

Bring the latest `main` changes into your branch regularly, ideally at least once a day while actively working.

```bash
git switch main
git pull origin main
git switch feat/add-faculty-endpoint
git merge main
```

Replace the example branch with your own branch name.

### Handling Merge Conflicts

If Git reports a merge conflict:

1. Run `git status` to identify conflicting files.
2. Open each conflicting file in VS Code.
3. Look for the conflict markers:

```text
<<<<<<< HEAD
Your current changes
=======
Changes from the other branch
>>>>>>> main
```

4. Keep the correct content and remove the conflict markers.
5. Save the files and test the application.
6. Stage and commit the resolved files:

```bash
git add .
git commit -m "fix: resolve merge conflicts"
```

If you are unsure which version is correct, ask the owner of that file before resolving the conflict.

## Project-Specific Guidelines

### Backend

- Keep API routes organized in `backend/src/routes/`.
- Follow the API contract in `backend/openapi.yaml`.
- Use consistent request and response formats.
- Validate input and return appropriate HTTP status codes.
- Do not commit real database credentials or `.env` files.

### Frontend

- Keep reusable React components in `client/src/components/`.
- Keep page-level components in `client/src/pages/`.
- Put API requests in `client/src/services/`.
- Use the configured API base URL instead of hardcoding URLs throughout components.
- Handle loading, empty, success, validation, and error states.
- Test the interface on desktop and mobile screen widths.

### Documentation

- Keep the root `README.md` updated with project setup and running instructions.
- Update `backend/openapi.yaml` when API endpoints or request and response schemas change.
- Update `client/README.md` when frontend setup or behavior changes.
- Keep `.env.example` files consistent with the environment variables actually used.

## Before Submitting a Pull Request

- [ ] My changes are focused on one task.
- [ ] I tested the affected functionality locally.
- [ ] My code follows the existing project structure.
- [ ] I updated `backend/openapi.yaml` if the API contract changed.
- [ ] I updated relevant documentation or confirmed none was needed.
- [ ] I did not commit `.env` files, passwords, or keys.
- [ ] My commit messages follow the agreed format.
- [ ] I pushed my feature branch and opened a pull request.
- [ ] I am ready for a teammate to review my changes.