import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbySearchComponent } from './nearby-search.component';

describe('NearbySearchComponent', () => {
  let component: NearbySearchComponent;
  let fixture: ComponentFixture<NearbySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbySearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NearbySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
