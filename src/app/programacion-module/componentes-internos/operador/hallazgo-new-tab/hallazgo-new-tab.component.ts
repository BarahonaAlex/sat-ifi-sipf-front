import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hallazgo-new-tab',
  templateUrl: './hallazgo-new-tab.component.html',
  styleUrls: ['./hallazgo-new-tab.component.scss']
})
export class HallazgoNewTabComponent implements OnInit {

  @Input('idCaso') idCaso!: number;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      if (params.get('id') != null) {
        this.idCaso = parseInt(params.get('id') ?? '-1');
      }

    });
  }

}
