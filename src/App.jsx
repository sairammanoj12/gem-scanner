import { useState, useEffect } from 'react';
import axios from 'axios';
import { Flame, ShieldCheck, ExternalLink, RefreshCcw, Zap } from 'lucide-react';

export default function App() {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://api.dexscreener.com/token-profiles/latest/v1?t=${Date.now()}`);
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
      
      <header style={{ textAlign: 'center', marginBottom: '50px', width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          {/* MATCHING YOUR FILENAME FROM SCREENSHOT */}
          <img 
            src="/logo.png.jpg" 
            style={{ 
              width: '70px', 
              height: '70px', 
              filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))',
              borderRadius: '14px',
              objectFit: 'cover'
            }} 
            alt="Gem Scanner Logo" 
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
            borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '10px'
          }}
        >
          <RefreshCcw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> 
          {loading ? 'SYNCING...' : 'LIVE_UPDATE'}
        </button>
      </header>

      {/* DATA GRID */}
      {!loading || pairs.length > 0 ? (
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '20px', width: '100%'
        }}>
          {pairs.map((token, index) => (
            <div key={index} style={{ 
              backgroundColor: '#1e293b', borderRadius: '20px', padding: '24px', border: '1px solid #334155'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                {/* Fallback to your custom logo if token icon is missing */}
                <img src={token.icon || '/logo.png.jpg'} style={{ width: '56px', height: '56px', borderRadius: '14px' }} alt="icon" />
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{token.chainId?.toUpperCase()}</h2>
                  <span style={{ fontSize: '0.875rem', color: '#10b981' }}>NEW_LISTING</span>
                </div>
                <Flame size={18} color="#f59e0b" style={{ marginLeft: 'auto' }} />
              </div>

              <div style={{ 
                backgroundColor: '#0f172a', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', 
                color: '#94a3b8', marginBottom: '24px', fontFamily: 'monospace', wordBreak: 'break-all'
              }}>
                CA: {token.tokenAddress}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <a href={token.url} target="_blank" rel="noreferrer" style={{ flex: 1.5, backgroundColor: '#f8fafc', color: '#0f172a', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: '700' }}>ANALYZE</a>
                <a href={`https://rugcheck.xyz/tokens/${token.tokenAddress}`} target="_blank" rel="noreferrer" style={{ flex: 1, border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: '700' }}>SAFETY</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#64748b' }}>
          <Zap size={40} />
          <p>SCANNING BLOCKCHAIN...</p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}