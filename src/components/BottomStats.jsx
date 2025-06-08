import React from "react";
import Asset from "./Asset";
import Health from "./Health";
import Love from "./Love";
import Reputation from "./Reputation";

function BottomStats({ stats }) {
  return (
    <div className="bottom-stats-bar">
      <Asset value={stats.asset} />
      <Health value={stats.health} />
      <Love value={stats.love} />
      <Reputation value={stats.reputation} />
    </div>
  );
}

export default BottomStats;
