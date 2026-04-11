
export type Language = 'en' | 'fr';

export interface ConfigParams {
  domain: string;
  adIp: string;
  proxmoxIp: string;
  mikrotikIp: string;
  radiusSecret: string;
  proxmoxSubnet: string;
  cmdIp: string;
  itIp: string;
  guestIp: string;
  dhcpGuestStart: string;
  dhcpGuestEnd: string;
  wifiSsidIt: string;
  wifiSsidGuest: string;
}

export const uiTranslations = {
  en: {
    appName: "NetDeploy Pro",
    appSubtitle: "Infrastructure Documentation",
    systemOnline: "SYSTEM ONLINE",
    dashboard: "Dashboard",
    windowsServer: "Windows Server",
    sftpConfig: "SFTP Config",
    mikrotikCli: "MikroTik CLI",
    proxmoxNodes: "Proxmox Nodes",
    securityHardening: "Security Hardening",
    globalConfig: "Global Config",
    powershellScripts: "PowerShell Scripts",
    verificationScripts: "Verification Scripts",
    exportPdf: "Export PDF",
    copy: "Copy",
    exportMd: "Export MD",
    exportRsc: "Export RSC",
    exportPs1: "Export PS1",
    copied: "Copied!",
    overview: "Overview",
    infrastructure: "Infrastructure",
    currentContext: "Current Context",
    
    // Dashboard
    domainInfo: "Domain Info",
    primaryDomain: "Primary Domain",
    mailDomain: "Mail Domain",
    infraTitle: "Infrastructure",
    hypervisor: "Hypervisor",
    coreRouter: "Core Router",
    securityStatus: "Security Status",
    pkiPlanned: "PKI / AD CS Planned",
    radiusPlanned: "RADIUS / NPS Planned",
    ldapsPending: "LDAPS Integration Pending",
    topologyTitle: "Network Topology Overview",
    internet: "Internet",
    
    // Config
    configTitle: "Global Configuration Parameters",
    networkDomain: "Network & Domain",
    adDomain: "AD Domain",
    adServerIp: "AD Server IP",
    proxmoxHostIp: "Proxmox Host IP",
    mikrotikRadius: "MikroTik & RADIUS",
    radiusSecret: "RADIUS Secret",
    mikrotikIpLabel: "MikroTik IP (Proxmox Bridge)",
    guestGatewayIp: "Guest Gateway IP",
    dhcpRange: "Guest DHCP Range",
    wifiSsids: "WiFi SSIDs",
    
    // Security
    securityChecklist: "Security Hardening Checklist",
    critical: "Critical",
    high: "High",
    medium: "Medium",
    
    // Tips
    configTip: "Configuration Tip",
    mikrotikTip: "Ensure that you have configured the RADIUS secret on both the Windows NPS server and the MikroTik router. The IP address used in the RADIUS configuration must match the MikroTik's interface IP reachable by the Windows Server."
  },
  fr: {
    appName: "NetDeploy Pro",
    appSubtitle: "Documentation d'Infrastructure",
    systemOnline: "SYSTÈME EN LIGNE",
    dashboard: "Tableau de bord",
    windowsServer: "Serveur Windows",
    sftpConfig: "Config SFTP",
    mikrotikCli: "CLI MikroTik",
    proxmoxNodes: "Noeuds Proxmox",
    securityHardening: "Sécurisation",
    globalConfig: "Config Globale",
    powershellScripts: "Scripts PowerShell",
    verificationScripts: "Scripts de Vérification",
    exportPdf: "Exporter PDF",
    copy: "Copier",
    exportMd: "Exporter MD",
    exportRsc: "Exporter RSC",
    exportPs1: "Exporter PS1",
    copied: "Copié !",
    overview: "Aperçu",
    infrastructure: "Infrastructure",
    currentContext: "Contexte Actuel",
    
    // Dashboard
    domainInfo: "Infos Domaine",
    primaryDomain: "Domaine Primaire",
    mailDomain: "Domaine Mail",
    infraTitle: "Infrastructure",
    hypervisor: "Hyperviseur",
    coreRouter: "Routeur Principal",
    securityStatus: "État de Sécurité",
    pkiPlanned: "PKI / AD CS Planifié",
    radiusPlanned: "RADIUS / NPS Planifié",
    ldapsPending: "Intégration LDAPS en attente",
    topologyTitle: "Aperçu de la Topologie Réseau",
    internet: "Internet",
    
    // Config
    configTitle: "Paramètres de Configuration Globale",
    networkDomain: "Réseau & Domaine",
    adDomain: "Domaine AD",
    adServerIp: "IP Serveur AD",
    proxmoxHostIp: "IP Hôte Proxmox",
    mikrotikRadius: "MikroTik & RADIUS",
    radiusSecret: "Secret RADIUS",
    mikrotikIpLabel: "IP MikroTik (Pont Proxmox)",
    guestGatewayIp: "IP Passerelle Invité",
    dhcpRange: "Plage DHCP Invité",
    wifiSsids: "SSIDs WiFi",
    
    // Security
    securityChecklist: "Liste de Sécurisation",
    critical: "Critique",
    high: "Élevé",
    medium: "Moyen",
    
    // Tips
    configTip: "Conseil de Configuration",
    mikrotikTip: "Assurez-vous d'avoir configuré le secret RADIUS sur le serveur Windows NPS et sur le routeur MikroTik. L'adresse IP utilisée dans la configuration RADIUS doit correspondre à l'IP de l'interface MikroTik joignable par le serveur Windows."
  }
};

export const getWindowsPowerShellScripts = (p: ConfigParams, lang: Language) => {
  if (lang === 'fr') {
    return `
# Scripts PowerShell de Configuration Windows Server 2025

## 1. Configuration AD DS & DNS
\`\`\`powershell
# Installer les outils AD DS
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# Promouvoir le serveur en tant que contrôleur de domaine
Import-Module ADDSDeployment
Install-ADDSForest \`
    -CreateDnsDelegation:$false \`
    -DatabasePath "C:\\Windows\\NTDS" \`
    -DomainMode "WinThreshold" \`
    -DomainName "${p.domain}" \`
    -DomainNetbiosName "${p.domain.split('.')[0].toUpperCase()}" \`
    -ForestMode "WinThreshold" \`
    -InstallDns:$true \`
    -LogPath "C:\\Windows\\NTDS" \`
    -NoRebootOnCompletion:$false \`
    -SysvolPath "C:\\Windows\\SYSVOL" \`
    -Force:$true
\`\`\`

## 2. Création de la Structure OU
\`\`\`powershell
# Créer l'OU Racine
New-ADOrganizationalUnit -Name "CFP-CMD" -Path "DC=${p.domain.replace(/\./g, ',DC=')}"

# Créer les sous-OUs
$rootPath = "OU=CFP-CMD,DC=${p.domain.replace(/\./g, ',DC=')}"
"Users", "Computers", "Groups" | ForEach-Object {
    New-ADOrganizationalUnit -Name $_ -Path $rootPath
}

# Créer les sous-OUs pour Users
$usersPath = "OU=Users,$rootPath"
"IT-Admin", "Staff", "Guests" | ForEach-Object {
    New-ADOrganizationalUnit -Name $_ -Path $usersPath
}
\`\`\`

## 3. Configuration NPS (RADIUS)
\`\`\`powershell
# Installer NPS
Install-WindowsFeature -Name NPAS -IncludeManagementTools

# Enregistrer NPS dans AD
netsh ras add registeredserver

# Ajouter le client RADIUS (MikroTik)
New-NpsRadiusClient -Name "MikroTik-Router" -Address "${p.mikrotikIp}" -SharedSecret "${p.radiusSecret}"
\`\`\`
`;
  }
  return `
# Windows Server 2025 PowerShell Configuration Scripts

## 1. AD DS & DNS Setup
\`\`\`powershell
# Install AD DS tools
Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools

# Promote server to Domain Controller
Import-Module ADDSDeployment
Install-ADDSForest \`
    -CreateDnsDelegation:$false \`
    -DatabasePath "C:\\Windows\\NTDS" \`
    -DomainMode "WinThreshold" \`
    -DomainName "${p.domain}" \`
    -DomainNetbiosName "${p.domain.split('.')[0].toUpperCase()}" \`
    -ForestMode "WinThreshold" \`
    -InstallDns:$true \`
    -LogPath "C:\\Windows\\NTDS" \`
    -NoRebootOnCompletion:$false \`
    -SysvolPath "C:\\Windows\\SYSVOL" \`
    -Force:$true
\`\`\`

## 2. OU Structure Creation
\`\`\`powershell
# Create Root OU
New-ADOrganizationalUnit -Name "CFP-CMD" -Path "DC=${p.domain.replace(/\./g, ',DC=')}"

# Create sub-OUs
$rootPath = "OU=CFP-CMD,DC=${p.domain.replace(/\./g, ',DC=')}"
"Users", "Computers", "Groups" | ForEach-Object {
    New-ADOrganizationalUnit -Name $_ -Path $rootPath
}

# Create sub-OUs for Users
$usersPath = "OU=Users,$rootPath"
"IT-Admin", "Staff", "Guests" | ForEach-Object {
    New-ADOrganizationalUnit -Name $_ -Path $usersPath
}
\`\`\`

## 3. NPS (RADIUS) Configuration
\`\`\`powershell
# Install NPS
Install-WindowsFeature -Name NPAS -IncludeManagementTools

# Register NPS in AD
netsh ras add registeredserver

# Add RADIUS client (MikroTik)
New-NpsRadiusClient -Name "MikroTik-Router" -Address "${p.mikrotikIp}" -SharedSecret "${p.radiusSecret}"
\`\`\`
`;
};

export const getWindowsVerificationScripts = (p: ConfigParams, lang: Language) => {
  if (lang === 'fr') {
    return `
# Scripts de Vérification Windows Server 2025

## 1. Vérification AD DS
\`\`\`powershell
# Vérifier l'état du domaine
Get-ADDomain | Select-Object AllowedDNSSuffixes, Forest, DomainControllersContainer

# Vérifier les services AD
Get-Service adws, dns, ntds, kdc | Select-Object Name, Status
\`\`\`

## 2. Vérification DNS
\`\`\`powershell
# Tester la résolution DNS locale
Resolve-DnsName -Name "${p.domain}" -Server 127.0.0.1

# Vérifier les zones DNS
Get-DnsServerZone | Select-Object ZoneName, ZoneType, IsReadOnly
\`\`\`

## 3. Vérification NPS / RADIUS
\`\`\`powershell
# Vérifier les clients RADIUS
Get-NpsRadiusClient | Select-Object Name, Address, SharedSecret

# Tester le port RADIUS (1812)
Test-NetConnection -ComputerName localhost -Port 1812
\`\`\`
`;
  }
  return `
# Windows Server 2025 Verification Scripts

## 1. AD DS Verification
\`\`\`powershell
# Check domain status
Get-ADDomain | Select-Object AllowedDNSSuffixes, Forest, DomainControllersContainer

# Check AD services
Get-Service adws, dns, ntds, kdc | Select-Object Name, Status
\`\`\`

## 2. DNS Verification
\`\`\`powershell
# Test local DNS resolution
Resolve-DnsName -Name "${p.domain}" -Server 127.0.0.1

# Check DNS zones
Get-DnsServerZone | Select-Object ZoneName, ZoneType, IsReadOnly
\`\`\`

## 3. NPS / RADIUS Verification
\`\`\`powershell
# Check RADIUS clients
Get-NpsRadiusClient | Select-Object Name, Address, SharedSecret

# Test RADIUS port (1812)
Test-NetConnection -ComputerName localhost -Port 1812
\`\`\`
`;
};

export const getMikrotikFullScript = (p: ConfigParams, lang: Language) => {
  return `
# MikroTik Full Configuration Script (RB951)
# Generated for: ${p.domain}
# Language: ${lang.toUpperCase()}

# 1. Bridge & Port Assignment
/interface bridge add name=BR-PROXMOX comment="Bridge for Hypervisor"
/interface bridge add name=BR-CP-CMD comment="Bridge for CMD Network"
/interface bridge add name=BR-CFP-IT comment="Bridge for IT Management"
/interface bridge add name=BR-GUEST comment="Bridge for Guest Network"

/interface bridge port add bridge=BR-PROXMOX interface=ether2
/interface bridge port add bridge=BR-CP-CMD interface=ether3
/interface ethernet set [find name=ether4] disabled=yes
/interface ethernet set [find name=ether5] disabled=yes

# 2. Wireless Security Profiles
/interface wireless security-profiles
add name=PROF-IT mode=dynamic-keys authentication-types=wpa2-eap eap-methods=passthrough radius-mac-auth=no
add name=PROF-GUEST mode=dynamic-keys authentication-types=wpa2-psk unicast-ciphers=aes-ccm group-ciphers=aes-ccm wpa2-pre-shared-key="GuestPassword123"

# 3. Wireless Interfaces
/interface wireless
set [find name=wlan1] name=W-IT ssid="${p.wifiSsidIt}" security-profile=PROF-IT disabled=no
add name=W-GUEST ssid="${p.wifiSsidGuest}" security-profile=PROF-GUEST master-interface=W-IT disabled=no
/interface bridge port add bridge=BR-CFP-IT interface=W-IT
/interface bridge port add bridge=BR-GUEST interface=W-GUEST

# 4. IP Addressing
/ip address
add address=${p.mikrotikIp}/27 interface=BR-PROXMOX
add address=${p.cmdIp}/24 interface=BR-CP-CMD
add address=${p.itIp}/28 interface=BR-CFP-IT
add address=${p.guestIp}/24 interface=BR-GUEST

# 5. DHCP Pools & Servers
/ip pool
add name=POOL-GUEST ranges=${p.dhcpGuestStart}-${p.dhcpGuestEnd}
/ip dhcp-server
add name=DHCP-GUEST interface=BR-GUEST address-pool=POOL-GUEST disabled=no
/ip dhcp-server network
add address=${p.guestIp.substring(0, p.guestIp.lastIndexOf('.'))}.0/24 gateway=${p.guestIp} dns-server=${p.adIp},8.8.8.8

# 6. RADIUS Configuration
/radius add address=${p.adIp} secret="${p.radiusSecret}" service=wireless,hotspot

# 7. Hotspot Configuration
/ip hotspot profile
add name=HS-PROF-GUEST hotspot-address=${p.guestIp} use-radius=yes login-by=http-chap,https
/ip hotspot
add name=GUEST-HOTSPOT interface=BR-GUEST profile=HS-PROF-GUEST disabled=no

# 8. Firewall Rules (Hardening)
/ip firewall filter
# Input Chain (Protect Router)
add chain=input action=accept connection-state=established,related comment="Accept established/related"
add chain=input action=drop connection-state=invalid comment="Drop invalid"
add chain=input action=accept protocol=icmp comment="Allow ICMP"
add chain=input action=accept src-address=${p.itIp.substring(0, p.itIp.lastIndexOf('.'))}.0/28 comment="Allow IT Management"
add chain=input action=drop comment="Drop everything else"

# Forward Chain (Inter-VLAN Isolation)
add chain=forward action=accept connection-state=established,related
add chain=forward action=drop connection-state=invalid
add chain=forward action=accept src-address=${p.itIp.substring(0, p.itIp.lastIndexOf('.'))}.0/28 comment="Allow IT to all"
add chain=forward action=drop src-address=${p.guestIp.substring(0, p.guestIp.lastIndexOf('.'))}.0/24 dst-address=${p.adIp} comment="Block Guest to AD"
add chain=forward action=accept out-interface=ether1 comment="Allow Internet access"
add chain=forward action=drop comment="Drop inter-VLAN by default"

# 9. NAT
/ip firewall nat
add chain=srcnat out-interface=ether1 action=masquerade
`;
};

export const getSFTPGuide = (p: ConfigParams, lang: Language) => {
  if (lang === 'fr') {
    return `
# Guide de Configuration SFTP Windows Server 2025

Ce guide détaille la mise en place d'un service SFTP sécurisé utilisant la fonctionnalité native **OpenSSH Server**.

## 1. Installation d'OpenSSH
1. Ouvrez **PowerShell** en tant qu'Administrateur.
2. Exécutez la commande suivante :
   \`\`\`powershell
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   \`\`\`
3. Démarrez et configurez le service pour un démarrage automatique :
   \`\`\`powershell
   Start-Service sshd
   Set-Service -Name sshd -StartupType 'Automatic'
   \`\`\`

## 2. Création d'Utilisateurs et Groupes (Active Directory)
1. Créez un groupe de sécurité : \`SFTP_Users\`.
2. Créez un utilisateur SFTP dédié (ex: \`sftp_svc\`) et ajoutez-le au groupe.
3. Assurez-vous que l'utilisateur n'a **pas de droits de connexion interactive** si la sécurité est une priorité.

## 3. Permissions de Répertoire (NTFS)
1. Créez le dossier racine : \`C:\\SFTP_Root\`.
2. **Désactivez l'héritage** sur le dossier.
3. Accordez le **Contrôle Total** à \`SYSTEM\` et \`Administrators\`.
4. Accordez **Lecture/Écriture** (Modification) au groupe \`SFTP_Users\`.
5. **CRITIQUE** : Pour que le Chroot fonctionne, les répertoires parents du chemin Chroot doivent appartenir aux \`Administrators\` et ne pas être accessibles en écriture par un autre utilisateur.

## 4. Configuration SSHD (\`sshd_config\`)
Éditez \`C:\\ProgramData\\ssh\\sshd_config\` :
\`\`\`text
# Désactiver l'authentification par mot de passe (Optionnel, pour clés uniquement)
PasswordAuthentication no

# Activer l'authentification par clé publique
PubkeyAuthentication yes

# Configuration Chroot
Match Group SFTP_Users
    ChrootDirectory C:\\SFTP_Root
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
\`\`\`
*Redémarrez le service après les modifications :* \`Restart-Service sshd\`

## 5. Authentification par Clé SSH
### Côté Client (Linux/Mac/WSL)
1. Générez les clés : \`ssh-keygen -t ed25519 -f id_sftp\`.
2. Copiez le contenu de \`id_sftp.pub\`.

### Côté Serveur
1. Naviguez vers le profil de l'utilisateur : \`C:\\Users\\sftp_svc\\.ssh\\\`.
2. Créez un fichier nommé \`authorized_keys\` (sans extension).
3. Collez le contenu de la clé publique dans ce fichier.
4. **Vérification des Permissions** : Assurez-vous que seuls l'utilisateur et \`SYSTEM\` ont accès au dossier \`.ssh\` et au fichier \`authorized_keys\`.

*Note : Si l'utilisateur est un Administrateur, OpenSSH cherche dans \`C:\\ProgramData\\ssh\\administrators_authorized_keys\` par défaut.*
`;
  }
  return `
# Windows Server 2025 SFTP Configuration Guide

This guide details the setup of a secure SFTP service using the native **OpenSSH Server** feature.

## 1. Installation of OpenSSH
1. Open **PowerShell** as Administrator.
2. Run the following command:
   \`\`\`powershell
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   \`\`\`
3. Start and configure the service to start automatically:
   \`\`\`powershell
   Start-Service sshd
   Set-Service -Name sshd -StartupType 'Automatic'
   \`\`\`

## 2. User & Group Creation (Active Directory)
1. Create a security group: \`SFTP_Users\`.
2. Create a dedicated SFTP user (e.g., \`sftp_svc\`) and add it to the group.
3. Ensure the user has **no interactive login** rights if security is a priority.

## 3. Directory Permissions (NTFS)
1. Create the root folder: \`C:\\SFTP_Root\`.
2. **Disable Inheritance** on the folder.
3. Grant **Full Control** to \`SYSTEM\` and \`Administrators\`.
4. Grant **Read/Write** (Modify) to the \`SFTP_Users\` group.
5. **CRITICAL**: For Chroot to work, the parent directories of the Chroot path must be owned by \`Administrators\` and not writable by any other user.

## 4. SSHD Configuration (\`sshd_config\`)
Edit \`C:\\ProgramData\\ssh\\sshd_config\`:
\`\`\`text
# Disable Password Authentication (Optional, for Key-only)
PasswordAuthentication no

# Enable Public Key Authentication
PubkeyAuthentication yes

# Chroot Setup
Match Group SFTP_Users
    ChrootDirectory C:\\SFTP_Root
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
\`\`\`
*Restart the service after changes:* \`Restart-Service sshd\`

## 5. SSH Key Authentication
### Client Side (Linux/Mac/WSL)
1. Generate keys: \`ssh-keygen -t ed25519 -f id_sftp\`.
2. Copy the content of \`id_sftp.pub\`.

### Server Side
1. Navigate to the user's profile: \`C:\\Users\\sftp_svc\\.ssh\\\`.
2. Create a file named \`authorized_keys\` (no extension).
3. Paste the public key content into this file.
4. **Permissions Check**: Ensure only the user and \`SYSTEM\` have access to the \`.ssh\` folder and \`authorized_keys\` file.

*Note: If the user is an Administrator, OpenSSH looks in \`C:\\ProgramData\\ssh\\administrators_authorized_keys\` by default.*
`;
};

export const getWindowsGuide = (p: ConfigParams, lang: Language) => {
  if (lang === 'fr') {
    return `
# Guide de Déploiement Windows Server 2025

## 1. Configuration Initiale & AD DS
- **Nom d'hôte** : \`SRV-AD-01\` (IP : \`${p.adIp}\`).
- **Installation du Rôle** : Installez **Active Directory Domain Services** via le Gestionnaire de Serveur.
- **Promotion** : Promouvoir en tant que Contrôleur de Domaine pour une nouvelle forêt : \`${p.domain}\`.
- **DNS** : Le DNS intégré sera installé automatiquement.

## 2. Configuration DNS
- Créer une Zone de Recherche Directe : \`mail.${p.domain}\`.
- Configurer les Redirecteurs (ex: \`8.8.8.8\`).
- Créer une Zone de Recherche Inversée pour \`${p.proxmoxSubnet}\`.

## 3. Structure OU & GPO
### Unités d'Organisation (OU)
- \`CFP-CMD\` (Racine)
  - \`Users\`
    - \`IT-Admin\`
    - \`Staff\`
    - \`Guests\`
  - \`Computers\`
  - \`Groups\`

### Objets de Stratégie de Groupe (GPO)
- **Default Domain Policy** : Complexité des mots de passe, seuil de verrouillage.
- **IT-Admin-Policy** : Activer le Bureau à Distance, désactiver le Panneau de Configuration pour les utilisateurs standards.
- **Security-Hardening** : Désactiver LLMNR/NetBIOS, restreindre NTLM.

## 4. Configuration SFTP
- Installer la fonctionnalité **OpenSSH Server**.
- Configurer \`sshd_config\` pour restreindre l'accès à des groupes AD spécifiques.
- Configurer le répertoire racine pour les transferts de fichiers.

## 5. AD CS / PKI & NPS
- **AD CS** : Installer l'Autorité de Certification (Enterprise Root CA).
- **NPS** : Installer le Network Policy Server.
  - Enregistrer le NPS dans l'Active Directory.
  - Configurer les **Clients RADIUS** (IP MikroTik : \`${p.mikrotikIp}\`).
  - Créer des **Stratégies Réseau** pour le WiFi IT (EAP-TLS ou PEAP-MSCHAPv2).

## 6. LDAPS (Port 636)
- Demander un certificat "Authentification Serveur" auprès de la CA.
- Installer le certificat dans le magasin Personnel de l'Ordinateur Local.
- Vérifier LDAPS en utilisant \`ldp.exe\`.
`;
  }
  return `
# Windows Server 2025 Deployment Guide

## 1. Initial Setup & AD DS
- **Hostname**: Set to \`SRV-AD-01\` (IP: \`${p.adIp}\`).
- **Role Installation**: Install **Active Directory Domain Services** via Server Manager.
- **Promotion**: Promote to Domain Controller for a new forest: \`${p.domain}\`.
- **DNS**: Integrated DNS will be installed automatically.

## 2. DNS Configuration
- Create Forward Lookup Zone: \`mail.${p.domain}\`.
- Configure Forwarders (e.g., \`8.8.8.8\`).
- Create Reverse Lookup Zone for \`${p.proxmoxSubnet}\`.

## 3. OU & GPO Structure
### Organizational Units (OU)
- \`CFP-CMD\` (Root)
  - \`Users\`
    - \`IT-Admin\`
    - \`Staff\`
    - \`Guests\`
  - \`Computers\`
  - \`Groups\`

### Group Policy Objects (GPO)
- **Default Domain Policy**: Password complexity, lockout threshold.
- **IT-Admin-Policy**: Enable Remote Desktop, Disable Control Panel for standard users.
- **Security-Hardening**: Disable LLMNR/NetBIOS, restrict NTLM.

## 4. SFTP Setup
- Install **OpenSSH Server** feature.
- Configure \`sshd_config\` to restrict access to specific AD groups.
- Set up root directory for file transfers.

## 5. AD CS / PKI & NPS
- **AD CS**: Install Certification Authority (Enterprise Root CA).
- **NPS**: Install Network Policy Server.
  - Register NPS in Active Directory.
  - Configure **RADIUS Clients** (MikroTik IP: \`${p.mikrotikIp}\`).
  - Create **Network Policies** for WiFi IT (EAP-TLS or PEAP-MSCHAPv2).

## 6. LDAPS (Port 636)
- Request a "Server Authentication" certificate from the CA.
- Install the certificate in the Personal store of the Local Computer.
- Verify LDAPS using \`ldp.exe\`.
`;
};

export const getMikrotikScripts = (p: ConfigParams, lang: Language) => {
  return getMikrotikFullScript(p, lang);
};

export const getProxmoxHardening = (p: ConfigParams, lang: Language) => {
  if (lang === 'fr') {
    return `
# Sécurisation Proxmox & VM

## 1. Sécurité de l'Hyperviseur (${p.proxmoxIp})
- Activer le Pare-feu au niveau du Datacenter.
- Restreindre l'accès à l'interface graphique (Port 8006) au sous-réseau \`CFP-IT\` uniquement.
- Utiliser Fail2Ban pour la protection SSH.

## 2. Plan d'Adressage VM
| Nom VM | Adresse IP | Rôle |
|---------|------------|------|
| Windows Server 2025 | ${p.adIp} | AD, DNS, PKI, NPS |
| WEB-SQL | 10.200.20.8 | Web & Base de données |
| Mail (iRedMail) | 10.200.20.7 | SMTP/IMAP |
| Zabbix | 10.200.20.6 | Supervision |
| VOIP | 10.200.20.10 | PBX |
| Samba | 10.200.20.15 | Partage de fichiers |

## 3. Sécurisation Réseau
- **Isolation** : Utiliser les règles de pare-feu MikroTik pour empêcher le routage inter-VLAN sauf si nécessaire (ex: Zabbix vers tous).
- **Mises à jour** : Automatiser les mises à jour de sécurité sur toutes les VM Linux (\`unattended-upgrades\`).
- **Sauvegardes** : Configurer Proxmox Backup Server (PBS) pour des instantanés quotidiens.
`;
  }
  return `
# Proxmox & VM Security Hardening

## 1. Hypervisor Security (${p.proxmoxIp})
- Enable Firewall at Datacenter level.
- Restrict GUI access (Port 8006) to the \`CFP-IT\` subnet only.
- Use Fail2Ban for SSH protection.

## 2. VM Address Plan
| VM Name | IP Address | Role |
|---------|------------|------|
| Windows Server 2025 | ${p.adIp} | AD, DNS, PKI, NPS |
| WEB-SQL | 10.200.20.8 | Web & Database |
| Mail (iRedMail) | 10.200.20.7 | SMTP/IMAP |
| Zabbix | 10.200.20.6 | Monitoring |
| VOIP | 10.200.20.10 | PBX |
| Samba | 10.200.20.15 | File Sharing |

## 3. Network Hardening
- **Isolation**: Use MikroTik Firewall rules to prevent inter-VLAN routing except where necessary (e.g., Zabbix to all).
- **Updates**: Automate security updates on all Linux VMs (\`unattended-upgrades\`).
- **Backups**: Configure Proxmox Backup Server (PBS) for daily snapshots.
`;
};

export const securityChecklistItems = (lang: Language) => {
  if (lang === 'fr') {
    return [
      { label: "Désactiver LLMNR et NetBIOS via GPO", status: "Critique" },
      { label: "Appliquer LDAPS pour toutes les requêtes d'annuaire", status: "Élevé" },
      { label: "Implémenter 802.1X (NPS) pour le WiFi de gestion IT", status: "Élevé" },
      { label: "Restreindre l'accès MikroTik WinBox au sous-réseau IT", status: "Critique" },
      { label: "Activer le pare-feu Proxmox pour toutes les VM", status: "Moyen" },
      { label: "Configurer SFTP avec authentification par clé SSH", status: "Moyen" }
    ];
  }
  return [
    { label: "Disable LLMNR and NetBIOS via GPO", status: "Critical" },
    { label: "Enforce LDAPS for all directory queries", status: "High" },
    { label: "Implement 802.1X (NPS) for IT Management WiFi", status: "High" },
    { label: "Restrict MikroTik WinBox access to IT subnet", status: "Critical" },
    { label: "Enable Proxmox Firewall for all VMs", status: "Medium" },
    { label: "Configure SFTP with SSH Key Authentication", status: "Medium" }
  ];
};
