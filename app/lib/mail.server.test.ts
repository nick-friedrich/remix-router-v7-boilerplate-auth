import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Mail, type MailAdapter } from './mail.server';

describe('Mail Service', () => {
  const consoleSpy = vi.spyOn(console, 'log');
  const errorSpy = vi.spyOn(console, 'error');
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    consoleSpy.mockClear();
    errorSpy.mockClear();
    (Mail as any).instance = undefined;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Console Adapter (Development Mode)', () => {
    it('should log email details to console when RESEND_API_KEY is not set', async () => {
      process.env.RESEND_API_KEY = '';
      process.env.NODE_ENV = 'development';

      await Mail.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        body: "<h1>Test Body</h1>"
      });

      expect(consoleSpy).toHaveBeenCalledWith('📧 Development Mail:');
      expect(consoleSpy).toHaveBeenCalledWith('To: test@example.com');
      expect(consoleSpy).toHaveBeenCalledWith('Subject: Test Subject');
      expect(consoleSpy).toHaveBeenCalledWith('<h1>Test Body</h1>');
    });
  });

  describe('Resend Adapter (Production Mode)', () => {
    it('should send email using Resend adapter', async () => {
      const mockAdapter: MailAdapter = {
        sendEmail: vi.fn().mockResolvedValue(undefined)
      };

      Mail.setAdapter(mockAdapter);

      await Mail.sendEmail({
        to: "test@example.com",
        subject: "Test Subject",
        body: "<h1>Test Body</h1>"
      });

      expect(mockAdapter.sendEmail).toHaveBeenCalledWith({
        to: "test@example.com",
        subject: "Test Subject",
        body: "<h1>Test Body</h1>"
      });
    });

    it('should throw error in production when RESEND_API_KEY is missing', () => {
      process.env.RESEND_API_KEY = '';
      process.env.RESEND_FROM_EMAIL = '';
      process.env.NODE_ENV = 'production';

      expect(() => {
        Mail.getInstance();
      }).toThrow('RESEND_API_KEY and RESEND_FROM_EMAIL are required in production');
    });

    it('should handle send errors', async () => {
      const mockError = new Error('Send failed');
      const mockAdapter: MailAdapter = {
        sendEmail: vi.fn().mockRejectedValue(mockError)
      };

      Mail.setAdapter(mockAdapter);

      await expect(
        Mail.sendEmail({
          to: "test@example.com",
          subject: "Test",
          body: "Body",
        })
      ).rejects.toThrow("Send failed");
    });
  });
});
