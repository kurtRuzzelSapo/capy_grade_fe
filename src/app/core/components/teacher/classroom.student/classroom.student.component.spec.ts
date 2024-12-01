import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassroomStudentComponent } from './classroom.student.component';

describe('ClassroomStudentComponent', () => {
  let component: ClassroomStudentComponent;
  let fixture: ComponentFixture<ClassroomStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassroomStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassroomStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
