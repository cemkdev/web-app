using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAppAPI.Persistence.Migrations
{
    public partial class mig_21 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AdminOnly",
                table: "Endpoints",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminOnly",
                table: "Endpoints");
        }
    }
}
