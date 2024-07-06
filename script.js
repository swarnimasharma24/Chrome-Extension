async function getMatchData() {
    try {
        const response = await fetch("https://api.cricapi.com/v1/currentMatches?apikey=7ac82303-a1eb-4c0c-9978-f015dde1865b&offset=0");
        const data = await response.json();
        
        if (data.status !== "success") return;
        
        const matchesList = data.data;
        if (!matchesList) return [];
        
        // Define the series IDs for World Cup T20 and One Day matches
        const worldCupSeriesIds = ["d13235de-1bd4-4e5e-87e8-766c21f11661", "a1ece0e1-97f7-4ca4-b73d-7448cf96b727"];
        
        const relevantData = matchesList
            .filter(match => worldCupSeriesIds.includes(match.series_id))
            .map(match => {
                const scores = match.score.map(score => `${score.inning}: ${score.r}/${score.w} in ${score.o} overs`).join(' | ');
                return {
                    name: match.name,
                    status: match.status,
                    venue: match.venue,
                    date: match.date,
                    teams: match.teams.join(' vs '),
                    scores: scores
                };
            });

        const matchItems = relevantData.map(match => `
            <li>
                <strong>${match.name}</strong><br>
                Status: ${match.status}<br>
                Venue: ${match.venue}<br>
                Date: ${match.date}<br>
                Teams: ${match.teams}<br>
                Scores: ${match.scores}
            </li>
        `).join('');

        document.getElementById("matches").innerHTML = `<ul>${matchItems}</ul>`;
        
        return relevantData;
    } catch (e) {
        console.log(e);
    }
}

// Call getMatchData initially and then every minute
getMatchData();
setInterval(getMatchData, 60000); // 60000 ms = 1 minute
