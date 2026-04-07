import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleResult } from './battle-result';

describe('BattleResult', () => {
  let component: BattleResult;
  let fixture: ComponentFixture<BattleResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleResult]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
