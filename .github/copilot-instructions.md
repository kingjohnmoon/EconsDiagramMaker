<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# EconsApp - Economic Diagram Generator

This is a frontend-only web application that helps economics students generate diagrams from mathematical formulas.

## Project Structure
- **HTML**: Main interface with form inputs for economic formulas
- **CSS**: Modern, responsive styling with gradient backgrounds
- **JavaScript**: Chart.js integration for dynamic diagram generation

## Key Features
- Supply and demand curve visualization
- Automatic equilibrium point calculation
- Real-time diagram updates
- Formula parsing and validation
- Mobile-responsive design

## Formula Format
Students input formulas in the format: `coefficient*x + constant`
Examples:
- Supply: `2*x + 10`
- Demand: `-1*x + 50`

## Libraries Used
- Chart.js for chart rendering
- Pure vanilla JavaScript for logic
- CSS Grid for responsive layout

When making changes:
- Keep the interface simple and student-friendly
- Ensure formulas are validated before processing
- Maintain accessibility and mobile responsiveness
- Add helpful error messages and examples
