/**
 * Maritime Intelligence Platform - Charts Module
 * Standardized Chart.js configurations and utilities
 */

// Standard dark theme configuration for all charts
const CHART_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: '#ffffff',
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#333',
            borderWidth: 1
        }
    },
    scales: {
        x: {
            grid: {
                color: '#333'
            },
            ticks: {
                color: '#888',
                maxRotation: 45
            }
        },
        y: {
            grid: {
                color: '#333'
            },
            ticks: {
                color: '#888'
            }
        }
    },
    interaction: {
        intersect: false,
        mode: 'index'
    }
};

// Color schemes for different story types
const COLOR_SCHEMES = {
    ammonia: {
        primary: '#00d4ff',
        secondary: '#0099cc',
        negative: '#ff6b6b',
        positive: '#4CAF50',
        neutral: '#ffa500'
    },
    chemical: {
        primary: '#ffa500',
        secondary: '#cc8400',
        negative: '#ff6b6b',
        positive: '#4CAF50',
        neutral: '#00d4ff'
    },
    tanker: {
        primary: '#4CAF50',
        secondary: '#388e3c',
        negative: '#ff6b6b',
        positive: '#4CAF50',
        neutral: '#ffa500'
    }
};

/**
 * Create a price trend line chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} config - Chart configuration
 */
function createPriceTrendChart(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Chart canvas ${canvasId} not found`);
        return null;
    }

    const storyType = config.storyType || 'ammonia';
    const colors = COLOR_SCHEMES[storyType];

    const chartConfig = {
        type: 'line',
        data: {
            labels: config.labels || [],
            datasets: [{
                label: config.label || 'Price Data',
                data: config.data || [],
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}20`,
                borderWidth: 3,
                pointBackgroundColor: colors.primary,
                pointBorderColor: colors.primary,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            scales: {
                ...CHART_DEFAULTS.scales,
                y: {
                    ...CHART_DEFAULTS.scales.y,
                    ticks: {
                        ...CHART_DEFAULTS.scales.y.ticks,
                        callback: function(value) {
                            return config.yAxisFormatter ? config.yAxisFormatter(value) : value;
                        }
                    },
                    min: config.yMin,
                    max: config.yMax
                }
            }
        }
    };

    return new Chart(ctx, chartConfig);
}

/**
 * Create a volume/capacity bar chart
 * @param {string} canvasId - ID of the canvas element
 * @param {Object} config - Chart configuration
 */
function createVolumeChart(canvasId, config) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Chart canvas ${canvasId} not found`);
        return null;
    }

    const storyType = config.storyType || 'ammonia';
    const colors = COLOR_SCHEMES[storyType];

    const chartConfig = {
        type: 'bar',
        data: {
            labels: config.labels || [],
            datasets: [{
                label: config.label || 'Volume Data',
                data: config.data || [],
                backgroundColor: `${colors.primary}80`,
                borderColor: colors.primary,
                borderWidth: 1
            }]
        },
        options: {
            ...CHART_DEFAULTS,
            scales: {
                ...CHART_DEFAULTS.scales,
                y: {
                    ...CHART_DEFAULTS.scales.y,
                    beginAtZero: true,
                    ticks: {
                        ...CHART_DEFAULTS.scales.y.ticks,
                        callback: function(value) {
                            return config.yAxisFormatter ? config.yAxisFormatter(value) : value;
                        }
                    }
                }
            }
        }
    };

    return new Chart(ctx, chartConfig);
}

/**
 * Initialize charts when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize any charts with data attributes
    const chartElements = document.querySelectorAll('[data-chart-type]');
    
    chartElements.forEach(element => {
        const chartType = element.dataset.chartType;
        const chartConfig = JSON.parse(element.dataset.chartConfig || '{}');
        
        switch(chartType) {
            case 'price-trend':
                createPriceTrendChart(element.id, chartConfig);
                break;
            case 'volume':
                createVolumeChart(element.id, chartConfig);
                break;
            default:
                console.warn(`Unknown chart type: ${chartType}`);
        }
    });
});

// Export functions for global use
window.MaritimeCharts = {
    createPriceTrendChart,
    createVolumeChart,
    CHART_DEFAULTS,
    COLOR_SCHEMES
}; 