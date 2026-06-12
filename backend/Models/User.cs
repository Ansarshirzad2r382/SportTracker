namespace Backend.Models;

public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public ICollection<Freundschaft> GesendeteFreundschaften { get; set; } = [];
    public ICollection<Freundschaft> EmpfangeneFreundschaften { get; set; } = [];
    public ICollection<Event> ErstellteEvents { get; set; } = [];
    public ICollection<EventTeilnahme> Teilnahmen { get; set; } = [];
}
