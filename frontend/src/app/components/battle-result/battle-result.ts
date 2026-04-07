import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BattleService } from '../../services/battle.service';

@Component({
  selector: 'app-battle-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './battle-result.html',
  styleUrls: ['./battle-result.css']
})
export class BattleResult implements OnInit {
  result: any = null;

  constructor(
    private battleService: BattleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.battleService.battleResult$.subscribe(res => {
      if(!res) {
        this.router.navigate(['/friends']);
        return;
      }
      this.result = res;
    });
  }
}
