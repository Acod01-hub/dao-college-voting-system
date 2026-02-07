import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Wallet, TrendingUp, Shield, Vote, FileText, ChevronRight, ExternalLink, Copy, Check, Zap, Users, Lock } from 'lucide-react';

// Mock Web3 functionality (replace with actual ethers.js in production)
const mockWeb3 = {
  connectWallet: async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
  },
  castVote: async (candidateId) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
  },
  getVoteStatus: (wallet) => {
    const voted = localStorage.getItem(`voted_${wallet}`);
    return voted ? JSON.parse(voted) : null;
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [walletAddress, setWalletAddress] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [toast, setToast] = useState(null);
  const [votes, setVotes] = useState({
    candidate1: 127,
    candidate2: 98,
    candidate3: 156,
    candidate4: 83
  });

  const candidates = [
    { id: 'candidate1', name: 'Sarah Chen', position: 'President', slogan: 'Innovation & Unity', color: '#6366f1' },
    { id: 'candidate2', name: 'Marcus Rivera', position: 'Vice President', slogan: 'Voice for All', color: '#8b5cf6' },
    { id: 'candidate3', name: 'Aisha Patel', position: 'Secretary', slogan: 'Transparency First', color: '#ec4899' },
    { id: 'candidate4', name: 'James Wilson', position: 'Treasurer', slogan: 'Fiscal Responsibility', color: '#14b8a6' }
  ];

  useEffect(() => {
    if (walletAddress) {
      const voteData = mockWeb3.getVoteStatus(walletAddress);
      if (voteData) {
        setHasVoted(true);
        setTxHash(voteData.txHash);
      }
    }
  }, [walletAddress]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const address = await mockWeb3.connectWallet();
      setWalletAddress(address);
      showToast('Wallet connected successfully!');
      setTimeout(() => setCurrentPage('register'), 500);
    } catch (error) {
      showToast('Failed to connect wallet', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyStudent = async (email) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsVerified(true);
    setIsLoading(false);
    showToast('Student verification successful!');
    setTimeout(() => setCurrentPage('dashboard'), 500);
  };

  const initiateVote = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const confirmVote = async () => {
    setShowModal(false);
    setIsLoading(true);
    
    try {
      const hash = await mockWeb3.castVote(selectedCandidate.id);
      setTxHash(hash);
      setHasVoted(true);
      
      // Store vote locally
      localStorage.setItem(`voted_${walletAddress}`, JSON.stringify({
        candidateId: selectedCandidate.id,
        txHash: hash,
        timestamp: Date.now()
      }));
      
      // Update vote count
      setVotes(prev => ({
        ...prev,
        [selectedCandidate.id]: prev[selectedCandidate.id] + 1
      }));
      
      showToast('Vote recorded on-chain!');
      setTimeout(() => setCurrentPage('success'), 500);
    } catch (error) {
      showToast('Transaction failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10">
          <nav className="px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">VoteDAO</span>
            </div>
            {walletAddress && (
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </nav>

          <div className="container mx-auto px-8 py-20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block">
                <div className="px-4 py-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-semibold mb-6 inline-flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Powered by Polygon Testnet
                </div>
              </div>
              
              <h1 className="text-7xl font-black tracking-tight leading-tight">
                Decentralized
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Campus Democracy
                </span>
              </h1>
              
              <p className="text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                DAO-powered college elections with transparent, immutable, and verifiable voting on the blockchain.
              </p>

              <div className="flex gap-4 justify-center pt-8">
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/50 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center gap-3"
                >
                  <Wallet className="w-5 h-5" />
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
                <button
                  onClick={() => setCurrentPage('results')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-bold text-lg transition-all flex items-center gap-3"
                >
                  <TrendingUp className="w-5 h-5" />
                  View Results
                </button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <Shield className="w-8 h-8 text-indigo-400 mb-3 mx-auto" />
                  <h3 className="font-bold mb-2">Secure</h3>
                  <p className="text-sm text-slate-400">Cryptographically verified votes</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <Lock className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                  <h3 className="font-bold mb-2">Immutable</h3>
                  <p className="text-sm text-slate-400">Permanent on-chain records</p>
                </div>
                <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <Users className="w-8 h-8 text-pink-400 mb-3 mx-auto" />
                  <h3 className="font-bold mb-2">Transparent</h3>
                  <p className="text-sm text-slate-400">Publicly auditable results</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Register & Verify Page
  if (currentPage === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10">
          <nav className="px-8 py-6 flex justify-between items-center">
            <button onClick={() => setCurrentPage('landing')} className="text-slate-400 hover:text-white transition-colors">
              ← Back
            </button>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </nav>

          <div className="container mx-auto px-8 py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-black mb-3">Student Verification</h2>
                <p className="text-slate-400">Verify your eligibility to participate in campus elections</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-300">
                    College Email or Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="student@university.edu"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder-slate-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        verifyStudent(e.target.value);
                      }
                    }}
                  />
                </div>

                <button
                  onClick={() => verifyStudent('student@university.edu')}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg shadow-indigo-500/50 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Verifying...
                    </span>
                  ) : (
                    'Verify Student Status'
                  )}
                </button>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-start gap-3 text-sm text-slate-400">
                    <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <p>Your wallet will be marked as an eligible voter. One wallet can only vote once.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Dashboard Page
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10">
          <nav className="px-8 py-6 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">VoteDAO</span>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </nav>

          <div className="container mx-auto px-8 py-12">
            <div className="mb-12">
              <h2 className="text-5xl font-black mb-4">Voting Dashboard</h2>
              <p className="text-xl text-slate-400">View active elections and cast your vote</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
              <StatusCard
                icon={<Wallet className="w-6 h-6" />}
                title="Wallet Connected"
                status="Active"
                color="indigo"
              />
              <StatusCard
                icon={<CheckCircle className="w-6 h-6" />}
                title="Verified Student"
                status="Eligible"
                color="green"
              />
              <StatusCard
                icon={<Vote className="w-6 h-6" />}
                title="Vote Status"
                status={hasVoted ? "Voted" : "Not Voted"}
                color={hasVoted ? "purple" : "slate"}
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Student Council Election 2026</h3>
                  <p className="text-slate-400">Voting ends in 2 days, 14 hours</p>
                </div>
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-semibold">
                  Active
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-2xl font-bold">{totalVotes}</div>
                    <div className="text-sm text-slate-400">Total Votes Cast</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-slate-400">Candidates</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentPage('voting')}
                disabled={hasVoted}
                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {hasVoted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Already Voted
                  </>
                ) : (
                  <>
                    Cast Your Vote
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentPage('results')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                View Results
              </button>
              <button
                onClick={() => setCurrentPage('audit')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Audit Trail
              </button>
            </div>
          </div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Voting Page
  if (currentPage === 'voting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10">
          <nav className="px-8 py-6 flex justify-between items-center border-b border-white/10">
            <button onClick={() => setCurrentPage('dashboard')} className="text-slate-400 hover:text-white transition-colors">
              ← Back to Dashboard
            </button>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          </nav>

          <div className="container mx-auto px-8 py-12">
            <div className="mb-12">
              <h2 className="text-5xl font-black mb-4">Cast Your Vote</h2>
              <p className="text-xl text-slate-400">Select your preferred candidate</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${candidate.color}, ${candidate.color}dd)` }}
                    >
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">{candidate.name}</h3>
                      <p className="text-slate-400 font-semibold">{candidate.position}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4 px-3 py-2 bg-white/5 rounded-lg">
                    <p className="text-sm text-slate-300 italic">"{candidate.slogan}"</p>
                  </div>

                  <button
                    onClick={() => initiateVote(candidate)}
                    disabled={hasVoted}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg group-hover:shadow-indigo-500/50"
                  >
                    Vote for {candidate.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showModal && (
          <Modal
            candidate={selectedCandidate}
            onConfirm={confirmVote}
            onCancel={() => setShowModal(false)}
            isLoading={isLoading}
          />
        )}

        {toast && <Toast message={toast.message} type={toast.type} />}
      </div>
    );
  }

  // Success Page
  if (currentPage === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12" />
          </div>

          <h2 className="text-5xl font-black mb-4">Vote Recorded!</h2>
          <p className="text-xl text-slate-400 mb-8">Your vote has been successfully recorded on the blockchain</p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="text-sm text-slate-400 mb-2">Transaction Hash</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <code className="text-indigo-400 font-mono text-lg break-all">
                {txHash}
              </code>
              <button
                onClick={() => copyToClipboard(txHash)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              >
                {copiedHash ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <a
              href={`https://polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center justify-center gap-2 transition-colors"
            >
              View on PolygonScan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('results')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg shadow-indigo-500/50 transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              View Results
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-bold transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (currentPage === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10">
          <nav className="px-8 py-6 flex justify-between items-center border-b border-white/10">
            <button onClick={() => setCurrentPage(walletAddress ? 'dashboard' : 'landing')} className="text-slate-400 hover:text-white transition-colors">
              ← Back
            </button>
            {walletAddress && (
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </nav>

          <div className="container mx-auto px-8 py-12">
            <div className="mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-5xl font-black mb-4">Live Results</h2>
                  <p className="text-xl text-slate-400">On-chain & Immutable</p>
                </div>
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live Updates
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-black mb-2">{totalVotes}</div>
                <div className="text-slate-400 text-lg">Total Votes Cast</div>
              </div>

              <div className="space-y-6">
                {candidates
                  .map(c => ({ ...c, voteCount: votes[c.id], percentage: ((votes[c.id] / totalVotes) * 100).toFixed(1) }))
                  .sort((a, b) => b.voteCount - a.voteCount)
                  .map((candidate, index) => (
                    <div key={candidate.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl font-bold text-slate-500">#{index + 1}</div>
                          <div>
                            <div className="font-bold text-lg">{candidate.name}</div>
                            <div className="text-sm text-slate-400">{candidate.position}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{candidate.voteCount}</div>
                          <div className="text-sm text-slate-400">{candidate.percentage}%</div>
                        </div>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${candidate.percentage}%`,
                            background: `linear-gradient(90deg, ${candidate.color}, ${candidate.color}cc)`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setCurrentPage('audit')}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-bold transition-all inline-flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                View Audit Trail
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Audit Page
  if (currentPage === 'audit') {
    const auditRecords = [
      { txHash: '0x7a3f9b2e8c1d4a5f6b9e2c8d1a4f7b3e9c2d8a5f6b1e4c9a2d7f3b8e1c5a9d4f', timestamp: '2026-02-07 14:32:15', event: 'Vote Cast', voter: '0x742d...0bEb' },
      { txHash: '0x3e9c2d8a5f6b1e4c9a2d7f3b8e1c5a9d4f7a3f9b2e8c1d4a5f6b9e2c8d1a4f7b', timestamp: '2026-02-07 14:28:43', event: 'Vote Cast', voter: '0x8a9f...3c2e' },
      { txHash: '0x1e4c9a2d7f3b8e1c5a9d4f7a3f9b2e8c1d4a5f6b9e2c8d1a4f7b3e9c2d8a5f6b', timestamp: '2026-02-07 14:15:22', event: 'Vote Cast', voter: '0x5d7b...9a1c' },
      { txHash: '0x5a9d4f7a3f9b2e8c1d4a5f6b9e2c8d1a4f7b3e9c2d8a5f6b1e4c9a2d7f3b8e1c', timestamp: '2026-02-07 13:58:09', event: 'Vote Cast', voter: '0x2c4e...7f8a' },
      { txHash: '0x4a5f6b9e2c8d1a4f7b3e9c2d8a5f6b1e4c9a2d7f3b8e1c5a9d4f7a3f9b2e8c1d', timestamp: '2026-02-07 13:45:31', event: 'Vote Cast', voter: '0x9e1f...4b6c' },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative z-10">
          <nav className="px-8 py-6 flex justify-between items-center border-b border-white/10">
            <button onClick={() => setCurrentPage('results')} className="text-slate-400 hover:text-white transition-colors">
              ← Back to Results
            </button>
            {walletAddress && (
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </nav>

          <div className="container mx-auto px-8 py-12">
            <div className="mb-12">
              <h2 className="text-5xl font-black mb-4">Audit Trail</h2>
              <p className="text-xl text-slate-400">Publicly verifiable transaction history</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Transaction Hash</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Timestamp</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Event</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Voter Address</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditRecords.map((record, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <code className="text-indigo-400 font-mono text-sm">
                            {record.txHash.slice(0, 10)}...{record.txHash.slice(-8)}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{record.timestamp}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-semibold">
                            {record.event}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-slate-300 font-mono text-sm">{record.voter}</code>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`https://polygonscan.com/tx/${record.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 text-sm"
                          >
                            View
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2 text-indigo-300">Blockchain Transparency</h3>
                  <p className="text-sm text-slate-300">
                    All voting transactions are permanently recorded on the Polygon blockchain. Every vote is cryptographically secured,
                    publicly verifiable, and cannot be altered or deleted. This ensures complete transparency and trust in the election process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Status Card Component
const StatusCard = ({ icon, title, status, color }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 border-indigo-500/30',
    green: 'from-green-500 to-green-600 border-green-500/30',
    purple: 'from-purple-500 to-purple-600 border-purple-500/30',
    slate: 'from-slate-500 to-slate-600 border-slate-500/30'
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-400 mb-1">{title}</h3>
      <div className="text-xl font-bold">{status}</div>
    </div>
  );
};

// Modal Component
const Modal = ({ candidate, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">Confirm Your Vote</h3>
        <p className="text-slate-400 mb-6">
          You are about to cast your vote for <span className="text-white font-bold">{candidate.name}</span> as {candidate.position}.
          This action will be recorded on the blockchain and cannot be changed.
        </p>

        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200">
              Once confirmed, your vote is final and immutable. Please review your choice carefully.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Confirming...
              </span>
            ) : (
              'Confirm Vote'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ message, type }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-semibold`}>
        {icon}
        {message}
      </div>
    </div>
  );
};

export default App;
