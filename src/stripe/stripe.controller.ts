import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService){}

    @Post('create-checkout-session')
    async createCheckoutSession(
        @Body('amount') amount: number,
        @Body('paymentPeriod') paymentPeriod: string,
    ){
        return this.stripeService.createCheckoutSession(amount, paymentPeriod)
    }

    @Post('create-payment-intent')
    async createPaymentWithConfiguration(
        @Body('amount') amount: number,
        @Body('paymentPeriod') paymentPeriod: string,
        @Body('paymentMethodConfigurationId') paymentMethodConfigurationId: string, // Optional if passing from the frontend
    ) {
        return this.stripeService.createPaymentWithConfiguration(amount, paymentPeriod, paymentMethodConfigurationId);
    }
}
