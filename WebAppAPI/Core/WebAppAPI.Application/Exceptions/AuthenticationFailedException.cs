namespace WebAppAPI.Application.Exceptions
{
    public class AuthenticationFailedException : Exception
    {
        public AuthenticationFailedException() : base("Unauthorized access. Invalid or expired token.")
        {
        }

        public AuthenticationFailedException(string? message) : base(message)
        {
        }

        public AuthenticationFailedException(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}
