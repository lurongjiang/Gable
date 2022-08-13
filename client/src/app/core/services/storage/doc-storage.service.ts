import { Injectable } from '@angular/core';
import {DocStorageElecService} from './electron/doc-storage-elec.service';
import {DocStorageIndexDbService} from './indexdb/doc-storage-index-db.service';
import {DocStorageRemoteService} from './remote/doc-storage-remote.service';
import {ElectronService} from '../electron/electron.service';
import {ConfigServiceImpl} from '../impl/ConfigServiceImpl';
import {db} from '../db';
import {Doc, DocDefine, DocMenu} from '../entity/Docs';

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
    }else if (this.electronService.isElectron) {
    }else {
      return db.docs.add(doc);
    }
  }

  public async getAllDocs() {
    if (this.saveDataInRemote()) {
    }else if (this.electronService.isElectron) {
    }else {
      return db.docs.toArray();
    }
  }

  public async getDocMenuBaseLevel(docId: number): Promise<DocMenu[]> {
    if (this.saveDataInRemote()) {
    }else if (this.electronService.isElectron) {
    }else {
      return db.docsMenu.where({docId, level: 0}).toArray();
    }
  }

  public async getSubMenu(parentId: number): Promise<DocMenu[]> {
    if (this.saveDataInRemote()) {
    }else if (this.electronService.isElectron) {
    }else {
      return db.docsMenu.where({parentId}).toArray();
    }
  }

  public async addDocMenu(docMenu: DocMenu): Promise<number> {
    if (this.saveDataInRemote()) {
    }else if (this.electronService.isElectron) {
    }else {
      return db.docsMenu.add(docMenu);
    }
  }

  public async addDocDefault(id: number, newName: string): Promise<number> {
    if (this.saveDataInRemote()) {
    }else if (this.electronService.isElectron) {
    }else {
      const doc = new DocDefine();
      doc.name = newName;
      doc.version = '2.25.0';
      doc.time = new Date().getTime();
      doc.blocks = [];
      doc.id = id;
      return db.docDefines.add(doc, id);
    }
  }

  public async updateContentCount(id: number, newCount: any): Promise<any> {
    if (this.saveDataInRemote()) {
    } else if (this.electronService.isElectron) {
    } else {
      return db.docsMenu.update(id, {itemCount: newCount});
    }
  }

  private saveDataInRemote() {
    const server = this.config.getConfigSync('gableServer');
    return server && server !== 'null';
  }
}
