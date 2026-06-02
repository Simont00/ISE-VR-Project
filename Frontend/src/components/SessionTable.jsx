const SessionTable = ({ sessions }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  };

  if (!sessions || sessions.length === 0) {
    return <div className="empty-table"><p>No session records found</p></div>;
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
              <td>{formatDate(s.start_time)}</td>
              <td>{formatTime(s.start_time)}</td>
              <td>{formatTime(s.end_time)}</td>
              <td className="duration-cell">{s.duration || "—"}</td>
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
