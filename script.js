let teams = {};  // Will store teams' statistics

// Function to load saved teams from localStorage
function loadFromLocalStorage() {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
        teams = JSON.parse(savedTeams);
        updateTable();
    }
}

// Function to save teams to localStorage
function saveToLocalStorage() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

// Function to update the table
function updateTable() {
    const tableBody = document.querySelector("#rankingTable tbody");
    tableBody.innerHTML = "";  // Clear current table

    // Convert the teams object to an array and sort it by points (descending)
    const sortedTeams = Object.values(teams).sort((a, b) => b.points - a.points);

    sortedTeams.forEach((team, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${team.goalDifference}</td>
            <td>${team.points}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to add a match result
function addMatchResult(team1, score1, team2, score2) {
    // Add team1 to teams if not already present
    if (!teams[team1]) {
        teams[team1] = { name: team1, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, goalDifference: 0 };
    }
    // Add team2 to teams if not already present
    if (!teams[team2]) {
        teams[team2] = { name: team2, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, goalDifference: 0 };
    }

    // Update played matches and goals for each team
    teams[team1].played++;
    teams[team2].played++;
    teams[team1].goalsFor += score1;
    teams[team1].goalsAgainst += score2;
    teams[team2].goalsFor += score2;
    teams[team2].goalsAgainst += score1;

    // Determine who won or if it's a draw
    if (score1 > score2) {
        teams[team1].won++;
        teams[team2].lost++;
        teams[team1].points += 3;
    } else if (score1 < score2) {
        teams[team2].won++;
        teams[team1].lost++;
        teams[team2].points += 3;
    } else {
        teams[team1].drawn++;
        teams[team2].drawn++;
        teams[team1].points++;
        teams[team2].points++;
    }

    // Calculate goal difference for both teams
    teams[team1].goalDifference = teams[team1].goalsFor - teams[team1].goalsAgainst;
    teams[team2].goalDifference = teams[team2].goalsFor - teams[team2].goalsAgainst;

    // Save to localStorage
    saveToLocalStorage();

    // Update the table after the match
    updateTable();
}

// Event listener for match submission
document.getElementById("matchForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form submission from reloading the page

    const team1 = document.getElementById("team1").value.trim();
    const score1 = parseInt(document.getElementById("score1").value);
    const team2 = document.getElementById("team2").value.trim();
    const score2 = parseInt(document.getElementById("score2").value);

    addMatchResult(team1, score1, team2, score2);
});

// Load saved data from localStorage when the page is loaded
loadFromLocalStorage();
