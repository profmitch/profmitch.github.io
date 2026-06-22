# HTTPS Maintenance

Here's a short, focused guide tailored to your setup:

---

## 🔐 HTTPS Certificate Setup & Auto-Renewal on Windows 11 + Apache (XAMPP)

### 🧰 Prerequisites

- **Windows 11** with admin rights
- **Apache via XAMPP**
- **Domain** managed via [freedns.afraid.org](https://freedns.afraid.org)
- **win-acme (WACS)** installed (latest version recommended)

---

### ⚙️ Step 1: Prepare Your Domain

- Ensure your domain (e.g., `example.mooo.com`) points to your public IP.
- For **DNS-01 validation**, you’ll need to create TXT records manually or via script on freedns.afraid.org.

---

### 🛠️ Step 2: Run win-acme for Initial Certificate

Open an elevated Command Prompt in the win-acme directory and run:

```bash
wacs.exe --target manual --host example.mooo.com --validation dns --store pemfiles --installation none
```

- Choose **DNS validation**.
- win-acme will prompt you to add a TXT record like `_acme-challenge.example.mooo.com` with a specific value.
- Go to freedns.afraid.org and manually add this TXT record.
- Once DNS propagates, win-acme will verify and issue the certificate.

---

### 📁 Step 3: Configure Apache to Use the Certificate

Edit your Apache `httpd-ssl.conf` (usually in `xampp/apache/conf/extra/`):

```apache
SSLEngine on
SSLCertificateFile "C:/path/to/cert.pem"
SSLCertificateKeyFile "C:/path/to/privkey.pem"
SSLCertificateChainFile "C:/path/to/chain.pem"
```

Restart Apache via XAMPP control panel.

---

### 🔁 Step 4: Automate Renewal

win-acme creates a **Windows Task Scheduler job** automatically after the first successful run.

To verify or manually trigger renewal:

```bash
wacs.exe --renew --force --verbose
```

If you want to customize or script the renewal (e.g., update Apache config or restart service), you can hook into win-acme’s post-renewal script options.

---

### 🧪 Optional: PowerShell Script for TXT Record

If freedns.afraid.org supports API access (it’s limited), you could automate TXT record creation. Otherwise, manual entry is required. Let me know if you want help building a script for that.

---

Would you like a sample post-renewal PowerShell hook to restart Apache or log renewal events?


Great setup, sm. Since you're running everything locally on Windows 11 with XAMPP, here's how to organize your certificate tools cleanly and safely:

---

## 📁 Folder Placement Guide for `win-acme` and `acme-dns`

### 🟢 `win-acme` (aka `wacs.exe`)
This tool doesn’t need to live inside your XAMPP folder. It’s best to keep it **separate** to avoid clutter and permission issues.

**Recommended location:**
```
C:\Tools\win-acme\
```

**Why:**
- Keeps cert management isolated from web server files.
- Easier to update or script without interfering with Apache configs.
- win-acme stores logs and renewal configs in its own subfolders.

You’ll run `wacs.exe` from this folder, and configure it to **output `.pem` files** to a location Apache can read (e.g., inside your XAMPP `apache/conf/ssl/` folder).

---

### 🟡 `acme-dns`
This is a self-hosted DNS server for automated DNS-01 validation. It should also be **outside XAMPP**, ideally in its own folder.

**Recommended location:**
```
C:\Tools\acme-dns\
```

**Why:**
- It runs as a standalone service (you’ll configure it to listen on port 53).
- Keeping it separate avoids conflicts with Apache or PHP.
- You’ll need to configure its `config.cfg` and possibly run it as a Windows service or scheduled task.

---

### 🔒 Apache SSL Folder (inside XAMPP)
Once certificates are issued, you’ll want to place them where Apache expects them:

**Recommended location:**
```
C:\xampp\apache\conf\ssl\
```

Then update your `httpd-ssl.conf` like so:

```apache
SSLCertificateFile "C:/xampp/apache/conf/ssl/cert.pem"
SSLCertificateKeyFile "C:/xampp/apache/conf/ssl/privkey.pem"
SSLCertificateChainFile "C:/xampp/apache/conf/ssl/chain.pem"
```

---

## 🧩 Bonus Tips

- You can configure win-acme to **automatically copy** the renewed certs to your Apache folder using post-renewal scripts.
- If you want to run `acme-dns` persistently, consider using **NSSM** (Non-Sucking Service Manager) to install it as a Windows service.
- Make sure your firewall allows inbound traffic on **port 53 (UDP/TCP)** for `acme-dns` to work.

---

Want help writing a PowerShell script to restart Apache after renewal or copy certs securely? I can scaffold that for you.

Absolutely—here’s a clean, modular PowerShell scaffold to help you automate post-renewal tasks with **win-acme**, specifically for:

- Copying renewed `.pem` files to your Apache SSL folder
- Restarting Apache via XAMPP
- Logging the renewal event

---

## 🧰 PowerShell Post-Renewal Hook Scaffold

```powershell
# === CONFIGURATION ===
$WinAcmeCertPath = "C:\Tools\win-acme\Certificates\example.mooo.com"
$ApacheCertPath  = "C:\xampp\apache\conf\ssl"
$LogPath         = "C:\Tools\win-acme\Logs\renewal.log"
$XamppControlExe = "C:\xampp\xampp-control.exe"

# === COPY CERTIFICATES ===
$filesToCopy = @{
    "cert.pem"     = "cert.pem"
    "privkey.pem"  = "privkey.pem"
    "chain.pem"    = "chain.pem"
}

foreach ($src in $filesToCopy.Keys) {
    $sourceFile = Join-Path $WinAcmeCertPath $src
    $destFile   = Join-Path $ApacheCertPath $filesToCopy[$src]

    if (Test-Path $sourceFile) {
        Copy-Item -Path $sourceFile -Destination $destFile -Force
    } else {
        Write-Warning "Missing certificate file: $sourceFile"
    }
}

# === RESTART APACHE ===
# Option 1: Restart Apache via XAMPP control (requires GUI interaction)
Start-Process -FilePath $XamppControlExe -ArgumentList "/restartapache"

# Option 2: Restart Apache service directly (if installed as a Windows service)
# Restart-Service -Name "Apache2.4" -Force

# === LOG RENEWAL ===
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogPath -Value "$timestamp - Certificate renewed and Apache restarted."
```

---

## 🧩 Integration with win-acme

To hook this into win-acme:

1. Place the script in a known location, e.g. `C:\Tools\win-acme\Scripts\post-renew.ps1`
2. In win-acme, use the `--script` argument during setup:
   ```bash
   wacs.exe --target manual --host example.mooo.com --validation manualdns --store pemfiles --installation script --script "C:\Tools\win-acme\Scripts\post-renew.ps1"
   ```

---

Would you like me to add dry-run logic, elevation checks, or symbolic link support to this scaffold? I can modularize it further for reuse across multiple domains.
