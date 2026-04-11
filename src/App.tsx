import React, { useState } from 'react';
import { 
  Server, 
  Shield, 
  Network, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Globe, 
  Cpu,
  ChevronRight,
  Copy,
  Info,
  Menu,
  X,
  Languages
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { 
  Language, 
  ConfigParams, 
  uiTranslations, 
  getSFTPGuide, 
  getWindowsGuide, 
  getWindowsPowerShellScripts,
  getWindowsVerificationScripts,
  getMikrotikFullScript,
  getMikrotikScripts, 
  getProxmoxHardening,
  securityChecklistItems
} from './translations';

// --- Types ---
type Section = 'dashboard' | 'windows' | 'powershell' | 'verification' | 'sftp' | 'mikrotik' | 'proxmox' | 'security' | 'config';

// --- Content Data Functions ---
// Moved to translations.ts

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg text-left",
      active 
        ? "bg-zinc-900 text-white shadow-lg shadow-black/20 border border-zinc-800" 
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
    )}
  >
    <Icon size={18} className={active ? "text-emerald-400" : "text-zinc-500"} />
    <span className="truncate">{label}</span>
  </button>
);

const Card = ({ children, title, icon: Icon, className }: { children: React.ReactNode, title?: string, icon?: any, className?: string }) => (
  <div className={cn("bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden", className)}>
    {title && (
      <div className="px-6 py-4 border-b border-zinc-900 flex items-center gap-3 bg-zinc-900/30">
        {Icon && <Icon size={18} className="text-emerald-500" />}
        <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">{title}</h3>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [lang, setLang] = useState<Language>('fr');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [config, setConfig] = useState<ConfigParams>({
    domain: 'cfp-cmd.local',
    adIp: '10.200.20.5',
    proxmoxIp: '10.200.20.2',
    mikrotikIp: '10.200.20.1',
    radiusSecret: 'MyRadiusSecret',
    proxmoxSubnet: '10.200.20.0/27',
    cmdIp: '192.168.30.1',
    itIp: '172.16.10.1',
    guestIp: '192.168.40.1',
    dhcpGuestStart: '192.168.40.100',
    dhcpGuestEnd: '192.168.40.200',
    wifiSsidIt: 'CFP-IT-MGMT',
    wifiSsidGuest: 'CFP-GUEST-WIFI'
  });

  const t = uiTranslations[lang];

  const handleExport = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    const commonMarkdownClass = "prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-wider prose-code:text-emerald-400 prose-code:bg-emerald-400/5 prose-code:px-1 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800";

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title={t.domainInfo} icon={Globe}>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-mono">{t.primaryDomain}</p>
                    <p className="text-lg font-semibold text-zinc-200">{config.domain}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-mono">{t.mailDomain}</p>
                    <p className="text-lg font-semibold text-zinc-200">mail.{config.domain}</p>
                  </div>
                </div>
              </Card>
              <Card title={t.infraTitle} icon={Cpu}>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-mono">{t.hypervisor}</p>
                    <p className="text-lg font-semibold text-zinc-200">Proxmox VE ({config.proxmoxIp})</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-mono">{t.coreRouter}</p>
                    <p className="text-lg font-semibold text-zinc-200">MikroTik RB951</p>
                  </div>
                </div>
              </Card>
              <Card title={t.securityStatus} icon={Shield}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">{t.pkiPlanned}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">{t.radiusPlanned}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-medium">{t.ldapsPending}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card title={t.topologyTitle} icon={Network}>
              <div className="relative h-64 bg-zinc-900/50 rounded-lg border border-zinc-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#34d399 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="flex flex-col items-center gap-8 relative z-10">
                  <div className="flex items-center gap-6 md:gap-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-500 shadow-xl">
                        <Globe size={24} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{t.internet}</span>
                    </div>
                    <div className="w-12 md:w-24 h-px bg-zinc-700 relative">
                      <div className="absolute -top-1.5 right-0 w-3 h-3 border-t border-r border-zinc-700 rotate-45" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/20">
                        <Network size={32} />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold">MikroTik RB951</span>
                    </div>
                  </div>
                  <div className="flex gap-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                        <Server size={24} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Proxmox</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                        <Lock size={24} />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">AD / NPS</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'windows':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getWindowsGuide(config, lang));
                  alert(t.copied);
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Copy size={14} /> {t.copy}
              </button>
              <button 
                onClick={() => handleExport(getWindowsGuide(config, lang), 'windows-server-guide.md')}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                {t.exportMd}
              </button>
            </div>
            <Card className={commonMarkdownClass}>
              <ReactMarkdown>{getWindowsGuide(config, lang)}</ReactMarkdown>
            </Card>
          </div>
        );
      case 'powershell':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getWindowsPowerShellScripts(config, lang));
                  alert(t.copied);
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Copy size={14} /> {t.copy}
              </button>
              <button 
                onClick={() => handleExport(getWindowsPowerShellScripts(config, lang), 'setup-ad-nps.ps1')}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                {t.exportPs1}
              </button>
            </div>
            <Card className={commonMarkdownClass}>
              <ReactMarkdown>{getWindowsPowerShellScripts(config, lang)}</ReactMarkdown>
            </Card>
          </div>
        );
      case 'verification':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getWindowsVerificationScripts(config, lang));
                  alert(t.copied);
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Copy size={14} /> {t.copy}
              </button>
              <button 
                onClick={() => handleExport(getWindowsVerificationScripts(config, lang), 'verify-infra.ps1')}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                {t.exportPs1}
              </button>
            </div>
            <Card className={commonMarkdownClass}>
              <ReactMarkdown>{getWindowsVerificationScripts(config, lang)}</ReactMarkdown>
            </Card>
          </div>
        );
      case 'sftp':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getSFTPGuide(config, lang));
                  alert(t.copied);
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Copy size={14} /> {t.copy}
              </button>
              <button 
                onClick={() => handleExport(getSFTPGuide(config, lang), 'sftp-config-guide.md')}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                {t.exportMd}
              </button>
            </div>
            <Card className={commonMarkdownClass}>
              <ReactMarkdown>{getSFTPGuide(config, lang)}</ReactMarkdown>
            </Card>
          </div>
        );
      case 'mikrotik':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getMikrotikFullScript(config, lang));
                  alert(t.copied);
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Copy size={14} /> {t.copy}
              </button>
              <button 
                onClick={() => handleExport(getMikrotikFullScript(config, lang), 'mikrotik-full-config.rsc')}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                {t.exportRsc}
              </button>
            </div>
            <Card className={commonMarkdownClass}>
              <ReactMarkdown>{"# MikroTik Full Script\n\n```bash\n" + getMikrotikFullScript(config, lang) + "\n```"}</ReactMarkdown>
            </Card>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Info size={20} />
              </div>
              <div>
                <h4 className="text-emerald-400 font-semibold mb-1">{t.configTip}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {t.mikrotikTip}
                </p>
              </div>
            </div>
          </div>
        );
      case 'proxmox':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(getProxmoxHardening(config, lang));
                  alert(t.copied);
                }}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
              >
                <Copy size={14} /> {t.copy}
              </button>
              <button 
                onClick={() => handleExport(getProxmoxHardening(config, lang), 'proxmox-hardening.md')}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
              >
                {t.exportMd}
              </button>
            </div>
            <Card className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-headings:uppercase prose-headings:tracking-wider prose-table:border prose-table:border-zinc-800 prose-th:bg-zinc-900 prose-th:p-3 prose-td:p-3 prose-td:border-t prose-td:border-zinc-800">
              <ReactMarkdown>{getProxmoxHardening(config, lang)}</ReactMarkdown>
            </Card>
          </div>
        );
      case 'config':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card title={t.configTitle} icon={Terminal}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-2">{t.networkDomain}</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">{t.adDomain}</label>
                      <input 
                        type="text" 
                        value={config.domain}
                        onChange={(e) => setConfig({...config, domain: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">{t.adServerIp}</label>
                      <input 
                        type="text" 
                        value={config.adIp}
                        onChange={(e) => setConfig({...config, adIp: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">{t.proxmoxHostIp}</label>
                      <input 
                        type="text" 
                        value={config.proxmoxIp}
                        onChange={(e) => setConfig({...config, proxmoxIp: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-2 mt-8">{t.wifiSsids}</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">IT Management SSID</label>
                      <input 
                        type="text" 
                        value={config.wifiSsidIt}
                        onChange={(e) => setConfig({...config, wifiSsidIt: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Guest WiFi SSID</label>
                      <input 
                        type="text" 
                        value={config.wifiSsidGuest}
                        onChange={(e) => setConfig({...config, wifiSsidGuest: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-2">{t.mikrotikRadius}</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">{t.radiusSecret}</label>
                      <input 
                        type="text" 
                        value={config.radiusSecret}
                        onChange={(e) => setConfig({...config, radiusSecret: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">{t.mikrotikIpLabel}</label>
                      <input 
                        type="text" 
                        value={config.mikrotikIp}
                        onChange={(e) => setConfig({...config, mikrotikIp: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">{t.guestGatewayIp}</label>
                      <input 
                        type="text" 
                        value={config.guestIp}
                        onChange={(e) => setConfig({...config, guestIp: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-mono text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20 pb-2 mt-8">{t.dhcpRange}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">Start</label>
                      <input 
                        type="text" 
                        value={config.dhcpGuestStart}
                        onChange={(e) => setConfig({...config, dhcpGuestStart: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase">End</label>
                      <input 
                        type="text" 
                        value={config.dhcpGuestEnd}
                        onChange={(e) => setConfig({...config, dhcpGuestEnd: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
      case 'security':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <Card title={t.securityChecklist} icon={Shield}>
              <div className="space-y-4">
                {securityChecklistItems(lang).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded border border-zinc-700 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-sm text-zinc-300">{item.label}</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider",
                      (item.status === "Critical" || item.status === "Critique") ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      (item.status === "High" || item.status === "Élevé") ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    )}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
    }
  };

  const NavContent = () => (
    <nav className="space-y-2">
      <SidebarItem 
        icon={Globe} 
        label={t.dashboard} 
        active={activeSection === 'dashboard'} 
        onClick={() => { setActiveSection('dashboard'); setIsMobileMenuOpen(false); }} 
      />
      <div className="pt-4 pb-2 px-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{t.windowsServer}</div>
      <SidebarItem 
        icon={FileText} 
        label={t.overview} 
        active={activeSection === 'windows'} 
        onClick={() => { setActiveSection('windows'); setIsMobileMenuOpen(false); }} 
      />
      <SidebarItem 
        icon={Terminal} 
        label={t.powershellScripts} 
        active={activeSection === 'powershell'} 
        onClick={() => { setActiveSection('powershell'); setIsMobileMenuOpen(false); }} 
      />
      <SidebarItem 
        icon={CheckCircle2} 
        label={t.verificationScripts} 
        active={activeSection === 'verification'} 
        onClick={() => { setActiveSection('verification'); setIsMobileMenuOpen(false); }} 
      />
      <SidebarItem 
        icon={Lock} 
        label={t.sftpConfig} 
        active={activeSection === 'sftp'} 
        onClick={() => { setActiveSection('sftp'); setIsMobileMenuOpen(false); }} 
      />
      
      <div className="pt-4 pb-2 px-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Network & Cloud</div>
      <SidebarItem 
        icon={Terminal} 
        label={t.mikrotikCli} 
        active={activeSection === 'mikrotik'} 
        onClick={() => { setActiveSection('mikrotik'); setIsMobileMenuOpen(false); }} 
      />
      <SidebarItem 
        icon={Cpu} 
        label={t.proxmoxNodes} 
        active={activeSection === 'proxmox'} 
        onClick={() => { setActiveSection('proxmox'); setIsMobileMenuOpen(false); }} 
      />
      <SidebarItem 
        icon={Shield} 
        label={t.securityHardening} 
        active={activeSection === 'security'} 
        onClick={() => { setActiveSection('security'); setIsMobileMenuOpen(false); }} 
      />
      <SidebarItem 
        icon={Terminal} 
        label={t.globalConfig} 
        active={activeSection === 'config'} 
        onClick={() => { setActiveSection('config'); setIsMobileMenuOpen(false); }} 
      />
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-emerald-500/30">
      {/* --- Top Bar --- */}
      <header className="h-16 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">{t.appName} <span className="text-emerald-500">2025</span></h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden sm:block">{t.appSubtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button 
              onClick={() => setLang('en')}
              className={cn(
                "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                lang === 'en' ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('fr')}
              className={cn(
                "px-2 py-1 text-[10px] font-bold rounded transition-colors",
                lang === 'fr' ? "bg-emerald-500 text-black" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              FR
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.systemOnline}
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* --- Mobile Sidebar Overlay --- */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* --- Sidebar --- */}
        <aside className={cn(
          "fixed lg:sticky top-16 h-[calc(100vh-64px)] border-r border-zinc-900 bg-zinc-950/95 lg:bg-zinc-950/30 p-6 z-45 transition-transform duration-300 lg:translate-x-0 w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <NavContent />

          <div className="mt-12 pt-8 border-t border-zinc-900">
            <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
              <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">{t.currentContext}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-300 mb-1">
                <FileText size={12} className="text-emerald-500" />
                <span>{config.domain}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Network size={12} className="text-emerald-500" />
                <span>{config.proxmoxSubnet}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full overflow-x-hidden">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest mb-1">
                <span>{t.infrastructure}</span>
                <ChevronRight size={12} />
                <span className="text-emerald-500">{t[activeSection as keyof typeof t] || activeSection}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">
                {(t[activeSection as keyof typeof t] || activeSection)} {t.overview}
              </h2>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto">
              <Copy size={16} />
              {t.exportPdf}
            </button>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
