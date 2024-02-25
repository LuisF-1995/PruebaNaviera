using APINaviera.src.DbConnection;
using APINaviera.src.Security;
using APINaviera.src.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Agregar el archivo appsettings.json, con la configuracion
var configuration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

// Leer las variables de entorno
//var userId = Environment.GetEnvironmentVariable("MYSQL_NAVIERADB_USER");
//var password = Environment.GetEnvironmentVariable("MYSQL_NAVIERADB_PASSWORD");
// Reemplazar las credenciales en la cadena de conexión
//configuration["ConnectionStrings:NavieraMySQLDB"] = $"Server=localhost;Port=3306;Database=naviera_db;User ID={userId};Password={password};";
builder.Configuration.AddConfiguration(configuration);

/* =============================> Agregando el contexto de la base de datos <================================*/
builder.Services.AddDbContext<NavieraDbContext>(options =>
{
    options.UseMySQL(builder.Configuration.GetConnectionString("NavieraMySQLDB"));
});
/* =========================================================================================================*/

/* =====================================> Agregando servicios usados <======================================*/
// JWT security
var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Jwt:Secret"]));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        };
    });
// UserServices
builder.Services.AddScoped<UserServices>();
builder.Services.AddScoped<SecurityServices>();
builder.Services.AddScoped<TicketServices>();
builder.Services.AddScoped<TravelServices>();
/* =========================================================================================================*/

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

/* ==============================> CORS Policy configuration <===================================== */
var allowedOrigins = configuration.GetSection("CorsPolicy:AllowedOrigins").Get<string[]>();
var allowedMethods = configuration.GetSection("CorsPolicy:AllowedMethods").Get<string[]>();
app.UseCors(builder =>
{
    builder.WithOrigins(allowedOrigins)
           .WithMethods(allowedMethods)
           .AllowAnyHeader()
           .AllowCredentials();
});
/* ================================================================================================= */

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();