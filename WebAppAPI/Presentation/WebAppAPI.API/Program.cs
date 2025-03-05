using WebAppAPI.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Here we call the extension method that adds services to the IoC Container.
// However, in order to use this extension method here, we need to add the Presentation Project(Layer) as a reference to this project.
builder.Services.AddPersistenceServices();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins("http://localhost:4200", "https://localhost:4200").AllowAnyHeader().AllowAnyMethod()
));
//builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
//    policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()
//));

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true); // It printed as GMT '+3+3'. Use 'UtcNow' in the relevant place instead.

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
