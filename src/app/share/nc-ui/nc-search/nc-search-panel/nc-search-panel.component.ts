import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchResult } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-nc-search-panel',
  templateUrl: './nc-search-panel.component.html',
  styleUrls: ['./nc-search-panel.component.less']
})
export class NcSearchPanelComponent implements OnInit {
  searchResult: SearchResult;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  // 跳转
  toInfo(path: [string, number]) {
    if (path[1]) {
      this.router.navigate(path);
    }
  }

}
