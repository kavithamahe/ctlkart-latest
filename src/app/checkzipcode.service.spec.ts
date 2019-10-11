import { TestBed } from '@angular/core/testing';

import { CheckzipcodeService } from './checkzipcode.service';

describe('CheckzipcodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckzipcodeService = TestBed.get(CheckzipcodeService);
    expect(service).toBeTruthy();
  });
});
