import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
    private stripe: Stripe

    constructor(private configService: ConfigService){
        this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'),{
            apiVersion: '2024-12-18.acacia'
        })
    }

    async createCheckoutSession(amount: number, paymentPeriod: string): Promise<string> {
        try {
          const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card', 'acss_debit','affirm','amazon_pay','wechat_pay','alipay', 'cashapp','alipay'],
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
            success_url: `https://checkout-fe.onrender.com/`,
            cancel_url: `https://checkout-fe.onrender.com/`,
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
      }


      // async createPaymentIntent(
      //   amount: number,
      //   currency: string,
      //   paymentMethodConfigurationId: string,
      // ) {
      //   try {
      //     const paymentIntent = await this.stripe.paymentIntents.create({
      //       payment_method_options:{

      //         amount: amount * 100, // Amount in the smallest unit
      //         currency: currency,
      //         payment_method_configuration: paymentMethodConfigurationId, // Add your payment method ID here
      //         confirm: true, // Immediately confirm the payment if possible
      //       }
      //     });
    
      //     return paymentIntent;
      //   } catch (error) {
      //     console.error('Error creating PaymentIntent:', error);
      //     throw error;
      //   }
      // }
// }
