document.addEventListener('DOMContentLoaded', function() {
    // API-Konfiguration
    const API_KEY = 'f3c2edbab53c4ffaab5d74a12c89be78'; // Ersetzen Sie 'demo' mit Ihrem Twelve Data API Key
    const API_BASE_URL = 'https://api.twelvedata.com';
    
    // URL-Parameter auslesen
    const urlParams = new URLSearchParams(window.location.search);
    let symbol = urlParams.get('symbol') || 'AAPL';
    
    // DOM-Elemente
    const stockNameEl = document.getElementById('stockName');
    const stockSymbolEl = document.getElementById('stockSymbol');
    const stockPriceEl = document.getElementById('stockPrice');
    const stockChangeEl = document.getElementById('stockChange');
    const openPriceEl = document.getElementById('openPrice');
    const dayHighEl = document.getElementById('dayHigh');
    const dayLowEl = document.getElementById('dayLow');
    const yearHighEl = document.getElementById('yearHigh');
    const yearLowEl = document.getElementById('yearLow');
    const marketCapEl = document.getElementById('marketCap');
    const intervalButtons = document.querySelectorAll('.interval-btn');
    
    // Chart initialisieren
    const ctx = document.getElementById('stockChart').getContext('2d');
    let stockChart = null;
    
    // Gradient für Chart
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(67, 97, 238, 0.3)');
    gradient.addColorStop(1, 'rgba(67, 97, 238, 0)');
    
    // Aktiendaten abrufen
    async function fetchStockData() {
      try {
        // Basisinformationen abrufen
        const quoteResponse = await fetch(`${API_BASE_URL}/quote?symbol=${symbol}&apikey=${API_KEY}`);
        const quoteData = await quoteResponse.json();
        
        // Aktienkursdaten für Chart abrufen (Standard: 1 Tag)
        const timeSeriesResponse = await fetch(`${API_BASE_URL}/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`);
        const timeSeriesData = await timeSeriesResponse.json();
        
        return {
          quote: quoteData,
          timeSeries: timeSeriesData
        };
      } catch (error) {
        console.error('Fehler beim Abrufen der Aktiendaten:', error);
        return null;
      }
    }
    
    // Chart erstellen/aktualisieren
    function updateChart(data, interval = '1d') {
      // Daten für Chart vorbereiten
      const labels = [];
      const values = [];
      
      // Je nach Intervall die Daten anders gruppieren
      const timeSeries = data.timeSeries.values || [];
      
      timeSeries.forEach(item => {
        labels.push(new Date(item.datetime).toLocaleDateString());
        values.push(parseFloat(item.close));
      });
      
      // Chart erstellen oder aktualisieren
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
          options: {
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
          }
        });
      }
    }
    
    // UI mit Aktiendaten aktualisieren
    function updateUI(data) {
      const quote = data.quote;
      
      stockNameEl.textContent = quote.name || symbol;
      stockSymbolEl.textContent = symbol;
      stockPriceEl.textContent = parseFloat(quote.close).toFixed(2);
      
      const changePercent = parseFloat(quote.percent_change);
      const changeElement = stockChangeEl;
      
      if (changePercent >= 0) {
        changeElement.className = 'stock-change positive';
        changeElement.innerHTML = `<i class="fas fa-caret-up"></i><span>+${Math.abs(changePercent).toFixed(2)}%</span>`;
      } else {
        changeElement.className = 'stock-change negative';
        changeElement.innerHTML = `<i class="fas fa-caret-down"></i><span>-${Math.abs(changePercent).toFixed(2)}%</span>`;
      }
      
      openPriceEl.textContent = parseFloat(quote.open).toFixed(2);
      dayHighEl.textContent = parseFloat(quote.high).toFixed(2);
      dayLowEl.textContent = parseFloat(quote.low).toFixed(2);
      yearHighEl.textContent = parseFloat(quote.fifty_two_week.high).toFixed(2);
      yearLowEl.textContent = parseFloat(quote.fifty_two_week.low).toFixed(2);
      
      // Marktkapitalisierung formatieren
      const marketCap = parseFloat(quote.market_cap);
      if (marketCap >= 1e12) {
        marketCapEl.textContent = (marketCap / 1e12).toFixed(2) + 'T';
      } else if (marketCap >= 1e9) {
        marketCapEl.textContent = (marketCap / 1e9).toFixed(2) + 'B';
      } else if (marketCap >= 1e6) {
        marketCapEl.textContent = (marketCap / 1e6).toFixed(2) + 'M';
      } else {
        marketCapEl.textContent = marketCap.toFixed(2);
      }
    }
    
    // Intervall-Buttons Event Listener
    intervalButtons.forEach(button => {
      button.addEventListener('click', function() {
        intervalButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const interval = this.getAttribute('data-interval');
        loadStockData(interval);
      });
    });
    
    // Daten laden und UI aktualisieren
    async function loadStockData(interval = '1d') {
      const data = await fetchStockData();
      if (data) {
        updateUI(data);
        updateChart(data, interval);
      } else {
        alert('Aktiendaten konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
      }
    }
    
    // Initialen Ladevorgang starten
    loadStockData();
    
    // Theme-Änderungen für Chart handhaben
    document.documentElement.addEventListener('themeChanged', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const textColor = currentTheme === 'dark' ? 'rgba(248, 249, 250, 0.7)' : 'rgba(33, 37, 41, 0.7)';
      const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      
      if (stockChart) {
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