const SessionTable = ({ sessions }) => {

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatDuration = (duration) => {
    if (duration === null || duration === undefined) return "—";

    // if backend gives seconds
    if (typeof duration === "number") {
      const min = Math.floor(duration / 60);
      const sec = duration % 60;
      return `${min}m ${sec}s`;
    }

    return `${duration} min`;
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="empty-table">
        <p>No session records found</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="session-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td className="session-id">#{s.id}</td>

              {/* DATE */}
              <td>{formatDate(s.start_time)}</td>

              {/* START TIME */}
              <td>{formatTime(s.start_time)}</td>

              {/* END TIME */}
              <td>{s.end_time ? formatTime(s.end_time) : "Active"}</td>

              {/* DURATION (FIXED) */}
              <td className="duration-cell">
                {formatDuration(s.duration)}
              </td>

              {/* STATUS */}
              <td>
                <span className={`status-badge ${s.is_active ? "active" : "ended"}`}>
                  {s.is_active ? "Active" : "Ended"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default SessionTable;