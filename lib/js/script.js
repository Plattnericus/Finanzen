document.addEventListener('DOMContentLoaded', function() {
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav');
  
  if (burger && nav) {
    burger.addEventListener('click', function() {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (burger && nav) {
        burger.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  });
  
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = 'none';
      }
    }
  });
  
  initSearch();
  
  initWatchlist();
  
  loadStockSuggestions();
});

function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const stockSearch = document.getElementById('stockSearch');
  
  if (searchBtn && stockSearch) {
    searchBtn.addEventListener('click', searchStock);
    stockSearch.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchStock();
      }
    });
  }
}

function searchStock() {
  const stockSearch = document.getElementById('stockSearch');
  if (stockSearch) {
    const symbol = stockSearch.value.trim();
    if (symbol) {
      window.location.href = `kurse.html?symbol=${symbol.toUpperCase()}`;
    }
  }
}

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

function initWatchlist() {
  renderWatchlist();
  
  setupWatchlistButtons();
}

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
  
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const symbol = this.getAttribute('data-symbol');
      removeFromWatchlist(symbol);
      renderWatchlist();
    });
  });
}

function setupWatchlistButtons() {
  document.querySelectorAll('.watchlist-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const symbol = this.getAttribute('data-symbol');
      const name = this.getAttribute('data-name');
      
      if (addToWatchlist(symbol, name)) {
        this.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
        this.classList.add('btn-disabled');
        renderWatchlist();
      }
    });
  });
  
  const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');
  if (addToWatchlistBtn) {
    const watchlist = getWatchlist();
    const symbol = new URLSearchParams(window.location.search).get('symbol');
    const stockName = document.getElementById('stockName')?.textContent;
    
    if (symbol && watchlist.some(item => item.symbol === symbol)) {
      addToWatchlistBtn.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
      addToWatchlistBtn.classList.add('btn-disabled');
    }
    
    addToWatchlistBtn.addEventListener('click', function() {
      if (!this.classList.contains('btn-disabled')) {
        const added = addToWatchlist(symbol, stockName);
        if (added) {
          this.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
          this.classList.add('btn-disabled');
          renderWatchlist();
        }
      }
    });
  }
}

function loadStockSuggestions() {
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