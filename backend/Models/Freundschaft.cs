namespace Backend.Models;

public class Freundschaft
{
    public int RequesterId { get; set; }
    public User Requester { get; set; } = null!;

    public int AddresseeId { get; set; }
    public User Addressee { get; set; } = null!;

    public string Status { get; set; } = string.Empty;

    public Freundschaft(int requesterId, int addresseeId, string status)
    {
        this.RequesterId = requesterId;
        this.AddresseeId = addresseeId;
        this.Status = status;
    }
}
