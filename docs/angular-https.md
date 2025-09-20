# Local HTTPS Setup for Angular Project

This guide explains how to run the Angular project over HTTPS locally.
HTTPS is required because the app uses HttpOnly cookies for secure token handling, and modern browsers restrict these cookies over plain HTTP.

---

## ✅ Step-by-Step Setup

### 1. Install [Chocolatey](https://chocolatey.org/install) (if not already installed)

Chocolatey is a Windows package manager. Open **PowerShell as Administrator** and run:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; `
iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex
```

To verify:

```powershell
choco -v
```

---

### 2. Install `mkcert`

```powershell
choco install mkcert
```

Verify:

```powershell
mkcert --version
```

---

### 3. Install a Local CA (Certificate Authority)

This step allows the generated certificates to be trusted by your system.

```powershell
mkcert -install
```

---

### 4. Generate Development Certificates

Navigate to the folder where you want the certificates to be saved. In this project, it's:

```
[path-to-project]/src/assets/certs
```

If it doesn't exist, create it:

```powershell
mkdir -p src/assets/certs
cd src/assets/certs
```

Then generate the cert:

```powershell
mkcert localhost 127.0.0.1 ::1
```

This will create files like:

- `localhost+2.pem`
- `localhost+2-key.pem`

> ⚠️ Filenames may vary (e.g. `localhost.pem`, `localhost+1.pem`) depending on how many hostnames are included. Angular config should use the actual generated names.

> ℹ️ If these files already exist from previous usage, `+2`, `+3` suffixes may be appended automatically. This is normal.

---

### 5. Serve Angular over HTTPS

Run Angular using these parameters:

```bash
ng serve --ssl true \
          --ssl-cert src/assets/certs/localhost+2.pem \
          --ssl-key src/assets/certs/localhost+2-key.pem
```

Adjust file names according to what was generated.

---

## 📆 Browser Trust Configuration

After running the above commands:

- Modern browsers like Chrome will trust the certificate automatically.
- Firefox **might not trust** it unless separately imported. To avoid Firefox issues, use Chromium-based browsers.
- **Ensure your browser’s strict HTTPS settings are disabled** for local development.
- Even if you manually add the certificate as trusted, some strict security settings in Chrome/Edge may still block cookies. Relax the HTTPS requirement if needed.

---

## ❌ Uninstall / Cleanup

If you want to remove `mkcert` and the Local CA from the system:

### 1. Uninstall Local CA

```powershell
mkcert -uninstall
```

### 2. Uninstall mkcert

```powershell
choco uninstall mkcert
```

### 3. (Optional) Uninstall Chocolatey

```powershell
choco uninstall chocolatey
```

> ⚠️ Chocolatey is a package manager. Remove only if you don't use it for other tools.

