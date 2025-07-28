// Economics Diagram Generator
class EconomicDiagramGenerator {
    constructor() {
        this.chart = null;
        this.initializeElements();
        this.bindEvents();
        this.updateDefaultRange(); // Set smart default range
        this.generateDiagram(); // Generate initial diagram
    }

    // Initialize DOM elements
    initializeElements() {
        this.supplyFormula = document.getElementById('supplyFormula');
        this.demandFormula = document.getElementById('demandFormula');
        this.xRange = document.getElementById('xRange');
        this.generateBtn = document.getElementById('generateBtn');
        this.ctx = document.getElementById('economicChart').getContext('2d');
    }

    bindEvents() {
        // Bind click event for the generate button
        this.generateBtn.addEventListener('click', () => this.generateDiagram());
        
        // Generate diagram when pressing Enter in input fields
        [this.supplyFormula, this.demandFormula, this.xRange].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.generateDiagram();
                }
            });
        });

        // Update range when demand formula changes
        this.demandFormula.addEventListener('input', () => {
            this.updateDefaultRange();
        });

        // Reset to default range if Q range input is empty
        this.xRange.addEventListener('blur', () => {
            if (!this.xRange.value || this.xRange.value <= 0) {
                this.updateDefaultRange();
            }
        });
    }

    generateDiagram() {
        const supplyFormula = this.supplyFormula.value;
        const demandFormula = this.demandFormula.value;
        let maxQ = parseInt(this.xRange.value);

        // Reset to default if Q range is empty or invalid
        if (!maxQ || maxQ <= 0) {
            this.updateDefaultRange();
            maxQ = parseInt(this.xRange.value);
        }

        try {
            this.clearErrors();

            // Parse formulas and generate data points
            const supplyParsed = this.parseFormula(supplyFormula);
            const demandParsed = this.parseFormula(demandFormula);

            const supplyPoints = this.calculatePoints(supplyParsed.coefficient, supplyParsed.constant, maxQ);
            const demandPoints = this.calculatePoints(demandParsed.coefficient, demandParsed.constant, maxQ);

            // Create chart datasets with color scheme matching design
            const datasets = [
                {
                    label: 'Supply',
                    data: supplyPoints,
                    borderColor: '#ea580c', // Orange to match input section
                    backgroundColor: 'rgba(234, 88, 12, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    pointBackgroundColor: 'transparent'
                },
                {
                    label: 'Demand',
                    data: demandPoints,
                    borderColor: '#3b82f6', // Blue to match output section
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    pointBackgroundColor: 'transparent'
                }
            ];

            this.renderChart(datasets, maxQ);

        } catch (error) {
            this.showError('Please check your formulas. Use format: slope*Q + intercept (e.g., 2*Q + 10)');
            console.error('Formula parsing error:', error);
        }
    }

    parseFormula(formula) {
        try {
            // Clean the formula and make it safe
            const cleanFormula = formula.replace(/\s/g, '').toLowerCase();
            
            // Extract coefficient and constant using regex
            // Pattern: coefficient*Q + constant
            const match = cleanFormula.match(/^([+-]?\d*\.?\d*)\*?q([+-]\d*\.?\d*)$/);
            
            if (!match) {
                throw new Error('Invalid formula format');
            }

            let coefficient = match[1];
            let constant = match[2];

            // Handle empty coefficient (means 1 or -1)
            if (coefficient === '' || coefficient === '+') coefficient = '1';
            if (coefficient === '-') coefficient = '-1';
            
            // Handle missing constant
            if (!constant) constant = '0';

            return {
                coefficient: parseFloat(coefficient),
                constant: parseFloat(constant)
            };
        } catch (error) {
            throw new Error(`Formula parsing error: ${error.message}`);
        }
    }

    calculatePoints(coefficient, constant, maxQ, minP = 0) {
        const points = [];
        
        // Generate one point per unit of Q
        for (let Q = 0; Q <= maxQ; Q += 1) {
            let P = coefficient * Q + constant;
            
            // Ensure P is not negative for economic diagrams
            if (P < minP) P = minP;
            
            points.push({ x: Q, y: P });
        }

        return points;
    }

    renderChart(datasets, maxQ) {
        if (this.chart) {
            this.chart.destroy();
        }

        const maxP = Math.max(...datasets.flatMap(d => d.data.map(point => point.y))) + 10;

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Supply & Demand Diagram',
                        font: { size: 18, weight: 'bold' },
                        color: '#1f2937' // Dark gray for good contrast on white
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#374151', // Medium gray for legend text
                            font: { size: 14, weight: '500' },
                            usePointStyle: true,
                            pointStyle: 'line'
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Quantity (Q)',
                            color: '#374151', // Medium gray for axis labels
                            font: { size: 14, weight: '600' }
                        },
                        min: 0,
                        max: maxQ,
                        grid: { 
                            display: true,
                            color: '#e5e7eb' // Light gray grid lines
                        },
                        ticks: {
                            color: '#6b7280', // Gray for tick numbers
                            font: { size: 12 }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price (P)',
                            color: '#374151' // Medium gray for axis labels
                        },
                        min: 0,
                        max: maxP,
                        grid: { 
                            display: true,
                            color: '#e5e7eb' // Light gray grid lines
                        },
                        ticks: {
                            color: '#6b7280', // Gray for tick numbers
                            font: { size: 12 }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    showError(message) {
        alert(`Error: ${message}\n\nPlease check your formula format. Example: 2*Q + 10`);
    }

    clearErrors() {
        // Clear any error styling
        [this.supplyFormula, this.demandFormula].forEach(input => {
            input.classList.remove('error');
        });
    }

    updateDefaultRange() {
        try {
            // Calculate where demand curve intersects Q-axis (P = 0)
            const demandFormula = this.demandFormula.value;
            const demandParsed = this.parseFormula(demandFormula);
            
            // For P = 0: 0 = coefficient*Q + constant
            // Solve for Q: Q = -constant/coefficient
            const qIntercept = Math.abs(demandParsed.constant / demandParsed.coefficient);
            
            // Set range to Q-intercept + 10% buffer for better visualization
            const defaultRange = Math.ceil(qIntercept * 1.1);
            
            // Let formulas decide the range naturally
            this.xRange.value = defaultRange || 50; // Fallback to 50 if calculation gives 0
            
        } catch (error) {
            // Fallback to 50 if calculation fails
            this.xRange.value = 50;
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EconomicDiagramGenerator();
});

// Example formulas for students to try
const examples = {
    'Basic Supply & Demand': {
        supply: '2*Q + 10',
        demand: '-1*Q + 50'
    },
    'Elastic Demand': {
        supply: '1.5*Q + 5',
        demand: '-2*Q + 60'
    },
    'Inelastic Supply': {
        supply: '0.5*Q + 15',
        demand: '-1.5*Q + 45'
    }
};

console.log('Website loaded! Try these example formulas:', examples);
