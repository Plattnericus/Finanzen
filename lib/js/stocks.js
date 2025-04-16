document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('marketOverviewChart').getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(67, 97, 238, 0.3)');
    gradient.addColorStop(1, 'rgba(67, 97, 238, 0)');
    
    const marketChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Marktentwicklung',
          data: [65, 59, 80, 81, 56, 55, 40, 57, 76, 85, 92, 98],
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
                return 'Wert: ' + context.parsed.y + ' Punkte';
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
    
    document.documentElement.addEventListener('themeChanged', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const textColor = currentTheme === 'dark' ? 'rgba(248, 249, 250, 0.7)' : 'rgba(33, 37, 41, 0.7)';
      const gridColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
      
      marketChart.options.scales.x.ticks.color = textColor;
      marketChart.options.scales.y.ticks.color = textColor;
      marketChart.options.scales.y.grid.color = gridColor;
      marketChart.options.plugins.tooltip.backgroundColor = currentTheme === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      marketChart.options.plugins.tooltip.titleColor = currentTheme === 'dark' ? '#f8f9fa' : '#212529';
      marketChart.options.plugins.tooltip.bodyColor = currentTheme === 'dark' ? '#f8f9fa' : '#212529';
      marketChart.options.plugins.tooltip.borderColor = currentTheme === 'dark' ? '#333' : '#dee2e6';
      
      marketChart.update();
    });
  
    async function fetchStockData(symbol) {
      try {
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=demo`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching stock data:', error);
        return null;
      }
    }
  
    document.getElementById('searchBtn').addEventListener('click', async function() {
      const symbol = document.getElementById('stockSearch').value.trim();
      if (symbol) {
        const stockData = await fetchStockData(symbol);
        if (stockData) {
          window.location.href = `kurse.html?symbol=${symbol}`;
        } else {
          alert('Aktie nicht gefunden. Bitte versuchen Sie ein anderes Symbol.');
        }
      }
    });
  
    document.getElementById('stockSearch').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
      }
    });
  });