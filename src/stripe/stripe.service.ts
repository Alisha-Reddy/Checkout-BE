import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/database/users.repository';

@Injectable()
export class StripeService {
    private stripe: Stripe

    constructor(private configService: ConfigService, private usersRepository: UsersRepository,){
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'),{
            apiVersion: '2024-12-18.acacia'
        })
    }

    async createCheckoutSession(amount: number, paymentPeriod: string, userId: string): Promise<string> {
        try {
          const session = await this.stripe.checkout.sessions.create({
            // payment_method_types: ['card', 'acss_debit','affirm','amazon_pay','wechat_pay','alipay', 'cashapp','alipay'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: `Upgrade to ${paymentPeriod} plan`,
                  },
                  unit_amount: Math.round(amount * 100),
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `https://checkout-fe.onrender.com/success`,
            cancel_url: `https://checkout-fe.onrender.com/cancel`,
          });
          return session.url;
        } catch (error) {
          console.error("Error creating Stripe Checkout session:", error);
        }
      };

      async createPaymentWithConfiguration(
        amount: number,
        paymentPeriod: string,
        paymentMethodConfigurationId: string,
      ) {
        const session = await this.stripe.checkout.sessions.create({
          // payment_method_types: ['card', 'acss_debit','affirm','amazon_pay','wechat_pay','alipay'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Upgrade to ${paymentPeriod} plan`,
                },
                unit_amount: Math.round(amount * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `http://localhost:3000`,
          cancel_url: `http://localhost:3000`,
          payment_method_configuration: paymentMethodConfigurationId,
        });
        return session.url;
      } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
  }
  
  async handleWebhook(payload: any, signature: string): Promise<void> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata.userId; // Pass userId as metadata when creating sessions

        // Calculate plan expiry (1 minute from now)
        const expiryTimestamp = new Date(Date.now() + 1 * 60 * 1000);

        // Update the user's plan expiry in the database
        await this.usersRepository.updateUserPlan(userId, {
          planExpiry: expiryTimestamp,
          email: session.customer_email, // Retrieve customer email from session
        });
      }
    } catch (error) {
      console.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }
}