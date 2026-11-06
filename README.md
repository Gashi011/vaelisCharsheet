# Vaelis Duskryn — Character Sheet PWA

Static PWA project. All files are already in the repository root so GitHub Pages can publish it directly.

## GitHub Pages

1. Create an empty GitHub repository.
2. Open PowerShell in this folder.
3. Run:

```powershell
git init
git add .
git commit -m "Initial Vaelis Duskryn character sheet"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

4. On GitHub open **Settings → Pages**.
5. Set **Source** to `Deploy from a branch`.
6. Choose branch `main` and folder `/(root)`.
7. Click **Save**.

For later updates:

```powershell
git add .
git commit -m "Update Vaelis character sheet"
git push
```
