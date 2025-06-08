using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAppAPI.Persistence.Migrations
{
    public partial class mig_20 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "AspNetRoles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "AspNetRoles");
        }
    }
}
