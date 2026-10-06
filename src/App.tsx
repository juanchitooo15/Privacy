/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { UserProfile, MediaPost, ScanSession, ProrrogaDuration } from './types/privacy';
import {
  loadUser,
  saveUser,
  loadPosts,
  savePosts,
  deleteAccount,
  getScanSession,
  saveScanSession,
} from './utils/storage';
import { AuthLanding } from './components/AuthLanding';
import { WelcomeInitialAnimation } from './components/WelcomeInitialAnimation';
import { RegistrationFlow } from './components/RegistrationFlow';
import { FinalWelcomeAnimation } from './components/FinalWelcomeAnimation';
import { ProfileView } from './components/ProfileView';
import { QRShareModal } from './components/QRShareModal';
import { ScanRequestDialog } from './components/ScanRequestDialog';
import { OptionsMenuModal } from './components/OptionsMenuModal';
import { LockScreen } from './components/LockScreen';
import { ExternalVisitorView } from './components/ExternalVisitorView';

type AppState =
  | 'auth'
  | 'initial_welcome_anim'
  | 'registration'
  | 'final_welcome_anim'
  | 'profile'
  | 'visitor_view';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => loadUser());
  const [posts, setPosts] = useState<MediaPost[]>(() => loadPosts());
  const [appState, setAppState] = useState<AppState>(() => {
    const user = loadUser();
    return user ? 'profile' : 'auth';
  });

  // Transient registration cache
  const [justRegisteredUser, setJustRegisteredUser] = useState<UserProfile | null>(null);

  // Security Lock
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Modals & Flows
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  // QR Scan interaction protocol
  const [scanRequestIncoming, setScanRequestIncoming] = useState<{
    visitorName: string;
    isOpen: boolean;
  }>({
    visitorName: 'Visitante Externo',
    isOpen: false,
  });

  const [activeVisitorSession, setActiveVisitorSession] = useState<ScanSession | null>(() =>
    getScanSession()
  );

  // BroadcastChannel for cross-tab realtime synchronization
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Handle cross-tab messages
  const handleBroadcastMessage = useCallback((event: MessageEvent) => {
    const data = event.data;
    if (!data || !data.type) return;

    if (data.type === 'SCAN_REQUEST') {
      // Owner receives scan alert
      setScanRequestIncoming({
        visitorName: data.visitorName || 'Visitante Externo',
        isOpen: true,
      });
    } else if (data.type === 'SCAN_ACCEPTED') {
      // Visitor receives acceptance
      const newSession: ScanSession = {
        id: data.id,
        ownerUsername: data.ownerUsername,
        visitorName: data.visitorName,
        status: 'accepted',
        durationMinutes: data.durationMinutes,
        expiresAt: data.expiresAt,
        createdAt: Date.now(),
      };
      setActiveVisitorSession(newSession);
      saveScanSession(newSession);
    } else if (data.type === 'SCAN_REJECTED') {
      // Visitor receives rejection
      const rejectedSession: ScanSession = {
        id: `rej_${Date.now()}`,
        ownerUsername: '',
        visitorName: '',
        status: 'rejected',
        durationMinutes: -1,
        expiresAt: null,
        createdAt: Date.now(),
      };
      setActiveVisitorSession(rejectedSession);
      saveScanSession(rejectedSession);
    } else if (data.type === 'SCAN_REVOKED') {
      // Visitor receives revocation
      const revokedSession: ScanSession = {
        id: `rev_${Date.now()}`,
        ownerUsername: '',
        visitorName: '',
        status: 'revoked',
        durationMinutes: -1,
        expiresAt: null,
        createdAt: Date.now(),
      };
      setActiveVisitorSession(revokedSession);
      saveScanSession(revokedSession);
    }
  }, []);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel('privacy_peer_exchange');
      broadcastRef.current = channel;
      channel.onmessage = handleBroadcastMessage;

      return () => {
        channel.close();
      };
    } catch {
      // Fallback for browsers without BroadcastChannel
    }
  }, [handleBroadcastMessage]);

  // Section 6: Permanent automatic lock when application loses focus or tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (currentUser && appState === 'profile') {
          setIsLocked(true);
        }
      }
    };

    const handleWindowBlur = () => {
      if (currentUser && appState === 'profile') {
        setIsLocked(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [currentUser, appState]);

  // Handle Save New Post
  const handleSaveNewPost = (post: MediaPost) => {
    const updated = [post, ...posts];
    setPosts(updated);
    savePosts(updated);
  };

  // Handle Delete Post
  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    savePosts(updated);
  };

  // Handle Update User
  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveUser(updated);
  };

  // Handle Delete Account Definitively
  const handleDeleteAccount = () => {
    deleteAccount();
    setCurrentUser(null);
    setPosts([]);
    setActiveVisitorSession(null);
    setIsOptionsMenuOpen(false);
    setAppState('auth');
  };

  // QR Scan Flow: Trigger simulated scan (local or broadcast)
  const handleRequestSimulatedScan = (visitorName: string) => {
    // Notify over broadcast channel
    broadcastRef.current?.postMessage({
      type: 'SCAN_REQUEST',
      visitorName,
    });

    // Also trigger locally so user can test seamlessly on a single screen!
    setScanRequestIncoming({
      visitorName,
      isOpen: true,
    });
  };

  // Owner Rejects visitor request
  const handleRejectScan = () => {
    setScanRequestIncoming({ visitorName: '', isOpen: false });

    broadcastRef.current?.postMessage({
      type: 'SCAN_REJECTED',
    });

    if (activeVisitorSession) {
      const rej: ScanSession = {
        ...activeVisitorSession,
        status: 'rejected',
      };
      setActiveVisitorSession(rej);
      saveScanSession(rej);
    }
  };

  // Owner Confirms visitor request with Prórroga duration
  const handleConfirmAcceptScan = (duration: ProrrogaDuration) => {
    const visitorName = scanRequestIncoming.visitorName;
    setScanRequestIncoming({ visitorName: '', isOpen: false });

    const expiresAt = duration === -1 ? null : Date.now() + duration * 60 * 1000;

    const newSession: ScanSession = {
      id: `session_${Date.now()}`,
      ownerUsername: currentUser?.username || 'Owner',
      visitorName,
      status: 'accepted',
      durationMinutes: duration,
      expiresAt,
      createdAt: Date.now(),
    };

    setActiveVisitorSession(newSession);
    saveScanSession(newSession);

    // Broadcast acceptance
    broadcastRef.current?.postMessage({
      type: 'SCAN_ACCEPTED',
      id: newSession.id,
      ownerUsername: newSession.ownerUsername,
      visitorName,
      durationMinutes: duration,
      expiresAt,
    });
  };

  // Owner Revokes visitor session in real time
  const handleRevokeVisitorSession = () => {
    setActiveVisitorSession(null);
    saveScanSession(null);

    broadcastRef.current?.postMessage({
      type: 'SCAN_REVOKED',
    });
  };

  return (
    <div className="relative min-h-screen bg-[#0f0b0d]">
      {/* 1. Landing Flow */}
      {appState === 'auth' && (
        <AuthLanding
          currentUser={currentUser}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAppState('profile');
          }}
          onCreateSessionClick={() => {
            setAppState('initial_welcome_anim');
          }}
        />
      )}

      {/* 2. Initial 5-second welcome animation for "Crear Sesión" */}
      {appState === 'initial_welcome_anim' && (
        <WelcomeInitialAnimation
          onComplete={() => {
            setAppState('registration');
          }}
        />
      )}

      {/* 3. 7-Step Registration Flow */}
      {appState === 'registration' && (
        <RegistrationFlow
          onCancel={() => {
            setAppState('auth');
          }}
          onFinish={(newUser) => {
            setJustRegisteredUser(newUser);
            setAppState('final_welcome_anim');
          }}
        />
      )}

      {/* 4. Final 5-second welcome animation ("Tú eres Tú" + dynamic palette) */}
      {appState === 'final_welcome_anim' && justRegisteredUser && (
        <FinalWelcomeAnimation
          firstName={justRegisteredUser.firstName}
          lastName={justRegisteredUser.lastName}
          onComplete={() => {
            saveUser(justRegisteredUser);
            setCurrentUser(justRegisteredUser);
            setAppState('profile');
          }}
        />
      )}

      {/* 5. Main Profile View */}
      {appState === 'profile' && currentUser && (
        <>
          <ProfileView
            user={currentUser}
            posts={posts}
            activeVisitorSession={activeVisitorSession}
            onOpenQRShare={() => setIsQRModalOpen(true)}
            onOpenOptionsMenu={() => setIsOptionsMenuOpen(true)}
            onRevokeVisitorSession={handleRevokeVisitorSession}
            onSaveNewPost={handleSaveNewPost}
            onDeletePost={handleDeletePost}
          />

          {/* QR Share Modal - Strictly QR only, no links or manual input */}
          <QRShareModal
            user={currentUser}
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            onRequestSimulatedScan={() => handleRequestSimulatedScan('Dispositivo Escáner Autorizado')}
          />

          {/* Options Menu Modal */}
          <OptionsMenuModal
            user={currentUser}
            isOpen={isOptionsMenuOpen}
            onClose={() => setIsOptionsMenuOpen(false)}
            onUpdateUser={handleUpdateUser}
            onDeleteAccount={handleDeleteAccount}
            onTriggerManualLock={() => setIsLocked(true)}
          />

          {/* Scan Request Dialog (Live incoming alert for profile owner) */}
          <ScanRequestDialog
            user={currentUser}
            visitorName={scanRequestIncoming.visitorName}
            isOpen={scanRequestIncoming.isOpen}
            onReject={handleRejectScan}
            onConfirmAccept={handleConfirmAcceptScan}
          />
        </>
      )}

      {/* 6. External Visitor View (Read-Only Mode) */}
      {appState === 'visitor_view' && currentUser && (
        <ExternalVisitorView
          user={currentUser}
          posts={posts}
          session={activeVisitorSession}
          onExitVisitorMode={() => {
            // Remove search param or switch back
            window.history.replaceState({}, '', window.location.pathname);
            setAppState('auth');
          }}
        />
      )}

      {/* 7. Automatic Lock Screen Overlay */}
      {isLocked && currentUser && (
        <LockScreen
          user={currentUser}
          onUnlock={() => setIsLocked(false)}
          onLogout={() => {
            setIsLocked(false);
            setAppState('auth');
          }}
        />
      )}
    </div>
  );
}
