import React, { useState, useCallback, useEffect } from 'react';
import { ChatInput } from '../components/ChatInput';
import { PlaylistDisplay } from '../components/PlaylistDisplay';
import { Loader } from '../components/Loader';
import { generatePlaylist } from '../services/geminiService';
import type { Playlist, PlaylistRequest } from '../types';
import { AdBanner } from '../components/AdBanner';
import { useAuth } from '../contexts/AuthContext';
import { useCEO } from '../contexts/CEOContext';
import { savePlaylist, incrementGenerationCount, db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Sparkles, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Copy, 
  Check, 
  Shuffle, 
  Smartphone, 
  Zap, 
  Clock, 
  LogIn, 
  X,
  Compass,
  Coffee,
  Sunset,
  Terminal,
  Disc
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDoc, 
  arrayUnion 
} from 'firebase/firestore';

interface PartyMember {
  uid: string;
  name: string;
  prompt: string;
  ready: boolean;
}

interface PartyRoom {
  id: string;
  name: string;
  hostUid: string;
  hostName: string;
  members: PartyMember[];
  status: 'collecting' | 'remixing' | 'finished';
  remixedPlaylist?: Playlist | null;
  createdAt: number;
}

const Home: React.FC = () => {
  const { user, profile, isPremium } = useAuth();
  const { strategy } = useCEO();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [slowLoadingStatus, setSlowLoadingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  // Daily Generation rate limit stats
  const [dailyGensCount, setDailyGensCount] = useState<number>(0);
  const todayStr = new Date().toISOString().split('T')[0];

  // Party state management
  const [partyRoom, setPartyRoom] = useState<PartyRoom | null>(null);
  const [partyPanelOpen, setPartyPanelOpen] = useState<boolean>(false);
  const [partyCodeInput, setPartyCodeInput] = useState<string>('');
  const [partyRoomNameInput, setPartyRoomNameInput] = useState<string>('');
  const [memberPromptInput, setMemberPromptInput] = useState<string>('');
  const [isCreatingParty, setIsCreatingParty] = useState<boolean>(false);
  const [isJoiningParty, setIsJoiningParty] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState<boolean>(false);

  // Open party panel automatically when active party room exists
  useEffect(() => {
    if (partyRoom) {
      setPartyPanelOpen(true);
      setShowConsole(true);
    }
  }, [partyRoom]);

  // Read current daily generations
  useEffect(() => {
    const key = `gens_${todayStr}`;
    const count = Number(localStorage.getItem(key) || '0');
    setDailyGensCount(count);
  }, [todayStr]);

  // "Surprise Me" mood list
  const discreteMoods = [
    { icon: Compass, label: 'Cosmic Drift', desc: 'Cosmic ambient electronic dream beats with soft vinyl hiss' },
    { icon: Zap, label: 'Hyper Kinetic', desc: 'Fast kinetic midnight cyber highway rave techno' },
    { icon: Coffee, label: 'Rainy Café', desc: 'Intimate warm organic jazz chords and crackling rainy lofi' },
    { icon: Sunset, label: 'Sunset Deep', desc: 'Balearic sun-drenched deep house sunset waves' },
    { icon: Terminal, label: 'Noir Static', desc: 'High-contrast dark industrial synth noise and distortion' },
    { icon: Disc, label: 'Retro Odyssey', desc: '80s nostalgic retro-synthwave neon analog chiptune' }
  ];

  const mostUsedPrompts = [
    'Cyberpunk driving in neon rain at night',
    'Lofi synth beats for quantum calculation',
    'Melancholic deep space ambient drone',
  ];

  const trendingPrompts = [
    'Pedro Belentani Signature Core Vibe',
    'Hypnotic high-tension kinetic techno',
    'Ethereal acoustic organic house',
  ];

  const risingArtists = [
    { name: 'Belentani Core', velocity: '+842% Growth' },
    { name: 'Xeno Synth', velocity: '+210% Growth' },
    { name: 'LUMINA_09', velocity: '+185% Growth' },
    { name: 'Vector Wave', velocity: '+114% Growth' },
  ];

  // Listener for Party code in URL params (?party=123456)
  useEffect(() => {
    const code = searchParams.get('party');
    if (code && user) {
      joinPartyRoom(code);
    }
  }, [searchParams, user]);

  // Firestore party realtime synchronizer
  useEffect(() => {
    if (!partyRoom?.id) return;

    const partyRef = doc(db, 'parties', partyRoom.id);
    const unsubscribe = onSnapshot(partyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as PartyRoom;
        setPartyRoom(data);
        
        // If the compilation is completed, fetch and show playlist
        if (data.status === 'finished' && data.remixedPlaylist) {
          setPlaylist(data.remixedPlaylist);
        }
      } else {
        setPartyRoom(null);
        setError('Party room session was closed or expired.');
      }
    });

    return () => unsubscribe();
  }, [partyRoom?.id]);

  // Create a party
  const createPartyRoom = async () => {
    if (!user) {
      setError('Please sign in to coordinate a Party Session.');
      return;
    }
    try {
      setIsCreatingParty(true);
      setError(null);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const hostName = user.displayName || user.email?.split('@')[0] || 'Sovereign human';
      
      const newRoom: PartyRoom = {
        id: code,
        name: partyRoomNameInput.trim() || `${hostName}'s Sonic Lounge`,
        hostUid: user.uid,
        hostName: hostName,
        members: [{
          uid: user.uid,
          name: hostName,
          prompt: '',
          ready: false
        }],
        status: 'collecting',
        createdAt: Date.now()
      };

      await setDoc(doc(db, 'parties', code), newRoom);
      setPartyRoom(newRoom);
      setSearchParams({ party: code });
    } catch (e) {
      console.error(e);
      setError('Failed to deploy party room registry context.');
    } finally {
      setIsCreatingParty(false);
    }
  };

  // Join a party
  const joinPartyRoom = async (codeStr: string) => {
    const cleanCode = codeStr.trim();
    if (!cleanCode) return;
    if (!user) {
      setError('Please identify inside Belentani Core access protocol (sign in) before joining.');
      return;
    }

    try {
      setIsJoiningParty(true);
      setError(null);
      const docRef = doc(db, 'parties', cleanCode);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError(`Party Session coordinate '${cleanCode}' not found in tactical grid.`);
        return;
      }

      const roomData = docSnap.data() as PartyRoom;
      const alreadyIn = roomData.members.some(m => m.uid === user.uid);

      if (!alreadyIn) {
        const myName = user.displayName || user.email?.split('@')[0] || 'Participant';
        const updatedMembers = [...roomData.members, {
          uid: user.uid,
          name: myName,
          prompt: '',
          ready: false
        }];

        await updateDoc(docRef, { members: updatedMembers });
      }

      setPartyRoom(roomData);
      setSearchParams({ party: cleanCode });
    } catch (e) {
      console.error(e);
      setError('Failed to sync to the specified party matrix room.');
    } finally {
      setIsJoiningParty(false);
    }
  };

  // Update member prompt vibe input in Firestore
  const submitMemberVibe = async () => {
    if (!partyRoom || !user) return;
    const promptValue = memberPromptInput.trim();
    if (!promptValue) return;

    try {
      const roomRef = doc(db, 'parties', partyRoom.id);
      const updatedMembers = partyRoom.members.map(m => {
        if (m.uid === user.uid) {
          return { ...m, prompt: promptValue, ready: true };
        }
        return m;
      });

      await updateDoc(roomRef, { members: updatedMembers });
      setMemberPromptInput('');
    } catch (e) {
      console.error(e);
      setError('Could not transmit vibe coordinates to party state.');
    }
  };

  // Execute Host Remix Action
  const executePartyRemix = async () => {
    if (!partyRoom || !user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Set state to remixing
      const roomRef = doc(db, 'parties', partyRoom.id);
      await updateDoc(roomRef, { status: 'remixing' });

      // Aggregate all active sub-prompts
      const promptsList = partyRoom.members
        .filter(m => m.prompt)
        .map(m => `"${m.prompt}" proposed by member ${m.name}`);

      if (promptsList.length === 0) {
        throw new Error("No active vibe coordinates have been registered to execute a mashup.");
      }

      const combinedPrompt = `Cooperative Party Remix Vibe Master: Seamlessly mashup, blend, and remix the following conflicting music vibes into an incredibly smooth, coherent, and highly energetic hybrid playlist: [${promptsList.join(' AND ')}]. Ensure the transition of genres feels sophisticated, clever, and artistic.`;

      // Call Gemini for the master playlist
      const partyPlaylist = await generatePlaylist({
        prompt: combinedPrompt,
        songCount: 20
      });

      await updateDoc(roomRef, { 
        remixedPlaylist: partyPlaylist,
        status: 'finished'
      });

      setPlaylist(partyPlaylist);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Coalescence calculation failure.');
      // Revert status
      const roomRef = doc(db, 'parties', partyRoom.id);
      await updateDoc(roomRef, { status: 'collecting' });
    } finally {
      setIsLoading(false);
    }
  };

  // Leave current party
  const leavePartyRoom = () => {
    setSearchParams({});
    setPartyRoom(null);
    setPlaylist(null);
  };

  // Handle Copy Invite Link
  const copyInviteLink = () => {
    if (!partyRoom) return;
    const link = `${window.location.origin}/?party=${partyRoom.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Main generator call with Phone limits & Slower Free APIs Simulation
  const handleGeneratePlaylist = useCallback(async (request: PlaylistRequest) => {
    if (!user) {
      setError('Belentani account sync required. Use top right console to login with Google.');
      return;
    }

    const key = `gens_${todayStr}`;
    const todayGens = Number(localStorage.getItem(key) || '0');

    // 1. Decolorization Limit: > 5 playists is blocked for free tier
    if (!isPremium && todayGens >= 5) {
      setError('Daily transmission rate limit reached (5 / 5). Upgrade to Premium Core (€3) for infinite instant bandwidth!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPlaylist(null);

    // 2. Delay free generators beyond the first daily one
    const isSlowerFreeTier = !isPremium && todayGens >= 1;

    try {
      if (isSlowerFreeTier) {
        // Slow speed simulation sequence
        setSlowLoadingStatus('[ INITIATING FREE DECELERATED COHERENCE DEVIATION... ]');
        await new Promise(r => setTimeout(r, 2000));
        
        setSlowLoadingStatus('[ SPEED LIMIT CONSTRAINTS DETECTED (-300% ACCELERATION)... ]');
        await new Promise(r => setTimeout(r, 2000));
        
        setSlowLoadingStatus('[ INTEGRATING SPECTRAL CHANNELS... PLEASE STAND BY ]');
        await new Promise(r => setTimeout(r, 2500));
      }

      const newPlaylist = await generatePlaylist(request);
      setPlaylist(newPlaylist);
      
      // Update local storage tracking counts
      const nextCount = todayGens + 1;
      localStorage.setItem(key, String(nextCount));
      setDailyGensCount(nextCount);

      // Save to Firestore collections
      await savePlaylist(user.uid, newPlaylist);
      await incrementGenerationCount(user.uid);
      
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Waveform compilation failed. Try again.');
    } finally {
      setIsLoading(false);
      setSlowLoadingStatus('');
    }
  }, [user, isPremium, todayStr]);

  return (
    <div className="max-w-md mx-auto px-1.5 py-4 space-y-6 animate-fade-in sm:max-w-2xl md:max-w-3xl">
      {/* PRIMARY GENERATOR WORKSTATION: Sits at the absolutely top of the fold */}
      <section className="space-y-5">
        {/* Chat input form (raised immediately to top for phone layout) */}
        <div>
          <ChatInput onGenerate={handleGeneratePlaylist} isLoading={isLoading} value={selectedPrompt} />
        </div>

        {/* Minimalist, discrete "icons os apps" (App Selector Matrix as tactile launcher tiles) */}
        <div className="space-y-2 px-0.5">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
              PRESET APPS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {discreteMoods.map((m, idx) => {
              const MoodIcon = m.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPrompt(m.desc)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl bg-gradient-to-b transition-all duration-300 text-center cursor-pointer select-none group aspect-square hover:scale-101 active:scale-95 border ${
                    selectedPrompt === m.desc 
                      ? 'from-zinc-950 to-zinc-900 border-amber-500/50 shadow-[0_0_15px_rgba(217,168,93,0.15)] text-white' 
                      : 'from-zinc-950/40 to-zinc-950/75 border-zinc-900 hover:border-amber-500/20 hover:bg-amber-500/5'
                  }`}
                  title={m.desc}
                >
                  <MoodIcon className={`w-5 h-5 mb-1.5 transition-transform duration-300 group-hover:scale-105 select-none ${
                    selectedPrompt === m.desc ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(217,168,93,0.5)]' : 'text-zinc-500 group-hover:text-amber-500/70'
                  }`} />
                  <span className={`text-[8px] font-mono font-medium tracking-wider uppercase truncate w-full transition-colors ${
                    selectedPrompt === m.desc ? 'text-amber-200' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* VECTOR OUTPUT / PLAYLIST WORKBENCH */}
      <main className="space-y-4">
        <div className="glass hud-border rounded-3xl p-4 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 py-6"
              >
                <Loader />
                {slowLoadingStatus && (
                  <p className="text-[10px] font-mono text-center text-zinc-400 uppercase tracking-widest animate-pulse">
                    {slowLoadingStatus}
                  </p>
                )}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-3 border border-red-500/15">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tight">System Bottleneck</h3>
                <p className="text-xs text-amber-100/60 mb-5 leading-normal max-w-sm mx-auto">{error}</p>
                {error.includes('Upgrade') && (
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-2"
                  >
                    Upgrade Core (€3.00)
                  </Link>
                )}
                <button
                  onClick={() => setError(null)}
                  className="block mx-auto mt-2 text-xs text-amber-500/40 hover:text-amber-400 transition-colors uppercase font-mono"
                >
                  Unlock Stream
                </button>
              </motion.div>
            ) : playlist ? (
              <motion.div
                key="playlist"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <PlaylistDisplay playlist={playlist} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-amber-100/20 font-mono text-[9px] uppercase tracking-widest">
                  Awaiting profile prompt matrix...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab/Toggle Button for Deploying Aux Matrix console */}
        <div className="flex justify-center pt-2 select-none">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`px-4 py-2 font-mono text-[9.5px] font-black tracking-widest border transition-all duration-300 rounded-full cursor-pointer uppercase flex items-center gap-1.5 shadow-sm ${
              showConsole
                ? 'bg-zinc-200 text-black border-zinc-300 hover:bg-white'
                : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40 hover:text-white'
            }`}
            id="toggle-auxiliary-console"
          >
            <span>{showConsole ? '⚡ HIDE SUB-CONSOLE' : '⚙ DEPLOY AUX PANEL & PARTY LOUNGE'}</span>
          </button>
        </div>

        {/* Collapsible Auxiliary Console to minimize visual noise */}
        {showConsole && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-zinc-900 bg-zinc-950/80 p-5 rounded-3xl space-y-5 animate-fade-in"
          >
            {/* Mobile Optimized Dynamic Indicator / Bandwidth counters inside Console tab */}
            <div className="flex items-center justify-between px-3 py-2 bg-black/60 border border-zinc-900 rounded-xl text-[10px] font-mono text-zinc-500">
              <div className="flex items-center gap-1.5 uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                Mobile UI Verification
              </div>
              <div className="flex items-center gap-2">
                {!isPremium ? (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    BANDWIDTH: {dailyGensCount}/5 COORD
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-zinc-300 font-bold tracking-widest uppercase">
                    <Zap className="w-3 h-3 text-zinc-400" />
                    SOVEREIGN UNLIMITED
                  </span>
                )}
              </div>
            </div>

            {/* Cooperative Lounge Collapsible Widget */}
            <div className="glass border border-zinc-900 rounded-2xl overflow-hidden">
              <button
                onClick={() => setPartyPanelOpen(!partyPanelOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950/40 hover:bg-zinc-900/10 transition-all cursor-pointer font-mono"
              >
                <span className="text-[11px] font-bold text-zinc-200 flex items-center gap-2 uppercase tracking-wide">
                  <Users className="w-4 h-4 text-zinc-400" />
                  Cooperative Party Lounge 
                  {partyRoom && (
                    <span className="text-[8px] bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold px-1.5 rounded">
                      Active
                    </span>
                  )}
                </span>
                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                  {partyPanelOpen ? '[ HIDE ]' : '[ ATTACH ]'}
                </span>
              </button>

              {partyPanelOpen && (
                <div className="p-4 bg-zinc-950/60 border-t border-zinc-900 space-y-4">
                  {!partyRoom ? (
                    <div className="space-y-4">
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                        Sync sonic wavelengths with other listeners in realtime. Host or attach to a shared room below to coordinate an aggregate mashup.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Host A Room */}
                        <div className="p-3 bg-black/60 rounded-xl border border-zinc-900 space-y-2">
                          <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase tracking-widest">// START CHANNELS</span>
                          <input 
                            type="text" 
                            value={partyRoomNameInput}
                            onChange={(e) => setPartyRoomNameInput(e.target.value)}
                            placeholder="LOUNGE NAME..."
                            className="w-full bg-black border border-zinc-800 px-2.5 py-1.5 text-xs rounded-lg font-mono tracking-wide focus:border-zinc-700 text-zinc-100 placeholder-zinc-700"
                          />
                          <button
                            onClick={createPartyRoom}
                            disabled={isCreatingParty}
                            className="w-full bg-zinc-200 hover:bg-white text-black py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            {isCreatingParty ? 'SYNCING...' : 'LAUNCH SESSION'}
                          </button>
                        </div>

                        {/* Join A Room */}
                        <div className="p-3 bg-black/60 rounded-xl border border-zinc-900 space-y-2">
                          <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase tracking-widest">// JOIN ACTIVE ID</span>
                          <input 
                            type="text" 
                            value={partyCodeInput}
                            onChange={(e) => setPartyCodeInput(e.target.value)}
                            placeholder="6-DIGIT CODE..."
                            className="w-full bg-black border border-zinc-800 px-2.5 py-1.5 text-xs rounded-lg text-center font-mono tracking-widest focus:border-zinc-700 text-zinc-100 placeholder-zinc-700"
                          />
                          <button
                            onClick={() => joinPartyRoom(partyCodeInput)}
                            disabled={isJoiningParty || !partyCodeInput}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            {isJoiningParty ? 'LINKING...' : 'JOIN ROOM'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-black/80 rounded-xl border border-zinc-800 space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-zinc-100 uppercase tracking-wide">{partyRoom.name}</p>
                          <span className="flex items-center gap-1 text-[8px] font-mono text-zinc-400 uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            <span className="w-1 h-1 rounded-full bg-zinc-500 animate-ping"></span>
                            Online Sync
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <p className="text-xs font-mono text-zinc-450">Room Code: <span className="text-sm font-bold tracking-widest select-all">{partyRoom.id}</span></p>
                          <button 
                            onClick={copyInviteLink} 
                            className="p-1 px-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded hover:bg-zinc-800 active:scale-95 transition-all text-[10px]"
                            title="Copy Invite Link"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button 
                            onClick={leavePartyRoom}
                            className="ml-auto text-[8px] font-mono text-zinc-500 hover:text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded uppercase hover:bg-zinc-900/20"
                          >
                            Leave
                          </button>
                        </div>
                      </div>

                      {/* List of members and their prompts */}
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-mono font-medium text-zinc-600 uppercase tracking-widest">// ACTIVE COORDINATES ({partyRoom.members.length})</p>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto">
                          {partyRoom.members.map((m, idx) => (
                            <div key={idx} className="flex flex-col p-2 bg-black/60 border border-zinc-900 rounded-lg relative">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-zinc-300">
                                  {m.name} {m.uid === partyRoom.hostUid && <span className="text-[8px] font-mono text-zinc-400 uppercase bg-zinc-800 border border-zinc-700 px-1 rounded ml-1">HOST</span>}
                                </span>
                                {m.ready ? (
                                  <span className="text-[8px] font-mono text-zinc-300 uppercase font-black flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5 text-zinc-400" /> Synced
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-mono text-zinc-600 uppercase">Standby...</span>
                                )}
                              </div>
                              {m.prompt && (
                                <p className="text-[11px] italic text-zinc-400 mt-1 font-light border-l border-zinc-800 pl-1.5">
                                  "{m.prompt}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prompt input form for the current user */}
                      {partyRoom.status === 'collecting' && (
                        <div className="p-3 bg-black/60 rounded-xl border border-zinc-800 space-y-2">
                          <label className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest block">
                            // TRANSMIT YOUR WAVELENGTH
                          </label>
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              value={memberPromptInput}
                              onChange={(e) => setMemberPromptInput(e.target.value)}
                              placeholder="E.g., Dark deep techno..."
                              className="flex-1 bg-black text-xs px-2.5 py-1.5 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-700"
                            />
                            <button 
                              onClick={submitMemberVibe}
                              disabled={!memberPromptInput.trim()}
                              className="bg-zinc-200 hover:bg-white text-black px-3 rounded-lg text-[10px] font-bold uppercase cursor-pointer disabled:opacity-40"
                            >
                              Sync
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Host controllers to trigger combined remixes */}
                      {partyRoom.status === 'collecting' && user.uid === partyRoom.hostUid && (
                        <div className="pt-1.5">
                          <button
                            onClick={executePartyRemix}
                            disabled={isLoading || partyRoom.members.filter(m => m.prompt).length < 2}
                            className="w-full bg-zinc-200 hover:bg-white text-black py-2.5 rounded-lg font-mono font-bold uppercase tracking-wider text-[11px] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Shuffle className="w-3.5 h-3.5 text-black" />
                            COMPILE COOP ({partyRoom.members.filter(m => m.prompt).length} IN)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Prestigious Strategy Vector & Discovery Widgets */}
            {strategy && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-black/40 rounded-2xl border border-zinc-900 text-left relative flex items-start gap-3"
              >
                <div className="p-2 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-xl flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="space-y-1">
                  <div className="text-[8.5px] font-mono font-medium text-zinc-500 uppercase tracking-widest block">
                    COUNCIL PRESTIGE VECTOR
                  </div>
                  <h3 className="text-xs font-light italic text-zinc-300 leading-normal">
                    "{strategy.headline}"
                  </h3>
                </div>
              </motion.div>
            )}

            {/* Discovery Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="glass border border-zinc-900/50 p-3.5 rounded-xl space-y-2 bg-black/40">
                <h4 className="text-[8.5px] font-mono font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-1">
                  [ HIGH DEMAND VECTORS ]
                </h4>
                <div className="space-y-1">
                  {mostUsedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPrompt(p)}
                      className="w-full text-left px-2 py-1.5 rounded-lg bg-zinc-950/40 border border-zinc-900 text-[10.5px] text-zinc-400 hover:text-white block cursor-pointer transition-all hover:bg-zinc-900/10 truncate"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass border border-zinc-900/50 p-3.5 rounded-xl space-y-2 bg-black/40">
                <h4 className="text-[8.5px] font-mono font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-1">
                  [ TRENDING COEFFICIENTS ]
                </h4>
                <div className="space-y-1">
                  {trendingPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPrompt(p)}
                      className="w-full text-left px-2 py-1.5 rounded-lg bg-zinc-950/40 border border-zinc-900 text-[10.5px] text-zinc-400 hover:text-white block cursor-pointer transition-all hover:bg-zinc-900/10 truncate"
                    >
                      "{p}"
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass border border-zinc-900/50 p-3.5 rounded-xl space-y-2 bg-black/40">
                <h4 className="text-[8.5px] font-mono font-medium text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-1">
                  [ VELOCITY ARTISTS ]
                </h4>
                <div className="space-y-1 font-mono text-[9px]">
                  {risingArtists.map((artist, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1 px-2 rounded bg-zinc-950/40 border border-zinc-900 text-zinc-400"
                    >
                      <span className="font-sans text-xs text-zinc-300">{artist.name}</span>
                      <span className="text-[7.5px] text-zinc-300 font-bold bg-zinc-800 px-1 border border-zinc-700 rounded">
                        {artist.velocity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!isPremium && (
              <div className="pt-2">
                <AdBanner />
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
