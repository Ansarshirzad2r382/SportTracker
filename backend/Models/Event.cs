namespace Backend.Models;

public class Event
{
    public int EventId { get; set; }

    public int CategoryId { get; set; }
    public EventKategorie Kategorie { get; set; } = null!;

    public int CreatorId { get; set; }
    public User Creator { get; set; } = null!;

    public int TargetValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public ICollection<EventTeilnahme> Teilnahmen { get; set; } = [];

    public Event(int eventId, int categoryId, int creatorId, int targetValue, DateTime startDate, DateTime endDate)
    {
        this.EventId = eventId;
        this.CategoryId = categoryId;
        this.CreatorId = creatorId;
        this.TargetValue = targetValue;
        this.StartDate = startDate;
        this.EndDate = endDate;
    }
}
