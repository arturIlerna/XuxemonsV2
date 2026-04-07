import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { BattleService } from '../../services/battle.service';
import { XuxemonsService } from '../../services/xuxemons.service';

@Component({
  selector: 'app-battle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './battle.html',
  styleUrls: ['./battle.css']
})
export class Battle implements OnInit {
  battleId!: number;
  myHealthyXuxemons: any[] = [];
  selectedXuxemon: any = null;
  userName: string = 'Usuario';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private battleService: BattleService,
    private xuxemonsService: XuxemonsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.battleId = Number(params.get('battleId'));
      this.loadMyHealthyXuxemons();
    });
  }

  loadMyHealthyXuxemons() {
    this.xuxemonsService.getMyCollection().subscribe((xuxemons: any) => {
      // Filtrar sanos
      this.myHealthyXuxemons = xuxemons.filter((x: any) => !x.enfermedad);
    });
  }

  selectXuxemon(xuxemon: any) {
    this.selectedXuxemon = xuxemon;
  }

  fight() {
    if(!this.selectedXuxemon) return;

    this.battleService.fight(this.battleId, this.selectedXuxemon.id).subscribe((result: any) => {
      this.battleService.battleResult$.next(result);
      this.router.navigate(['/battle-result']);
    });
  }
}
