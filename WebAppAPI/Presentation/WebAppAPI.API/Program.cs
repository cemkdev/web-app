using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using WebAppAPI.Application.Validators.Products;
using WebAppAPI.Infrastructure.Filters;
using WebAppAPI.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Here we call the extension method that adds services to the IoC Container.
// However, in order to use this extension method here, we need to add the Presentation Project(Layer) as a reference to this project.
builder.Services.AddPersistenceServices();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:4200", "https://localhost:4200").AllowAnyHeader().AllowAnyMethod()
));

builder.Services.AddControllers(options => options.Filters.Add<ValidationFilter>())
    .ConfigureApiBehaviorOptions(options => options.SuppressModelStateInvalidFilter = true);
builder.Services.AddFluentValidationAutoValidation().AddFluentValidationClientsideAdapters().AddValidatorsFromAssemblyContaining<ProductCreateValidator>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
