using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebAppAPI.Application.ViewModels.Products;

namespace WebAppAPI.Application.Validators.Products
{
    public class ProductCreateValidator : AbstractValidator<VM_Product_Create>
    {
        public ProductCreateValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty()
                .NotNull()
                    .WithMessage("Please enter a product name.")
                .MaximumLength(100)
                .MinimumLength(2)
                    .WithMessage("The product name must be between 2 and 100 characters.");

            RuleFor(p => p.Stock)
                .NotEmpty()
                .NotNull()
                    .WithMessage("Please enter a stock value.")
                .Must(s => s >= 0)
                    .WithMessage("The stock value cannot be a negative value.");

            RuleFor(p => p.Price)
                .NotEmpty()
                .NotNull()
                    .WithMessage("Please enter a price value.")
                .Must(s => s >= 0)
                    .WithMessage("The price value cannot be a negative value.");

        }
    }
}
