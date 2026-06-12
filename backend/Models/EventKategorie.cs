namespace Backend.Models;

public class EventKategorie
{
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string MetricUnit { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Event> Events { get; set; } = [];
}
