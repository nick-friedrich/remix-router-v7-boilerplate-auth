import { Resend } from 'resend';

/*
 * USAGE:
  await Mail.sendEmail(
    "test@example.com",
    "Test Subject",
    "<h1>Test Body</h1>"
  );
 */

// Interface for mail adapters
interface MailAdapter {
  sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void>;
}

// Resend adapter implementation
class ResendAdapter implements MailAdapter {
  private client: Resend;
  private fromAddress: string;

  constructor(apiKey: string, fromAddress: string) {
    this.client = new Resend(apiKey);
    this.fromAddress = fromAddress;
  }

  async sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    try {
      await this.client.emails.send({
        from: this.fromAddress,
        to,
        subject,
        html: body,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}

// Console adapter for development
class ConsoleAdapter implements MailAdapter {
  async sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    console.log('📧 Development Mail:');
    console.log('------------------');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:');
    console.log(body);
    console.log('------------------');
  }
}

export class Mail {
  private static instance: Mail;
  private adapter: MailAdapter;

  private constructor() {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'no-reply@yourdomain.com';

    if (resendApiKey && fromAddress) {
      this.adapter = new ResendAdapter(resendApiKey, fromAddress);
      console.log('✉️ Mail service initialized with Resend');
    } else if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY and RESEND_FROM_EMAIL are required in production');
    } else {
      this.adapter = new ConsoleAdapter();
      console.log('📝 Mail service initialized in development mode');
    }
  }

  public static getInstance(): Mail {
    if (!Mail.instance) {
      Mail.instance = new Mail();
    }
    return Mail.instance;
  }

  public static async sendEmail({
    to,
    subject,
    body,
  }: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    const instance = Mail.getInstance();
    return instance.adapter.sendEmail({ to, subject, body });
  }

  // For testing purposes
  public static setAdapter(adapter: MailAdapter): void {
    const instance = Mail.getInstance();
    instance.adapter = adapter;
  }
}

export type { MailAdapter };