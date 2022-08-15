import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {DocJsonNode} from '../../core/services/entity/Docs';

@Component({
  selector: 'app-mock-page',
  templateUrl: './mock-page.component.html',
  styleUrls: ['./mock-page.component.scss']
})
export class MockPageComponent implements OnInit {
  editorOptions = {theme: 'vs-light', language: 'json'};
  code = `
  {
    "a":"123",
    "b":123,
    "c": true,
    "d": {
        "e": "sd",
        "f": 123
    },
    "g": [
        {
            "h": "123",
            "i": 89
        }
    ],
    "j":[
        1,2,3
    ],
    "k":[
        {
            "l":123,
            "m": true
        }
    ]
}
  `;

  root: DocJsonNode;


  treeControl = new NestedTreeControl<DocJsonNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DocJsonNode>();

  constructor() {
    this.dataSource.data = [];
  }

  hasChild = (_: number, node: DocJsonNode) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    setTimeout(() => {
      console.log('zzq see data', this.dataSource.data);
    }, 5000);
  }

  gen(): void {
    const data = JSON.parse(this.code);
    if (!this.root) {
      this.root = new DocJsonNode();
      this.root.type = typeof data;
      this.root.children = [];
      this.root.name = 'root';
    }
    this.traverse(data, this.process, this.root.children);
    console.log('zzq see ', this.root);
    const arr = [];
    arr.push(this.root);
    this.dataSource.data = [...[]];
    setTimeout(() => {
      this.dataSource.data = [...arr];
    }, 100);
  }

  delete(id): void {
    console.log('want to delete ', id);
    this.traverseForDelete(this.root, id);

    const arr = [];
    arr.push(this.root);
    this.dataSource.data = [...[]];
    setTimeout(() => {
      this.dataSource.data = [...arr];
    }, 100);
  }

  private traverseForDelete(o: DocJsonNode, deleteId: string) {
    let index = -1;
    for (let i = 0; i < o.children.length; i++) {
      const child = o.children[i];
      console.log('handle', child);
      if (child.id === deleteId) {
        console.log('find');
        index = i;
        break;
      }
      if (child.type === 'object' || child.type === 'array') {
        this.traverseForDelete(child, deleteId);
      }
    }
    if (index !== -1) {
      o.children.splice(index, 1);
    }
  }

  //called with every property and its value
  private process(key, value, docs: DocJsonNode[]) {
    let index = -1;
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].name === key) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      const a = new DocJsonNode();
      if (Array.isArray(value)) {
        a.type = 'array';
      }else {
        a.type = typeof value;
        if (a.type !== 'object') {
          a.sample = value;
        }
      }
      a.name = key;
      a.children = [];
      docs.push(a);
      index = docs.length - 1;
    }
    return index;
  }

  private traverse(o, func, docs: DocJsonNode[]) {
    // eslint-disable-next-line guard-for-in
    for (const i in o) {
      const index = func.apply(this, [i, o[i], docs]);
      if (o[i] !== null && Array.isArray(o[i]) && o[i].length > 0) {
        if (typeof o[i][0] === 'object') {
          this.traverse(o[i][0], func, docs[index].children);
        } else {
          const a = new DocJsonNode();
          a.type = typeof o[i][0];
          a.sample = o[i][0];
          a.name = 'item';
          a.children = [];
          docs[index].children.push(a);
        }
      } else if (o[i] !== null && typeof (o[i]) === 'object') {
        //going one step down in the object tree!!
        this.traverse(o[i], func, docs[index].children);
      }
    }
  }
}
