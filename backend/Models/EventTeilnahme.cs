namespace Backend.Models;

public class EventTeilnahme
{
    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int CurrentScore { get; set; }
    public DateTime JoinedAt { get; set; }

    public EventTeilnahme(int eventId, int userId, int currentScore, DateTime joinedAt)
    {
        this.EventId = eventId;
        this.UserId = userId;
        this.CurrentScore = currentScore;
        this.JoinedAt = joinedAt;
    }
}
