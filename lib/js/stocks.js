document.addEventListener('DOMContentLoaded', function() {
  // 1. API-Konfiguration
  const API_KEY = 'f3c2edbab53c4ffaab5d74a12c89be78'; // Ersetzen Sie 'demo' mit Ihrem Twelve Data API Key
  const API_BASE_URL = 'https://api.twelvedata.com';
  
  // 2. Symbol aus URL lesen (z.B. kurse.html?symbol=AAPL)
  const urlParams = new URLSearchParams(window.location.search);
  let symbol = urlParams.get('symbol') || 'AAPL';
  
  // 3. Chart initialisieren
  const ctx = document.getElementById('stockChart').getContext('2d');
  let stockChart = null;
  
  // 4. Hauptfunktion zum Laden der Aktiendaten
  async function loadStockData(interval = '1day') {
    try {
      // Zeige Ladeindikator
      document.getElementById('stockPrice').textContent = 'Lädt...';
      
      // 4.1 Aktuelle Kursdaten abrufen
      const quoteResponse = await fetch(`${API_BASE_URL}/quote?symbol=${symbol}&apikey=${API_KEY}`);
      const quoteData = await quoteResponse.json();
      
      // 4.2 Historische Daten für Chart abrufen
      const timeSeriesResponse = await fetch(`${API_BASE_URL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=30&apikey=${API_KEY}`);
      const timeSeriesData = await timeSeriesResponse.json();
      
      // 4.3 Daten verarbeiten
      const stockData = {
        quote: quoteData,
        timeSeries: timeSeriesData
      };
      
      // 4.4 UI aktualisieren
      updateStockInfo(stockData);
      updateChart(stockData, interval);
      
      // 4.5 Watchlist-Button aktualisieren
      updateWatchlistButton();
      
    } catch (error) {
      console.error('Fehler beim Laden der Aktiendaten:', error);
      alert('Aktiendaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    }
  }
  
  // 5. Aktieninformationen im UI anzeigen
  function updateStockInfo(data) {
    const quote = data.quote;
    
    // 5.1 Grunddaten
    document.getElementById('stockName').textContent = quote.name || symbol;
    document.getElementById('stockSymbol').textContent = symbol;
    
    // 5.2 Aktueller Preis
    const price = parseFloat(quote.close).toFixed(2);
    document.getElementById('stockPrice').textContent = price;
    
    // 5.3 Preisänderung
    const changePercent = parseFloat(quote.percent_change);
    const changeElement = document.getElementById('stockChange');
    
    if (changePercent >= 0) {
      changeElement.className = 'stock-change positive';
      changeElement.innerHTML = `<i class="fas fa-caret-up"></i><span>+${Math.abs(changePercent).toFixed(2)}%</span>`;
    } else {
      changeElement.className = 'stock-change negative';
      changeElement.innerHTML = `<i class="fas fa-caret-down"></i><span>-${Math.abs(changePercent).toFixed(2)}%</span>`;
    }
    
    // 5.4 Weitere Kennzahlen
    document.getElementById('openPrice').textContent = parseFloat(quote.open).toFixed(2);
    document.getElementById('dayHigh').textContent = parseFloat(quote.high).toFixed(2);
    document.getElementById('dayLow').textContent = parseFloat(quote.low).toFixed(2);
    document.getElementById('yearHigh').textContent = parseFloat(quote.fifty_two_week.high).toFixed(2);
    document.getElementById('yearLow').textContent = parseFloat(quote.fifty_two_week.low).toFixed(2);
    
    // 5.5 Marktkapitalisierung formatieren
    const marketCap = parseFloat(quote.market_cap);
    let marketCapFormatted;
    
    if (marketCap >= 1e12) {
      marketCapFormatted = (marketCap / 1e12).toFixed(2) + ' Billionen';
    } else if (marketCap >= 1e9) {
      marketCapFormatted = (marketCap / 1e9).toFixed(2) + ' Milliarden';
    } else if (marketCap >= 1e6) {
      marketCapFormatted = (marketCap / 1e6).toFixed(2) + ' Millionen';
    } else {
      marketCapFormatted = marketCap.toFixed(2);
    }
    
    document.getElementById('marketCap').textContent = marketCapFormatted;
  }
  
  // 6. Chart erstellen/aktualisieren
  function updateChart(data, interval) {
    // 6.1 Daten für Chart vorbereiten
    const timeSeries = data.timeSeries.values || [];
    const labels = [];
    const values = [];
    
    timeSeries.forEach(item => {
      // Datum formatieren basierend auf Intervall
      const date = new Date(item.datetime);
      let label;
      
      if (interval === '1day' || interval === '5d') {
        label = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
      } else if (interval === '1mo' || interval === '6mo') {
        label = date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
      } else {
        label = date.toLocaleDateString('de-DE', { year: 'numeric' });
      }
      
      labels.push(label);
      values.push(parseFloat(item.close));
    });
    
    // 6.2 Farbverlauf für Chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(67, 97, 238, 0.3)');
    gradient.addColorStop(1, 'rgba(67, 97, 238, 0)');
    
    // 6.3 Chart erstellen oder aktualisieren
    if (stockChart) {
      stockChart.data.labels = labels.reverse();
      stockChart.data.datasets[0].data = values.reverse();
      stockChart.update();
    } else {
      stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels.reverse(),
          datasets: [{
            label: 'Kursverlauf',
            data: values.reverse(),
            backgroundColor: gradient,
            borderColor: '#4361ee',
            borderWidth: 2,
            pointBackgroundColor: '#4361ee',
            pointRadius: 0,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4
          }]
        },
        options: getChartOptions()
      });
    }
  }
  
  // 7. Chart-Optionen
  function getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(30, 30, 30, 0.9)',
          titleColor: '#f8f9fa',
          bodyColor: '#f8f9fa',
          borderColor: '#333',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return 'Kurs: ' + context.parsed.y.toFixed(2) + ' €';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: 'rgba(248, 249, 250, 0.7)'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: 'rgba(248, 249, 250, 0.7)'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    };
  }
  
  // 8. Watchlist-Button aktualisieren
  function updateWatchlistButton() {
    const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');
    if (!addToWatchlistBtn) return;
    
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const isInWatchlist = watchlist.some(item => item.symbol === symbol);
    
    if (isInWatchlist) {
      addToWatchlistBtn.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
      addToWatchlistBtn.classList.add('btn-disabled');
    } else {
      addToWatchlistBtn.innerHTML = '<i class="fas fa-plus"></i> Zur Watchlist hinzufügen';
      addToWatchlistBtn.classList.remove('btn-disabled');
    }
  }
  
  // 9. Event Listener für Intervall-Buttons
  function setupIntervalButtons() {
    const intervalButtons = document.querySelectorAll('.interval-btn');
    
    intervalButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Aktiven Button markieren
        intervalButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Daten für neues Intervall laden
        const interval = this.getAttribute('data-interval');
        let apiInterval;
        
        // API-Interval zuweisen
        switch(interval) {
          case '1d': apiInterval = '1day'; break;
          case '5d': apiInterval = '1day'; break; // 5 Tage mit täglichen Daten
          case '1mo': apiInterval = '1week'; break;
          case '6mo': apiInterval = '1week'; break;
          case '1y': apiInterval = '1month'; break;
          default: apiInterval = '1day';
        }
        
        loadStockData(apiInterval);
      });
    });
  }
  
  // 10. Event Listener für Watchlist-Button
  function setupWatchlistButton() {
    const addToWatchlistBtn = document.getElementById('addToWatchlistBtn');
    if (!addToWatchlistBtn) return;
    
    addToWatchlistBtn.addEventListener('click', function() {
      if (!this.classList.contains('btn-disabled')) {
        const stockName = document.getElementById('stockName').textContent;
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        
        // Prüfen ob bereits in Watchlist
        if (!watchlist.some(item => item.symbol === symbol)) {
          // Zur Watchlist hinzufügen
          watchlist.push({ symbol, name: stockName });
          localStorage.setItem('watchlist', JSON.stringify(watchlist));
          
          // Button aktualisieren
          this.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
          this.classList.add('btn-disabled');
          
          // Erfolgsmeldung
          showAlert(`${symbol} wurde zur Watchlist hinzugefügt!`, 'success');
        }
      }
    });
  }
  
  // 11. Hilfsfunktion für Benachrichtigungen
  function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.classList.add('fade-out');
      setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
  }
  
  // 12. Initialisierung
  setupIntervalButtons();
  setupWatchlistButton();
  loadStockData();
  
  // 13. Theme-Änderungen für Chart
  document.documentElement.addEventListener('themeChanged', function() {
    if (stockChart) {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const textColor = currentTheme === 'dark' ? 'rgba(248, 249, 250, 0.7)' : 'rgba(33, 37, 41, 0.7)';
      const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      
      stockChart.options.scales.x.ticks.color = textColor;
      stockChart.options.scales.y.ticks.color = textColor;
      stockChart.options.scales.y.grid.color = gridColor;
      stockChart.options.plugins.tooltip.backgroundColor = currentTheme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      stockChart.options.plugins.tooltip.titleColor = currentTheme === 'dark' ? '#f8f9fa' : '#212529';
      stockChart.options.plugins.tooltip.bodyColor = currentTheme === 'dark' ? '#f8f9fa' : '#212529';
      stockChart.options.plugins.tooltip.borderColor = currentTheme === 'dark' ? '#333' : '#dee2e6';
      
      stockChart.update();
    }
  });
});