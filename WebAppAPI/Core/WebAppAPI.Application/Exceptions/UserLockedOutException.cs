namespace WebAppAPI.Application.Exceptions
{
    public class UserLockedOutException : Exception
    {
        public UserLockedOutException() : base("User account is locked due to multiple failed login attempts. Please try again later.")
        {
        }

        public UserLockedOutException(string? message) : base(message)
        {
        }

        public UserLockedOutException(string? message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
