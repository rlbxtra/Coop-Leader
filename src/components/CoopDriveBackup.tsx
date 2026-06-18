import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudLightning, 
  Settings, 
  Key, 
  Check, 
  Loader, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  RefreshCw,
  Info
} from 'lucide-react';

interface BackupData {
  userName: string;
  scores: Record<string, number>;
  finalStyle: string;
  backupDate: string;
  appVersion: string;
}

interface CoopDriveBackupProps {
  userName: string;
  scores: Record<string, number>;
  finalStyle: string;
  onRestore: (userName: string, scores: Record<string, number>, finalStyle: string) => void;
}

const DEFAULT_CLIENT_ID = '394402832039-google-studio-placeholder.apps.googleusercontent.com'; // Helpful guidance template Client ID

export default function CoopDriveBackup({ 
  userName, 
  scores, 
  finalStyle, 
  onRestore 
}: CoopDriveBackupProps) {
  // Config state
  const [clientId, setClientId] = useState<string>(() => {
    return localStorage.getItem('coop_google_client_id') || '';
  });
  const [showSettings, setShowSettings] = useState(false);
  
  // Auth & API state
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return sessionStorage.getItem('coop_google_access_token') || null;
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [backupFileId, setBackupFileId] = useState<string | null>(null);
  const [hasCheckedBackup, setHasCheckedBackup] = useState(false);

  // Sync client ID with localStorage
  const handleSaveClientId = (newId: string) => {
    const trimmed = newId.trim();
    setClientId(trimmed);
    localStorage.setItem('coop_google_client_id', trimmed);
    setStatus('success');
    setMessage('Integration Settings Saved! Try connecting now.');
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  // Google OAuth Popup Flow
  const handleConnect = () => {
    const activeClientId = clientId.trim();
    if (!activeClientId) {
      setShowSettings(true);
      setStatus('error');
      setMessage('A Google OAuth Client ID is required to connect your Drive.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Waiting for Google sign-in response...');
      
      const redirectUri = window.location.origin;
      const scopes = ['https://www.googleapis.com/auth/drive.file'];
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        `client_id=${encodeURIComponent(activeClientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=${encodeURIComponent(scopes.join(' '))}` +
        `&state=coop_backup_flow` +
        `&prompt=consent`;

      // Open popup
      const authWindow = window.open(authUrl, 'coop_oauth_popup', 'width=600,height=700,status=no,toolbar=no,menubar=no');
      
      if (!authWindow) {
        setStatus('error');
        setMessage('Popup was blocked. Please enable popups in your browser settings.');
        return;
      }

      // Track window close
      const timer = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(timer);
          // Check if token was received via fallback storage check or postMessage
          const token = sessionStorage.getItem('coop_google_access_token');
          if (token) {
            setAccessToken(token);
            setStatus('success');
            setMessage('Successfully connected to Google Drive!');
          } else {
            setStatus('idle');
            setMessage('');
          }
        }
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage('Failed to launch authorize popup: ' + err.message);
    }
  };

  // Listen for callback responses from Auth Popup redirection
  useEffect(() => {
    // 1. Listen for cross-window messages (postMessage) from the same origin popup callback
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.origin) return;
      if (event.data?.type === 'COOP_OAUTH_TOKEN') {
        const token = event.data.accessToken;
        if (token) {
          sessionStorage.setItem('coop_google_access_token', token);
          setAccessToken(token);
          setStatus('success');
          setMessage('Google Drive connected.');
          setTimeout(() => {
            setStatus('idle');
            setMessage('');
          }, 3000);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);

    // 2. Fallback: Parse URL fragments directly (in case of page redirection inside iframe)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const tokenFromUrl = hashParams.get('access_token');
    const stateFromUrl = hashParams.get('state');

    if (tokenFromUrl && stateFromUrl === 'coop_backup_flow') {
      sessionStorage.setItem('coop_google_access_token', tokenFromUrl);
      setAccessToken(tokenFromUrl);
      // Clean url hash
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setStatus('success');
      setMessage('Connected via page redirection!');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }

    return () => {
      window.removeEventListener('message', handleOAuthMessage);
    };
  }, []);

  // Check if a backup file already exists in Drive
  const checkExistingBackup = async (token: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='coop_style_backup.json' and trashed=false&fields=files(id,name,modifiedTime)`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Google API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.files && data.files.length > 0) {
        const file = data.files[0];
        setBackupFileId(file.id);
        setHasCheckedBackup(true);
        return file.id;
      } else {
        setBackupFileId(null);
        setHasCheckedBackup(true);
        return null;
      }
    } catch (err: any) {
      console.warn('Failed checking backup file:', err);
      return null;
    }
  };

  useEffect(() => {
    if (accessToken) {
      checkExistingBackup(accessToken);
    }
  }, [accessToken]);

  // Push local data backup to Google Drive
  const handleBackupToDrive = async () => {
    if (!accessToken) return;
    setStatus('loading');
    setMessage('Synchronizing nested data to Google Drive...');

    try {
      const filePayload: BackupData = {
        userName,
        scores,
        finalStyle,
        backupDate: new Date().toISOString(),
        appVersion: '2026.1.0'
      };

      // 1. Locate or verify current backup ID
      let fileId = backupFileId;
      if (!fileId) {
        fileId = await checkExistingBackup(accessToken);
      }

      if (fileId) {
        // OVERWRITE existing file
        const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
        const response = await fetch(uploadUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(filePayload, null, 2)
        });

        if (!response.ok) {
          throw new Error(`Write failed with status ${response.status}`);
        }

        setStatus('success');
        setMessage('Great success! Coop style backed up successfully to Google Drive.');
      } else {
        // CREATE new file first
        const createRefResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: 'coop_style_backup.json',
            mimeType: 'application/json'
          })
        });

        if (!createRefResponse.ok) {
          throw new Error(`Metadata reference creation failed: ${createRefResponse.status}`);
        }

        const refData = await createRefResponse.json();
        const newFileId = refData.id;

        // Populate content in step 2
        const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${newFileId}?uploadType=media`;
        const populateResponse = await fetch(uploadUrl, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(filePayload, null, 2)
        });

        if (!populateResponse.ok) {
          throw new Error(`Payload write failed: ${populateResponse.status}`);
        }

        setBackupFileId(newFileId);
        setStatus('success');
        setMessage('First-time backup created in Google Drive successfully!');
      }

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(`Backup failed: ${err.message || err}`);
    }
  };

  // Restore/Import state from Google Drive file
  const handleRestoreFromDrive = async () => {
    if (!accessToken) return;
    setStatus('loading');
    setMessage('Retrieving backup from Google Drive...');

    try {
      let fileId = backupFileId;
      if (!fileId) {
        fileId = await checkExistingBackup(accessToken);
      }

      if (!fileId) {
        setStatus('error');
        setMessage('No prior backup file "coop_style_backup.json" found in your Google Drive folder.');
        return;
      }

      // Fetch file content using alt=media
      const fetchMediaUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const response = await fetch(fetchMediaUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const backupData: BackupData = await response.json();

      if (!backupData.userName || !backupData.finalStyle) {
        throw new Error('Backup file contains invalid format or data');
      }

      // Apply the restoration callback
      onRestore(
        backupData.userName,
        backupData.scores || { rooster: 0, hen: 0, rebel: 0 },
        backupData.finalStyle
      );

      setStatus('success');
      setMessage(`Backup restored! Welcome back, ${backupData.userName}.`);
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(`Retrieval failed: ${err.message || err}`);
    }
  };

  const handleDisconnect = () => {
    sessionStorage.removeItem('coop_google_access_token');
    setAccessToken(null);
    setBackupFileId(null);
    setHasCheckedBackup(false);
    setStatus('success');
    setMessage('Disconnected successfully.');
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 2000);
  };

  return (
    <div id="drive-backup-panel" className="bg-[#FAF6F0] border-4 border-[#3D405B] rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(61,64,91,1)] space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-stone-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#81B29A]/10 rounded-xl border-2 border-[#3D405B]">
            <Cloud className="w-5 h-5 text-[#81B29A]" />
          </div>
          <div>
            <h4 className="font-display font-black text-[#3D405B] text-sm uppercase leading-none">
              Google Drive Backup Nest
            </h4>
            <p className="text-[10px] uppercase font-mono text-stone-500 font-bold mt-1 tracking-wider">
              {accessToken ? '● Connected to Cloud' : '○ Standalone Offline Mode'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-[#3D405B] hover:bg-amber-50 rounded-xl text-xs font-bold transition-all"
        >
          <Settings className="w-3.5 h-3.5 text-[#3D405B]" />
          <span>Configure Setup</span>
        </button>
      </div>

      {showSettings && (
        <div className="bg-white border-2 border-[#3D405B] rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#E07A5F] uppercase">
            <Key className="w-4 h-4" />
            Configuring Your Cloud Integration
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
            Since this app will run directly on your own custom domain (Cloudflare Pages, Render, or GitHub), you must utilize your personal, dedicated Google Cloud Project Client ID for Google API interactions.
          </p>

          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600 block mt-1">
            Google Client ID (OAuth 2.0 Web Client)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. 1234567-xyz.apps.googleusercontent.com"
              className="flex-1 bg-stone-50 border-2 border-stone-300 rounded-xl px-3 py-2 text-xs text-[#3D405B] font-mono placeholder-stone-400 focus:outline-none focus:border-[#E07A5F]"
            />
            <button
              onClick={() => handleSaveClientId(clientId)}
              className="px-4 py-2 bg-[#E07A5F] hover:bg-[#c9694e] text-white font-bold text-xs border-2 border-[#3D405B] rounded-xl transition"
            >
              Apply ID
            </button>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 space-y-1.5 text-[10.5px] text-amber-900">
            <div className="font-bold flex items-center gap-1 text-xs">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              Fast Fix Guide for Google Cloud Console:
            </div>
            <p className="font-medium text-stone-600 pl-1 leading-normal">
              To resolve the <strong>Error 400: redirect_uri_mismatch</strong>, you must add the application URL to BOTH fields under your Client ID details in the Google Cloud Console:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-1 mb-4 text-stone-700">
              <li>
                Click on your Client ID name to edit its settings at <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-bold inline-flex items-center gap-0.5">Google Cloud Credentials <ExternalLink className="w-2.5 h-2.5" /></a>.
              </li>
              <li>
                Find <strong>Authorized JavaScript origins</strong> and add:
                <div className="mt-1 pl-4">
                  <code className="bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] break-all">{window.location.origin}</code>
                </div>
              </li>
              <li>
                Find <strong>Authorized redirect URIs</strong> (this is what's blocking you!) and click Add URI, then paste:
                <div className="mt-1 pl-4">
                  <code className="bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-bold text-[10px] break-all">{window.location.origin}</code>
                </div>
              </li>
              <li>
                Scroll to the bottom of the Cloud Console page and click <strong>Save</strong>. Wait 30 seconds for Google to update.
              </li>
            </ol>

            <div className="border-t border-amber-200 pt-3">
              <div className="font-bold flex items-center gap-1 text-xs text-orange-850 mt-1">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                How to Fix Error 403: access_denied (Test Users)
              </div>
              <p className="font-medium text-stone-600 pl-1 mt-1 leading-normal">
                Because your Google Cloud app is currently in <strong>"Testing"</strong> mode rather than "Production", only people explicitly registered as "Test Users" can sign in. Enable access for your own account in 4 fast clicks:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-1 mt-2 text-stone-700">
                <li>
                  Open the left menu sidebar in your Google Cloud platform or click <a href="https://console.cloud.google.com/auth/audience" target="_blank" rel="noreferrer" className="underline font-bold inline-flex items-center gap-0.5">Audience Settings <ExternalLink className="w-2.5 h-2.5" /></a>.
                </li>
                <li>
                  Locate the <strong>Test users</strong> section near the bottom of that page.
                </li>
                <li>
                  Click the <strong>+ ADD USERS</strong> button.
                </li>
                <li>
                  Type your Gmail address (<code className="bg-orange-100 px-1 py-0.5 rounded font-mono">rlmcguire18@gmail.com</code>) into the field, and click <strong>Save</strong>.
                </li>
              </ol>
              <p className="text-[10px] text-stone-500 italic mt-2.5 pl-1">
                Once saved, close the blocked popup, hit "Connect" again, and you'll be able to proceed cleanly. (You might see a gray "Google hasn't verified this app" screen; click <strong>Advanced</strong> at the bottom left of that pop-up, then click <strong>"Go to ... (unsafe)"</strong> to proceed.)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Connection controls */}
      <div className="space-y-3">
        {!accessToken ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-dashed border-stone-300 rounded-2xl p-4">
            <div className="text-left space-y-0.5">
              <h5 className="font-semibold text-xs text-[#3D405B]">Sync Your Pecking Order History</h5>
              <p className="text-[11px] text-stone-500 leading-relaxed font-serif italic">
                Connect your personal Google Drive to safely backup your Insignia styles, certificate states, and questions without any local cache dependency!
              </p>
            </div>
            <button
              onClick={handleConnect}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#81B29A] hover:bg-[#6c9c84] text-white font-bold text-xs border-2 border-[#3D405B] rounded-xl shadow-[2px_2px_0px_0px_rgba(61,64,91,1)] transition"
            >
              <CloudLightning className="w-4 h-4" />
              <span>Connect Drive Nest</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[#81B29A]/10 border-2 border-[#81B29A] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] font-mono bg-[#81B29A]/20 text-[#3D405B] border border-[#81B29A]/40 px-2 py-0.5 rounded-full font-bold">
                  SECURE API AUTHORIZED
                </span>
                <p className="text-xs font-semibold text-stone-700 mt-1.5">
                  Backup File status: <strong className="text-[#3D405B]">{backupFileId ? '💾 coops_style_backup.json Active' : '⚪ Ready for first upload'}</strong>
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                className="text-[10px] font-mono uppercase bg-stone-100 hover:bg-stone-200 border border-[#3D405B]/30 px-3 py-1 rounded"
              >
                Disconnect Cloud
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBackupToDrive}
                disabled={status === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E07A5F] hover:bg-[#c9694e] text-white border-2 border-[#3D405B] rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_rgba(61,64,91,1)] disabled:opacity-50 transition"
              >
                <Cloud className="w-4 h-4" />
                Upload Backup to Drive
              </button>

              <button
                onClick={handleRestoreFromDrive}
                disabled={status === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-stone-50 text-[#3D405B] border-2 border-[#3D405B] rounded-xl font-bold text-xs shadow-[2px_2px_0px_0px_rgba(61,64,91,1)] disabled:opacity-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
                Restore From Drive
              </button>
            </div>
          </div>
        )}

        {status !== 'idle' && (
          <div className={`p-3 rounded-xl border-2 text-xs flex items-start gap-2 ${
            status === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
            status === 'error' ? 'bg-orange-50 border-orange-300 text-orange-800' :
            'bg-slate-50 border-slate-300 text-slate-800'
          }`}>
            {status === 'loading' ? (
              <Loader className="w-4 h-4 text-slate-500 animate-spin shrink-0 mt-0.5" />
            ) : status === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
