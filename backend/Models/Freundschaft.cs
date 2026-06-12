namespace Backend.Models;

public class Freundschaft
{
    public int RequesterId { get; set; }
    public User Requester { get; set; } = null!;

    public int AddresseeId { get; set; }
    public User Addressee { get; set; } = null!;

    public string Status { get; set; } = string.Empty;
}
