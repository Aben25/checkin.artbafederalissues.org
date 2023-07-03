function Attendee({ attendee, onAttendeeClick }) {
    return (
      <div
        className="card"
        onClick={() => onAttendeeClick(attendee)}
      >
        <div className="card-content">
          <h2 className="card-title">{attendee.Email}</h2>
          <p className="card-text">
            {attendee.FirstName} {attendee.LastName}
          </p>
        </div>
      </div>
    );
  }
  