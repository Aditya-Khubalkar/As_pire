/**
 * logic.js - Core Lung Health Application Logic
 * Purpose: Analyzes AQI and user data to provide health risks and recommendations.
 */

/**
 * Calculates health risk based on AQI, pre-existing conditions, and age.
 * @param {number} aqi - Air Quality Index (0-500)
 * @param {Array} userConditions - List of health conditions (e.g., ['asthma', 'copd'])
 * @param {number} age - User's age
 * @returns {Object} - Contains riskLevel (String) and message (String)
 */
const calculateHealthRisk = (aqi, userConditions = [], age = 0) => {
    let riskScore = aqi;

    // Condition Multiplier: Asthma or COPD increases vulnerability
    const hasRespiratoryIssues = userConditions.some(condition => 
        ['asthma', 'copd'].includes(condition.toLowerCase())
    );

    if (hasRespiratoryIssues) {
        riskScore *= 1.5;
    }

    // Age-based penalty
    if (age > 60) {
        riskScore += 20;
    }

    // Determine Risk Level and Message
    let riskLevel = '';
    let message = '';

    if (riskScore >= 300) {
        riskLevel = 'Critical';
        message = 'Hazardous conditions. Emergency health warnings for everyone.';
    } else if (riskScore >= 150) {
        riskLevel = 'High';
        message = 'Unhealthy air quality. Everyone may begin to experience health effects.';
    } else if (riskScore >= 51) {
        riskLevel = 'Moderate';
        message = 'Acceptable air quality, but may be a risk for some people.';
    } else {
        riskLevel = 'Low';
        message = 'Air quality is considered satisfactory.';
    }

    return { riskLevel, riskScore, message };
};

/**
 * Provides punchy safety advice based on the calculated risk level.
 * @param {string} riskLevel - 'Low', 'Moderate', 'High', or 'Critical'
 * @returns {string} - Actionable advice
 */
const getSafetyRecommendation = (riskLevel) => {
    const advice = {
        'Critical': 'STAY INDOORS. Use air purifiers. Total outdoor activity avoidance required.',
        'High': 'Wear an N95 mask immediately. Avoid outdoor exercise.',
        'Moderate': 'Sensitive groups should stay indoors and monitor symptoms.',
        'Low': 'Air is clean. Enjoy the outdoors.'
    };

    return advice[riskLevel] || 'Monitor local air quality reports.';
};

/**
 * Triggers a browser notification if AQI exceeds safety thresholds.
 * @param {number} aqi - Current Air Quality Index
 */
const checkAlertStatus = (aqi) => {
    if (aqi > 150) {
        if (!("Notification" in window)) {
            console.error("This browser does not support desktop notifications.");
            return;
        }

        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification("⚠️ DANGER: High Pollution", {
                    body: `High Pollution in your area! Current AQI is ${aqi}. Take precautions.`,
                    icon: "/path-to-your-icon.png" // Optional: add your icon path here
                });
            }
        });
    }
};

// Exporting for potential Node environments or just making it globally accessible
// if linked via <script src="logic.js"></script>