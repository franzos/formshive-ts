# Rusty Forms Frontend

## Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `vitest` – runs vitest tests
- `vitest:watch` – starts vitest watch
- `test` – runs `vitest`, `prettier:check`, `lint` and `typecheck` scripts

## Distribution

```bash
docker build --network=host -t rusty.forms.client:latest .
docker save rusty.forms.client:latest | ssh -C root@virt1.pantherx.org docker load
```