import { useState } from 'react';
import { ArrowRight, Shield, Zap, Users, TrendingUp, Wallet as WalletIcon, Lock, Globe, LayoutDashboard, ShoppingBag, Award, Store } from 'lucide-react';
import { WalletProvider } from './contexts/WalletContext';
import { WalletConnect } from './components/WalletConnect';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { Marketplace } from './pages/Marketplace';
import { MyMemberships } from './pages/MyMemberships';
import { SecondaryMarket } from './pages/SecondaryMarket';
import { TransactionHistory } from './pages/TransactionHistory';

type Page = 'home' | 'dashboard' | 'marketplace' | 'memberships' | 'secondary' | 'history';

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (currentPage === 'dashboard') {
    return (
      <div>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <CreatorDashboard />
      </div>
    );
  }

  if (currentPage === 'marketplace') {
    return (
      <div>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <Marketplace />
      </div>
    );
  }

  if (currentPage === 'memberships') {
    return (
      <div>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <MyMemberships />
      </div>
    );
  }

  if (currentPage === 'secondary') {
    return (
      <div>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <SecondaryMarket />
      </div>
    );
  }

  if (currentPage === 'history') {
    return (
      <div>
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <TransactionHistory />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 text-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">FairPass</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setCurrentPage('marketplace')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Marketplace</button>
            <button onClick={() => setCurrentPage('secondary')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">Resale</button>
            <button onClick={() => setCurrentPage('memberships')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">My Memberships</button>
            <button onClick={() => setCurrentPage('dashboard')} className="text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">For Creators</button>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium mb-8">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700">Built on Polkadot</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Memberships That Belong<br />to the Creator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A Web3 membership protocol where creators issue time-bound, tradable NFTs that unlock premium content and community access — <span className="text-blue-600 font-semibold">without platform fees</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
            >
              Explore Marketplace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-8 py-4 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-xl font-semibold text-base transition-all"
            >
              For Creators
            </button>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-6 border-y border-blue-200 bg-white/50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">0%</div>
              <div className="text-sm text-slate-600">Platform Fees</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-slate-600">Creator Owned</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">NFT</div>
              <div className="text-sm text-slate-600">Memberships</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-2">DOT</div>
              <div className="text-sm text-slate-600">Powered</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Why FairPass?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The first membership protocol designed for Web3 creators who want true ownership
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-8 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-200">
                <WalletIcon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Zero Platform Fees</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unlike Patreon's 10-30% cut, FairPass takes nothing. Your revenue is yours, managed by smart contracts on Polkadot.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-200">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Tradable Memberships</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fans can resell or transfer their memberships. Creators earn royalties automatically from every secondary sale.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-200">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Self-Sovereign Identity</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Creators and fans own their data. No platform can lock you out or change terms overnight.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-200">
                <Globe className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Cross-Chain Portable</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Memberships work across Polkadot parachains and partner ecosystems via XCMP bridging technology.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-200">
                <Zap className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Low-Fee Transactions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Built on Polkadot's efficient infrastructure means no surprise gas fees that eat into profits.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-blue-200">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Community First</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Gate Discord servers, websites, or exclusive content with on-chain verification of membership NFTs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">How It Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four simple steps to launch your decentralized membership
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">
                1
              </div>
              <div className="ml-10 p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900">Creator Onboards</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Connect your Polkadot wallet, create membership tiers (Gold, Silver, Bronze), and set duration and pricing.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">
                2
              </div>
              <div className="ml-10 p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900">Fan Purchases</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Fans sign a transaction, receive a time-bound NFT, and get instant access to gated content and communities.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">
                3
              </div>
              <div className="ml-10 p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900">Automatic Verification</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our Access Control API checks NFT validity on-chain. Access granted or denied based on real-time expiry status.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">
                4
              </div>
              <div className="ml-10 p-6 bg-white rounded-xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900">Renew or Trade</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Members can renew directly or sell on secondary markets. Creators earn automatic royalties from resales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="p-12 bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl border-2 border-blue-200 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-slate-900">Our Vision</h2>
            <p className="text-lg text-slate-700 leading-relaxed text-center mb-8">
              FairPass empowers a new generation of creators to own their audience and revenue. Using NFTs not as speculation, but as utility — with frictionless, portable subscriptions across all chains.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">Own</div>
                <div className="text-sm text-slate-600">Your Audience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">Control</div>
                <div className="text-sm text-slate-600">Your Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">Build</div>
                <div className="text-sm text-slate-600">On Web3</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-slate-600 mb-12">
            Join the movement of creators building sovereign memberships on Polkadot
          </p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium text-lg flex items-center gap-3 mx-auto transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Launch Your Membership
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="relative py-12 px-6 border-t border-blue-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">FairPass</span>
            </div>
            <div className="text-slate-600 text-sm">
              Memberships That Belong to the Creator — Not the Platform
            </div>
            <div className="flex gap-6 text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors text-sm">Docs</a>
              <a href="https://polkadot.cloud" target="_blank" rel="noopener" className="hover:text-blue-600 transition-colors text-sm">Polkadot</a>
              <a href="#" className="hover:text-blue-600 transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Navigation({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  return (
    <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-blue-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">FairPass</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              currentPage === 'marketplace' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline">Marketplace</span>
          </button>
          <button
            onClick={() => onNavigate('secondary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              currentPage === 'secondary' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden md:inline">Resale</span>
          </button>
          <button
            onClick={() => onNavigate('memberships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              currentPage === 'memberships' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden md:inline">My Memberships</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              currentPage === 'dashboard' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden md:inline">For Creators</span>
          </button>
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}

export default App;
