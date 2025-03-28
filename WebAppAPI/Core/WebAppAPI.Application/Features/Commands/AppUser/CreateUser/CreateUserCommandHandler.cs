using MediatR;
using Microsoft.AspNetCore.Identity;
using WebAppAPI.Application.Abstractions.Services;
using WebAppAPI.Application.DTOs.User;
using WebAppAPI.Application.Exceptions;
using U = WebAppAPI.Domain.Entities.Identity;

namespace WebAppAPI.Application.Features.Commands.AppUser.CreateUser
{
    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommandRequest, CreateUserCommandResponse>
    {
        readonly IUserService _userService;

        public CreateUserCommandHandler(IUserService userService)
        {
            _userService = userService;
        }

        public async Task<CreateUserCommandResponse> Handle(CreateUserCommandRequest request, CancellationToken cancellationToken)
        {
            CreateUserResponse response = await _userService.CreateAsync(new()
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                FullName = $"{request.FirstName} {request.LastName}",
                Username = request.Username,
                Email = request.Email,
                Password = request.Password,
                ConfirmPassword = request.ConfirmPassword,
            });

            return new()
            {
                Message = response.Message,
                Succeeded = response.Succeeded
            };

            //throw new UserCreateFailedException();
        }
    }
}
