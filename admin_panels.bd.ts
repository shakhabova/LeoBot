
import { readFile, writeFile } from 'fs/promises'
import * as path from 'node:path';
import { adminPanelModel as AdminPanelModel } from './admin_panel.model';

const ADMIN_PANELS_BD_PATH = path.resolve('admin_panels.bd.json');

export class AdminPanelsBD {
  async getAll(): Promise<AdminPanelModel[]> {
    const contents = await readFile(ADMIN_PANELS_BD_PATH, { encoding: 'utf8' });
    try {
      return JSON.parse(contents);
    } catch (err: unknown) {
      console.error(err, 'getAll parse error');
      return [];
    }
  }

  async add(adminPanel: AdminPanelModel): Promise<void> {
    const allAdminPanels = await this.getAll();
    allAdminPanels.push(adminPanel);
    await writeFile(ADMIN_PANELS_BD_PATH, JSON.stringify(allAdminPanels), { encoding: 'utf8' });
  }

  async getByLogin(adminPanel?: string): Promise<AdminPanelModel | undefined> {
    if (!adminPanel) {
      return undefined;
    }

    const logins = await this.getAll();
    return logins.find(e => e.login === adminPanel);
  }

  async getByName(name?: string): Promise<AdminPanelModel | undefined> {
    if (!name) {
      return undefined;
    }
    
    const adminPanels = await this.getAll();
    return adminPanels.find(e => e.name === name);
  }
}