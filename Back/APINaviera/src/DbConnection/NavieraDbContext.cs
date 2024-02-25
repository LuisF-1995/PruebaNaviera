using APINaviera.src.Models;
using Microsoft.EntityFrameworkCore;

namespace APINaviera.src.DbConnection
{
    public class NavieraDbContext: DbContext
    {
        public NavieraDbContext(DbContextOptions<NavieraDbContext> options) : base(options){}

        public DbSet<User> Users { get; set; }
        public DbSet<Ship> Ships { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Travel> Travels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasKey(user => user.id);

            modelBuilder.Entity<Ship>()
                .HasKey(ship => ship.id);

            modelBuilder.Entity<Ticket>()
                .HasKey(ticket => ticket.id);

            modelBuilder.Entity<Travel>()
                .HasKey(travel => travel.id);
        }
    }
}
