import { useState } from 'react';
import { ArrowRight, Shield, Zap, Users, TrendingUp, Wallet as WalletIcon, Lock, Globe, LayoutDashboard, ShoppingBag, Award, History, Store } from 'lucide-react';
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
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-black">FairPass</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setCurrentPage('marketplace')} className="text-gray-700 hover:text-black transition-colors text-sm font-medium">Marketplace</button>
            <button onClick={() => setCurrentPage('secondary')} className="text-gray-700 hover:text-black transition-colors text-sm font-medium">Resale</button>
            <button onClick={() => setCurrentPage('memberships')} className="text-gray-700 hover:text-black transition-colors text-sm font-medium">My Memberships</button>
            <button onClick={() => setCurrentPage('dashboard')} className="text-gray-700 hover:text-black transition-colors text-sm font-medium">For Creators</button>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-full text-xs font-medium mb-8">
            <Globe className="w-3.5 h-3.5" />
            <span>Built on Polkadot</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black leading-tight tracking-tight">
            Memberships That Belong<br />to the Creator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A Web3 membership protocol where creators issue time-bound, tradable NFTs that unlock premium content and community access — without platform fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="px-8 py-3.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-base flex items-center justify-center gap-2 transition-colors"
            >
              Explore Marketplace
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-8 py-3.5 border-2 border-black hover:bg-gray-50 text-black rounded-lg font-medium text-base transition-colors"
            >
              For Creators
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">0%</div>
              <div className="text-sm text-gray-600">Platform Fees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">100%</div>
              <div className="text-sm text-gray-600">Creator Owned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">NFT</div>
              <div className="text-sm text-gray-600">Memberships</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">DOT</div>
              <div className="text-sm text-gray-600">Powered</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Why FairPass?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The first membership protocol designed for Web3 creators who want true ownership
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <WalletIcon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Zero Platform Fees</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Unlike Patreon's 10-30% cut, FairPass takes nothing. Your revenue is yours, managed by smart contracts on Polkadot.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Tradable Memberships</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Fans can resell or transfer their memberships. Creators earn royalties automatically from every secondary sale.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Self-Sovereign Identity</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Creators and fans own their data. No platform can lock you out or change terms overnight.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Cross-Chain Portable</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Memberships work across Polkadot parachains and partner ecosystems via XCMP bridging technology.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Low-Fee Transactions</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built on Polkadot's efficient infrastructure means no surprise gas fees that eat into profits.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black">Community First</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gate Discord servers, websites, or exclusive content with on-chain verification of membership NFTs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four simple steps to launch your decentralized membership
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-white text-lg">
                1
              </div>
              <div className="ml-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-black">Creator Onboards</h3>
                <p className="text-gray-600 text-sm">
                  Connect your Polkadot wallet, create membership tiers (Gold, Silver, Bronze), and set duration and pricing.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-white text-lg">
                2
              </div>
              <div className="ml-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-black">Fan Purchases</h3>
                <p className="text-gray-600 text-sm">
                  Fans sign a transaction, receive a time-bound NFT, and get instant access to gated content and communities.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-white text-lg">
                3
              </div>
              <div className="ml-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-black">Automatic Verification</h3>
                <p className="text-gray-600 text-sm">
                  Our Access Control API checks NFT validity on-chain. Access granted or denied based on real-time expiry status.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-4 top-0 w-10 h-10 bg-black rounded-full flex items-center justify-center font-bold text-white text-lg">
                4
              </div>
              <div className="ml-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-3 text-black">Renew or Trade</h3>
                <p className="text-gray-600 text-sm">
                  Members can renew directly or sell on secondary markets. Creators earn automatic royalties from resales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="vision" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="p-12 bg-white rounded-2xl border-2 border-black">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-black">Our Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-8">
              FairPass empowers a new generation of creators to own their audience and revenue. Using NFTs not as speculation, but as utility — with frictionless, portable subscriptions across all chains.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-black mb-1">Own</div>
                <div className="text-sm text-gray-600">Your Audience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black mb-1">Control</div>
                <div className="text-sm text-gray-600">Your Revenue</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black mb-1">Build</div>
                <div className="text-sm text-gray-600">On Web3</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Join the movement of creators building sovereign memberships on Polkadot
          </p>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-10 py-4 bg-black hover:bg-gray-800 text-white rounded-lg font-medium text-lg flex items-center gap-3 mx-auto transition-colors"
          >
            Launch Your Membership
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-black">FairPass</span>
            </div>
            <div className="text-gray-600 text-sm">
              Memberships That Belong to the Creator — Not the Platform
            </div>
            <div className="flex gap-6 text-gray-700">
              <a href="#" className="hover:text-black transition-colors text-sm">Docs</a>
              <a href="https://polkadot.cloud" target="_blank" rel="noopener" className="hover:text-black transition-colors text-sm">Polkadot</a>
              <a href="#" className="hover:text-black transition-colors text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Navigation({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-black">FairPass</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('marketplace')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              currentPage === 'marketplace' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline">Marketplace</span>
          </button>
          <button
            onClick={() => onNavigate('secondary')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              currentPage === 'secondary' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden md:inline">Resale</span>
          </button>
          <button
            onClick={() => onNavigate('memberships')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              currentPage === 'memberships' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden md:inline">My Memberships</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              currentPage === 'dashboard' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
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
