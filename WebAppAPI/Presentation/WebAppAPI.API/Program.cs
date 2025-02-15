//using WebAppAPI.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Here we call the extension method that adds services to the IoC Container.
// However, in order to use this extension method here, we need to add the Presentation Project(Layer) as a reference to this project.
//builder.Services.AddPersistenceServices();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
