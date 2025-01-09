import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
    ){}

    @Post('create-checkout-session')
    async createCheckoutSession(
        @Body('amount') amount: number,
        @Body('paymentPeriod') paymentPeriod: string,
        @Body('userId') userId: string,
    ) {
        return this.stripeService.createCheckoutSession(amount, paymentPeriod, userId)
    }

    @Post('create-payment-intent')
    async createPaymentWithConfiguration(
        @Body('amount') amount: number,
        @Body('paymentPeriod') paymentPeriod: string,
        @Body('paymentMethodConfigurationId') paymentMethodConfigurationId: string, // Optional if passing from the frontend
    ) {
        return this.stripeService.createPaymentWithConfiguration(amount, paymentPeriod, paymentMethodConfigurationId);
    }

    @Post('webhook')
  async handleStripeWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    // Call Stripe Service to process the webhook
    return this.stripeService.handleWebhook(req.body, signature);
  }
    
}
