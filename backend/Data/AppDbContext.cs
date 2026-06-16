using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Freundschaft> Freundschaften => Set<Freundschaft>();
    public DbSet<EventKategorie> EventKategorien => Set<EventKategorie>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<EventTeilnahme> EventTeilnahmen => Set<EventTeilnahme>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Freundschaft: zusammengesetzter PK
        modelBuilder.Entity<Freundschaft>()
            .HasKey(f => new { f.RequesterId, f.AddresseeId });

        modelBuilder.Entity<Freundschaft>()
            .HasOne(f => f.Requester)
            .WithMany(u => u.GesendeteFreundschaften)
            .HasForeignKey(f => f.RequesterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Freundschaft>()
            .HasOne(f => f.Addressee)
            .WithMany(u => u.EmpfangeneFreundschaften)
            .HasForeignKey(f => f.AddresseeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Event: Creator FK
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Creator)
            .WithMany(u => u.ErstellteEvents)
            .HasForeignKey(e => e.CreatorId)
            .OnDelete(DeleteBehavior.Restrict);

        // EventTeilnahme: zusammengesetzter PK
        modelBuilder.Entity<EventTeilnahme>()
            .HasKey(t => new { t.EventId, t.UserId });

        modelBuilder.Entity<EventTeilnahme>()
            .HasOne(t => t.Event)
            .WithMany(e => e.Teilnahmen)
            .HasForeignKey(t => t.EventId);

        modelBuilder.Entity<EventTeilnahme>()
            .HasOne(t => t.User)
            .WithMany(u => u.Teilnahmen)
            .HasForeignKey(t => t.UserId);
    }
}
