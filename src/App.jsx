import { useState, useEffect } from 'react';
import axios from 'axios';
import { Flame, ShieldCheck, ExternalLink, RefreshCcw, Zap } from 'lucide-react';

export default function App() {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGems = async () => {
    setLoading(true);
    try {
      // ?t= timestamp forces the browser to bypass its cache for fresh data
      const res = await axios.get(`https://api.dexscreener.com/token-profiles/latest/v1?t=${Date.now()}`);
      
      // Filter out invalid token data
      const validData = res.data.filter(item => item.tokenAddress);
      
      setPairs(validData.slice(0, 15));
      setLoading(false);
    } catch (err) {
      console.error("DEX_SCAN_FAILED", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGems();
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', width: '100vw', 
      fontFamily: '"Inter", sans-serif', padding: '40px', display: 'flex',
      flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box'
    }}>
      
      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '50px', width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          {/* LOGO: Path updated to match your renamed file logo.png */}
          <img 
            src="/logo.png" 
            style={{ 
              width: '65px', 
              height: '65px', 
              filter: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.5))',
              borderRadius: '12px',
              objectFit: 'contain'
            }} 
            alt="Gem Scanner Logo"
            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/2592/2592201.png"; }}
          />
          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.05em', margin: 0 }}>
            GEM<span style={{ color: '#10b981' }}>SCANNER</span>
          </h1>
        </div>
        
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '32px' }}>
          Professional-grade token discovery for the Solana ecosystem.
        </p>
        
        <button 
          onClick={fetchGems}
          disabled={loading}
          style={{ 
            backgroundColor: loading ? '#334155' : '#10b981', color: '#fff', border: 'none', 
            padding: '14px 32px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', 
            borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '10px',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCcw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 
          {loading ? 'SYNCING...' : 'LIVE_UPDATE'}
        </button>
      </header>

      {/* TOKEN GRID */}
      {loading && pairs.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>
          <Zap size={40} style={{ marginBottom: '20px' }} />
          <p>SCANNING BLOCKCHAIN...</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px', width: '100%', flexGrow: 1
        }}>
          {pairs.map((token, index) => (
            <div key={index} style={{ 
              backgroundColor: '#1e293b', borderRadius: '20px', padding: '24px', border: '1px solid #334155',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <img 
                    src={token.icon || '/logo.png'} 
                    style={{ width: '56px', height: '56px', borderRadius: '14px' }} 
                    alt="token icon" 
                  />
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{token.chainId?.toUpperCase() || 'SOLANA'}</h2>
                    <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '500' }}>NEW_LISTING</span>
                  </div>
                  <Flame size={18} color="#f59e0b" style={{ marginLeft: 'auto' }} />
                </div>

                <div style={{ 
                  backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', 
                  color: '#94a3b8', marginBottom: '24px', fontFamily: 'monospace', wordBreak: 'break-all',
                  border: '1px solid #1e293b'
                }}>
                  CA: {token.tokenAddress}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={token.url} target="_blank" rel="noreferrer" style={{ flex: 1.5, backgroundColor: '#f8fafc', color: '#0f172a', textAlign: 'center', padding: '12px', textDecoration: 'none', fontWeight: '700', borderRadius: '10px' }}>
                  <ExternalLink size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> ANALYZE
                </a>
                <a href={`https://rugcheck.xyz/tokens/${token.tokenAddress}`} target="_blank" rel="noreferrer" style={{ flex: 1, border: '1px solid #ef4444', color: '#ef4444', textAlign: 'center', padding: '12px', textDecoration: 'none', fontWeight: '700', borderRadius: '10px' }}>
                  <ShieldCheck size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> SAFETY
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spinner Animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}