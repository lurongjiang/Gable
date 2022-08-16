import { Injectable } from '@angular/core';
import {DocStorageElecService} from './electron/doc-storage-elec.service';
import {DocStorageIndexDbService} from './indexdb/doc-storage-index-db.service';
import {DocStorageRemoteService} from './remote/doc-storage-remote.service';
import {ElectronService} from '../electron/electron.service';
import {ConfigServiceImpl} from '../impl/ConfigServiceImpl';
import {db} from '../db';
import {Doc, DocBlock, DocDefine, DocMenu} from '../entity/Docs';

@Injectable({
  providedIn: 'root'
})
export class DocStorageService {

  constructor(
    private config: ConfigServiceImpl,
    private electronService: ElectronService,
    private elecService: DocStorageElecService,
    private remoteService: DocStorageRemoteService,
    private indexDbService: DocStorageIndexDbService
  ) {
  }

  public async addDoc(doc: Doc): Promise<number>{
    if (this.saveDataInRemote()) {
      return this.remoteService.addDoc(doc);
    }else if (this.electronService.isElectron) {
    }else {
      return db.docs.add(doc);
    }
  }

  public async getAllDocs(): Promise<Doc[]> {
    if (this.saveDataInRemote()) {
      return this.remoteService.getAllDocs();
    } else if (this.electronService.isElectron) {
    } else {
      return db.docs.toArray();
    }
  }

  public async getDocMenuBaseLevel(docId: number): Promise<DocMenu[]> {
    if (this.saveDataInRemote()) {
      return this.remoteService.getDocMenuBaseLevel(docId, 0);
    }else if (this.electronService.isElectron) {
    }else {
      return db.docsMenu.where({docId, level: 0}).toArray();
    }
  }

  public async getSubMenu(parentId: number): Promise<DocMenu[]> {
    if (this.saveDataInRemote()) {
      return this.remoteService.getSubMenu(parentId);
    }else if (this.electronService.isElectron) {
    }else {
      return db.docsMenu.where({parentId}).toArray();
    }
  }

  public async addDocMenu(docMenu: DocMenu): Promise<number> {
    if (this.saveDataInRemote()) {
      return this.remoteService.addDocMenu(docMenu);
    }else if (this.electronService.isElectron) {
    }else {
      return db.docsMenu.add(docMenu);
    }
  }

  public async addDocDefault(id: number, newName: string): Promise<number> {
    const doc = new DocDefine();
    doc.name = newName;
    doc.version = '2.25.0';
    doc.time = new Date().getTime();
    doc.blocks = [];
    doc.id = id;
    if (this.saveDataInRemote()) {
      return this.remoteService.addDocDefaultDefine(doc, id);
    } else if (this.electronService.isElectron) {
    } else {
      return db.docDefines.add(doc, id);
    }
  }

  public async updateContentCount(id: number, newCount: any): Promise<any> {
    if (this.saveDataInRemote()) {
      return this.remoteService.updateContentCount(id, newCount);
    } else if (this.electronService.isElectron) {
    } else {
      return db.docsMenu.update(id, {itemCount: newCount});
    }
  }

  public async getBlocksByDocId(docDefineId: number): Promise<DocBlock[]> {
    if (this.saveDataInRemote()) {
      return this.remoteService.getBlocksByDocId(docDefineId);
    } else if (this.electronService.isElectron) {
    } else {
      return db.docBlocks.where({docDefineId}).toArray();
    }
  }

  public async updateOrCreateBlock(docId: number, arr: any[], newName: string) {
    if (this.saveDataInRemote()) {
      return this.remoteService.updateOrCreateBlock(docId, arr, newName);
    } else if (this.electronService.isElectron) {
    } else {
      db.docDefines.update(docId, {name: newName}).then(res => {});
      await db.docBlocks.where({docDefineId: docId}).delete();
      return db.docBlocks.bulkAdd(arr);
    }
  }

  public async getDocDefine(docDefineId: number): Promise<DocDefine> {
    if (this.saveDataInRemote()) {
      return this.remoteService.getDocDefine(docDefineId);
    } else if (this.electronService.isElectron) {
    } else {
      return db.docDefines.get(docDefineId);
    }
  }

  public async updateName(id: number, name: string): Promise<any> {
    if (this.saveDataInRemote()) {
      return this.remoteService.updateDocMenuName(id, name);
    } else if (this.electronService.isElectron) {
    } else {
      return db.docsMenu.update(id, {name});
    }
  }

  private saveDataInRemote() {
    const server = this.config.getConfigSync('gableServer');
    return server && server !== 'null';
  }
}
