let countdownTarget;

async function loadRace() {

  const res = await fetch(
    "https://api.jolpi.ca/ergast/f1/current/next.json"
  );

  const data = await res.json();

  const race =
    data.MRData.RaceTable.Races[0];

  document.getElementById(
    "raceName"
  ).innerText = race.raceName;

  const sessions = [];

  if (race.FirstPractice) {
    sessions.push({
      name: "Practice 1",
      date: `${race.FirstPractice.date}T${race.FirstPractice.time}`
    });
  }

  if (race.SecondPractice) {
    sessions.push({
      name: "Practice 2",
      date: `${race.SecondPractice.date}T${race.SecondPractice.time}`
    });
  }

  if (race.ThirdPractice) {
    sessions.push({
      name: "Practice 3",
      date: `${race.ThirdPractice.date}T${race.ThirdPractice.time}`
    });
  }

  if (race.Qualifying) {
    sessions.push({
      name: "Qualifying",
      date: `${race.Qualifying.date}T${race.Qualifying.time}`
    });
  }

  if (race.Sprint) {
    sessions.push({
      name: "Sprint",
      date: `${race.Sprint.date}T${race.Sprint.time}`
    });
  }

  sessions.push({
    name: "Race",
    date: `${race.date}T${race.time}`
  });

  const now = new Date();

  const nextSession =
    sessions.find(
      s => new Date(s.date) > now
    );

  if (nextSession) {

    countdownTarget =
      new Date(nextSession.date);

    document.getElementById(
      "sessionName"
    ).innerText =
      nextSession.name;

    document.getElementById(
      "sessionTime"
    ).innerText =
      countdownTarget.toLocaleString(
        "en-SG",
        {
          timeZone: "Asia/Singapore",
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }
      );
  }
  else {

  document.getElementById(
    "sessionName"
  ).innerText =
    "Weekend Complete";

  document.getElementById(
    "sessionTime"
  ).innerText =
    "Waiting for next GP";

  document.getElementById(
    "countdown"
  ).innerText =
    "🏁";
}
  const schedule =
    document.getElementById(
      "schedule"
    );

  schedule.innerHTML = "";

  sessions.forEach(session => {

    const d =
      new Date(session.date);

    const item =
      document.createElement("div");

    item.className =
      "schedule-item";

    item.innerHTML = `
      <span>${session.name}</span>
      <span class="schedule-time">
        ${d.toLocaleString(
          "en-SG",
          {
            timeZone:
              "Asia/Singapore",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit"
          }
        )}
      </span>
    `;

    schedule.appendChild(item);
  });
}

function updateCountdown() {

  if (!countdownTarget) return;

  const now = new Date();

  const diff =
    countdownTarget - now;

  if (diff < 0) return;

  const days =
    Math.floor(
      diff / 86400000
    );

  const hours =
    Math.floor(
      (diff % 86400000)
      / 3600000
    );

  const mins =
    Math.floor(
      (diff % 3600000)
      / 60000
    );

  const secs =
    Math.floor(
      (diff % 60000)
      / 1000
    );

  document.getElementById(
    "countdown"
  ).innerText =
    `${days}d ${hours}h ${mins}m ${secs}s`;
}

loadRace();

setInterval(
  updateCountdown,
  1000
);
