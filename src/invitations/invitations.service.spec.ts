import { Test, TestingModule } from '@nestjs/testing';
import { ProjectInvitationService } from './invitations.service';

describe('ProjectInvitationService', () => {
  let service: ProjectInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectInvitationService],
    }).compile();

    service = module.get<ProjectInvitationService>(ProjectInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
