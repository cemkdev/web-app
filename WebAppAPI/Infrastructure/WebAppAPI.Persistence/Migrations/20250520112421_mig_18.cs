using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAppAPI.Persistence.Migrations
{
    public partial class mig_18 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateUpdated",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "AspNetRoles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateUpdated",
                table: "AspNetRoles",
                type: "timestamp with time zone",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DateUpdated",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "AspNetRoles");

            migrationBuilder.DropColumn(
                name: "DateUpdated",
                table: "AspNetRoles");
        }
    }
}
