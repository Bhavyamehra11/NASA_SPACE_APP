
/* ==========================================
   ORBITAL COMMAND
   SPACE MISSION DESIGN GAME
========================================== */


/* ==========================================
   1. GAME DATA
========================================== */

const INITIAL_BUDGET = 500;

const missions = {
    moon: {
        name: "LUNAR EXPLORATION",
        destination: "MOON",
        cost: 100,
        difficulty: "BEGINNER",
        planet: "🌕"
    },

    mars: {
        name: "MARS EXPEDITION",
        destination: "MARS",
        cost: 220,
        difficulty: "INTERMEDIATE",
        planet: "🔴"
    },

    deepSpace: {
        name: "DEEP SPACE",
        destination: "DEEP SPACE",
        cost: 300,
        difficulty: "ADVANCED",
        planet: "🪐"
    }
};


/* ==========================================
   2. SPACECRAFT COMPONENTS
========================================== */

const components = [

    {
        id: "solar",
        name: "Basic Solar Panels",
        category: "power",
        cost: 20,
        mass: 30,
        power: -150,
        science: 0,
        reliability: 85,
        description: "Generates 150 W of electrical power."
    },

    {
        id: "advancedSolar",
        name: "Advanced Solar Panels",
        category: "power",
        cost: 40,
        mass: 50,
        power: -300,
        science: 0,
        reliability: 95,
        description: "Generates 300 W of electrical power."
    },

    {
        id: "nuclear",
        name: "Nuclear Power System",
        category: "power",
        cost: 70,
        mass: 60,
        power: -250,
        science: 0,
        reliability: 98,
        description: "Generates 250 W. Reliable in deep space."
    },

    {
        id: "communications",
        name: "Basic Communications",
        category: "communications",
        cost: 15,
        mass: 10,
        power: 15,
        science: 0,
        reliability: 85,
        description: "Basic communication with Earth."
    },

    {
        id: "advancedComms",
        name: "Advanced Communications",
        category: "communications",
        cost: 35,
        mass: 25,
        power: 30,
        science: 0,
        reliability: 96,
        description: "Higher capacity for transmitting data."
    },

    {
        id: "chemical",
        name: "Chemical Propulsion",
        category: "propulsion",
        cost: 35,
        mass: 70,
        power: 10,
        science: 0,
        reliability: 90,
        description: "Conventional propulsion system."
    },

    {
        id: "ion",
        name: "Ion Propulsion",
        category: "propulsion",
        cost: 55,
        mass: 50,
        power: 30,
        science: 0,
        reliability: 94,
        description: "Efficient propulsion requiring electrical power."
    },

    {
        id: "basicComputer",
        name: "Basic Flight Computer",
        category: "computer",
        cost: 15,
        mass: 15,
        power: 20,
        science: 0,
        reliability: 85,
        description: "Controls basic spacecraft operations."
    },

    {
        id: "advancedComputer",
        name: "Advanced Flight Computer",
        category: "computer",
        cost: 30,
        mass: 25,
        power: 35,
        science: 0,
        reliability: 97,
        description: "Advanced navigation and autonomous control."
    }

];


/* ==========================================
   3. SCIENTIFIC INSTRUMENTS
========================================== */

const instruments = [

    {
        id: "camera",
        name: "Scientific Camera",
        cost: 25,
        mass: 15,
        power: 35,
        science: 20,
        reliability: 90,
        description: "Captures images of the destination."
    },

    {
        id: "spectrometer",
        name: "Spectrometer",
        cost: 35,
        mass: 20,
        power: 45,
        science: 30,
        reliability: 92,
        description: "Analyses the chemical composition of materials."
    },

    {
        id: "radar",
        name: "Radar Instrument",
        cost: 45,
        mass: 35,
        power: 80,
        science: 35,
        reliability: 88,
        description: "Studies surface structures and subsurface features."
    },

    {
        id: "magnetometer",
        name: "Magnetometer",
        cost: 30,
        mass: 12,
        power: 25,
        science: 25,
        reliability: 95,
        description: "Measures magnetic fields."
    }

];


/* ==========================================
   4. LAUNCH VEHICLES
========================================== */

const rockets = [

    {
        id: "small",
        name: "LIGHT LAUNCH VEHICLE",
        cost: 40,
        capacity: 250,
        destinations: ["MOON"],
        reliability: 90,
        description: "Economical launcher for lighter spacecraft."
    },

    {
        id: "medium",
        name: "MEDIUM LAUNCH VEHICLE",
        cost: 70,
        capacity: 450,
        destinations: ["MOON", "MARS"],
        reliability: 94,
        description: "Suitable for medium-sized spacecraft."
    },

    {
        id: "heavy",
        name: "HEAVY LAUNCH VEHICLE",
        cost: 90,
        capacity: 700,
        destinations: ["MOON", "MARS", "DEEP SPACE"],
        reliability: 97,
        description: "High-capacity launcher for ambitious missions."
    }

];


/* ==========================================
   5. GAME STATE
========================================== */

let game = {};

function resetGame() {

    game = {
        budget: INITIAL_BUDGET,
        mission: null,
        selectedComponents: {},
        selectedInstruments: [],
        rocket: null,
        simulationEvents: [],
        eventIndex: 0,
        successfulEvents: 0,
        failedEvents: 0,
        finalScore: 0
    };

}

resetGame();


/* ==========================================
   6. SCREEN NAVIGATION
========================================== */

function showScreen(screenId) {

    document.querySelectorAll(".hero, .game-screen")
        .forEach(screen => {
            screen.classList.add("hidden");
        });

    document.getElementById(screenId)
        .classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

document.getElementById("start-button").addEventListener("click", () => {
    showScreen("mission-screen");
});


/* ==========================================
   7. MISSION SELECTION
========================================== */

document.querySelectorAll(".select-mission").forEach(button => {

    button.addEventListener("click", () => {

        const missionId = button.dataset.mission;

        game.mission = missions[missionId];

        game.budget = INITIAL_BUDGET - game.mission.cost;

        document.getElementById("design-mission-description").textContent =
            "Destination: " + game.mission.destination +
            " | Difficulty: " + game.mission.difficulty;

        renderDesign();

        showScreen("design-screen");

    });

});


/* ==========================================
   8. RESOURCE CALCULATIONS
========================================== */

function getSelectedComponents() {

    return Object.values(game.selectedComponents);

}


function getSelectedInstruments() {

    return game.selectedInstruments
        .map(id => instruments.find(item => item.id === id))
        .filter(Boolean);

}


function getTotalCost() {

    let cost = game.mission ? game.mission.cost : 0;

    getSelectedComponents().forEach(item => {
        cost += item.cost;
    });

    getSelectedInstruments().forEach(item => {
        cost += item.cost;
    });

    if (game.rocket) {
        cost += game.rocket.cost;
    }

    return cost;

}


function getRemainingBudget() {

    return INITIAL_BUDGET - getTotalCost();

}


function getTotalMass() {

    let mass = 0;

    getSelectedComponents().forEach(item => {
        mass += item.mass;
    });

    getSelectedInstruments().forEach(item => {
        mass += item.mass;
    });

    return mass;

}


function getPowerGeneration() {

    let generation = 0;

    getSelectedComponents().forEach(item => {

        if (item.category === "power") {
            generation += Math.abs(item.power);
        }

    });

    return generation;

}


function getPowerConsumption() {

    let consumption = 0;

    getSelectedComponents().forEach(item => {

        if (item.category !== "power") {
            consumption += item.power;
        }

    });

    getSelectedInstruments().forEach(item => {
        consumption += item.power;
    });

    return consumption;

}


function getAvailablePower() {

    return getPowerGeneration() - getPowerConsumption();

}


function getScienceValue() {

    let science = 0;

    getSelectedInstruments().forEach(item => {
        science += item.science;
    });

    return science;

}


/* ==========================================
   9. SPACECRAFT DESIGN DISPLAY
========================================== */

const componentOptions = document.getElementById("component-options");
const instrumentOptions = document.getElementById("instrument-options");


function renderDesign() {

    componentOptions.innerHTML = "";

    components.forEach(item => {

        const selected =
            game.selectedComponents[item.category]?.id === item.id;

        const card = document.createElement("div");

        card.className = "component-card";

        card.innerHTML = `
            <h4>${item.name}</h4>

            <p>${item.description}</p>

            <p>Cost: $${item.cost}M</p>
            <p>Mass: ${item.mass} kg</p>
            <p>Power: ${item.power < 0
                ? "+" + Math.abs(item.power) + " W generated"
                : item.power + " W consumed"}</p>

            <button data-component="${item.id}"
                class="${selected ? "selected" : ""}">
                ${selected ? "SELECTED ✓" : "SELECT"}
            </button>
        `;

        componentOptions.appendChild(card);

    });


    instrumentOptions.innerHTML = "";

    instruments.forEach(item => {

        const selected =
            game.selectedInstruments.includes(item.id);

        const card = document.createElement("div");

        card.className = "component-card";

        card.innerHTML = `
            <h4>${item.name}</h4>

            <p>${item.description}</p>

            <p>Cost: $${item.cost}M</p>
            <p>Mass: ${item.mass} kg</p>
            <p>Power: ${item.power} W</p>
            <p>Science value: ${item.science}</p>

            <button data-instrument="${item.id}"
                class="${selected ? "selected" : ""}">
                ${selected ? "REMOVE ✓" : "SELECT"}
            </button>
        `;

        instrumentOptions.appendChild(card);

    });

    updateDashboard();

    renderSelectedItems();

}


/* ==========================================
   10. COMPONENT SELECTION
========================================== */

componentOptions.addEventListener("click", event => {

    const button = event.target.closest("[data-component]");

    if (!button) return;

    const id = button.dataset.component;

    const item = components.find(component => component.id === id);

    if (!item) return;

    const current = game.selectedComponents[item.category];

    if (current?.id === id) {

        delete game.selectedComponents[item.category];

    } else {

        game.selectedComponents[item.category] = item;

    }

    renderDesign();

});


/* ==========================================
   11. INSTRUMENT SELECTION
========================================== */

instrumentOptions.addEventListener("click", event => {

    const button = event.target.closest("[data-instrument]");

    if (!button) return;

    const id = button.dataset.instrument;

    if (game.selectedInstruments.includes(id)) {

        game.selectedInstruments =
            game.selectedInstruments.filter(item => item !== id);

    } else {

        game.selectedInstruments.push(id);

    }

    renderDesign();

});


/* ==========================================
   12. UPDATE RESOURCE DASHBOARD
========================================== */

function updateDashboard() {

    document.getElementById("budget-display").textContent =
        "$" + getRemainingBudget() + "M";

    document.getElementById("mass-display").textContent =
        getTotalMass() + " kg";

    const power = getAvailablePower();

    document.getElementById("power-display").textContent =
        (power >= 0 ? "+" : "") + power + " W";

    document.getElementById("power-display").style.color =
        power >= 0 ? "#42e6a4" : "#ff6464";

    document.getElementById("science-display").textContent =
        getScienceValue();

}


function renderSelectedItems() {

    const container = document.getElementById("selected-items");

    let selected = [
        ...getSelectedComponents(),
        ...getSelectedInstruments()
    ];

    if (selected.length === 0) {

        container.innerHTML = "<p>No components selected yet.</p>";

        return;

    }

    container.innerHTML = `
        <ul>
            ${selected.map(item => `
                <li>
                    ✓ ${item.name}
                    — $${item.cost}M
                    — ${item.mass} kg
                </li>
            `).join("")}
        </ul>
    `;

}


/* ==========================================
   13. CONTINUE TO LAUNCH
========================================== */

document.getElementById("continue-launch")
    .addEventListener("click", () => {

        const required = [
            "power",
            "communications",
            "propulsion",
            "computer"
        ];

        const missing = required.filter(category =>
            !game.selectedComponents[category]
        );

        if (missing.length > 0) {

            alert(
                "Your spacecraft is incomplete.\n\n" +
                "Please select all four required systems:\n" +
                missing.join(", ")
            );

            return;

        }

        if (game.selectedInstruments.length === 0) {

            alert("Please select at least one scientific instrument.");

            return;

        }

        if (getAvailablePower() < 0) {

            alert(
                "Insufficient power!\n\n" +
                "Your spacecraft consumes more power than it generates. " +
                "Choose better power systems or fewer instruments."
            );

            return;

        }

        if (getRemainingBudget() < 0) {

            alert("Your spacecraft exceeds the available budget.");

            return;

        }

        game.rocket = null;

        renderRocketOptions();

        showScreen("launch-screen");

    });


/* ==========================================
   14. LAUNCH VEHICLE SELECTION
========================================== */

function renderRocketOptions() {

    const container = document.getElementById("rocket-options");

    container.innerHTML = "";

    rockets.forEach(rocket => {

        const canReach =
            rocket.destinations.includes(game.mission.destination);

        const selected = game.rocket?.id === rocket.id;

        const card = document.createElement("div");

        card.className =
            "rocket-card" + (selected ? " selected" : "");

        card.innerHTML = `
            <h3>${rocket.name}</h3>

            <p>${rocket.description}</p>

            <p>Cost: $${rocket.cost}M</p>
            <p>Payload capacity: ${rocket.capacity} kg</p>
            <p>Reliability: ${rocket.reliability}%</p>

            <p>
                ${canReach
                    ? "✓ Compatible with destination"
                    : "✕ Cannot reach this destination"}
            </p>

            <p>
                ${getTotalMass() <= rocket.capacity
                    ? "✓ Payload capacity sufficient"
                    : "✕ Spacecraft too heavy"}
            </p>

            <p>
                ${getRemainingBudget() - rocket.cost >= 0
                    ? "✓ Within budget"
                    : "✕ Exceeds budget"}
            </p>

            <button class="select-mission"
                data-rocket="${rocket.id}"
                ${!canReach ||
                  getTotalMass() > rocket.capacity ||
                  getRemainingBudget() < rocket.cost
                    ? "disabled"
                    : ""}>
                ${selected ? "SELECTED ✓" : "SELECT LAUNCH VEHICLE"}
            </button>
        `;

        container.appendChild(card);

    });

    updateLaunchDashboard();

}


document.getElementById("rocket-options")
    .addEventListener("click", event => {

        const button = event.target.closest("[data-rocket]");

        if (!button || button.disabled) return;

        const id = button.dataset.rocket;

        game.rocket = rockets.find(rocket => rocket.id === id);

        renderRocketOptions();

    });


/* ==========================================
   15. LAUNCH READINESS CHECK
========================================== */

function updateLaunchDashboard() {

    document.getElementById("launch-mass").textContent =
        getTotalMass() + " kg";

    document.getElementById("launch-budget").textContent =
        "$" + getRemainingBudget() + "M";

    const checks = document.getElementById("readiness-checks");

    const categories = [
        "power",
        "communications",
        "propulsion",
        "computer"
    ];

    const allSystems = categories.every(category =>
        Boolean(game.selectedComponents[category])
    );

    const hasInstrument = game.selectedInstruments.length > 0;

    const powerOK = getAvailablePower() >= 0;

    const budgetOK = getRemainingBudget() >= 0;

    const rocketSelected = Boolean(game.rocket);

    const massOK = rocketSelected &&
        getTotalMass() <= game.rocket.capacity;

    const destinationOK = rocketSelected &&
        game.rocket.destinations.includes(game.mission.destination);

    const ready =
        allSystems &&
        hasInstrument &&
        powerOK &&
        budgetOK &&
        massOK &&
        destinationOK;

    checks.innerHTML = `
        <p>${allSystems ? "✓" : "✕"} All essential spacecraft systems installed</p>
        <p>${hasInstrument ? "✓" : "✕"} Scientific instrument selected</p>
        <p>${powerOK ? "✓" : "✕"} Sufficient electrical power</p>
        <p>${budgetOK ? "✓" : "✕"} Within available budget</p>
        <p>${rocketSelected ? "✓" : "✕"} Launch vehicle selected</p>
        <p>${massOK ? "✓" : "✕"} Payload mass within capacity</p>
        <p>${destinationOK ? "✓" : "✕"} Launch vehicle can reach destination</p>
        <p style="color:${ready ? "#42e6a4" : "#ff6464"}; margin-top:15px;">
            ${ready ? "MISSION READY FOR LAUNCH" : "MISSION NOT READY"}
        </p>
    `;

    document.getElementById("launch-mission").disabled = !ready;

}


/* ==========================================
   16. NAVIGATION BUTTONS
========================================== */

document.getElementById("back-to-missions")
    .addEventListener("click", () => {

        showScreen("mission-screen");

    });


document.getElementById("back-to-design")
    .addEventListener("click", () => {

        showScreen("design-screen");

    });


/* ==========================================
   17. MISSION SIMULATION DATA
========================================== */

function prepareSimulation() {

    const destination = game.mission.destination;

    const events = [

        {
            title: "LAUNCH AND DEPLOYMENT",
            success: "Spacecraft successfully deployed into its planned trajectory.",
            failure: "Deployment experienced an unexpected technical anomaly."
        },

        {
            title: "NAVIGATION AND GUIDANCE",
            success: "Navigation systems successfully corrected the spacecraft trajectory.",
            failure: "Navigation required an additional correction."
        },

        {
            title: "SCIENTIFIC OPERATIONS",
            success: "Scientific instruments successfully collected mission data.",
            failure: "One scientific observation was interrupted."
        },

        {
            title: "COMMUNICATION WITH EARTH",
            success: "Mission data successfully transmitted to Earth.",
            failure: "Communication was temporarily disrupted."
        }

    ];

    if (destination === "MARS") {

        events[1].success =
            "Spacecraft successfully completed its interplanetary journey.";

    }

    if (destination === "DEEP SPACE") {

        events[1].success =
            "Spacecraft successfully navigated its deep-space trajectory.";

    }

    return events;

}


/* ==========================================
   18. START MISSION
========================================== */

document.getElementById("launch-mission")
    .addEventListener("click", () => {

        const readiness = document.getElementById("readiness-checks");

        if (!game.rocket || getRemainingBudget() < 0 ||
            getAvailablePower() < 0 ||
            getTotalMass() > game.rocket.capacity) {

            readiness.textContent = "Launch conditions are not satisfied.";

            return;

        }

        game.simulationEvents = prepareSimulation();

        game.eventIndex = 0;

        game.successfulEvents = 0;

        game.failedEvents = 0;

        const planet = document.getElementById("simulation-planet");

        planet.textContent = game.mission.planet;

        document.getElementById("simulation-title").textContent =
            "MISSION INITIALISATION";

        document.getElementById("simulation-message").textContent =
            "Your spacecraft has launched. Awaiting mission operations.";

        document.getElementById("mission-progress").style.width = "0%";

        document.getElementById("mission-events").innerHTML =
            "<p>Spacecraft launched successfully. Mission operations beginning.</p>";

        document.getElementById("next-event").classList.remove("hidden");

        document.getElementById("next-event").textContent =
            "BEGIN MISSION OPERATIONS →";

        showScreen("simulation-screen");

    });


/* ==========================================
   19. MISSION EVENT SIMULATION
========================================== */

function getReliability() {

    const items = [
        ...getSelectedComponents(),
        ...getSelectedInstruments()
    ];

    const total = items.reduce((sum, item) =>
        sum + item.reliability, 0);

    const average = total / items.length;

    return (average + game.rocket.reliability) / 2;

}


document.getElementById("next-event")
    .addEventListener("click", () => {

        if (game.eventIndex >= game.simulationEvents.length) {

            generateReport();

            return;

        }

        const event = game.simulationEvents[game.eventIndex];

        const reliability = getReliability();

        const successChance =
            Math.min(0.96, 0.65 + reliability / 300);

        const success = Math.random() < successChance;

        if (success) {

            game.successfulEvents++;

        } else {

            game.failedEvents++;

        }

        const log = document.getElementById("mission-events");

        const entry = document.createElement("p");

        entry.textContent =
            (success ? "✓ " : "⚠ ") +
            event.title + ": " +
            (success ? event.success : event.failure);

        entry.style.color = success ? "#42e6a4" : "#ffb35c";

        log.appendChild(entry);

        document.getElementById("simulation-title").textContent =
            event.title;

        document.getElementById("simulation-message").textContent =
            success
                ? "MISSION EVENT SUCCESSFUL"
                : "MISSION EVENT EXPERIENCED AN ANOMALY";

        game.eventIndex++;

        const progress =
            (game.eventIndex / game.simulationEvents.length) * 100;

        document.getElementById("mission-progress").style.width =
            progress + "%";

        const button = document.getElementById("next-event");

        button.textContent =
            game.eventIndex === game.simulationEvents.length
                ? "GENERATE MISSION REPORT →"
                : "NEXT MISSION EVENT →";

        log.scrollTop = log.scrollHeight;

    });


/* ==========================================
   20. FINAL SCORE CALCULATION
========================================== */

function calculateScore() {

    // Scientific value: maximum 30 points

    const scienceScore =
        Math.min(30, getScienceValue() * 0.3);


    // Spacecraft reliability: maximum 25 points

    const reliabilityScore =
        getReliability() * 0.25;


    // Resource management: maximum 15 points

    let resourceScore = 0;

    const power = getAvailablePower();

    if (power >= 0) {
        resourceScore += 8;
    }

    const remaining = getRemainingBudget();

    if (remaining >= 0) {
        resourceScore += 7;
    }


    // Launch compatibility: 10 points

    const launchScore = 10;


    // Mission operations: maximum 20 points

    const operationsScore =
        (game.successfulEvents / 4) * 20;


    const total =
        scienceScore +
        reliabilityScore +
        resourceScore +
        launchScore +
        operationsScore;

    return Math.round(Math.min(100, total));

}


/* ==========================================
   21. GENERATE FINAL REPORT
========================================== */

function generateReport() {

    game.finalScore = calculateScore();

    const successes = game.successfulEvents;

    let result;

    if (successes === 4) {

        result = "MISSION SUCCESSFUL";

    } else if (successes >= 3) {

        result = "MISSION MOSTLY SUCCESSFUL";

    } else if (successes === 2) {

        result = "PARTIAL MISSION SUCCESS";

    } else {

        result = "MISSION UNSUCCESSFUL";

    }

    document.getElementById("final-score").textContent =
        game.finalScore;

    document.getElementById("mission-result").textContent =
        result;

    document.getElementById("report-destination").textContent =
        game.mission.destination;

    document.getElementById("report-science").textContent =
        getScienceValue();

    document.getElementById("report-budget").textContent =
        "$" + getRemainingBudget() + "M";

    document.getElementById("report-mass").textContent =
        getTotalMass() + " kg";


    const feedback = document.getElementById("report-feedback-content");

    let comments = [];

    comments.push(
        `<p>✓ Your spacecraft completed ${successes} out of 4 mission events successfully.</p>`
    );

    comments.push(
        `<p>Scientific value: ${getScienceValue()} points. ${
            getScienceValue() >= 50
                ? "You selected a strong scientific payload."
                : "Consider adding more scientific instruments."
        }</p>`
    );

    comments.push(
        `<p>Power management: ${
            getAvailablePower()
        } W available after spacecraft consumption.</p>`
    );

    comments.push(
        `<p>Budget remaining: $${getRemainingBudget()}M.</p>`
    );

    if (getScienceValue() < 30) {

        comments.push(
            "<p>Improvement: Consider selecting additional scientific instruments to increase the scientific value of your mission.</p>"
        );

    }

    if (getAvailablePower() > 150) {

        comments.push(
            "<p>Improvement: Your spacecraft has significant unused power capacity. Consider a more capable scientific payload.</p>"
        );

    }

    if (getRemainingBudget() > 100) {

        comments.push(
            "<p>Improvement: You have substantial unused funding. Consider investing more in your spacecraft.</p>"
        );

    }

    if (game.failedEvents > 0) {

        comments.push(
            "<p>Mission risk: Some mission events experienced technical anomalies. Higher-reliability systems may improve future performance.</p>"
        );

    }

    comments.push(
        `<p><strong>FINAL RESULT: ${result}</strong></p>`
    );

    feedback.innerHTML = comments.join("");

    showScreen("report-screen");

}


/* ==========================================
   22. RESTART GAME
========================================== */

document.getElementById("restart-game")
    .addEventListener("click", () => {

        resetGame();

        renderDesign();

        showScreen("home-screen");

    });


/* ==========================================
   23. INITIALISE GAME
========================================== */

console.log("ORBITAL COMMAND INITIALISED");

console.log("Space Mission Simulator Ready");
