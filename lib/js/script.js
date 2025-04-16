// Suchfunktion für beide Seiten
async function searchStock() {
    const symbol = document.getElementById('stockSearch').value.trim();
    if (symbol) {
      // Zur Kursseite mit Symbol als Parameter navigieren
      window.location.href = `kurse.html?symbol=${symbol.toUpperCase()}`;
    }
  }
  
  // Event Listener für Suchbutton
  document.getElementById('searchBtn')?.addEventListener('click', searchStock);
  
  // Event Listener für Enter-Taste im Suchfeld
  document.getElementById('stockSearch')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchStock();
    }
  });
  
  // Watchlist Funktionen
  function getWatchlist() {
    return JSON.parse(localStorage.getItem('watchlist')) || [];
  }
  
  function saveWatchlist(watchlist) {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }
  
  function addToWatchlist(symbol, name) {
    const watchlist = getWatchlist();
    if (!watchlist.some(item => item.symbol === symbol)) {
      watchlist.push({ symbol, name });
      saveWatchlist(watchlist);
      return true;
    }
    return false;
  }
  
  function removeFromWatchlist(symbol) {
    const watchlist = getWatchlist();
    const newWatchlist = watchlist.filter(item => item.symbol !== symbol);
    saveWatchlist(newWatchlist);
  }
  
  // Watchlist auf der Startseite anzeigen
  function renderWatchlist() {
    const watchlistGrid = document.getElementById('watchlistGrid');
    const watchlistSection = document.getElementById('watchlistSection');
    
    if (!watchlistGrid || !watchlistSection) return;
    
    const watchlist = getWatchlist();
    
    if (watchlist.length === 0) {
      watchlistSection.style.display = 'none';
      return;
    }
    
    watchlistSection.style.display = 'block';
    watchlistGrid.innerHTML = '';
    
    watchlist.forEach(item => {
      const watchlistItem = document.createElement('div');
      watchlistItem.className = 'watchlist-item';
      watchlistItem.innerHTML = `
        <div class="watchlist-header">
          <div class="watchlist-name">${item.name || item.symbol}</div>
          <div class="watchlist-symbol">${item.symbol}</div>
        </div>
        <div class="watchlist-actions">
          <a href="kurse.html?symbol=${item.symbol}" class="btn btn-small"><i class="fas fa-chart-line"></i> Details</a>
          <button class="btn btn-small btn-remove" data-symbol="${item.symbol}">
            <i class="fas fa-times"></i> Entfernen
          </button>
        </div>
      `;
      watchlistGrid.appendChild(watchlistItem);
    });
    
    // Event Listener für Entfernen-Buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        const symbol = this.getAttribute('data-symbol');
        removeFromWatchlist(symbol);
        renderWatchlist();
      });
    });
  }
  
  // Initialisierung
  document.addEventListener('DOMContentLoaded', function() {
    // ... bestehende Initialisierungscodes ...
    
    // Watchlist rendern
    renderWatchlist();
    
    // Populäre Aktien für Autocomplete laden
    loadStockSuggestions();
  });
  
  // Autocomplete-Funktion
  async function loadStockSuggestions() {
    const popularStocks = [
      {symbol: 'AAPL', name: 'Apple Inc.'},
      {symbol: 'MSFT', name: 'Microsoft Corp.'},
      {symbol: 'AMZN', name: 'Amazon.com Inc.'},
      {symbol: 'GOOGL', name: 'Alphabet Inc.'},
      {symbol: 'TSLA', name: 'Tesla Inc.'},
      {symbol: 'META', name: 'Meta Platforms Inc.'},
      {symbol: 'NVDA', name: 'NVIDIA Corp.'},
      {symbol: 'V', name: 'Visa Inc.'},
      {symbol: 'JPM', name: 'JPMorgan Chase & Co.'},
      {symbol: 'WMT', name: 'Walmart Inc.'}
    ];
    
    const datalist = document.getElementById('stockSuggestions');
    if (datalist) {
      popularStocks.forEach(stock => {
        const option = document.createElement('option');
        option.value = stock.symbol;
        option.textContent = `${stock.name} (${stock.symbol})`;
        datalist.appendChild(option);
      });
    }
  }