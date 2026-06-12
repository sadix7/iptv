import { NextResponse } from "next/server";

const fetchWithTimeout = async (url: string, timeout = 4000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
};

export async function GET() {
  try {
    const [gamesData, groupsData, teamsData, stadiumsData] = await Promise.all([
      fetchWithTimeout("https://worldcup26.ir/get/games"),
      fetchWithTimeout("https://worldcup26.ir/get/groups"),
      fetchWithTimeout("https://worldcup26.ir/get/teams"),
      fetchWithTimeout("https://worldcup26.ir/get/stadiums"),
    ]);

    const gamesList = gamesData.games || [];
    const groupsList = groupsData.groups || [];
    const teamsList = teamsData.teams || [];
    const stadiumsList = stadiumsData.stadiums || [];

    const teamsMap: Record<string, { name: string; flag: string; code: string }> = {};
    teamsList.forEach((t: any) => {
      teamsMap[t.id] = {
        name: t.name_en || "TBD",
        flag: t.flag || "",
        code: t.fifa_code || "",
      };
    });

    const stadiumsMap: Record<string, string> = {};
    stadiumsList.forEach((s: any) => {
      stadiumsMap[s.id] = `${s.name_en || "TBD Stadium"}, ${s.city_en || "TBD City"}`;
    });

    const matches = gamesList.map((g: any) => {
      let date = "TBD";
      let time = "TBD";
      if (g.local_date) {
        const parts = g.local_date.trim().split(" ");
        if (parts.length >= 1) {
          const dateParts = parts[0].split("/");
          if (dateParts.length === 3) {
            const pad = (s: string) => s.padStart(2, "0");
            date = `${dateParts[2]}-${pad(dateParts[0])}-${pad(dateParts[1])}`;
          }
        }
        if (parts.length >= 2) {
          time = parts[1];
        }
      }

      let stage = "Group Stage";
      if (g.type === "r32") stage = "Round of 32";
      else if (g.type === "r16") stage = "Round of 16";
      else if (g.type === "qf") stage = "Quarter-finals";
      else if (g.type === "sf") stage = "Semi-finals";
      else if (g.type === "third") stage = "Third Place";
      else if (g.type === "final") stage = "Final";

      const homeTeam = teamsMap[g.home_team_id];
      const awayTeam = teamsMap[g.away_team_id];

      const homeName = homeTeam?.name || g.home_team_name_en || g.home_team_label || "TBD";
      const awayName = awayTeam?.name || g.away_team_name_en || g.away_team_label || "TBD";

      return {
        id: parseInt(g.id) || g._id,
        date,
        time,
        home: homeName,
        away: awayName,
        homeFlag: homeTeam?.flag || "",
        awayFlag: awayTeam?.flag || "",
        homeScore: g.home_score !== "null" && g.home_score !== null ? parseInt(g.home_score) : null,
        awayScore: g.away_score !== "null" && g.away_score !== null ? parseInt(g.away_score) : null,
        finished: g.finished === "TRUE",
        live: g.time_elapsed !== "notstarted" && g.time_elapsed !== "finished",
        timeElapsed: g.time_elapsed || "",
        venue: stadiumsMap[g.stadium_id] || "TBD",
        group: g.group || "",
        stage,
      };
    });

    const groups = groupsList.map((group: any) => {
      const teams = (group.teams || []).map((t: any) => {
        const teamInfo = teamsMap[t.team_id];
        return {
          name: teamInfo?.name || "TBD",
          flag: teamInfo?.flag || "",
          mp: parseInt(t.mp) || 0,
          w: parseInt(t.w) || 0,
          d: parseInt(t.d) || 0,
          l: parseInt(t.l) || 0,
          gf: parseInt(t.gf) || 0,
          ga: parseInt(t.ga) || 0,
          gd: parseInt(t.gd) || 0,
          pts: parseInt(t.pts) || 0,
        };
      });

      teams.sort((a: any, b: any) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
      });

      return {
        id: group.name,
        name: `Group ${group.name}`,
        teams,
      };
    });

    groups.sort((a: any, b: any) => a.id.localeCompare(b.id));

    return NextResponse.json({
      tournament: "FIFA World Cup 2026",
      hosts: ["USA", "Canada", "Mexico"],
      year: 2026,
      groups,
      matches,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      }
    });

  } catch (error) {
    console.error("Failed to fetch live World Cup data:", error);
    return NextResponse.json({ error: "Failed to fetch live data" }, { status: 503 });
  }
}
