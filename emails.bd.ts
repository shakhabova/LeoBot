import { EmailModel } from "./email.model";
import { readFile, writeFile } from 'fs/promises'
import path from 'node:path';

const EMAIL_BD_PATH = path.resolve('email.bd.json');

export class EmailBD {
  async getAll(): Promise<EmailModel[]> {
    const contents = await readFile(EMAIL_BD_PATH, { encoding: 'utf8' });
    try {
      return JSON.parse(contents);
    } catch (err: unknown) {
      console.error(err, 'getAll parse error');
      return [];
    }
  }

  async add(email: EmailModel): Promise<void> {
    const allEmails = await this.getAll();
    allEmails.push(email);
    await writeFile(EMAIL_BD_PATH, JSON.stringify(allEmails), { encoding: 'utf8' });
  }

  async getByEmail(email?: string): Promise<EmailModel | undefined> {
    if (!email) {
      return undefined;
    }

    const emails = await this.getAll();
    return emails.find(e => e.email === email);
  }

  async getByName(name?: string): Promise<EmailModel | undefined> {
    if (!name) {
      return undefined;
    }
    
    const emails = await this.getAll();
    return emails.find(e => e.name === name);
  }
}