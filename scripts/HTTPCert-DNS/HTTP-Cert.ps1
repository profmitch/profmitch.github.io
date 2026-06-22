<#
# Log in once per session
Initialize-FreeDnsSession -Username "youruser" -Password "yourpass"

# Add a TXT record
Add-FreeDnsTxtRecord -Fqdn "_acme-challenge.example.com" -Value "challenge-token"

# Remove it later
Remove-FreeDnsTxtRecord -Fqdn "_acme-challenge.example.com" -Value "challenge-token"


Notes:

The regexes here are rough equivalents of the grep/sed logic in your shell script. 
You may need to tweak them depending on the actual HTML returned by FreeDNS (their 
markup changes over time).

The original _info, _debug, _get, _post helpers in acme.sh are replaced with 
PowerShell’s Write-Host, Write-Warning, and Invoke-WebRequest.

You could add -Verbose flags for extra debugging.

So instead of porting the whole shell script, you’d just tell win-acme:

“I want DNS-01 validation.”

Choose FreeDNS (if supported) or “manual/script.”

Point it at a PowerShell script that adds/removes TXT records. (Much simpler than 
translating the whole acme.sh plugin.)


🔹 Practical path forward

Since you’ve got win-acme.exe:

If you want to automate FreeDNS DNS validation, check if win-acme has a 
FreeDNS plugin already (they’ve been expanding supported providers).

If not, you only need a tiny PowerShell script with:

# add txt
Add-FreeDnsTxtRecord -Fqdn "_acme-challenge.example.com" -Value "token"

# remove txt
Remove-FreeDnsTxtRecord -Fqdn "_acme-challenge.example.com" -Value "token"


(Exactly what I sketched earlier — but simplified, no full acme.sh compatibility needed.)

Because FreeDNS is not supported by default in win-acme, you have two paths:

Use the “Script” plugin in win-acme:

You write your own PowerShell (or batch) script that adds/removes the TXT records 
via FreeDNS API (or by scraping HTTP pages, cookies, etc.).

Configure win-acme to call your script for the “validation” (DNS-01).

This is basically using win-acme’s “plugin = Script” option.

Switch to a DNS provider that is built-in with win-acme, if acceptable. 
This avoids writing/maintaining your own script.

#>

param(
    [string]$Command,      # 'create' or 'delete'
    [string]$RecordName,   # e.g. _acme-challenge.example.com
    [string]$Token         # the TXT record value
)

$User = $env:FREEDNS_User
$Pass = $env:FREEDNS_Password

if (-not $User -or -not $Pass) {
    Write-Error "FREEDNS_User / FREEDNS_Password environment variables not set"
    exit 1
}

# Start a session
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

# Login
$response = Invoke-WebRequest -Uri "https://freedns.afraid.org/zc.php?step=2" `
    -Method POST `
    -Body @{
        username = $User
        password = $Pass
        submit   = "Login"
        action   = "auth"
    } `
    -WebSession $session

if ($response.Content -match "Invalid login") {
    Write-Error "FreeDNS login failed"
    exit 1
}

if ($Command -eq "create") {
    Write-Host "Creating TXT record for $RecordName with value $Token"
    # TODO: Implement actual POST for TXT record (see your shell script logic)
}
elseif ($Command -eq "delete") {
    Write-Host "Deleting TXT record for $RecordName with value $Token"
    # TODO: Implement delete logic
}

<#
👉 You’ll need to finish the _freedns_add_txt_record and _freedns_delete_txt_record 
parts by replicating the URLs from your shell script (save.php and delete2.php).

🔧 Step 2. Configure win-acme to use the script

When you run win-acme (wacs.exe):

Choose Create new certificate (full options).

Select your target (manual input, IIS, etc.).

When prompted for validation, pick:

[DNS-01] Create verification records with your own script


Enter the path to your PowerShell script.

win-acme will call it like this:

powershell.exe -File yourscript.ps1 create  _acme-challenge.example.com  "TOKEN"
powershell.exe -File yourscript.ps1 delete  _acme-challenge.example.com  "TOKEN"

🔧 Step 3. Store your credentials

Set environment variables for your FreeDNS login so the script can use them:

setx FREEDNS_User "yourusername"
setx FREEDNS_Password "yourpassword"


Close/reopen your shell so they’re available.

#>


<#
.SYNOPSIS
  PowerShell FreeDNS API client for acme.sh-style DNS validation
#>

# Global vars for session and login
$global:FreeDnsSession = $null
$global:FreeDnsUsername = $null
$global:FreeDnsPassword = $null

function Initialize-FreeDnsSession {
    param(
        [string]$Username,
        [securestring]$Password
    )

    $body = @{
        username = $Username
        password = $Password
        submit   = 'Login'
        action   = 'auth'
    }

    try {
        $response = Invoke-WebRequest `
            -Uri "https://freedns.afraid.org/zc.php?step=2" `
            -Method POST `
            -Body $body `
            -SessionVariable session

        if ($response.StatusCode -eq 200 -and $response.Content -match "logout") {
            $global:FreeDnsSession  = $session
            $global:FreeDnsUsername = $Username
            $global:FreeDnsPassword = $Password
            Write-Host "FreeDNS login succeeded for $Username"
            return $true
        } else {
            Write-Error "FreeDNS login failed. Response did not indicate success."
            return $false
        }
    }
    catch {
        Write-Error "Login to FreeDNS failed: $_"
        return $false
    }
}

function Add-FreeDnsTxtRecord {
    param(
        [string]$Fqdn,    # full record name
        [string]$Value    # TXT record value
    )

    if (-not $global:FreeDnsSession) {
        throw "No active FreeDNS session. Run Initialize-FreeDnsSession first."
    }

    # Split FQDN into subdomain + domain (simple heuristic)
    $parts = $Fqdn -split '\.'
    if ($parts.Count -lt 2) {
        throw "Invalid FQDN: $Fqdn"
    }

    $subDomain = $parts[0]
    $domain = ($parts[1..($parts.Count - 1)] -join '.')

    # Find domain_id from FreeDNS index page
    $resp = Invoke-WebRequest `
        -Uri "https://freedns.afraid.org/subdomain/" `
        -WebSession $global:FreeDnsSession

    if ($resp.StatusCode -ne 200) {
        throw "Failed to load subdomain list."
    }

    $domainIdRegex = [regex]"edit\.php\?edit_domain_id=(\d+).*?>\Q$domain\E<"
    $match = $domainIdRegex.Match($resp.Content)
    if (-not $match.Success) {
        throw "Unable to locate domain_id for domain $domain"
    }
    $domainId = $match.Groups[1].Value

    $body = @{
        type      = "TXT"
        domain_id = $domainId
        subdomain = $subDomain
        address   = "`"$Value`""
        send      = "Save!"
    }

    $resp = Invoke-WebRequest `
        -Uri "https://freedns.afraid.org/subdomain/save.php?step=2" `
        -Method POST `
        -Body $body `
        -WebSession $global:FreeDnsSession

    if ($resp.StatusCode -eq 200 -and $resp.Content -match "successfully") {
        Write-Host "TXT record $Fqdn successfully added."
        return $true
    } else {
        Write-Warning "Could not verify success. Check FreeDNS panel."
        return $false
    }
}

function Remove-FreeDnsTxtRecord {
    param(
        [string]$Fqdn,
        [string]$Value
    )

    if (-not $global:FreeDnsSession) {
        throw "No active FreeDNS session. Run Initialize-FreeDnsSession first."
    }

    # Fetch subdomain list page
    $resp = Invoke-WebRequest `
        -Uri "https://freedns.afraid.org/subdomain/" `
        -WebSession $global:FreeDnsSession

    if ($resp.StatusCode -ne 200) {
        throw "Failed to load subdomain list."
    }

    # Look for delete.php link for given FQDN + value
    $deleteRegex = [regex]"delete\.php\?data_id=(\d+).*?$Fqdn.*?TXT.*?\Q$Value\E"
    $match = $deleteRegex.Match($resp.Content)

    if (-not $match.Success) {
        Write-Warning "No matching TXT record $Fqdn with value $Value found to delete."
        return $false
    }

    $dataId = $match.Groups[1].Value

    $resp = Invoke-WebRequest `
        -Uri "https://freedns.afraid.org/subdomain/delete.php?data_id=$dataId" `
        -WebSession $global:FreeDnsSession

    if ($resp.StatusCode -eq 200) {
        Write-Host "TXT record $Fqdn removed."
        return $true
    } else {
        Write-Warning "Could not verify deletion. Check FreeDNS panel."
        return $false
    }
}

<#

More updated
#>
param(
    [string]$Command,      # 'create' or 'delete'
    [string]$RecordName,   # e.g. _acme-challenge.example.com
    [string]$Token         # TXT value from Let's Encrypt
)

# --- CONFIG: Credentials pulled from env vars ---
$User = $env:FREEDNS_User
$Pass = $env:FREEDNS_Password
if (-not $User -or -not $Pass) {
    Write-Error "Set FREEDNS_User and FREEDNS_Password environment variables."
    exit 1
}

# --- SESSION mgmt ---
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

function Connect-FreeDns {
    Write-Host "Logging into FreeDNS..."
    $loginUrl = "https://freedns.afraid.org/zc.php?step=2"
    $body = @{
        username = $User
        password = $Pass
        submit   = "Login"
        action   = "auth"
    }

    $resp = Invoke-WebRequest -Uri $loginUrl -Method POST -Body $body -WebSession $session
    if ($resp.Content -match "Invalid login") {
        throw "Login failed for $User"
    }
}

function Get-DomainId-FreeDns([string]$TopDomain) {
    $url = "https://freedns.afraid.org/subdomain/"
    $resp = Invoke-WebRequest -Uri $url -WebSession $session

    # Look for "edit_domain_id" in HTML rows that match our domain
    $regex = [regex]"edit\.php\?edit_domain_id=(\w+).*?$TopDomain"
    $m = $regex.Match($resp.Content)
    if ($m.Success) {
        return $m.Groups[1].Value
    }
    return $null
}

function Add-TXT-FreeDns([string]$DomainId, [string]$SubDomain, [string]$Value) {
    $url = "https://freedns.afraid.org/subdomain/save.php?step=2"
    $body = @{
        type      = "TXT"
        domain_id = $DomainId
        subdomain = $SubDomain
        address   = "`"$Value`""   # quotes around TXT
        send      = "Save!"
    }

    $resp = Invoke-WebRequest -Uri $url -Method POST -Body $body -WebSession $session
    if ($resp.StatusCode -ne 200) {
        throw "Failed to add TXT record"
    }
    Write-Host "✅ Added TXT record for $SubDomain.$DomainId"
}

function Remove-TXT-FreeDns([string]$DataId) {
    $url = "https://freedns.afraid.org/subdomain/delete2.php?data_id%5B%5D=$DataId&submit=delete+selected"
    $resp = Invoke-WebRequest -Uri $url -WebSession $session
    if ($resp.StatusCode -ne 200) {
        throw "Failed to delete TXT record id=$DataId"
    }
    Write-Host "✅ Deleted TXT record id=$DataId"
}

# --- MAIN FLOW ---
try {
    FreeDns-Login

    # Split full domain into sub + top (similar to your shell loop)
    $parts = $RecordName.Split('.')
    for ($i = 1; $i -lt $parts.Length; $i++) {
        $Top = ($parts[$i..($parts.Length-1)] -join ".")
        $Sub = ($parts[0..($i-1)] -join ".")
        $id = FreeDns-GetDomainId $Top
        if ($id) {
            $DomainId = $id
            $SubDomain = $Sub
            break
        }
    }

    if (-not $DomainId) { throw "Domain not found in FreeDNS: $RecordName" }

    if ($Command -eq "create") {
        FreeDns-AddTxt $DomainId $SubDomain $Token
    }
    elseif ($Command -eq "delete") {
        # NOTE: In shell script, they retrieved TXT record IDs first.
        # Here we simplify: you'd need to parse HTML page for `data_id` matching this record.
        throw "Delete not yet fully implemented — needs TXT record lookup"
    }
    else {
        throw "Unknown command: $Command"
    }
}
catch {
    Write-Error $_
    exit 1
}
