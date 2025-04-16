document.addEventListener('DOMContentLoaded', function() {
    // API-Konfiguration
    const API_KEY = 'f3c2edbab53c4ffaab5d74a12c89be78';
    const API_BASE_URL = 'https://api.twelvedata.com';
    
    // Beispiel-Daten für Analysen
    const sampleStocks = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        sector: 'tech',
        pe: 28.5,
        peg: 2.1,
        dividend: 0.5,
        roe: 145.3,
        debt: 1.8,
        rating: 'buy'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        sector: 'tech',
        pe: 32.7,
        peg: 2.4,
        dividend: 0.8,
        roe: 43.1,
        debt: 0.9,
        rating: 'buy'
      },
      {
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        sector: 'healthcare',
        pe: 15.2,
        peg: 1.8,
        dividend: 2.9,
        roe: 25.7,
        debt: 0.7,
        rating: 'hold'
      },
      {
        symbol: 'XOM',
        name: 'Exxon Mobil Corp.',
        sector: 'energy',
        pe: 8.3,
        peg: 0.9,
        dividend: 3.2,
        roe: 18.4,
        debt: 0.4,
        rating: 'hold'
      },
      {
        symbol: 'WMT',
        name: 'Walmart Inc.',
        sector: 'consumer',
        pe: 22.6,
        peg: 1.2,
        dividend: 1.5,
        roe: 19.8,
        debt: 1.2,
        rating: 'buy'
      },
      {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        sector: 'finance',
        pe: 10.8,
        peg: 1.5,
        dividend: 2.7,
        roe: 15.3,
        debt: 1.1,
        rating: 'buy'
      }
    ];
  
    // Initialisierung
    renderAnalysisCards(sampleStocks);
    initIndicatorChart();
    setupEventListeners();
  
    // Funktionen
    function renderAnalysisCards(stocks) {
      const grid = document.getElementById('analysisGrid');
      grid.innerHTML = '';
  
      stocks.forEach(stock => {
        const card = document.createElement('div');
        card.className = 'analysis-card';
        
        // Zufällige Chart-Daten generieren
        const chartData = Array.from({length: 12}, () => Math.floor(Math.random() * 100));
        
        card.innerHTML = `
          <div class="analysis-header">
            <div class="analysis-title">${stock.name}</div>
            <div class="analysis-rating rating-${stock.rating}">${stock.rating.toUpperCase()}</div>
          </div>
          <div class="analysis-metrics">
            <div class="metric-item">
              <span class="metric-label">KGV</span>
              <span class="metric-value">${stock.pe}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">PEG</span>
              <span class="metric-value">${stock.peg}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Dividende</span>
              <span class="metric-value">${stock.dividend}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">ROE</span>
              <span class="metric-value">${stock.roe}%</span>
            </div>
          </div>
          <div class="analysis-chart">
            <canvas id="chart-${stock.symbol}"></canvas>
          </div>
          <a href="kurse.html?symbol=${stock.symbol}" class="btn btn-outline">Details anzeigen</a>
        `;
        
        grid.appendChild(card);
        initMiniChart(`chart-${stock.symbol}`, chartData);
      });
    }
  
    function initMiniChart(canvasId, data) {
      const ctx = document.getElementById(canvasId)?.getContext('2d');
      if (!ctx) return;
      
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map((_, i) => ''),
          datasets: [{
            data: data,
            borderColor: '#4361ee',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    }
  
    function initIndicatorChart() {
      const ctx = document.getElementById('indicatorChart').getContext('2d');
      const descriptions = {
        rsi: 'Der Relative Strength Index (RSI) ist ein Momentum-Oszillator, der die Geschwindigkeit und Veränderung von Preisbewegungen misst. Ein RSI über 70 deutet auf überkaufte Bedingungen hin, während ein RSI unter 30 auf überverkaufte Bedingungen hindeutet.',
        macd: 'Der Moving Average Convergence Divergence (MACD) ist ein Trendfolge-Momentum-Indikator, der die Beziehung zwischen zwei gleitenden Durchschnitten eines Wertpapierpreises zeigt.',
        moving: 'Gleitende Durchschnitte glätten Preisdaten und erzeugen eine einzige fließende Linie, die Trendrichtungen anzeigt. Häufig verwendete Perioden sind 50 und 200 Tage.',
        bollinger: 'Bollinger Bänder bestehen aus einem mittleren Band (einfacher gleitender Durchschnitt) und zwei äußeren Bändern, die Standardabweichungen vom mittleren Band darstellen. Sie helfen bei der Identifizierung von Überkauft-/Überverkauft-Bedingungen.'
      };
      
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({length: 30}, (_, i) => i + 1),
          datasets: [
            {
              label: 'RSI',
              data: Array.from({length: 30}, () => Math.floor(Math.random() * 30) + 35),
              borderColor: '#4361ee',
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: 'Signal',
              data: Array(30).fill(70),
              borderColor: '#f72585',
              borderWidth: 1,
              borderDash: [5, 5]
            },
            {
              label: 'Signal',
              data: Array(30).fill(30),
              borderColor: '#f72585',
              borderWidth: 1,
              borderDash: [5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { 
              min: 0, 
              max: 100,
              grid: { color: 'rgba(255, 255, 255, 0.05)' }
            }
          }
        }
      });
      
      // Standardmäßig RSI anzeigen
      document.getElementById('indicatorDescription').textContent = descriptions.rsi;
      
      // Tab-Event-Handler
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          
          const indicator = this.getAttribute('data-indicator');
          document.getElementById('indicatorDescription').textContent = descriptions[indicator];
          
          // Hier würden Sie normalerweise die Chart-Daten aktualisieren
          // Für dieses Beispiel zeigen wir nur den RSI an
        });
      });
    }
  
    function setupEventListeners() {
      // Filter-Button
      document.getElementById('applyFilters').addEventListener('click', function() {
        const sector = document.getElementById('sector-filter').value;
        const metric = document.getElementById('metric-filter').value;
        
        let filteredStocks = [...sampleStocks];
        
        if (sector !== 'all') {
          filteredStocks = filteredStocks.filter(stock => stock.sector === sector);
        }
        
        // Sortieren nach ausgewählter Kennzahl
        filteredStocks.sort((a, b) => b[metric] - a[metric]);
        
        renderAnalysisCards(filteredStocks);
      });
      
      // Screener-Button
      document.getElementById('runScreener').addEventListener('click', function() {
        const minPE = parseFloat(document.getElementById('minPE').value) || 0;
        const maxPE = parseFloat(document.getElementById('maxPE').value) || 100;
        const minDividend = parseFloat(document.getElementById('minDividend').value) || 0;
        
        const filteredStocks = sampleStocks.filter(stock => 
          stock.pe >= minPE && 
          stock.pe <= maxPE && 
          stock.dividend >= minDividend
        );
        
        renderScreenerResults(filteredStocks);
      });
    }
  
    function renderScreenerResults(stocks) {
      const resultsContainer = document.getElementById('screenerResults');
      resultsContainer.innerHTML = '';
      
      if (stocks.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">Keine Aktien gefunden, die den Kriterien entsprechen</div>';
        return;
      }
      
      stocks.forEach(stock => {
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
        
          <div class="table-cell">${stock.symbol}</div>
          <div class="table-cell">${stock.name}</div>
          <div class="table-cell">${stock.pe}</div>
          <div class="table-cell">${stock.dividend}%</div>
          <div class="table-cell">
            <a href="kurse.html?symbol=${stock.symbol}" class="btn btn-small">Details</a>
          </div>
        `;
        resultsContainer.appendChild(row);
      });
    }
  });