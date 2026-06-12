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
}
